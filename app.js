(() => {
  'use strict';
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  const format=date=>new Intl.DateTimeFormat('et-EE',{timeZone:'Europe/Tallinn'}).format(new Date(date));
  const safeLink=(text,url,cls)=>{const a=el('a',cls,text);const u=new URL(url);if(u.protocol!=='https:')throw Error('Invalid URL');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';return a;};
  async function fetchJSON(url){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(url,{cache:'no-cache',signal:controller.signal});if(!r.ok)throw Error(r.status);return await r.json();}finally{clearTimeout(timer);}}
  let active=null;
  function closePlayer(){if(!active)return;active.host.replaceChildren();active.host.hidden=true;active.button.setAttribute('aria-expanded','false');active.button.innerHTML='<span aria-hidden="true">▶</span><span class="play-label"> Kuula</span>';active=null;}
  function togglePlayer(button,host,media,title){
    if(active?.button===button){closePlayer();return;}
    closePlayer();host.hidden=false;button.setAttribute('aria-expanded','true');button.innerHTML='<span aria-hidden="true">×</span><span class="play-label"> Sulge</span>';
    const frame=document.createElement('iframe');frame.title=title+' — '+(media.provider==='youtube'?'YouTube':'Spotify')+' mängija';frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
    if(media.provider==='spotify'&&/^[A-Za-z0-9]{22}$/.test(media.id)&&['track','album'].includes(media.type)){frame.src=`https://open.spotify.com/embed/${media.type}/${media.id}?theme=0`;frame.height='152';}
    else if(media.provider==='youtube'&&/^[\w-]{11}$/.test(media.id)){frame.src=`https://www.youtube-nocookie.com/embed/${media.id}?playsinline=1&rel=0`;frame.className='video-player';}
    else{host.append(el('p','','Selle loo mängija pole saadaval.'));return;}
    host.append(frame);const hint=el('p','','Vajuta mängijas ▶. Kui kuulamine on piiratud, ');hint.append(safeLink('ava lugu allikas ↗',media.url));host.append(hint);active={button,host};
  }
  function playButton(media,title,host){const b=el('button','play-button');b.type='button';b.innerHTML='<span aria-hidden="true">▶</span><span class="play-label"> Kuula</span>';b.setAttribute('aria-label','Kuula: '+title);b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>togglePlayer(b,host,media,title));return b;}
  window.Radar={el,format,safeLink,playButton,closePlayer,fetchJSON};
  document.getElementById('today').textContent=new Intl.DateTimeFormat('et-EE',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Tallinn'}).format(new Date());
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Tallinn',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  async function loadReleases(){
    const list=document.getElementById('estonian-list'),quarter=document.getElementById('quarter');
    try{const data=await fetchJSON('data/estonian-releases.json');quarter.value=String(Math.ceil(Number(today.slice(5,7))/3));let limit=12;
      function render(){closePlayer();const tracks=data.tracks.filter(t=>t.quarter===Number(quarter.value)&&t.released<=today);list.replaceChildren();const age=Date.now()-Date.parse(data.checkedAt);document.getElementById('estonian-status').textContent=`${tracks.length} kuulatavat lugu · kontrollitud ${format(data.checkedAt)}`+(age>8*86400000?' · uuendus ootel':'');for(const track of tracks.slice(0,limit)){const row=el('li','release-row'),main=el('div','release-main'),info=el('div');info.append(el('strong','',track.title),el('p','',track.artist),el('time','',format(track.released+'T12:00:00Z')));const host=el('div','track-player');host.hidden=true;main.append(info,playButton(track.playback,track.title,host));row.append(main,host);list.append(row);}if(!tracks.length)list.append(el('li','state','Selles kvartalis pole veel kuulatavaid lugusid.'));document.getElementById('more-releases').hidden=tracks.length<=limit;}
      quarter.addEventListener('change',()=>{limit=12;render();document.querySelector('.release-scroll').scrollTop=0;});document.getElementById('more-releases').addEventListener('click',()=>{limit+=12;render();});render();
    }catch{list.replaceChildren(el('li','state','Lugude nimekirja laadimine ei õnnestunud. Ava MuusikaPlaneedi algallikas alloleva lingiga.'));quarter.disabled=true;document.getElementById('more-releases').hidden=true;}
  }
  async function loadNews(){const feed=document.getElementById('feed');try{const data=await fetchJSON('data/news.json');const frag=document.createDocumentFragment();for(const item of data.items){const a=safeLink('',item.url,'feed-item');a.append(el('strong','',item.title),el('time','',format(item.date)));frag.append(a);}feed.replaceChildren(frag);}catch{const p=el('p','state','Uudised on saadaval otse allikas: ');p.append(safeLink('MuusikaPlaneet ↗','https://muusikaplaneet.ee/'));feed.replaceChildren(p);}}
  loadReleases();loadNews();
})();
