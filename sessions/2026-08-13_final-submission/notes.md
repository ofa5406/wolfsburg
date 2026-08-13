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

## Second pass, same day — the double-click bug, restructure, prints

**İrem reported the maps and embeds not working. He was right, and my first
verification had measured the wrong thing** — it only ever tested the *served*
case. Measured properly:

| Opened as `file://` | Result |
|---|---|
| Deck | Prose and images fine, **all 11 embeds blank** |
| Activity map | **Completely blank page** |
| Brain, hub-viewer | Work (classic scripts, not ES modules) |

Chrome refuses ES modules and stylesheets over `file://`, so everything Vite
builds dies. `exhibition/deck/start-exhibition.cmd` existed for exactly this and
**was never copied into `site/`**.

- **Launchers.** `launchers/open-offline.{cmd,sh}` serve the folder they sit in;
  copied into `site/` (8777) and `site/map/` (8778) so both can run at once. The
  README now opens with how to open the folder and why double-clicking will not
  do. All six served paths return 200.
- **`site/embeds/`** now holds `mapembed`, `hpmapembed`, `fleetembed`,
  `hubembed` — 9 iframe sources rewritten. **`brain/` and `hub-viewer/` stayed at
  top level**: the studio requires those two reachable on their own. Re-probed —
  all 11 embeds still render from the new location.
- **The activity map stands alone** — its own `README.md` (sections, data
  provenance, the OSM snapshots, rebuilding, and how the live version deployed
  vs this relative-base build) and its own launcher.
- **`verify-offline.mjs` gained a `file://` pass**, so the gap between served and
  double-clicked is reported rather than rediscovered; and it now waits for video
  `readyState` instead of a fixed sleep (`hero2.mp4` was intermittently
  misreported — the file is byte-identical to the original and fine).
- **The exhibition prints are in** (`prepare-materials.py`, sources in
  `D:\ıudd\prompt city\exhibition`): `graphic-and-content.pdf` (9 boards at A2)
  and `before-after.pdf` (8 sheets at A3) at print resolution in `materials/`,
  150 dpi copies in `site/materials/` (12.4 → 7.1 MB; the A3 set was already
  web-sized). The web version recompresses the images *inside* the PDF rather
  than rasterising it — `graphic-and-content.pdf` has 16 font objects, and
  flattening would lose all 4,354 characters of selectable text. Verified pages,
  dimensions and text all survive. The 14 source images went to
  `raw/exhibition-prints/`.
- **`raw/` filled** from the repo: full-resolution charts, source videos,
  exhibition photographs, cycling survey material.
- **`_guidelines/` untracked** — the studio's document, not ours to redistribute.
  Files remain on disk.

**Package now:** `site/` 261 MB · `source/` 364 MB · `raw/` 241 MB ·
`materials/` 19 MB — **898 MB total**. Served run clean on all four pieces.

## Third pass — credits, and separating the tooling from the upload

**Image credits.** `image-credits.xlsx` (supplied by İrem, revised once during the
session) maps exactly onto the files: all 9 in `assets/history/`, all 6 in
`assets/today/`, no misses. The README's `TO FILL IN` placeholder is gone,
replaced by per-image tables in three groups:

- **Historical** — Wikipedia (castle, Aller ×2), postautomation.de (the 1938
  construction set ×3), automotivehistory.org, NDR, visual-history.de.
- **Contemporary** — Heidersberger archive, Braunschweiger Zeitung, three Google
  Earth views, and `storage-2` credited to Ömer Faruk Aslan.
- **Team-produced** — the hub visualisations and diagrammatic aerials, credited
  as the team's own work made by **AI manipulation and Photoshop editing of
  Google Earth base aerials**. Stated rather than omitted: the method is the
  studio's subject.

Licence position written plainly — **permission is not cleared** for the archive
and press photographs or for anything derived from Google Earth, with a sentence
naming what InfAU would have to clear or replace first. This is a real exposure,
not a formality, since the university becomes the publisher. The brief's own
line covers it: *"an honest gap is workable, a silent one is not."*

