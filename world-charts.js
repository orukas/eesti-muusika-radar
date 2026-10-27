(async function () {
  const container = document.getElementById('world-charts');
  const filter = document.getElementById('new-releases');
  const dateFormat = new Intl.DateTimeFormat('et-EE', {timeZone: 'Europe/Tallinn'});
  const fmt = value => dateFormat.format(new Date(value + 'T12:00:00Z'));
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  function link(text, url, className) {
    const node = element('a', className, text);
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') throw new Error('Invalid source URL');
    node.href = parsed.href;
    node.target = '_blank';
    node.rel = 'noopener noreferrer';
    return node;
  }
  try {
    const response = await fetch('data/world-charts.json', {cache: 'no-cache', signal: AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Chart data unavailable');
    const data = await response.json();
    function render() {
      const fragment = document.createDocumentFragment();
      for (const genre of data.genres) {
        const panel = element('article', 'panel');
        const heading = element('h3', '', genre.name);
        heading.append(link(genre.source + ' ↗', genre.url));
        panel.append(heading);
        const stale = Date.now() - Date.parse(genre.asOf + 'T23:59:59Z') > 8 * 86400000;
        panel.append(element('p', 'chart-meta' + (stale ? ' chart-warning' : ''),
          'Allika seis: ' + fmt(genre.asOf) + (stale ? ' · Uuendus on ootel' : '')));
        const tracks = genre.tracks.filter(track => {
          if (!filter.checked) return true;
          if (!track.released) return false;
          const age = Date.now() - Date.parse(track.released + 'T00:00:00Z');
          return age >= 0 && age < 30 * 86400000;
        });
        const list = element('ol', 'chart-list');
        for (const track of tracks) {
          const row = element('li', 'chart-row');
          row.append(element('span', 'chart-rank', String(track.rank).padStart(2, '0')));
          const details = element('div');
          details.append(link(track.title, track.url, 'chart-title'));
          if (track.newEntry === true) details.append(element('span', 'chart-new', 'Uus TOP 5-s'));
          details.append(element('p', 'chart-artist', track.artist));
          details.append(element('p', 'chart-date', track.released ? 'Ilmunud ' + fmt(track.released) : 'Ilmumiskuupäev allikas puudub'));
          row.append(details);
          list.append(row);
        }
        panel.append(list);
        if (!tracks.length) panel.append(element('p', 'feed-state', 'Selles TOP 5-s pole teadaoleva kuupäevaga viimase 30 päeva väljalaskeid.'));
        panel.append(element('p', 'chart-foot', genre.note));
        const foot = element('p', 'chart-foot');
        foot.append(link('Ava täielik edetabel ↗', genre.url));
        panel.append(foot);
        fragment.append(panel);
      }
      container.replaceChildren(fragment);
    }
    filter.addEventListener('change', render);
    render();
  } catch (error) {
    container.replaceChildren(element('p', 'feed-state', 'Edetabelite laadimine ei õnnestunud. Ava allikad otse:'));
    for (const [name, url] of [
      ['Beatport House', 'https://www.beatport.com/genre/house/5/top-100'],
      ['Beatport Deep House', 'https://www.beatport.com/genre/deep-house/12/top-100'],
      ['Hardstyle Top 100', 'https://hardstyle.com/en/charts?genre=hardstyle']
    ]) container.append(link(name, url, 'card'));
    filter.disabled = true;
  }
})();
