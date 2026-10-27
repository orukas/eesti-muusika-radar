import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sources=['https://muusikaplaneet.ee/muusika2026/','https://muusikaplaneet.ee/muusika2026/osa2/','https://muusikaplaneet.ee/muusika2026/osa3/'];
const decode=s=>s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&ndash;/g,'–').replace(/&mdash;/g,'—');
const plain=s=>decode(s.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
export function parseReleases(html,source) {
 const tracks=[];
 for(const m of html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) {
  const row=m[1], links=[...row.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const date=plain(row).match(/\((\d{1,2})\/(\d{1,2})(?:\b|\))/);
  if(!date)continue;
  let media;
  for(const link of links){try {const u=new URL(decode(link[1]));if(['www.youtube.com','youtube.com','youtu.be'].includes(u.hostname)){const id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v');if(/^[\w-]{11}$/.test(id||'')){media={provider:'youtube',id,url:u.href,link};break;}}if(u.hostname==='open.spotify.com'){const match=u.pathname.match(/^\/(track|album)\/([A-Za-z0-9]{22})$/);if(match){media={provider:'spotify',type:match[1],id:match[2],url:u.href,link};break;}}}catch{}}
  if(!media)continue;
  const title=plain(media.link[2]).replace(/^[“”„"'\s]+|[“”„"'\s]+$/g,'');
  const artist=plain(row.slice(0,media.link.index)).replace(/[–—-]\s*$/,'').trim();
  if(!title||!artist||title.toLowerCase()==='video')continue;
  const month=Number(date[2]),day=Number(date[1]);if(month<1||month>12||day<1||day>31)continue;
  const released=`2026-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  tracks.push({title,artist,released,quarter:Math.ceil(month/3),source,playback:{provider:media.provider,type:media.type||'video',id:media.id,url:media.url}});
 }
 return tracks;
}
async function run(){
 const tracks=[];
 for(const source of sources){const r=await fetch(source,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${source}: HTTP ${r.status}`);const parsed=parseReleases(await r.text(),source);if(parsed.length<10)throw Error(`Unexpected source layout: ${source}`);tracks.push(...parsed);}
 const unique=[...new Map(tracks.map(t=>[t.playback.url+'|'+t.released,t])).values()].sort((a,b)=>b.released.localeCompare(a.released));
 const target=path.join(root,'data/estonian-releases.json');await fs.mkdir(path.dirname(target),{recursive:true});
 const checkedAt=new Date().toISOString();
 await fs.writeFile(target,JSON.stringify({year:2026,checkedAt,sources,tracks:unique},null,2)+'\n');
 console.log(`Saved ${unique.length} verified release links; quarters:`,[1,2,3,4].map(q=>unique.filter(t=>t.quarter===q).length));
 try{const r=await fetch('https://muusikaplaneet.ee/feed/',{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error(r.status);const xml=await r.text();const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0,6).map(m=>{const field=tag=>plain((m[1].match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))||[])[1]?.replace(/<!\[CDATA\[|\]\]>/g,'')||'');return {title:field('title'),url:field('link'),date:field('pubDate')};}).filter(x=>x.title&&x.url.startsWith('https://muusikaplaneet.ee/'));if(!items.length)throw Error('No news');await fs.writeFile(path.join(root,'data/news.json'),JSON.stringify({checkedAt,items},null,2)+'\n');}catch(e){console.warn('News snapshot retained:',e.message);}
}
if(process.argv[1]===fileURLToPath(import.meta.url))await run();
