import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
export function parseHardstyle(html){
 const section=html.split('<h2 class="normalTitle">Hardstyle top 100</h2>')[1];
 if(!section)throw Error('Hardstyle chart heading missing');
 const rows=section.split(/<div class="track listView[^>]*>/).slice(1,6);
 return validate(rows.map((row,i)=>{const link=row.match(/<a href="(\/en\/tracks\/[^" ]+)" title="([^"]+)" class="number">\s*(\d+)/);const artists=[...row.matchAll(/href="\/en\/artists\/[^" ]+" title="([^"]+)"/g)].map(m=>decode(m[1]));if(!link||Number(link[3])!==i+1)throw Error('Unexpected chart rank');return {rank:i+1,title:decode(link[2]),artist:[...new Set(artists)].join(', '),url:'https://hardstyle.com'+link[1],released:null};}));
}
export function validate(tracks){if(tracks.length!==5||tracks.some((t,i)=>t.rank!==i+1||!t.title||!t.artist||!t.url.startsWith('https://'))||new Set(tracks.map(t=>t.url)).size!==5)throw Error('Invalid TOP 5');return tracks;}
export function parseBeatport(html){
 const raw=html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];if(!raw)throw Error('Beatport structured chart unavailable');
 const data=JSON.parse(raw),queries=data.props?.pageProps?.dehydratedState?.queries||[];
 const candidates=queries.filter(q=>JSON.stringify(q.queryKey).includes('top')).map(q=>q.state?.data?.results).filter(Array.isArray);
 if(candidates.length!==1)throw Error('Cannot identify unambiguous Beatport ranking');
 return validate(candidates[0].slice(0,5).map((t,i)=>({rank:i+1,title:t.name+(t.mix_name?' ('+t.mix_name+')':''),artist:t.artists.map(a=>a.name).join(', '),released:t.publish_date?.slice(0,10)||null,url:'https://www.beatport.com/track/'+t.slug+'/'+t.id})));
}
export function mergeTracks(tracks,old){return tracks.map(t=>{const match=old.find(o=>o.url===t.url&&o.title===t.title&&o.artist===t.artist)||old.find(o=>o.title===t.title&&o.artist===t.artist);return {...t,released:t.released||match?.released||null,newEntry:!match,...(match?.spotify?{spotify:match.spotify}:{})};});}
export async function updateWorld(){
 const target=new URL('data/world-charts.json',root),before=await fs.readFile(target,'utf8'),data=JSON.parse(before),results=[];const today=new Date().toISOString().slice(0,10);
 for(const genre of data.genres){try{const r=await fetch(genre.url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);const tracks=(genre.id==='hardstyle'?parseHardstyle:parseBeatport)(await r.text());genre.tracks=mergeTracks(tracks,genre.tracks);genre.asOf=today;genre.note='Kontrollitud otse allikast. Automaatne pilveuuendus.';results.push({source:genre.name,ok:true});}catch(e){genre.note='Automaatne kontroll ebaõnnestus; säilitatud viimati kontrollitud tabel.';results.push({source:genre.name,ok:false,error:e.message});}}
 data.checkedAt=today;const after=JSON.stringify(data,null,2)+'\n';if(after!==before){await fs.mkdir(new URL('data/archive/',root),{recursive:true});await fs.writeFile(new URL('data/archive/'+today+'.json',root),before,{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});await fs.writeFile(target,after);}return results;
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log(await updateWorld());
