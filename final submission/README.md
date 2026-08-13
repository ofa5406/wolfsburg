# `<stadt.hub>` — Parking City → Hub City

Prompt City. Urban Vision Wolfsburg 2026 — Design studio SoSe 2026
Bauhaus-Universität Weimar, InfAU

**Team:** Ömer Faruk Aslan · Anastasiia Mulyndina · Başak Pınar
**Contact:** <one email that will still work after graduation — TO FILL IN>

## Abstract

Wolfsburg was built around the car, and it still stores one everywhere: roughly a
quarter of the built city is given over to parking. `<stadt.hub>` asks what the
city becomes when the organising element of urban mobility shifts from **parking**
to **mobility hubs** — 68 of them, in three tiers, six of which reuse existing
multi-storey car parks. A fleet of 763 shared and autonomous vehicles across five
modes replaces private ownership, sized against roughly 100,000 trips a day and a
9,000-trip peak hour driven by Volkswagen's shift changes.

AI is the studio's method and it runs through the whole project. Agentic coding
tools built every piece of software here — the spatial-analysis platform, the 3D
hub configurator, the presentation, and a knowledge graph that atomises the
project into 408 linked notes so its own reasoning can be inspected. The
algorithms that place hubs and size the fleet were written, argued with, and
revised in that dialogue. The design decisions remain the team's; the speed and
the reach are the tools'.

## The urban issue

Wolfsburg is a company town whose form follows the assembly line: a Volkswagen
plant on one bank, housing on the other, and car storage filling the space
between. Land that could carry public life is occupied by stationary vehicles,
and the daily shift wave makes private-car dependency structural rather than
incidental. The question is not how to move cars better, but what to do with the
city once they no longer need to be stored in it.

## How to use this site

**Start at the front page** — it is the exhibition presentation, 24 slides, the
same thing a visitor met at Summaery. Press **Present** to let it run itself, or
scroll to move at your own pace. Live maps, the 3D hub model and the knowledge
graph are embedded in it and can be clicked into directly.

The three tools are also reachable on their own, from the last slide or directly:

- **`map/`** — the Activity Map. The spatial analysis platform: mobility networks,
  facilities, greenery, hub placement, cycling, and the fleet/capacity model. This
  is where the project's numbers come from.
- **`brain/`** — the Project Brain. A 3D force graph of 408 notes and ~2,400 typed
  links covering concepts, all 45 hub elements, the fleet mathematics, ~60 sourced
  research findings, 25 precedents and the decision log. Click any node to read it.
- **`hub-viewer/`** — the Hub Viewer. The 3D element kit of one mobility hub, with
  four saved views and walk/fly navigation. Hover any element for a description.

## What is frozen

The site is a static archive. Everything the project *argues* still works; three
things that reached out to live services do not:

- **Live OpenStreetMap queries.** The Activity Map used to query the Overpass API
  at runtime — around twenty separate queries. Those are now captured to
  `map/osm/*.json` and read from disk, so every analysis layer still renders with
  no network. `source/` contains the script that captured them, and re-running it
  with internet refreshes the data.
- **The basemap.** Map backgrounds came from Carto's tile service and label fonts
  from MapLibre's demo glyph server. Both are external services, so the maps now
  draw the project's own GeoJSON on a plain background — which is how five of the
  analysis views already rendered. Glyphs ship in `map/glyphs/`.
- **Satellite view.** The "Earth" mode used Esri World Imagery tiles, which cannot
  be redistributed. It has been removed. No navigation reached it.

Also inert: the Activity Map's Excel-upload flow geocodes addresses through
Nominatim, so uploading a new venue file needs internet. The venue data shipped
with the site is already geocoded and unaffected.

## Contents

- `index.html` — the exhibition presentation (the project itself)
- `presentation/` — points at the presentation
- `map/` — Wolfsburg Activity Map, the spatial analysis platform
- `brain/` — Project Brain, the 3D knowledge graph
- `hub-viewer/` — Hub Viewer, the 3D hub element configurator
- `materials/` — posters, boards and plans as web-resolution PDF
- `assets/` — images, video and data, all local

