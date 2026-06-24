# Wolfsburg Mobility Hub — Web Viewer

A standalone, interactive 3D viewer of the mobility-hub design, exported from the Rhino
model `wolfsburg_urban design_02.3dm`. The hub's components are individually hoverable and
show a short description panel. Built to be **dropped into a larger web tool** (see
[Embedding](#embedding-into-another-web-tool)).

## How to open

**Double-click `index.html`** — it runs in any modern browser. No install, no build, no
server, no network: every library is vendored locally in `js/` and all data is local in
`data/`. Works fully offline.

## Controls

- **Right-drag** — orbit · **Middle-drag** — pan · **Wheel** — zoom
- **Hover** any element — its description card appears (bigger heading, one-line text)
- **Scene tabs** (top) — the Rhino named views (Perspective 1–4) + an orthographic **Iso**
  preset, all centred on the hub. Opens on Perspective 1. Perspective orbit stays upright
  (orbits around world-up, no flipping); Iso is true parallel projection and stays orbitable.
- **People: Off / On** (bottom-right) — toggle ~205 static low-poly **brown** figures on the
  hub surfaces (model scale, not animated). Default off.
- **Trees: Solid / Contour** (bottom-right) — switch context trees between solid and outline.
- **Legend** (bottom-left) — click a category to show / hide it.
- **Reset view** — re-applies the active tab.

## Visual style

Fixed to a **muted, low-key** look: deeper muted mid-tones, crisp dark edges on every
object, and shaded (not flat) lighting so forms read clearly. Hovering an element shifts its
accent to a **more saturated** colour. The `h_interaction buildings` block renders light gray
with black profile edges and its ground floors glow on hover. The `3_water`, `3_green` and
`3_green development` layers carry dedicated colours; `3_hub ground` is itself a hoverable
element.

## Editing the text

Open `data/descriptions.js` and edit the `title` / `text` for any element key. Save, refresh.
That is the only file to touch for wording. Keep `text` to one short sentence.

## Files (everything needed to run is here)

```
hub-viewer/
├── index.html                  ← the viewer + all scene logic (open this)
├── README.md                   ← this file
├── CLAUDE.md                   ← briefing for an AI/dev reusing or embedding the tool
├── js/                         ← vendored libraries (three.js r137, MIT)
│   ├── three.min.js
│   ├── OrbitControls.js
│   ├── LineSegmentsGeometry.js ┐
│   ├── LineMaterial.js         ├ fat-line addon (thick building profile edges)
│   └── LineSegments2.js        ┘
└── data/
    ├── model-data.js           ← geometry exported from Rhino (window.HUB_MODEL)
    └── descriptions.js         ← element text + category palette (HUB_DESCRIPTIONS / HUB_CATEGORIES)
```

The source `.3dm` is **not** required to run — `data/model-data.js` is the baked geometry.

## Embedding into another web tool

The viewer is framework-agnostic plain ES5 + three.js, with **no build step**. It is keyed
off three globals and one container:

- `window.HUB_MODEL` — geometry (from `data/model-data.js`)
- `window.HUB_DESCRIPTIONS` — per-element text (from `data/descriptions.js`)
- `window.HUB_CATEGORIES` — category labels + colours (from `data/descriptions.js`)
- a `<div id="app">` the canvas mounts into

To embed:
1. Copy the `hub-viewer/js/` and `hub-viewer/data/` folders into the host app.
2. Load the scripts in this order (deps before data before the scene logic):
   `three.min.js` → `OrbitControls.js` → `LineSegmentsGeometry.js` → `LineMaterial.js` →
   `LineSegments2.js` → `data/model-data.js` → `data/descriptions.js`.
3. Provide a `#app` container and lift the inline `<script>` from `index.html` (or move it to
   its own `.js`). The UI chrome (tabs, legend, controls, panel) is wired by `id` in the
   markup — copy those elements or re-point the selectors.
4. The fat-line addon globals (`THREE.LineSegments2`, …) are optional; if absent the building
   edges fall back to plain lines automatically (`FAT_LINES` guard).

### `HUB_MODEL` data schema (for integrators)

All coordinates are **three.js Y-up** (the exporter converts Rhino Z-up via `(x, z, -y)`),
units = metres.

```
HUB_MODEL = {
  meta:     { bbox_min, bbox_max, elem_center, units, source, views[] },  // views = Rhino named cameras
  groups:   [ { n, color:[r,g,b], pos:[…], idx:[…], nat?:true } ],        // static context, merged by colour
  trees:    [ { n, color, pos, idx } ],                                   // toggled context trees
  elements: [ { key, block, cat, center, pos, idx, col?:[…0-1…],          // hoverable; col = per-vertex colour
                special?:"interaction_buildings", interaction?:{pos,idx} } ],
  people:   [ [x, y, z, rotY], … ]                                        // static figures (~205)
}
```

`elements[].cat` maps to a `HUB_CATEGORIES` entry (colour + label). `key` maps to a
`HUB_DESCRIPTIONS` entry. `nat` groups keep their exact colour; everything else is tinted by
the active style.

## Regenerating `model-data.js`

Generated from the open Rhino model via the rhino MCP bridge (see `../rhino/`): static
geometry is render-meshed and merged by material colour, each hub block kept as a separate
vertex-coloured hoverable object, nature layers and people sampled separately, Rhino Z-up
converted to three.js Y-up. Re-run the extractor after model changes, then re-serialise
compactly with `JSON.stringify`.

## Dependencies & licence

three.js r137 and its line addons (MIT) are the only libraries, vendored in `js/`. The
viewer code and data are part of the Wolfsburg studio project.
