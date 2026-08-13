# Wolfsburg Activity Map

The spatial-analysis platform behind `<stadt.hub>`. This is where the project's
numbers come from — hub placement, coverage, fleet sizing and capacity are all
computed here, and the presentation quotes the results.

**It runs on its own.** The deck embeds parts of it and links to it, but nothing
here needs the deck, and nothing here needs the internet.

## Open it

Double-click **`open-offline.cmd`** (Windows) or run **`./open-offline.sh`**
(macOS/Linux). Either serves this folder and opens it in your browser.

Do **not** open `index.html` by double-clicking — the page will be blank. The app
is an ES-module bundle, and browsers refuse to load those from a `file://` page.
Any static server works:

```
python -m http.server 8778      # then open http://localhost:8778
```

## What is in it

Five numbered sections, reached from the navigation:

| Section | What it does |
|---|---|
| **01 Post-Car Strategy** | The argument: parking city → hub city. |
| **02 Capacity Analysis** | Fleet sizing and per-hub capacity — the model behind the 763-vehicle figure and the hub tiers. |
| **03 Hub System** | Two tools. *Geo Data Analysis* (mobility networks, facilities, greenery) and *Hubs Placement* (the intermodal, cycling and L/M-hub placement algorithms), plus the methodology write-up. |
| **04 Urban Design** | The hub element kit — 45 elements across S/M/L tiers, with PDF/XLSX export for sheet layouts. |
| **05 Operational Simulation** | Not built. |

The landing page scrolls through the analysis maps — mobility, livability,
centrality, hub network and a comparative view — each drawn from the project's
own data.

## The data

All of it is local. Two kinds:

- **Computed results**, produced by the project's own pipeline and shipped as
  GeoJSON: `wolfsburg_centrality.geojson` and `wolfsburg_centrality_hubs.geojson`
  are the centrality and hub-placement outputs. The Python that made them is in
  `source/wolfsburg-activity-map/scripts/` and `analysis/`.
- **OpenStreetMap extracts** in `osm/` — 26 snapshots covering roads, cycling,
  transit, parking, facilities, greenery, social amenities, historic sites,
  settlement places, the city boundary and the six districts.

The app used to query the Overpass API live for that second group. It no longer
does: the queries are captured to `osm/` so the tool works with no network and
still works when Overpass is unavailable or has changed. To refresh them, run
`node scripts/capture_osm_snapshots.mjs` in the source with an internet
connection; the script holds every query verbatim.

Map label fonts are served from `glyphs/` for the same reason.

## What is frozen

- **The basemap.** Backgrounds came from Carto's tile service. The maps now draw
  the project's own GeoJSON on a plain background, which is how several of the
  analysis views already rendered.
- **Satellite view.** Used Esri World Imagery tiles, which cannot be
  redistributed. Removed; no navigation reached it.
- **Excel upload.** Uploading a new venue spreadsheet geocodes addresses through
  Nominatim and needs internet. The venue data shipped here is already geocoded
  and unaffected.

## Rebuilding

Source is in `source/wolfsburg-activity-map/`:

```
npm install
npx vite build          # output is this folder
```

The live version deployed from the `master` branch of
`github.com/annestasiia/wolfsburg-activity-map` via `.github/workflows/deploy.yml`
to GitHub Pages, built with `base: '/wolfsburg-activity-map/'`. **This archived
copy is built with `base: './'`** so it runs from any address — a university
server, a subfolder, or a plain local folder — rather than only the one path the
absolute base named.

## Credits

OpenStreetMap contributors (ODbL 1.0) for all geographic data; MapLibre GL JS
(BSD-3-Clause) for map rendering; Noto Sans glyphs (SIL OFL 1.1). Full credits,
including the reference datasets behind the capacity model, are in the README at
the top of this submission.