## How to run it

Static — serve the folder and open it. It must be *served*, not opened as a file:
the embedded map, hub and brain modules are ES modules, which browsers refuse to
load over `file://`.

```
cd site
python -m http.server 8000      # then open http://localhost:8000
```

`start-exhibition.cmd` does the same on Windows and opens Chrome in kiosk mode.

**Rebuilding.** The presentation, brain and hub-viewer are plain HTML/CSS/JS with
no build step — edit and reload. The Activity Map is a Vite app; from its source
in `source/wolfsburg-activity-map/`:

```
npm install
npx vite build        # output lands in dist/, which is this site's map/
```

The whole `site/` folder is assembled by `source/build-site.mjs`, and the images
are reduced to web resolution by `source/downsize-media.mjs`.

## Credits

**Geographic data**
- **OpenStreetMap contributors** — road network, footways, cycling network, bus
  stops and routes, car and bicycle parking, land use, parks, forests, water,
  facilities, historic sites, district and city boundaries. © OpenStreetMap
  contributors, **Open Database License (ODbL) 1.0**. Retrieved via the Overpass
  API (overpass-api.de) and snapshotted into `map/osm/`.
- **City of Wolfsburg Open Data Portal** (opendata.wolfsburg.de) — supplementary
  city data. **CC BY 4.0**.
- **Lower Saxony OpenGeoData portal** — topographic reference during design.
  Licence: **unverified** — used as reference only, no data redistributed here.
- **Nominatim** (nominatim.openstreetmap.org) — geocoding during venue
  preparation. ODbL.

**Reference data**
- **Bundesministerium für Digitales und Verkehr (BMDV)** — *Mobilität in
  Deutschland (MiD) 2023*, conducted by infas, DLR and IVT. Used for modal-split
  baselines. Licence: **unverified**; cited, not redistributed.
- **Google Maps "Popular Times"** — used as a proxy for pedestrian activity per
  street segment and venue. Proprietary; **derived estimates only**, no Google
  data is included in this folder.
- Volkswagen shift figures and city population figures — team estimates compiled
  from public sources; see `brain/` for the per-figure trace.

**Software libraries** (all vendored into this folder)
- **three.js** r137 — 3D rendering in the hub viewer and the brain. **MIT**.
- **MapLibre GL JS** 4.x — map rendering. **BSD-3-Clause**.
- **3d-force-graph** and **three-spritetext** — the brain's force graph. **MIT**.
- **marked** — Markdown rendering in the brain. **MIT**.
- **React** 18 and **react-dom** — Activity Map UI. **MIT**.
- **Zustand** 4 — state. **MIT**.
- **osmtogeojson** — OSM to GeoJSON conversion. **MIT**.
- **jsPDF**, **jspdf-autotable**, **html2canvas** — PDF/PNG export. **MIT**.
- **SheetJS (xlsx)** 0.18 — Excel parsing. **Apache-2.0**.
- **Noto Sans** map label glyphs, from MapLibre's demo glyph server. **SIL Open
  Font License 1.1**.

**Photographs and imagery**
- Contemporary photographs of Wolfsburg (`assets/today/`, `assets/*-scene*.jpg`,
  aerial views) — **taken by the team**, except where noted below.
- Historical photographs (`assets/history/` — the Aller valley, Wolfsburg castle,
  the 1938 masterplan, early housing, factory construction, the production line,
  the Beetle): **sources not yet confirmed — TO FILL IN before publication.**
  These were gathered during research and their provenance and licence must be
  established or the images replaced.
- 3D models, renderings and diagrams — **produced by the team** in Rhino and
  Grasshopper.

> Where a licence is marked *unverified* or *TO FILL IN*, that is an honest gap
> rather than a silent one, and it should be closed before the university
> republishes this work.

## Permissions

We agree that InfAU may republish this work under a university account or domain —
including on GitHub Pages — host and mirror these files, and show the work in teaching,
exhibitions and documentation, with credit to the team.
