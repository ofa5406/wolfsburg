# Session — 2026-06-21 / 22

**Date:** 2026-06-21 → 2026-06-22
**Focus:** Building and iterating the Auto-Stadt HTML presentation
**Who:** Basak + Claude

---

## What we did

- Renamed the project from "Post-Car Wolfsburg" to **Auto-Stadt** throughout the presentation (title, nav, section 01 display heading)
- Updated all numbers to match the web tool's computed values: 104,100 trips/day, 17,400 residents + 18,000 workers + 7,080 daily visitors, 641 e-bikes (total 1,273 fleet)
- Fixed chart legend overlap in `hub_area_breakdown.png` and `hub_stacked_bar.png` — moved legends below the chart axes; regenerated all charts locally into `wolfsburg-presentation/charts/`
- Embedded four hub analysis charts from the web tool into the presentation (hub heatmap, area breakdown, stacked bar, profile cards) in sections 3.1 and 3.3
- Added **two masterplan scales** with actual Rhino exports:
  - Section 3.1 (Strategy) — upper scale: full city road hierarchy + hub network
  - Section 3.2 (Centre) — lower scale: city centre with hubs, catchment areas, land acquisition
- Added the lower-scale masterplan as the **scroll-zoom hero** image in section 01
- Built a **crossfade animation** in section 3.1: hub network plan ↔ catchment overlay, 5-second cycle, with a state label tracking which layer is visible
- Added a **lightbox** (click to enlarge) for both upper and lower plan frames — opens current image fullscreen, switch buttons between layers, Escape/click-outside to close
- Added a **stats recap table** before the closing "Parking City → Hub City" slogan in section 06
- Cleaned up nav: removed "2026" year label; vision section credentials moved to right-hand `anno-side` column
- Fixed hub profile cards: text overflow (footer rows now anchored to fixed positions), tighter row spacing, taller figure

## Decisions made

- Project name in the presentation is **Auto-Stadt** (matching the web tool repo name)
- Numbers in the presentation use the **web tool's computed values** (641 e-bikes / 1,273 total), not the earlier locked design decision (131 e-bikes / 763 total) — this discrepancy should be resolved with the group
- Masterplan images are stored compressed in `wolfsburg-presentation/charts/` (not committed to the main repo)
- Chart PNGs are generated locally from `charts/generate_charts.py` — run `python3 charts/generate_charts.py` to regenerate

## Files created / changed

| File | What changed |
|------|--------------|
| `wolfsburg-presentation/index.html` | Major: Auto-Stadt rename, number updates, chart embeds, two masterplan scales, crossfade frame, lightbox, stats recap in section 06, nav/credentials cleanup |
| `wolfsburg-presentation/style.css` | Crossfade CSS, lightbox styles, `split-card--plan`, `split-img--plan`, dark-section data-table overrides |
| `wolfsburg-presentation/script.js` | Crossfade state label, lightbox open/close/nav, per-frame config for upper + lower plans |
| `wolfsburg-presentation/charts/generate_charts.py` | Fixed legend placement (hub_area_breakdown, hub_stacked_bar), fixed profile card layout (overflow + footer anchoring) |
| `wolfsburg-presentation/charts/masterplan_upper.jpg` | Multiple iterations — latest is upper scale with hub markers |
| `wolfsburg-presentation/charts/masterplan_upper_catchment.jpg` | Catchment overlay for crossfade |
| `wolfsburg-presentation/charts/masterplan_lower.jpg` | City centre plan |
| `wolfsburg-presentation/charts/masterplan_lower_catchment.jpg` | City centre catchment overlay |
| `wolfsburg-presentation/charts/masterplan_hero.jpg` | Hero image for section 01 scroll-zoom |
| `wolfsburg-presentation/charts/hub_*.png` | Regenerated: heatmap, area_breakdown, stacked_bar, profile_cards |

## Open threads / unfinished

- **E-bike fleet discrepancy**: presentation shows 641 (web tool) but locked design decision says 131 — group needs to agree which number to use and sync `HANDOFF.md`
- Section 3.1 still has placeholder split-cards for hub heatmap and area breakdown charts — these are data charts, not spatial drawings; reconsider whether they belong in this section or a dedicated data section
- Section 3.2 layer toggle (mobility/facility) is currently in section 3.3 (Hubs), not 3.2 (Centre) as the original outline intended — may want to move
- Hub typology diagrams still placeholder (`typology-diagram` divs)
- Before/after street sections (Kleiststraße) still placeholder
- Persona scenario cards (05) still TBD
- Presentation not yet deployed — local only

## Next session — start here

1. Confirm e-bike number (641 vs 131) with the group and update the presentation
2. Drop in real images for section 2.2 (car-land map) and the before/after street sections when ready
3. Fill in the persona/scenario cards in section 05 when journey details are agreed
4. Consider deploying to a separate GitHub repo for the Summaery exhibition
