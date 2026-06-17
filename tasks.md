# Tasks

Quick-scan list of all open work. Update this during sessions and between them.

**Key:**
- `[ ]` Open — not yet started
- `[~]` In progress — someone is working on it
- `[x]` Done — completed

---

## Open

- [ ] Car-land composite map — all land currently dedicated to cars (surface parking, on-street, garages, overwide roads) | owner: team | source: June 4 consultation | by: June 25
- [ ] Hub network map — all 68 hub locations (6L, 19M, 43S) with walking catchment radii and coverage percentage | owner: team | source: June 11 consultation | by: June 25
- [ ] Hub typology sheets — one sheet per tier (L, M, S) showing functions, capacity, vehicle mix, footprint, urban role | owner: team | source: June 11 consultation | by: June 25
- [ ] VW shift simulation visualization — illustrate the fleet sizing calculation for one 10,000-worker shift wave | owner: team | source: June 11 consultation | by: June 25
- [ ] Anna persona journey — one complete journey from home to VW factory gate without private car, showing time, transfers, experience | owner: team | source: June 4 consultation | by: June 25
- [ ] Street transformation sections — before/after for Kleiststraße and at least one other street | owner: team | source: June 4 consultation | by: June 25
- [ ] 4-phase implementation timeline — Pilot → Hub backbone → Network reshaping → Post-car centre | owner: team | source: June 4 consultation | by: June 25
- [ ] Update web-tool/status.md planned features — what is the team currently building or planning in the Activity Map? | owner: team | source: workshop setup session | by: anytime

### From hub-system rethink — June 17 (see project/hub_concept_vs_tool.md + decisions.md)
Design questions RESOLVED 2026-06-17; remaining items are implementation:
- [x] Resolve the **L-hub** question → L broadened into **L-Anchor** (central reuse building) + **L-Gateway** (edge depot + park-and-switch interchange). | completed: June 17
- [x] Decide **M-hub location logic** → M = near underground parking for fast AV service **+** full surface typology. | completed: June 17
- [x] Settle **naming** → kept "hub"; typology protected, "garage" dropped as a label. | completed: June 17
- [ ] **Decide:** do **L-Gateways** count toward the "6 L-hubs" public total, or are they a separate fleet-infrastructure layer? | owner: team | source: 2026-06-17 | by: June 25
- [ ] **Typology:** add an **L-Gateway** variant (mode-change arrival sequence for inbound commuters) alongside S / M / L-Anchor sheets | owner: team | source: 2026-06-17 | by: June 25
- [ ] **Web tool code:** the algorithm excludes L from central cores (`HUB_L_EXCLUDED_DISTRICTS`), so it cannot place L-Anchors centrally — lift the exclusion or split L into Anchor/Gateway sub-types | owner: web-tool | source: 2026-06-17 | by: June 25 | priority: high
- [ ] Reconcile the web tool's **published methodology** (`HubAlgoPanel.jsx`: MCLP/AHP/KDE/isochrones) with what the **code actually does** (`hubLMAlgorithm.js`: parking-area greedy select) — implement toward it, or revise the text. Public-facing → jury risk | owner: web-tool | source: 2026-06-17 | by: June 25 | priority: high
- [ ] Reconcile **coverage radii**: code uses 4000/2000/500 m (service ranges); concept uses 700-1000/300-500/150-250 m walking catchments | owner: web-tool | source: 2026-06-17 | by: anytime

### From MOIA/MIA research (research/10) — June 17
- [ ] Add MOIA "home-advantage" frame to narrative + research/06 (VW subsidiary already builds this; Wolfsburg = ideal pilot city) | owner: team | source: research/10 | by: June 25 | effort: low / high-leverage
- [ ] Add MOIA counters to the 3 weak points in research/07 (AV-realism, VW-company-town politics, who-operates-and-pays) | owner: team | source: research/10 | by: June 25 | effort: low / high-leverage
- [ ] Cite AMAG/Zurich validation (600 AVs / 230k weekly trips / 5-min wait / 96% acceptance) beside our fleet math | owner: team | source: research/10 | by: June 25 | effort: low
- [ ] Web tool: prototype a "Simulator" panel — 3 live sliders (fleet size, max wait time, walking-conversion %) recomputing fleet + coverage (mirrors MIA Simulator) | owner: team | source: research/10 | by: June 25 | effort: medium / highest tool value
- [ ] Web tool: add a service-area definition step (MIA Explorer) + a full-screen "Presenter" scenario view for unattended Summaery exhibition | owner: team | source: research/10 | by: July 9 | effort: medium
- [ ] Adopt MIA parameter vocabulary across tool UI + presentation (service area, fleet size, max wait, detour ratio, acceptance rate, service quality vs viability vs policy goals) | owner: team | source: research/10 | by: June 25 | effort: low
- [ ] STRETCH (post-June-25): run one agent-based scenario in MATSim/FleetPy (VW shift wave) for a defensible simulated fleet number | owner: team | source: research/10 | by: Aug 16 | effort: high

---

## In Progress

*(move tasks here when someone starts working on them)*

---

## Done

- [x] Set up workshop parallel system (CLAUDE.md, folders, all core files) | completed: June 14, 2026
- [x] Convert studio brief PDF to studio_brief.md | completed: June 15, 2026
- [x] Convert midterm brief to midterm_brief.md | completed: June 15, 2026
- [x] Convert Wolfsburg Award website to competition_brief.md | completed: June 14, 2026
- [x] Write detailed web-tool/status.md for urban designers | completed: June 15, 2026
- [x] Pre-populate decisions.md from June 4 and June 11 consultations | completed: June 14, 2026
