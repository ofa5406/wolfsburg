# Session — 2026-08-13

**Date:** 2026-08-13
**Focus:** InfAU final submission package — make all four pieces run with no internet, from any address, and assemble the Nextcloud folder
**Who:** Ömer + Claude

---

## What we did

**Saved the loose work first.** Two repos had uncommitted work, and the
activity-map branch existed only on this laptop:

- `ofa5406/wolfsburg` — hub-viewer transparent-PNG export button, the
  `exhibition/README.md` cleanup and three matching `codex-work/` vault notes.
- `annestasiia/wolfsburg-activity-map` — the tier-table vector PDF + XLSX export
  work, plus `embed-hub/` and `vite.hubembed.config.js`, which had never been
  tracked. Committed and **pushed the branch**
  `tier-table-indesign-export-2026-07-15`.

**Made the activity map work offline** — this was the whole job. The other three
pieces (deck, brain, hub-viewer) already had no CDN dependencies and passed as
they were. The map had five separate ties to the network:

| What | Fix |
|---|---|
| ~20 live Overpass queries across 10 files | Captured to `public/osm/*.json` (26 snapshots, 65 MB) via a new `scripts/capture_osm_snapshots.mjs`, read through a new `src/osmSnapshot.js`. Snapshots keep the raw Overpass shape, so `osmtogeojson` and the `*ToGeoJSON` helpers are untouched. |
| Carto positron basemap + MapLibre demo glyph server | New `src/mapBaseStyle.js`: plain background, glyphs from `public/glyphs/` (952 KB, Noto Sans Regular/Bold + Open Sans Semibold). Five landing sections already rendered this way — the other three now match. |
| Esri World Imagery satellite tiles | Removed. No nav entry reached "Earth" mode and the toggle was already guarded. |
| Google Fonts (Inter) | Removed — loaded but never used; the CSS already fell back to the system stack. |
| `base: '/wolfsburg-activity-map/'` | `'./'`. Also made the project-site link relative instead of an absolute `github.io` URL. |

The district boundaries were the one that mattered most: they load on first
render, so without a snapshot the map would have drawn **no districts at all**
offline.

**Built the submission package** at `final submission/`, driven by scripts so it
can be regenerated rather than hand-assembled:

- `build-site.mjs` — gathers the deck (as `site/index.html`), brain, hub-viewer
  and map; **rebuilds the three map embeds from source** (the committed ones
  predated the offline work and still called Overpass); rewrites the deck's
  `../../` paths and its three hard-coded GitHub URLs into links to the
  sub-apps; prunes each embed to the data its own bundle names; writes
  `.nojekyll`.
- `downsize-media.mjs` — 23 images to 2000 px / q80: **119 MB → 20 MB**.
- `check-snapshots.mjs`, `check-filename-case.mjs`, `verify-offline.mjs` — the
  checks (see below).
- `build-submission.mjs` — `source/`, plus `materials/`, `exhibition/` and
  `raw/` with READMEs saying what belongs in each.

## Decisions made

- **The deck is `site/index.html`.** The guidelines are explicit that what opens
  must be the project running, not a portfolio page about it.
- **The closing slide's three QR tiles became links to the three sub-apps**
  (map, brain, hub-viewer). This removes the hard-coded hostnames *and*
  satisfies the studio's requirement that the analysis platform and the
  configurator be reachable on their own, not only as deck iframes.
- **Basemap dropped rather than shipped as tiles.** Offline raster tiles would
  have added 100–300 MB and hours; the deck's embedded maps already rendered on
  a plain background, so the look stays consistent.
- **`exhibition/deck/` was left untouched.** The archive is a rebuilt copy, so
  the live exhibition deck is unchanged.

## Files created / changed

| File | What changed |
|------|--------------|
| `final submission/build-site.mjs` | new — assembles `site/` |
| `final submission/downsize-media.mjs` | new — images to web resolution |
| `final submission/verify-offline.mjs` | new — blocks the network, loads and scrolls all four pieces |
| `final submission/check-snapshots.mjs` | new — every `loadOsm()` name vs. the files on disk |
| `final submission/check-filename-case.mjs` | new — case-sensitivity check for Linux/Pages |
| `final submission/build-submission.mjs` | new — `source/` + the folders needing outside files |
| `final submission/README.md` | new — the submission README (also copied into `site/`) |
| `.gitignore` | ignores the ~850 MB of built `site/` and `source/` |
| map: `src/osmSnapshot.js`, `src/mapBaseStyle.js` | new |
| map: `scripts/capture_osm_snapshots.mjs` | new — regenerates all 26 snapshots |
| map: `public/osm/`, `public/glyphs/` | new — 65 MB of data, 952 KB of glyphs |
| map: 10 components + `useGreenSocialData.js`, `osmBoundaries.js` | Overpass → snapshots; CDN style → local |
| map: `vite.config.js`, `index.html` | relative base; font/host links removed |

## Verification

`verify-offline.mjs` serves the folder **one level deep** (mimicking
`Bauhaus-InfAU.github.io/<project>/`) and **blocks every request that would
leave the machine** — stricter than switching wifi off, and it sidesteps the
browser-cache trap the guidelines warn about.

```
Deck (presentation) … clean
Activity Map … clean   (scrolled 10 steps / 6439px + section clicks)
Project Brain … clean
Hub Viewer … clean
PASS — nothing reaches the network, nothing 404s.
```

Also passing: all 21 referenced snapshots present with data; 75 local references
match real files case-included; no absolute asset paths; `.nojekyll` present; no
Git LFS; `site/` **248 MB** (limit 1 GB), largest file 14 MB (limit 100 MB).

## Open threads / unfinished

- **`materials/` and `exhibition/` are empty.** They need the printed
  posters/boards, photographs of the Summaery installation, and photographs of
  the physical model. *"If it was in the exhibition and is not in your folder,
  it is gone."*
- **README has two gaps**, both deliberately marked rather than hidden: a
  contact email that outlives graduation, and the **sources/licences of the
  historical photographs** in `assets/history/`.
- **`raw/` needs the Rhino files** — `wolfsburg_masterplan.3dm` and
  `toolpalette.3dm` are not in the repo at all.
- **The activity-map snapshots are committed locally but not pushed** — 65 MB to
  a teammate's repo, on branch `offline-archive-2026-08-13`. Ömer to decide.
- `exhibition copy/` — a 196 MB stale duplicate of `exhibition/` (pre-July-9,
  still has alt-1/alt-2). Not referenced anywhere, not in the submission. Safe
  to delete but left alone.
- **Wolfsburg Award (Aug 16) sheets do not exist.** No A1/A0 files anywhere.

## Next session — start here

1. Drop the photographs and printed materials into `final submission/materials/`
   and `final submission/exhibition/`, then re-run `build-site.mjs` →
   `downsize-media.mjs` → `verify-offline.mjs`.
2. Fill the two README gaps (contact email, historic photo credits).
3. Upload to Nextcloud `02_StadtHub/` — the folder is the hand-in.
4. Then the competition sheets, if they are still being attempted.
