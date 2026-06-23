# Post-Car Future of Wolfsburg — Current Project Description

*Update this file after consultations, group decisions, working sessions, and milestones.
Before major updates, copy the current version to `archive/vN_YYYY-MM-DD.md` first.*

*Last updated: June 14, 2026*

---

## One-Sentence Thesis

Wolfsburg is reimagined as a post-private-car city where the organizing element of urban mobility shifts from **parking** to **mobility hubs** — enabling autonomous shared vehicles, MaaS, cycling, and public transport, while reclaiming car-dominated land for public life.

---

## Core Argument

Wolfsburg gives a disproportionate amount of urban land to private cars: parking lots, surface parking, on-street parking, and car-oriented street infrastructure. This is amplified by Volkswagen's commuting patterns — the city was literally built around car storage and car movement.

The project argues this land-use model is no longer necessary. If mobility is reorganized around a shared, multimodal, autonomous system, the land currently used for parking becomes available for public life, greenery, housing, and civic space.

**Parking is the infrastructure of private ownership.**
**Hubs are the infrastructure of shared mobility.**

---

## The Hub System

The core spatial shift: from parking (where privately owned vehicles are stored) to mobility hubs (where shared access happens).

| Hub Type | Count | Walking Radius | Role |
|----------|-------|---------------|------|
| L (Large) | 6 | 700–1000 m catchment | Repurposed multi-storey car parks. Backbone. Charging, storage, fleet management. |
| M (Medium) | 19 | 300–500 m | Neighbourhood hubs. Bikes, EV charging, shuttle stops, transfers. |
| S (Small) | 43 | 150–250 m | Minimal nodes. E-bike dock, pod stop, last-mile coverage. |

The hub near the Volkswagen factory campus is the primary detailed case study.

---

## Fleet

| Mode | Count | Notes |
|------|-------|-------|
| Autonomous buses | 33 | High-capacity, fixed routes |
| Autonomous shuttle pods | 55 | Flexible on-demand routing |
| Autonomous micro-pods | 369 | Individual or small group |
| Shared EV cars | 175 | For longer trips, families |
| E-cargo bikes | 131 | Shopping, logistics, active users |
| **Total** | **763** | |

Sized for 100,000 trips/day. Peak hour: ~9,000 trips. Basis: 17,000 residents + 18,000 workers + 17,000 daily visitors.

---

## Traffic and Zone Structure

5 zones inspired by Groningen, Netherlands:
- Filtered permeability — restricted zone entrances prevent through-traffic
- One-way internal streets
- Priority for shared mobility, cycling, and pedestrians
- Direct access maintained for residents and services

---

## The Proof Framework

What the project must demonstrate before final submission:

1. **Hub coverage** — All 68 hubs mapped with walking catchments. Show that 80–90% of residents are within 300 m of an S- or M-hub.
2. **Fleet sizing logic** — Clear calculation showing fleet handles one VW shift wave (10,000 workers in ~1 hour).
3. **Persona journey** — One detailed journey from home to VW factory gate without private car. Show time, transfers, experience.
4. **Car-land map** — Single composite visualization of all land currently dedicated to cars (parking + roads + storage). The rhetorical anchor of the project.
5. **Street transformation sections** — Before/after for Kleiststraße and at least one other street, showing reclaimed public space.
6. **Implementation timeline** — 4-phase transition from today to full post-car centre.

---

## Current Focus

*(Update this section whenever the active work shifts)*

**As of June 20, 2026:** Masterplan Rhino file (`wolfsburg_masterplan.3dm`) updated with:
road hierarchy cleaned into 5 access tiers, hub points placed and intersected with the
street network, hub catchment/effect areas drawn, and acquired land / possible development
zones marked. Full layer reference in `project/rhino_masterplan.md`.

**As of June 15, 2026:** Hub typology design logic is complete (`project/hub_typologies.md`).
The **3D kit-of-parts is now built in Rhino** (`toolpalette.3dm`): all 45 hub elements
modelled as reusable blocks on material-based layers, a labelled palette catalogue, and
three sample hub scenes (S / M / L) with street context. Full catalogue in
`project/rhino_toolpalette.md`; rebuildable from `rhino/build_toolpalette.py`.

---

## Next Steps

*(Update this after each session or decision)*

- [x] Road hierarchy — cleaned and sorted into 5 access tiers in masterplan file (June 20, see `rhino_masterplan.md`)
- [x] Hub points placed and intersected with street network in masterplan file (June 20)
- [x] Hub catchment / effect areas drawn in masterplan file (June 20)
- [x] Acquired land / possible development zones drawn in masterplan file (June 20)
- [ ] Map all 68 hub locations with coverage radii — **geometry exists, export needed**
- [ ] Produce the "car-land" composite graphic (parking + roads dedicated to cars) — **layers exist, export needed**
- [x] Hub typology design logic — element palette, tier definitions, spatial logic (June 15, see `hub_typologies.md`)
- [x] Rhino kit-of-parts — 45 element blocks, material layers, palette catalogue, 3 sample scenes (June 15, see `rhino_toolpalette.md` / `toolpalette.3dm`)
- [ ] Hub typology drawings — plan, section, axonometric per tier (S, M, L)
- [ ] Case study hub design — VW factory gate location, adapt L-hub scene, before/after section
- [ ] Run the VW shift wave simulation for fleet sizing
- [ ] Develop the Anna persona journey (VW worker, home → factory)
- [ ] Street transformation sections (Kleiststraße + one other)
- [ ] 4-phase implementation timeline
- [ ] Fill in `briefs/studio_brief.md` and `briefs/midterm_brief.md`

---

## Wolfsburg as a Special Case

VW shift waves create predictable peak demand — the opposite of the dispersed, unpredictable demand that makes shared mobility hard. This makes Wolfsburg an unusually strong prototype for shared autonomous mobility. The factory commute is the project's main proof case.

---

## What Urban Space Is Reclaimed

When parking is removed and hub access replaces it:
- Wider footpaths and protected cycling lanes
- Trees and climate infrastructure
- Pocket parks, seating, public gardens
- Active ground-floor uses at hub locations
- Canal-side land currently used for surface parking → park
- New housing, play spaces, community space

The goal is not prettier traffic corridors. The goal is to ask what fundamentally new urban life becomes possible.
