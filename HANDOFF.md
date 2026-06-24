# HANDOFF — read this first when resuming

*This is the single "where are we right now" file. Whenever you (or Claude) start a session, read this before anything else. Whenever you end a session, update it. It is the memory that survives when a chat ends or usage resets.*

*Last updated: 2026-06-24 (Hub Viewer — built a standalone, embeddable 3D hub-element viewer in `hub-viewer/`; iterated nav, dark→muted restyle, static people, hover cards; locked the "Muted & deep" look; packaged for reuse + committed. See `sessions/2026-06-24_hub-viewer-round2/notes.md`)*

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

- ✅ **HTML presentation** (`wolfsburg-presentation/`) — scroll-based site with Swiss-grid layout, named **Auto-Stadt**. Two masterplan scales (upper city / lower centre) with crossfade animation between hub network and catchment views. Hub data charts (heatmap, stacked bar, profile cards, area breakdown). Lightbox for enlarged plan views. Local only — not yet deployed.
- ✅ **Hub Viewer** (`hub-viewer/`) — standalone, offline, **embeddable** 3D viewer of one hub's element kit, exported from the Rhino model. Hover any element for a one-line description; tabs for the 4 named views + Iso; muted style with crisp edges; toggleable static people + trees. Self-contained (vendored three.js, baked `data/model-data.js`). Built to drop into a larger web tool — see `hub-viewer/README.md` + `hub-viewer/CLAUDE.md`.
- ✅ **Rhino masterplan** (`wolfsburg_masterplan.3dm`) — road hierarchy in 5 tiers, hub points placed, catchment areas drawn, land acquisition zones marked. See `project/rhino_masterplan.md`.
- ✅ Hub typology logic (`project/hub_typologies.md`) + Rhino kit-of-parts (`toolpalette.3dm`, 45 blocks, 3 sample scenes).
- ✅ Web tool "Wolfsburg Activity Map" (annestasiia.github.io/wolfsburg-activity-map) — hub placement, cycling network, fleet/capacity calculations. Source of computed numbers used in the presentation.
- ✅ **`research/` library** — ~10 cited documents. Start at `research/README.md`.
- ✅ **session-memory system** — this file + `sessions/INDEX.md` + `sessions/_template.md`.

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

1. **Resolve e-bike number** — presentation currently shows 641 e-bikes / 1,273 total fleet (web tool computed), but locked design decision says 131 / 763 (tutor-accepted June 11). Group needs to agree and sync all files.
2. **Drop in missing visuals** — section 2.2 (car-land map), before/after street sections (Kleiststraße), and persona journey diagrams (section 05) are all still placeholder. Export from Rhino when ready.
3. **Hub concept — RESOLVED 2026-06-17** (`decisions.md` + `project/hub_concept_vs_tool.md`): typology protected; S unchanged; M = near underground parking + surface typology; L = **L-Anchor** (central reuse) + **L-Gateway** (edge depot + park-and-switch interchange). Remaining items: decide if L-Gateways count toward the 6; web-tool code change. See `tasks.md`.
4. **Deploy the presentation** to a separate GitHub repo when ready for Summaery (July 9–12). Currently local only at `wolfsburg-presentation/`.
5. Begin the **car-land map** (highest rhetorical value — the project's main argument).

**Paused thread — MOIA/MIA research (2026-06-17):** `research/10_moia-mia-precedent.md` written but not folded in. To continue: fold frame + numbers into `research/06` and `07`; spec the MIA-style simulator panel for the web tool.

## Open questions / risks

- Research docs are a **first draft** — fact-check key numbers before quoting to the jury.
- AV realism, financing, and VW-company-town politics are the likely hardest jury objections — see `research/07_weak-points-actions.md`.
- **Hub concept — resolved 2026-06-17** (`decisions.md`): typology protected by separating placement (parking-served) from the hub-as-place; L = Anchor + Gateway. Now an *implementation* gap, not a design one: the web-tool algorithm still only produces the parking-derived, centre-excluded L.
- **Tool methodology vs. code gap:** the deployed "Hubs Algorithm Work" page describes MCLP/AHP/KDE/isochrone methods that `hubLMAlgorithm.js` does not implement. This is public-facing — reconcile before the jury reads it.

---

*End-of-session checklist: update this file's "Last updated", "Resume here", and deliverable checkboxes; add a line to `sessions/INDEX.md`; write a session log from `sessions/_template.md`.*
