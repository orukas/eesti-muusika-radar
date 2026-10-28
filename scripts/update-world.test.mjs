import test from 'node:test';
import assert from 'node:assert/strict';
import {parseHardstyle,parseBeatport,mergeTracks} from './update-world.mjs';
test('rejects challenge pages and incomplete rankings',()=>{assert.throws(()=>parseBeatport('<html>Access denied</html>'));assert.throws(()=>parseHardstyle('<h2 class="normalTitle">Hardstyle top 100</h2>'));});
test('does not attach previous player to a different track',()=>{const old=[{title:'A',artist:'Artist',url:'https://example.com/a',released:'2026-01-01',spotify:{id:'verified'}}];assert.equal(mergeTracks([{title:'B',artist:'Artist',url:'https://example.com/b'}],old)[0].spotify,undefined);assert.equal(mergeTracks([{title:'A',artist:'Artist',url:'https://example.com/a'}],old)[0].spotify.id,'verified');});
test('parses explicit Hardstyle ranks and artists',()=>{const html='<h2 class="normalTitle">Hardstyle top 100</h2>'+Array.from({length:5},(_,i)=>`<div class="track listView chart"><a href="/en/tracks/id${i}/song" title="Song ${i}" class="number">0${i+1}</a><a href="/en/artists/a" title="Artist &amp; B">Artist</a>`).join('');assert.equal(parseHardstyle(html)[4].rank,5);assert.equal(parseHardstyle(html)[0].artist,'Artist & B');});
