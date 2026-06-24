# hub-viewer — briefing for reusing / embedding this tool

Read this first when working on or embedding the Wolfsburg Mobility Hub viewer. For the
end-user description, controls, file list and the `HUB_MODEL` data schema, see `README.md`
in this folder.

## What this is

A self-contained 3D web viewer of one Wolfsburg mobility hub, exported from Rhino. Pure
HTML + vendored three.js (r137), **no build step, no server, no network**. Open
`index.html` directly. Designed to be lifted into a larger web tool (the Wolfsburg
Activity Map or any host) — see "Embedding into another web tool" in `README.md`.

## Architecture in one minute

- `index.html` — markup (UI chrome wired by `id`) + one inline `<script>` holding all the
  scene logic (an IIFE). Everything lives here; there is no bundler.
- `data/model-data.js` → `window.HUB_MODEL` (baked geometry, three.js Y-up, metres).
- `data/descriptions.js` → `window.HUB_DESCRIPTIONS` (per-element text) and
  `window.HUB_CATEGORIES` (category labels + the pastel accent colours).
- `js/` — vendored three.js + the fat-line addon (thick building edges). Load order matters
  (deps → data → scene); the `<script>` tags in `index.html` already encode it.

## How it renders (so edits stay consistent)

- Build loops turn each `HUB_MODEL.groups` / `trees` / `elements` entry into meshes, and
  stash registries (`ctxItems`, `treeItems`, element `userData.rawCol`, light/material refs)
  so the look can be re-applied without rebuilding geometry.
- `applyStyle(name)` re-skins live from a `STYLES` preset (currently only **`muted`**): it
  sets background, light intensities, ground-shadow opacity, per-fill colour transforms,
  edge colour/opacity, building tones and people colour. Startup calls `applyStyle('muted')`.
  (Earlier rounds had a Style dropdown with several presets; it was removed once "muted" was
  chosen — the machinery remains, so re-adding presets is just new `STYLES` entries + UI.)
- Hover (`setHover`) brightens an element and swaps its accent to a more **saturated**
  colour; the `interaction_buildings` block glows its ground-floor volumes.
- Special cases to preserve when editing the element loop:
  - `el.special==="interaction_buildings"` → light-gray masses, black fat profile edges,
    separate `el.interaction` ground-floor mesh that glows on hover.
  - `el.key==="hub_ground"` and the `nat` groups (water/green) are hoverable / exact-colour.

## Common tasks

- **Reword a card:** edit `data/descriptions.js` (`title` / `text` by element `key`). One
  short sentence, no em dashes. Keys must stay in sync with `model-data.js` element keys.
- **Recolour a category:** edit the hex in `HUB_CATEGORIES` (`data/descriptions.js`).
- **Tune the look:** edit the `muted` preset object in `index.html` (`STYLES.muted`).
- **Refresh geometry after a Rhino change:** regenerate `model-data.js` via the rhino MCP
  bridge in `../rhino/` (Rhino open + `mcpstart`; see that folder's `README.md`), keeping the
  schema in this folder's `README.md`. Validate with the checks below.

## Validate before shipping

```bash
# every model element key resolves to a description; no em dashes in the text
node -e 'global.window={};require("./data/model-data.js");require("./data/descriptions.js");
  const M=window.HUB_MODEL,D=window.HUB_DESCRIPTIONS;
  const miss=[...new Set(M.elements.map(e=>e.key))].filter(k=>!D[k]);
  console.log("missing desc:",miss.length?miss:"OK");'
# inline scene script parses
#   extract the IIFE and run: node --check
```

Also open `index.html` and confirm: tabs = Perspective 1–5 + eye level 1–4 + Iso, perspective orbit upright,
People/Trees toggles, legend filtering, hover cards, buildings light-gray with black edges.
