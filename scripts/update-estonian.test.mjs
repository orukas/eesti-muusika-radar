import test from 'node:test';
import assert from 'node:assert/strict';
import {parseReleases} from './update-estonian.mjs';
test('extracts source media, decodes text and derives calendar quarter',()=>{
 const rows=parseReleases('<li>Artist &amp; Friend <a href="https://www.youtube.com/watch?v=abcdefghijk">&#8220;A &amp; B&#8221;</a> (15/04)</li>','https://muusikaplaneet.ee/muusika2026/');
 assert.equal(rows.length,1);assert.equal(rows[0].artist,'Artist & Friend');assert.equal(rows[0].title,'A & B');assert.equal(rows[0].quarter,2);assert.equal(rows[0].released,'2026-04-15');assert.equal(rows[0].playback.id,'abcdefghijk');
});
test('uses original Spotify link instead of secondary video release date',()=>{
 const rows=parseReleases('<li>Artist <a href="https://open.spotify.com/album/1234567890123456789012">Song</a> (30/06, <a href="https://www.youtube.com/watch?v=abcdefghijk">video</a> 01/07)</li>','source');
 assert.equal(rows.length,1);assert.equal(rows[0].quarter,2);assert.equal(rows[0].playback.provider,'spotify');assert.equal(rows[0].playback.type,'album');
});
test('ignores unrelated, unsafe and malformed links',()=>{
 const html='<li>Menu <a href="https://example.com/">News</a></li><li>A <a href="javascript:alert(1)">Bad</a> (01/01)</li><li>A <a href="https://www.youtube.com/watch?v=bad">Bad</a> (01/01)</li><li>A <a href="https://www.youtube.com.evil.example/watch?v=abcdefghijk">Bad</a> (01/01)</li>';
 assert.deepEqual(parseReleases(html,'source'),[]);
});