**The upload shape — İrem caught this.** The brief says the Nextcloud folder is
fixed: *"Do not create new ones — upload into the existing structure."*
`final submission/` was also carrying nine scripts, `launchers/`,
`materials-web/`, `map-README.md`, the credits spreadsheet and the studio's own
brief. Uploading the folder would have scattered all of it across the top of
`02_StadtHub/`.

The package is now **pure output** — exactly `site/ source/ materials/
exhibition/ raw/ README.md` — and the tooling lives in **`submission-tools/`**
at the repo root. `build-submission.mjs` copies it to `source/build/`, since the
brief asks `source/` to include the scripts; keeping the canonical copy outside
the package means regenerating `source/` cannot destroy the scripts that build
it, which nearly happened earlier when I deleted that folder by hand.
`paths.mjs` is now the single place that knows where anything is — that is what
made moving nine scripts safe, since each had derived its own paths differently.

Two new guards so neither point can regress quietly:
- `check-upload-shape.mjs` — the root must hold only those six entries.
- `check-credits.mjs` — every sourced photograph named in the README, and no
  `TO FILL IN` / `TODO` left behind.

The studio's brief moved to `briefs/infau-final-submission/` — alongside the
other briefs, and not uploaded back to them. `visuals/` added to `source/`,
since `image-prompts.md` records how the AI imagery was made.

**Final state of the checks:**

```
upload shape    exactly six entries
credits         15 photographs credited, no placeholders
snapshots       every referenced snapshot present with data
filename case   75 references match, case included
offline         PASS — nothing reaches the network, nothing 404s
embeds          all 11 rendering inside the deck
README          identical in site/ and at the folder root
```

`site/` 261 MB · `source/` 379 MB · `raw/` 241 MB · `materials/` 19 MB —
**899 MB total.**

## Open threads / unfinished

- **`exhibition/` is still empty** — photographs of the Summaery installation,
  and of the physical model if one was built. *"If it was in the exhibition and
  is not in your folder, it is gone."* (`materials/` is now filled.)
- **`raw/` still needs the two Rhino files** — `wolfsburg_masterplan.3dm` and
  `toolpalette.3dm` are not in the repository at all.
- ⚠ **The activity-map offline work is on this laptop only.** Branch
  `offline-archive-2026-08-13` holds four commits — the Overpass→snapshot
  conversion, the local basemap/glyphs, and the 65 MB of captured data — and is
  **not pushed**, by decision (it is a large addition to a teammate's repo). The
  copy inside `final submission/source/` is gitignored, so **there is no backup
  of this work off this machine.** Worth revisiting once the team agrees.
- **`raw/` needs the Rhino files** — `wolfsburg_masterplan.3dm` and
  `toolpalette.3dm` are not in the repo at all.
- **The activity-map snapshots are committed locally but not pushed** — 65 MB to
  a teammate's repo, on branch `offline-archive-2026-08-13`. Ömer to decide.
- `exhibition copy/` — a 196 MB stale duplicate of `exhibition/` (pre-July-9,
  still has alt-1/alt-2). Not referenced anywhere, not in the submission. Safe
  to delete but left alone.
- **Wolfsburg Award (Aug 16) sheets do not exist.** No A1/A0 files anywhere.

## Next session — start here

1. **Upload `final submission/` to Nextcloud `02_StadtHub/`** — that upload *is*
   the hand-in, and it is due **14 August**. The folder now contains exactly the
   six entries expected, so "upload everything in it" is correct.
2. Add the **exhibition photographs** to `exhibition/` and the two **Rhino
   `.3dm` files** to `raw/` if they can be found before uploading. Neither
   blocks the rest.
3. After adding anything, re-run in order — never hand-edit `site/`:
   `build-site.mjs` → `downsize-media.mjs` → `build-submission.mjs` →
   `check-upload-shape.mjs` → `check-credits.mjs` → `verify-offline.mjs`.
   See `submission-tools/README.md`.
4. Decide whether to push branch `offline-archive-2026-08-13` to the activity-map
   repo — currently the only copy of that work is on this laptop.
5. Then the Wolfsburg Award sheets (Aug 16), which do not exist yet.
