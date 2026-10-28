# Eesti Muusika Radar — DJ Krisor

Static GitHub Pages dashboard: https://orukas.github.io/eesti-muusika-radar/

Local project: `D:\AI\eesti-muusika-radar`. The GitHub account/URL remains `orukas`; the public DJ name is **Krisor**.

## Weekly world charts

`data/world-charts.json` contains five source-ranked tracks per genre: Beatport House, Beatport Deep House and Hardstyle.com Hardstyle. These are individual international genre charts, not a combined worldwide ranking. The first Beatport snapshot is search-index evidence dated 25 October 2026; Hardstyle.com was fetched directly on 27 October 2026. Do not label a cached result as a live snapshot.

GitHub Actions runs the free public-repository workflow on Mondays at approximately 09:00 Europe/Tallinn (GitHub may delay scheduled runs). No local computer, paid API or AI subscription is needed. Standard ubuntu-latest runners only; private repositories are explicitly skipped. Manual runs are available in Actions > Weekly music and Pages > Run workflow. Each source updates independently; blocked sources retain their verified date and tracks. Beatport currently returns HTTP 403, so those snapshots remain unchanged until the source becomes accessible. See data/update-status.json and the workflow summary for per-source results.

For each genre preserve `id`, `name`, `source`, `url`, `asOf`, `note`, and `tracks`. Track fields: `rank`, `title`, `artist`, `released` (YYYY-MM-DD or null), `url`, `newEntry` (boolean, or null for the initial baseline). Only set `newEntry` when absent from the previous verified TOP 5, using title + artist + mix to identify the track. This means new to the displayed TOP 5, not newly released or new to the full TOP 100. Use source track URLs when verified; otherwise link to the genre chart. Never guess release dates. Preserve the actual source date on failures or cached results. `checkedAt` records the attempt date, not data freshness.

Before replacing a snapshot, archive it to `data/archive/YYYY-MM-DD.json` (do not overwrite an existing archive). Keep first-party source evidence and source-specific notes accurate. If any source is blocked, retain that genre, update the note, and report the limitation without fabricating tracks. Refresh verified sources independently.

## Checks

Run `node --check world-charts.js`, validate JSON structure, inspect `git diff --check`, and preview the page at desktop and mobile widths. Verify all three panels, recent-release filter, empty states and direct source links. No build or package installation is required. GitHub Pages publishes the explicit public-file artifact through Actions.

## Listening layout and MuusikaPlaneet

The page is now listening-first: two discovery panels, genre buttons with one TOP 5 visible, then source links. `styles.css` contains responsive layout and `app.js` owns the shared lazy-loaded track player. The first Spotify playlist is independent; only one additional track iframe is mounted at a time.

Run `node scripts/update-estonian.mjs` to refresh all three verified 2026 MuusikaPlaneet period pages and RSS headlines. It writes `data/estonian-releases.json` and `data/news.json`. Date-based quarter filtering occurs in the browser. The source periods are four-month groups, not calendar quarters. A failed period fetch/parse must not replace the previous release snapshot. Do not change the year/source URLs automatically without checking next year's pages.

World chart tracks may contain a `spotify` object with verified `id`, `name`, `artist`, `url`, and `cover`. Preserve it when updating a retained track. Resolve new tracks by title AND artist; never reuse the prior row's player ID for a different song. Streaming edits can differ from the chart version. Never store expiring Spotify natural-language playback URIs. Without a verified Spotify match the UI falls back to the chart source link.

Checks: `node --check app.js`, `node --check world-charts.js`, `node --test scripts/update-estonian.test.mjs`, `git diff --check`; browser checks for quarter selection, more rows, genre filter, one active track player, and 320/390/412 px widths. See AUDIT.md for findings, recommendations and device-test limits.

## Cloud updater

Run `node scripts/update-all.mjs` and `node --test scripts/*.test.mjs`. No dependencies or paid credentials are required. New chart entries without an exact previously verified Spotify match link to the official source; no guessed player IDs are added. Drum & Bass is a curator-maintained Spotify embed. The 2026 MuusikaPlaneet source configuration needs review at year rollover. GitHub can disable public repository schedules after 60 days without repository activity; check Actions if updates stop. Failed sources produce workflow warnings; if all sources fail the run fails and no deployment occurs.
