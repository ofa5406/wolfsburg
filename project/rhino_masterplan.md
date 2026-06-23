# Rhino Masterplan File — Layer Reference

*File: `/Users/basakpnar/Desktop/wolfsburg mobility/wolfsburg_masterplan.3dm`*
*Units: Meters | Last modified: 2026-06-20*

This is the primary spatial working file for the Wolfsburg masterplan — separate from `toolpalette.3dm` (the kit-of-parts). It contains the city-wide base map, road hierarchy, hub placements, catchment areas, and acquired land geometry.

---

## How the visualization works

**The masterplan visual is driven by Grasshopper (`wolfsburg_masterplan.gh`), not by baked Rhino geometry.**

The canvas has three named groups:

---

### Group 1 — ROAD HIERARCHY

Geometry Pipelines pull curves from Rhino layers and pass them to **Custom Preview Lineweights**:

| Layer | Thickness | Colour |
|-------|-----------|--------|
| `Street Network::Cars only` | 15 | Dark gray |
| `Street Network::Shared Streets (Vehicle)` | 10 | Teal/blue-gray |
| `Street Network::Shared Streets (Bike)` | 5 | Rose/pink (merged with Pedestrian) |
| `Street Network::Pedestrian` | 5 | Rose/pink (merged with Bike) |

> `Street Network::Shared Streets` (the main 8,282-object layer) is not yet wired into this group.

---

### Group 2 — HUBS

Hub data is read from a **CSV file via a GHPython component** (`hubs_m_s`):
- Input: `File Path` → `csv_path`
- Outputs: `m_points`, `m_names`, `s_points`, `s_names`

L-hubs (`l_hub`) are a separate input — not from the CSV.

**Catchment areas** — each tier draws Circle CNR → Region Union (merged blob) → Surface → Custom Preview Materials:

| Hub tier | Dot size | Catchment radius | Transparency |
|----------|----------|-----------------|--------------|
| L (`l_hub`) | 57 | 1500 m | 0.70 |
| M (`m_points`) | 40 | 500 m | 0.70 |
| S (`s_points`) | 20 | 250 m | 0.50 |

All dots and catchment fills are GH preview geometry — **not baked to Rhino layers**.

---

### Group 3 — MASTERPLAN

Two Geometry Pipelines feed a shared **Custom Preview Materials** node (blue-gray fill):

| Layer | Status |
|-------|--------|
| `Buildings::Parkhaus` | ✅ Working — Parkhaus footprints shown as surfaces |
| `Masterplan::Land Acquisition` | Drawn manually in Rhino — geometry in progress |

Land acquisition zones are being drawn manually as Rhino geometry on `Masterplan::Land Acquisition`.

---

> **For exports / deliverables:** hub dots, catchment circles, and Land Acquisition fills only appear when GH is open and solving. To export cleanly, capture the Rhino viewport with GH active, or bake geometry to layers first.

---

## File stats (as of 2026-06-20)

| Item | Value |
|------|-------|
| Active Rhino objects | ~9,518 (street network + railway — all other layers empty or hidden) |
| Units | Meters |
| Created | 2026-04-09 |
| Last modified | 2026-06-20 |

---

## Layer Structure

### Street Network *(visible — source geometry for GH lineweights)*

Cleaned and sorted 2026-06-20 into 5 access tiers:

| Layer | Objects | Lineweight in GH |
|-------|---------|-----------------|
| `Street Network::Cars only` | 324 | Thickest — highways, arterials |
| `Street Network::Shared Streets (Vehicle)` | 779 | Medium-thick |
| `Street Network::Shared Streets` | 8,282 | Medium — main local network |
| `Street Network::Shared Streets (Bike)` | 60 | Thin |
| `Street Network::Pedestrian` | 68 | Thinnest |
| `Street Network::Pedestrian only` | — | (hidden — not populated) |
| `Street Network::VW Factory` | — | (hidden — not populated) |
| `Street Network::Field and Forest` | — | (hidden) |

