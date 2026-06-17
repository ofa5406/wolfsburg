# Design Decisions Log

Formally agreed decisions only. Ideas and open questions go in `notes.md`.

---

## 2026-06-11 — Fleet composition accepted

**Decided:** Fleet of 763 vehicles total:
- 131 e-bikes (free-floating considered, but fixed docks preferred for predictability)
- 55 autonomous shuttle pods
- 33 autonomous buses
- 369 autonomous micro-pods
- 175 car-sharing EVs

**Why:** Calculated from 100,000 trips/day baseline (17,000 residents + 18,000 workers + 17,000 visitors). Peak hour load ~9,000 trips. Tutors accepted the sizing logic.

**Alternatives considered:** Free-floating e-bikes were discussed but fixed docks at hubs were chosen for operational simplicity and predictability.

---

## 2026-06-11 — Hub network counts accepted

**Decided:** 6 L-hubs, 19 M-hubs, 43 S-hubs (68 hubs total)

**Why:** Based on coverage analysis. 43 S-hubs are to be placed with Grasshopper algorithm. 6 L-hubs are the existing multi-storey car parks. 19 M-hubs are manually designed.

**Alternatives considered:** Higher number of M-hubs discussed but team settled on 19 for manageability.

---

## 2026-06-11 — Zone structure (Groningen model)

**Decided:** City centre divided into 5 zones inspired by Groningen, Netherlands. One-way internal streets. Restricted zone entrances to prevent through-traffic.

**Why:** Groningen precedent shows filtered permeability reduces unnecessary car traffic without removing access entirely. Tutors receptive to this approach.

**Alternatives considered:** Full car exclusion zone (rejected as too radical for this stage of proof), Barcelona superblock model (considered, Groningen more directly applicable).

---

## 2026-06-11 — Small hub placement via Grasshopper

**Decided:** Use Grasshopper (parametric design tool) for placing the 43 S-hubs algorithmically. L-hubs and M-hubs designed manually.

**Why:** Manual design for 43 locations would be impractical. Algorithm can optimize for coverage, walking distance, and density. Tutors recommended this split.

**Alternatives considered:** Manual placement for all hubs (rejected — too time-consuming for S-hubs at this scale).

---

## 2026-06-11 — Hub near VW factory as case study

**Decided:** The hub adjacent to the Volkswagen factory campus is the primary detailed case study for hub design.

**Why:** Most compelling proof-of-concept — demonstrating how the system handles the predictable VW shift wave is the strongest argument for the whole system.

**Alternatives considered:** City centre hub as case study (may still be done as secondary example).

---

## 2026-06-04 — Project focus: prove the system, not invent vehicles

**Decided:** The project stops developing new vehicle types and focuses entirely on proving the hub-based system works spatially and operationally.

**Why:** Reviewer feedback — "move beyond compelling images to prove the system actually works." The vision was accepted; the task is now proof.

**Alternatives considered:** Continuing vehicle typology development (rejected per tutor direction).

---

## 2026-06-04 — L-hubs: convert existing multi-storey car parks

**Decided:** The 6 L-hubs will be built by repurposing the 6 existing central multi-storey car parks in Wolfsburg.

**Why:** Pragmatic transformation strategy — existing structure already in place, avoids new construction, converts car-storage infrastructure directly into mobility-hub infrastructure. Strong symbolic argument.

**Alternatives considered:** New purpose-built L-hubs (rejected — existing car parks are more spatially and narratively convincing).

---

## 2026-06-17 — Hub system resolved (concept vs. tool reconciliation)

**Context:** A group debate reopened the hub concept because the web tool places hubs from existing parking data (M = underground car parks, L = multi-storey car parks), which made hubs read as "garages." Full analysis in `project/hub_concept_vs_tool.md`.

**Decided — the hub typology is protected; location and place are treated as separate questions** (parking infrastructure may determine *where* a hub sits for fast autonomous-vehicle servicing, but the hub remains the spatial public place the typology defines, expressed on the ground/surface):

- **S-hubs — unchanged.** Keep the existing typology. Their placement is transit/activity-driven (bus stops + footfall + bike parking + parks), not parking-driven, so no conflict.
- **M-hubs — parking-served place.** M-hubs sit close to (underground) parking infrastructure so autonomous cars can be serviced quickly, **and** retain their full surface typology (the spatial, multimodal elements). Residual parking demand is absorbed **underground**, freeing the surface for the hub-as-place.
- **L-hubs — broadened into two sub-types**, both with a genuine public role:
  - **L-Anchor** (central): reuse of former multi-storey car-park *buildings* as neighbourhood anchors — mostly non-parking functions (gastronomy, shops, community, housing above), with minor incidental parking if needed. As defined in `hub_typologies.md` (Scenario A). This refines/extends the 2026-06-04 decision (the 6 central car-park conversions remain L-Anchors).
  - **L-Gateway** (city edge): multi-storey car parks on the outer approaches serving as fleet depot + maintenance **and** as park-and-switch **interchange** for inbound regional commuters — the threshold where a private car is left and the post-car system is entered. This is the operational edge of the locked 5-zone Groningen filtered-permeability model; private-car parking is deliberately concentrated here.

**Why:** Protects the design typology while accepting the operational reality (parking served underground at M, concentrated at the L-Gateway edge). Giving the peripheral L a mode-change/interchange function means it is a true hub, not merely storage. Fits the already-locked 5-zone model and the typology's existing Scenario A/B.

**Still open (implementation, not design):** (a) whether L-Gateways count toward the "6 L-hubs" public total or sit as a separate fleet-infrastructure layer; (b) the web tool's algorithm currently *excludes* L from the central cores, so it cannot place L-Anchors centrally — needs a code change or an L sub-type split; (c) the tool's coverage radii (L 4000 m / M 2000 m) are service ranges, not the typology's walking catchments; (d) the tool's published methodology page describes methods the code does not implement. Tracked in `tasks.md`.

**Alternatives considered:** Abandoning surface hubs entirely (the "AVs are everywhere, why anything on the surface?" position) — rejected, as it reduces the project to mobility infrastructure and discards the public-life thesis.
