# Hub System — Concept vs. Web Tool: a neutral comparison

*Created 2026-06-17, after the group session that reopened the hub concept. This is an
objective comparison, not a judgement. It compares three things that all describe "the
hub system" but do not currently agree: the **design concept**, the web tool's
**implemented code**, and the web tool's **published methodology page**. Companion to
the session log `sessions/2026-06-17_hub-system-rethink/notes.md`.*

Related: [`hub_typologies.md`](hub_typologies.md) · [`../research/03_transfer-hubs.md`](../research/03_transfer-hubs.md)

---

## The three "hub" definitions in play

There are effectively **three different models** of the hub system right now. They share
the S/M/L vocabulary but mean different things by it.

### A — The design concept
Sources: `project/hub_typologies.md`, `research/03_transfer-hubs.md`.

A hub is a **spatial public-life anchor**, not a piece of infrastructure: a reddish
stone ground field, a three-zone arrival sequence (vehicle edge → threshold → dwelling
edge), a vertical beacon, and a ~28-element palette (mobility + seating + greenery +
social/cultural). Tiers are defined by **urban role**, with nested walking catchments:

| Tier | Walk radius (concept) | Role |
|------|----------------------|------|
| S (43) | 150–250 m | Last-metre moment in the street |
| M (19) | 300–500 m | Multimodal choice point |
| L (6)  | 700–1000 m | Neighbourhood anchor — repurposed multi-storey car parks, ground-floor gastronomy/shops/community + housing above, full fleet at the perimeter |

Note: the concept **does** put L-hubs on repurposed multi-storey car parks — but **in
the centre, as destinations**, not as peripheral depots.

### B — The web tool, as actually coded
Sources: `wolfsburg-activity-map/src/utils/hubLMAlgorithm.js`,
`.../src/utils/intermodalAlgorithm.js`.

The tool contains **two different, unrelated placement algorithms**, both driven by
existing parking/transport data:

- **`hubLMAlgorithm.js`** (the "Hub L·M·S network" mode). Hardcoded at the top of the
  file: *"Hub L = multi-storey car parks; Hub M = underground car parks."* Candidates
  come **only** from the parking GeoJSON, filtered by parking tag:
  - **L** = points tagged `multi-storey` / `garage`, **excluded** from Stadtmitte &
    Schillerteich (the dense pedestrian cores).
  - **M** = points tagged `underground` / `underpass`.
  - **There is no S tier in this algorithm at all.**
  - Selection is a simple greedy area-fill (`score = 0.5·areaRatio + 0.5·distance`)
    until a target floor-area is reached.
  - Coverage radii in code: **L 4000 m · M 2000 m · S 500 m** (`COVERAGE_RADIUS`).
- **`intermodalAlgorithm.js`** (the "Intermodal" mode). A *separate* model: it scores
  **bus stops + car parkings** by surrounding facilities/parks/bike-parking/residential,
  greedy-selects by density, and merges bus+car pairs within 200 m into hub types
  (`auto_bus_bike`, `bus_bike`, `auto_bike`). It is **not** organised as S/M/L tiers.

### C — The web tool's published methodology page
Source: `wolfsburg-activity-map/src/components/HubAlgoPanel.jsx` (live on the deployed
site, "Hubs Algorithm Work").

This page describes a **rigorous demand-based pipeline**: Maximal Covering Location
Problem (MCLP), AHP-weighted criteria, Kernel Density Estimation, Moran's I spatial
autocorrelation, OSMnx/NetworkX network isochrones, candidates generated on a 100 m
grid, and tiers assigned by HubScore rank (top 10 % → L, next 30 % → M, rest → S, with
S sourced from bus-stop/bike-parking coverage gaps).

**This narrative does not match either algorithm in B.** None of MCLP, AHP, KDE,
Moran's I, isochrones, or 100 m-grid candidates appears in the actual code. As written,
the methodology page is aspirational rather than a description of what runs.

---

## Tier-by-tier alignment

