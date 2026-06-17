# Session — 2026-06-17 (Hub system rethink)

**Date:** 2026-06-17
**Focus:** Group debate reopening the hub concept; comparison of the web tool's hub
definitions and algorithms against the design concept.
**Who:** Team (incl. the web-tool teammate) + Claude

---

## What we did

- Held a long group discussion that **reopened the whole hub concept**, prompted by the
  web teammate's account of how hub placement and the placement algorithm currently work.
- Established (neutrally) what the web tool actually does and where it diverges from the
  design concept. Written up in `project/hub_concept_vs_tool.md`.

## The discussion (objective minutes)

- The web tool's hub placement is driven almost entirely by **existing parking
  infrastructure**. A view was raised that all parking could be absorbed by the existing
  underground system.
- This led to questioning whether **hubs are needed at all**: if a hub only relates to
  parking + AV pickup, it stays a mere **infrastructure element**, not a place. The
  pointed version: *"why do we need anything on the surface, if AV cars are everywhere
  anyway?"*
- It took significant discussion to re-establish that a hub, in this project, is **not
  just parking + AV** — it is a **spatial public infrastructure and part of a
  multi-mobility system** (the typology position).
- It was then noted that the tool's hub *placements* are **directly tied to parking**.
  The working response in the room: *"then these are not hubs"* — and they were
  provisionally renamed **"garages"** as a proxy label.
- Tier-by-tier landing point reached in the room:
  - **S-hubs** can remain hubs and can be made spatial.
  - **M-hubs** currently match under/above-ground parking structures (proximity +
    fast AV service is the main criterion) → may need **other location/relationship
    proposals** if they are to be genuine choice points.
  - **L-hubs** were framed by the teammate as **fleet parking/maintenance**, therefore
    located **outside** the city rather than inside.
- Open tension identified: the concept and `research/03` put **L-hubs in the centre as
  neighbourhood anchors** (repurposed multi-storey car parks with programme + housing),
  while the operational framing pushes L to the periphery as a depot. Whether L as a
  depot is **incompatible with our typologies** was left unresolved ("a mystery").

## Decisions made

**Resolved later the same day → locked in `decisions.md` (2026-06-17 — Hub system resolved):**
- Principle: **protect the typology**; separate *where* a hub sits (parking may decide,
  for fast AV servicing) from *what* it is (the spatial place stays, on the surface).
- **S** — unchanged.
- **M** — near underground parking for fast AV service **+** full surface typology;
  residual parking absorbed underground.
- **L** — broadened into **L-Anchor** (central reuse building, mostly non-parking) and
  **L-Gateway** (edge multi-storey: fleet depot + park-and-switch interchange for inbound
  commuters; the threshold of the locked 5-zone model). Both are genuine hubs.
- Remaining items are **implementation, not design** (see `tasks.md`).

## Files created / changed

| File | What changed |
|------|--------------|
| `project/hub_concept_vs_tool.md` | New — neutral 3-way comparison (concept / code / published methodology) |
| `sessions/2026-06-17_hub-system-rethink/notes.md` | New — this log |
| `sessions/INDEX.md` | Added top line |
| `notes.md` | Added neutral summary + provisional landing |
| `tasks.md` | Added hub-rethink open items |
| `HANDOFF.md` | Updated "Last updated", "Resume here", "Open questions / risks" |

## Open threads / unfinished

- **L-hub:** central neighbourhood anchor (concept) vs. peripheral fleet depot
  (operational framing) — pick one, or define two distinct things.
- **M-hub:** decide whether "near an underground car park" is sufficient location logic
  or whether M needs choice-point criteria.
- **Naming:** "hub" vs. the working proxy "garage" for the parking-derived points.
- **Web tool:** the deployed methodology page (`HubAlgoPanel.jsx`) describes
  MCLP/AHP/KDE/isochrones that the code does not implement — reconcile (implement, or
  revise the text) before the jury reads it.

## Next session — start here

1. Read `project/hub_concept_vs_tool.md` and confirm it reads as neutral/accurate.
2. Resolve the **L-hub** question first (it blocks the typology sheets and the VW-gate
   case study).
3. Decide the **naming** and whether the web tool's M/L placement should stay
   parking-derived or move toward the concept's role-based placement.
