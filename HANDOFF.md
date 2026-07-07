# HANDOFF — read this first when resuming

*This is the single "where are we right now" file. Whenever you (or Claude) start a session, read this before anything else. Whenever you end a session, update it. It is the memory that survives when a chat ends or usage resets.*

*Last updated: 2026-07-07 (**Full 24-page exhibition presentation BUILT + DEPLOYED.** Grew `exhibition/deck/` from 5 slides into the complete self-running Summaery pitch-talk per `exhibition/PRESENTATION-OUTLINE.md` (refined + completed this session from the print text + hub_typologies + decisions). 7 new `deck.css` template variants (T2.1 today · T2.2 potential · T-STAT outcomes · T-DIAGRAM S/M/L + hierarchy · T-TYPO S/M/L sheets · T-PLAN masterplans · T-STATEMENT manifesto) + bracket titles / ghost numbers / accent / before-after wipe. `deck.js` is now a **24-slide array** with a generic `txtSlide` builder + counter animation, and map/hub/brain are found by slide **`kind`** (not hardcoded index) so autoplay/loop/idle-resume survive the longer deck. All prose typed; live map + 3D hub-viewer + brain graph embedded (click-to-activate, GPU pause off-screen). Curated M/L-hub aerials copied to `exhibition/deck/assets/`. **The deck is now the live homepage** (root `index.html` redirect → `exhibition/deck/`). Headless-verified (24 slides, 0 console/exception errors, no broken images); committed + pushed `ofa5406/wolfsburg` `main` `ca34c09`; **live at ofa5406.github.io/wolfsburg/**. Open: ⚠ **fleet number 763 vs 1,300** (§4.2 shows 763 + a visible TODO tag), S-hub uses a street-scene stand-in, pacing pass + hi-res history images pending. See `sessions/2026-07-07_kiosk-presentation/notes.md`.)*

*Previous update: 2026-07-07 (**The Project Brain — an Obsidian-style 3D knowledge graph of the whole project, now slide 5 of the exhibition deck.** New `brain/` folder: `brain/vault/` = 408 markdown notes with typed wikilink edges (~2,400 links) atomising everything — concepts, all 45 hub elements, fleet math, ~60 sourced research findings, 25 precedents, all locked decisions, risk register with tracked contradictions (incl. **Fleet Number Conflict** 763 vs 1,273), personas, places, tools, plus 54 researched deep dives (etymologies, histories, theory, Jacobs→Moreno lineage). Open the vault in Obsidian at `brain/vault/` (start: `00_Index/Home.md`). Pipeline: `brain/scripts/validate_vault.py` (0 errors, 0 orphans — the gate) → `build_graph.py` → `brain/web/data/graph.js`. Viewer: `brain/web/index.html` — self-contained offline 3D force graph in the deck identity (monochrome nodes, accent selection, paper detail panel with clickable wikilinks, search, category chips; `?kiosk=1` auto-tour posting `brain-cycle-complete`, `?debug=1` FPS). Deck: additive slide 5 (`#s5` + `brain-*` bridge in `deck.js`; rollback = delete both). Headless-verified: viewer all checks 0 errors; deck 5-slide regression 0 errors, hub slide unchanged. See `brain/README.md` + `sessions/2026-07-07_project-brain/notes.md`.)*

*Previous update: 2026-07-06 (**New exhibition deck — replaces the kiosk look.** Built `exhibition/deck/` from templates after İrem rejected `exhibition/kiosk/`. Vertical **fullpage** deck (one-scroll-one-page, ease-in-out, thick L-frames, near-monochrome); 3 templates + hub. Biggest piece: the template-3 maps are the **real Activity-Map deployment components** embedded offline — new `wolfsburg-activity-map/embed/` built via `vite.embed.config.js` into `exhibition/deck/mapembed/` (rebuild after any change: `npx vite build --config vite.embed.config.js`, then prune `Video/` + `wolfsburg_centrality_hubs.geojson`). **Present** button (auto-play + loop, resumes from current slide); **all prose typed**; **per-image** history captions; **`<stadt.hub>`** logo big on slide 1 with an always-blinking caret; **click-to-activate** map+hub; hub render loop **pauses off-screen** (fixed choppy playback). Shared-file edits gated so the live deployment is unchanged. Verified headless (0 errors). **Committed + pushed:** `ofa5406/wolfsburg` `main` `bb46ed2`, `annestasiia/wolfsburg-activity-map` `master` `264cd3f` (gated so the live tool is unchanged). See `sessions/2026-07-06_exhibition-deck/notes.md`. The kiosk still exists, untouched.)*

---

## The project in one line

**`<stadt.hub>`** — Wolfsburg reimagined as a **post-private-car city**: the organizing element shifts from **parking → mobility hubs** (68 hubs, three tiers), freeing car-land for public life. Studio project + Wolfsburg Award 2026 entry.

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

- ✅ **Project Brain** (`brain/`) — 408-note Obsidian vault of the entire project + offline 3D graph viewer (`brain/web/`), embedded as slide 5 of the exhibition deck. Validator-gated (0 broken links); see `brain/README.md`.
- ✅ **HTML presentation** (`final-presentation/`) — scroll-based site with Swiss-grid layout, branded **`<stadt.hub>`** (was "Auto-Stadt"). Two masterplan scales (upper city / lower centre) with crossfade animation between hub network and catchment views. Hub data charts (heatmap, stacked bar, profile cards, area breakdown). Lightbox for enlarged plan views. Embeds the hub-viewer in section 3.3. Deployed via GitHub Pages at **ofa5406.github.io/wolfsburg/** (repo root `index.html` redirects here). Note: a separate Reveal.js workflow/intro deck lives in `wolfsburg-workflow/`.
- ✅ **Hub Viewer** (`hub-viewer/`) — standalone, offline, **embeddable** 3D viewer of one hub's element kit, exported from the Rhino model. Hover any element for a one-line description; tabs for the 4 named views + Iso; muted style with crisp edges; toggleable static people + trees. Self-contained (vendored three.js, baked `data/model-data.js`). Built to drop into a larger web tool — see `hub-viewer/README.md` + `hub-viewer/CLAUDE.md`. **Now also has game-style Walk/Fly navigation** (drag-look, WASD + Shift sprint, click-to-pick, fullscreen), and is embedded in the presentation's section 3.3 via iframe.
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

0. **Summaery exhibition presentation (July 9–12) — BUILT + LIVE.** The full **24-page self-running deck** is `exhibition/deck/` (now the site homepage), deployed at ofa5406.github.io/wolfsburg/ (`ca34c09`). Next: full-loop **pacing pass** on the exhibition PC (F11 / Chrome `--kiosk`, screen-sleep off) — tune slide hold timings, condense any slide that runs long, confirm idle→takeover→resume + clean loop restart; resolve ⚠ **fleet number 763 vs 1,300** (§4.2 shows 763 + a TODO tag, then remove it); swap the **S-hub** stand-in image + low-res history images for hi-res. Outline of every page: `exhibition/PRESENTATION-OUTLINE.md`. Older `exhibition/kiosk/` superseded (kept). Then: reconcile copy/captions with the team's Miro board, swap the low-res placeholder history images for hi-res, and set up the exhibition PC (Chrome `--kiosk`, screen-sleep off). **To change the maps:** edit the 3 landing sections / `ExportControl` / `embed/main.jsx`, then rebuild — `cd wolfsburg-activity-map && npx vite build --config vite.embed.config.js` and re-prune. Already committed + pushed (`wolfsburg` `main` `bb46ed2`, `wolfsburg-activity-map` `master` `264cd3f`). Optional follow-ups: align embed center to the teammate's new `[10.7769, 52.4056]` (rebuild + push); vendor maplibre glyphs for offline map labels; hub tour dwell 6 s → 5 s.
1. **Resolve e-bike number** — presentation currently shows 641 e-bikes / 1,273 total fleet (web tool computed), but locked design decision says 131 / 763 (tutor-accepted June 11). Group needs to agree and sync all files.
2. **Drop in missing visuals** — section 2.2 (car-land map), before/after street sections (Kleiststraße), and persona journey diagrams (section 05) are all still placeholder. Export from Rhino when ready.
3. **Hub concept — RESOLVED 2026-06-17** (`decisions.md` + `project/hub_concept_vs_tool.md`): typology protected; S unchanged; M = near underground parking + surface typology; L = **L-Anchor** (central reuse) + **L-Gateway** (edge depot + park-and-switch interchange). Remaining items: decide if L-Gateways count toward the 6; web-tool code change. See `tasks.md`.
4. **Presentation is deployed** via GitHub Pages at ofa5406.github.io/wolfsburg/ (source in `final-presentation/`). Ready for Summaery (July 9–12).
5. Begin the **car-land map** (highest rhetorical value — the project's main argument).

**Paused thread — MOIA/MIA research (2026-06-17):** `research/10_moia-mia-precedent.md` written but not folded in. To continue: fold frame + numbers into `research/06` and `07`; spec the MIA-style simulator panel for the web tool.

## Open questions / risks

- Research docs are a **first draft** — fact-check key numbers before quoting to the jury.
- AV realism, financing, and VW-company-town politics are the likely hardest jury objections — see `research/07_weak-points-actions.md`.
- **Hub concept — resolved 2026-06-17** (`decisions.md`): typology protected by separating placement (parking-served) from the hub-as-place; L = Anchor + Gateway. Now an *implementation* gap, not a design one: the web-tool algorithm still only produces the parking-derived, centre-excluded L.
- **Tool methodology vs. code gap:** the deployed "Hubs Algorithm Work" page describes MCLP/AHP/KDE/isochrone methods that `hubLMAlgorithm.js` does not implement. This is public-facing — reconcile before the jury reads it.

---

*End-of-session checklist: update this file's "Last updated", "Resume here", and deliverable checkboxes; add a line to `sessions/INDEX.md`; write a session log from `sessions/_template.md`.*