| | A — Concept | B — Code | C — Published methodology |
|---|---|---|---|
| **S** | Spatial last-metre hub, 150–250 m, e-bike + micro-pod + bench + beacon | Placed in hub-network mode from **bus stops**: the intermodal algorithm is run on bus stops only (car parks passed as `null`), scored by nearby footfall/park/bike-parking/residential, then density-thinned (radii auto-scaled to population). Not from parking. (`buildRunAllHubs` in `CapacitySidebar.jsx` → `intermodalAlgorithm.js`, kept as `hubType==='bus_bike'`.) | From bus-stop / bike-parking gaps (>200 m from any L/M) |
| **M** | Multimodal choice point, 300–500 m, public place | = **underground car parks** | Intermodal node from underground car parks, score 40–70 |
| **L** | Neighbourhood **anchor** in central repurposed car parks, programme + housing, 700–1000 m | = **multi-storey car parks**, **excluded from the centre** | City-centre anchor from multi-storey car parks, score >70 |
| **Placement basis** | Urban role + walkable catchment | Existing parking-structure locations | Demand optimisation (MCLP/AHP) — *described, not coded* |
| **Coverage radius** | 150–250 / 300–500 / 700–1000 m (walking) | 500 / 2000 / 4000 m | network isochrones (not coded) |

---

## Divergences & open conflicts (neutral list)

1. **Placement is parking-derived.** In the implemented code, hub *location* is whatever
   the existing parking stock happens to be (M = underground, L = multi-storey). This is
   the heart of the group's "these are garages, not hubs" observation: the tool places
   hubs *where cars are parked today*, which is a different logic from "where a public
   mobility place should be."

2. **L-hub: anchor vs. depot — and centre vs. periphery.** Three sources disagree:
   - Concept & research/03: L = **central** neighbourhood anchor (programme + housing).
   - Code: L is **excluded** from the dense centre (Stadtmitte/Schillerteich) as
     "spatially incompatible with a large fleet depot."
   - Teammate's framing in the session: L = peripheral fleet **parking/maintenance**.
   So the typology's central-anchor L and the operational depot-L are currently two
   different things wearing the same label. **Unresolved.**

3. **M-hub location logic.** Code ties M strictly to underground parking. The group's
   landing point ("M = proximity to parking + fast AV service") is consistent with that,
   but if M is meant to be a *spatial choice point* (concept A) it may need location
   criteria beyond "there is an underground car park here."

4. **S-hub is the least parking-bound tier.** No model places S from parking structures
   (the methodology sources S from bus stops/bike parking). This is consistent with the
   group's conclusion that **S can stay a genuine spatial hub.**

5. **Coverage-radius mismatch.** The code's radii (500 / 2000 / 4000 m) are far larger
   than the concept's walking catchments (150–250 / 300–500 / 700–1000 m). The tool's
   numbers read as vehicle/service ranges, not walk distances — worth reconciling before
   either is shown as "coverage."

6. **Two algorithms, one label.** The Intermodal mode and the Hub-network mode are
   different methods producing different hub sets; only the latter uses S/M/L.

7. **Published methodology vs. running code.** The deployed "Hubs Algorithm Work" page
   describes methods (MCLP/AHP/KDE/Moran's I/isochrones) that the code does not
   implement. Because this page is public, it is worth a team decision: either implement
   toward it, or revise it to describe what the tool actually does — especially before a
   jury reads it.

---

## Resolution — 2026-06-17 (locked in `decisions.md`)

The group resolved the design questions by **separating *where* a hub is placed from
*what* a hub is**: parking infrastructure may set the location (for fast AV servicing),
but the hub stays the spatial place the typology defines, expressed on the surface.

| Divergence above | Resolution |
|---|---|
| 1. Placement is parking-derived | Accepted as the *location* logic for M/L only; the **surface typology is protected** on top. Residual parking goes underground (M) or to the edge (L-Gateway). |
| 2. L anchor vs. depot / centre vs. periphery | **Broadened into two sub-types:** *L-Anchor* (central reuse building, mostly non-parking, neighbourhood anchor) and *L-Gateway* (edge multi-storey: fleet depot + **park-and-switch interchange** for inbound commuters). Both are genuine hubs. |
| 3. M location logic | Resolved: M = close to underground parking for fast AV service **and** full surface typology. |
| 4. S least parking-bound | Kept: S unchanged, transit/activity-derived. |
| 5. Coverage-radius mismatch | **Still open (implementation):** tool radii are service ranges, not walking catchments — reinterpret or fix. |
| 6. Two algorithms, one label | Still open (tool cleanliness, low priority). |
| 7. Methodology vs. code | **Still open (jury risk):** implement toward the page, or revise it. |

**Remaining items are implementation, not design** — see `tasks.md`:
- the algorithm currently excludes L from the central cores, so it cannot place
  L-Anchors centrally → needs a code change or an L sub-type split;
- decide whether L-Gateways count toward the "6 L-hubs" or are a separate fleet layer;
- reconcile coverage radii and the methodology page with the code.
