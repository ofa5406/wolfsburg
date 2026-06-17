# HANDOFF — read this first when resuming

*This is the single "where are we right now" file. Whenever you (or Claude) start a session, read this before anything else. Whenever you end a session, update it. It is the memory that survives when a chat ends or usage resets.*

*Last updated: 2026-06-17 (Hub-system rethink — group reopened the hub concept; wrote neutral comparison `project/hub_concept_vs_tool.md`. Earlier same day: MOIA & MIA research, wrote research/10, PAUSED.)*

---

## The project in one line

Wolfsburg reimagined as a **post-private-car city**: the organizing element shifts from **parking → mobility hubs** (68 hubs, three tiers), freeing car-land for public life. Studio project + Wolfsburg Award 2026 entry.

## Deadlines (the clock)

| Date | What | Days from June 15 |
|------|------|-------------------|
| **June 25, 2026** | Studio final presentation — must **PROVE** the system works | 10 |
| **July 9–12, 2026** | Summaery exhibition (self-explanatory artefacts, no narration) | ~25 |
| **August 16, 2026** | Wolfsburg Award digital submission | ~62 |

## What is locked (don't re-litigate)

- 68 hubs: **6 Large** (reuse multi-storey car parks), **19 Medium**, **43 Small**.
- Fleet **763 vehicles**: 131 e-bikes, 55 shuttle pods, 33 autonomous buses, 369 micro-pods, 175 shared EVs. Sized for ~100k trips/day, ~9k peak-hour.
- **5-zone** Groningen-style filtered permeability; one-way internal streets.
- S-hub placement via **Grasshopper algorithm**; VW-factory-gate hub = primary case study; persona **"Anna"** (VW worker).
- Focus = **prove the system**, stop inventing vehicle types (tutor direction).

## What exists now

- ✅ Hub typology logic (`project/hub_typologies.md`) + Rhino kit-of-parts (`toolpalette.3dm`, 45 blocks, 3 sample scenes).
- ✅ Web tool "Wolfsburg Activity Map" — now organised as **5 sections** (Strategy · Capacity · Hub System · Urban Design · Simulation); hub placement + cycling network live. Repo now has README + `CLAUDE.md` + `docs/MODES.md`; deploys from `master` (GitHub Pages).
- ✅ **NEW: `research/` library** — ~10 cited documents (arguments, weak-points, hubs, mobility, precedents, behavior, theory, future, workflow). Start at `research/README.md`.
- ✅ **NEW: session-memory system** — this file + `sessions/INDEX.md` + `sessions/_template.md`.

## What's NOT done yet — the June 25 deliverables

None of the seven proof deliverables are produced yet. In rough priority:

1. ⬜ **Car-land map** — composite of all car-dedicated land (the rhetorical anchor).
2. ⬜ **Hub-coverage map** — all 68 hubs + walking catchments + coverage %.
3. ⬜ **Hub typology sheets** — plan/section/axonometric per tier (logic done, drawings not).
4. ⬜ **VW shift-wave simulation** — visualize fleet handling ~10k workers in ~1 hr.
5. ⬜ **Anna persona journey** — home → VW gate without a private car.
6. ⬜ **Street-transformation sections** — Kleiststraße + one more (before/after).
7. ⬜ **4-phase implementation timeline**.

## Resume here (next actions)

1. **Hub concept — RESOLVED 2026-06-17** (`decisions.md` + `project/hub_concept_vs_tool.md`): typology protected; S unchanged; M = near underground parking + surface typology; L = **L-Anchor** (central reuse) + **L-Gateway** (edge depot + park-and-switch interchange). Remaining items are *implementation*: decide if L-Gateways count toward the 6; add an L-Gateway typology variant; web-tool code change (algorithm currently excludes L from central cores); coverage radii; methodology-vs-code. See `tasks.md`.
2. **HTML presentation — queued (decided 2026-06-17):** build a single deck/site covering concept, spatial diagrams/visualizations, before/afters, videos, **strategy plan** (bigger scale, incl. outer settlements) and **masterplan** (city-centre scale: traffic plan, hubs, land acquisition, L-hub reuse scenarios). Build deferred; recorded in `project/deliverables.md` + `tasks.md`. Most visuals still to be produced; live web tool can be embedded.
3. Skim `research/README.md`, then read `research/07_weak-points-actions.md` → pick the highest-leverage fixes.
4. Begin the **car-land map** and **hub-coverage map** (highest rhetorical value, both feasible in Rhino/web tool).
5. Use `research/09_execution-workflow.md` for the realistic week-by-week plan to June 25.

**Paused thread — MOIA/MIA research (2026-06-17):** new doc `research/10_moia-mia-precedent.md` is written but not yet folded into the rest. Key takeaway: MOIA is **VW-owned** → "Wolfsburg = ideal pilot city" home-advantage frame, plus AMAG/Zurich validation numbers (600 AVs / 230k weekly trips / 5-min / 96%). To continue: (a) fold the frame + numbers into `research/06` and `07`; (b) spec the MIA-style "Simulator slider" panel for the web tool. See the 7 tasks in `tasks.md` and `sessions/2026-06-17_moia-mia-research/notes.md`.

## Open questions / risks

- Research docs are a **first draft** — fact-check key numbers before quoting to the jury.
- AV realism, financing, and VW-company-town politics are the likely hardest jury objections — see `research/07_weak-points-actions.md`.
- **Hub concept — resolved 2026-06-17** (`decisions.md`): typology protected by separating placement (parking-served) from the hub-as-place; L = Anchor + Gateway. Now an *implementation* gap, not a design one: the web-tool algorithm still only produces the parking-derived, centre-excluded L.
- **Tool methodology vs. code gap:** the deployed "Hubs Algorithm Work" page describes MCLP/AHP/KDE/isochrone methods that `hubLMAlgorithm.js` does not implement. This is public-facing — reconcile before the jury reads it.

---

*End-of-session checklist: update this file's "Last updated", "Resume here", and deliverable checkboxes; add a line to `sessions/INDEX.md`; write a session log from `sessions/_template.md`.*