### Railway *(visible)*

| Layer | Objects | What it shows |
|-------|---------|---------------|
| `Railway` | 5 | Rail lines through Wolfsburg. |

### Mobility *(layer group — empty, hub data comes from web tool via GH)*

These layers exist but contain no Rhino geometry. Hub points are fetched from the web app at GH runtime.

| Layer | Color | Role |
|-------|-------|------|
| `Mobility::HUB L` | Blue | Placeholder for 6 Large hubs |
| `Mobility::HUB M` | Yellow | Placeholder for 19 Medium hubs |
| `Mobility::HUB S` | Blue | Placeholder for 43 Small hubs |
| `Mobility::Public Transport` | — | (empty) |
| `Mobility::Automobile` | — | (empty) |
| `Mobility::Bicycle` | — | (empty) |

### Masterplan *(layer group — sub-layers currently hidden)*

| Layer | What it will show |
|-------|------------------|
| `Masterplan::Land Acquisition` | Parcels freed from car use — the red outlines in plan |
| `Masterplan::Urban Greens` | New green space from reclaimed land |
| `Masterplan::Pedestrian` | Pedestrian priority zones / new footpath areas |
| `Masterplan::Shared` | Shared-street transformation areas |
| `Masterplan::Bike` | Cycling network additions |
| `Masterplan::Car` | Residual car-access zones |

### Buildings *(hidden — base map context)*

17 sub-layers typed by use: Residential, Mixed, Commercial, Industry, Education, Culture, Public Buildings, Sports, Religion, Health, Parking, Petrol Station, Fire Station, Railway Station, Police Station, Agriculture, Infrastructure, Other, Parkhaus.

### Utility / legacy

| Layer | Status |
|-------|--------|
| `Old::*` (streets, buildings) | Hidden, locked — pre-cleanup geometry kept for reference |
| `Selection` | Hidden — temporary selection helper |
| `Route generation::origin_pt / dest_pt` | Hidden — for Anna persona journey routing |
| `External Origins (Vehicles/Pedestrian)` | Hidden — traffic analysis inputs |
| `Counting Points` | Hidden |

---

## What's done (as of 2026-06-20)

- ✅ Road hierarchy cleaned, sorted into 5 access tiers in Rhino (`Street Network::*`)
- ✅ GH lineweights set per access tier (Cars only = thickest → Pedestrian = thinnest)
- ✅ Hub points visualized in GH via GHPython pulling from the web tool
- ✅ Hub catchment circles drawn as GH preview (Circle CNR per hub tier radius)
- ✅ Acquired land / possible development zones drawn (red outlines in Masterplan layer)

## What's still needed

- [ ] **Wire `Street Network::Shared Streets`** into the Road Hierarchy GH group (pending — 8,282 objects not yet given a lineweight)
- [ ] **Bake hub points** from GH to `Mobility::HUB L/M/S` Rhino layers (so they exist without GH open)
- [ ] **Bake catchment circles** from GH to a Rhino layer for clean export
- [ ] `Masterplan::Urban Greens` — fill reclaimed land zones
- [ ] `Street Network::VW Factory` — add factory campus boundary
- [ ] Export plan view for **hub-coverage map** deliverable (open GH + bake, then export)
- [ ] Export plan view for **car-land map** deliverable (toggle Buildings::Parking + Cars only)
- [ ] Route generation — place `origin_pt` and `dest_pt` for Anna persona journey

---

## Connecting from the terminal

Rhino must be open with this file loaded and `mcpstart` run in its command line.

```bash
# Check connection
python3 -c "import socket,json; s=socket.socket(); s.settimeout(3); s.connect(('127.0.0.1',1999)); ..."

# Or use the client (requires Python 3.10+)
cd /path/to/wolfsburg-main/rhino
python rhino_client.py summary
```

See `rhino/README.md` for full usage.
