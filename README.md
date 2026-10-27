# Eesti Muusika Radar — DJ Krisor

Static GitHub Pages dashboard: https://orukas.github.io/eesti-muusika-radar/

Local project: `D:\AI\eesti-muusika-radar`. The GitHub account/URL remains `orukas`; the public DJ name is **Krisor**.

## Weekly world charts

`data/world-charts.json` contains five source-ranked tracks per genre: Beatport House, Beatport Deep House and Hardstyle.com Hardstyle. These are individual international genre charts, not a combined worldwide ranking. The first Beatport snapshot is search-index evidence dated 25 October 2026; Hardstyle.com was fetched directly on 27 October 2026. Do not label a cached result as a live snapshot.

A Codex weekly follow-up checks the sources on Mondays at 09:00 Europe/Tallinn, updates this file, commits and pushes to `main`, then checks GitHub Pages deployment. The local computer and Codex must be available for the local task to run. This is not a server-side GitHub Actions schedule. Existing data remains visible when a source cannot be verified; after eight days the website shows an update-pending message.

For each genre preserve `id`, `name`, `source`, `url`, `asOf`, `note`, and `tracks`. Track fields: `rank`, `title`, `artist`, `released` (YYYY-MM-DD or null), `url`, `newEntry` (boolean, or null for the initial baseline). Only set `newEntry` when absent from the previous verified TOP 5, using title + artist + mix to identify the track. This means new to the displayed TOP 5, not newly released or new to the full TOP 100. Use source track URLs when verified; otherwise link to the genre chart. Never guess release dates. Preserve the actual source date on failures or cached results. `checkedAt` records the attempt date, not data freshness.

Before replacing a snapshot, archive it to `data/archive/YYYY-MM-DD.json` (do not overwrite an existing archive). Keep first-party source evidence and source-specific notes accurate. If any source is blocked, retain that genre, update the note, and report the limitation without fabricating tracks. Refresh verified sources independently.

## Checks

Run `node --check world-charts.js`, validate JSON structure, inspect `git diff --check`, and preview the page at desktop and mobile widths. Verify all three panels, recent-release filter, empty states and direct source links. No build or package installation is required. GitHub Pages publishes from `main` / root.
