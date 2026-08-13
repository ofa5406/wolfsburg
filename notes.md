# Project Notes

Running log of ideas, quick thoughts, group decisions, and things to follow up on.
Newest entries at the top. Add freely — this is a scratchpad, not a formal document.

---

## 2026-08-13 — things worth remembering from the submission build

- **"Works offline" and "works when double-clicked" are different tests.** The
  package passed every served check while every embed was blank on a
  double-click. Browsers refuse ES modules over `file://`, so anything Vite
  builds needs an actual server. The launchers exist for this; the deck's old
  `start-exhibition.cmd` had solved it once already and the lesson was lost when
  the file was not carried over.
- **The permissions question is real, not paperwork.** The university becomes the
  publisher, so the archive/press photographs and the Google Earth views are an
  actual exposure. They are credited with permission marked *not cleared*, and
  the README names them as what to clear or replace first. If anyone follows up,
  the cheapest fix is replacing the two press images and re-shooting the Google
  Earth views from an openly licensed source.
- **Three deliverables, three different things.** InfAU final submission (Aug 14,
  graded, Nextcloud folder) · Wolfsburg Award (Aug 16, A1/A0 sheets, **still does
  not exist**) · the live site. Easy to conflate; they have almost nothing in
  common except the content.
- The activity map's data is now a **captured snapshot**, not a live query. That
  makes it reproducible and immune to Overpass changing — but it also means the
  numbers are frozen at 13 Aug 2026. Re-run `capture_osm_snapshots.mjs` to
  refresh.

## 2026-07-07 — Full 24-page exhibition presentation built + deployed

Refined + completed the outline (`exhibition/PRESENTATION-OUTLINE.md`), then grew
`exhibition/deck/` from 5 slides into the whole self-running Summaery pitch-talk (§1 opening
→ §8 tools/close). Added 7 new CSS template variants and rebuilt `deck.js` as a 24-slide
engine (generic `txtSlide` builder + counters; map/hub/brain now keyed by slide `kind`, not
a hardcoded index). **Made the deck the live homepage** (root redirect). Headless-verified
(24 slides, 0 errors), pushed `ca34c09`, live at ofa5406.github.io/wolfsburg/. Two things
still open: the **fleet number** (763 vs 1,300 — §4.2 shows 763 + a visible TODO) and the
**S-hub** placeholder image. Next is a full-loop pacing pass. Details:
`sessions/2026-07-07_kiosk-presentation/notes.md`.

---

## 2026-07-06 — New exhibition deck (`exhibition/deck/`)

Rebuilt the Summaery exhibit as a template deck after the kiosk got scrapped. Vertical fullpage,
near-monochrome, `<stadt.hub>` logo + always-blinking caret, all text typed. The big idea that worked:
**embed the real Activity-Map landing map components** (offline build in `wolfsburg-activity-map/embed/`
→ `deck/mapembed/`) so the T3 maps ARE the deployment — same tabs, pan/zoom, popups — instead of a
redraw. Interactive embeds are click-to-activate (scroll doesn't grab them until clicked), and the
hub-viewer render loop now pauses off-screen (that was the cause of choppy video). Shared-file edits are
gated so the live tool is unchanged. Rebuild maps with `npx vite build --config vite.embed.config.js`.
All local, nothing pushed yet. Details: `sessions/2026-07-06_exhibition-deck/notes.md`.

---

## 2026-07-04 — Hub-viewer Walk/Fly + deck folders

Two "presentations" were causing confusion, so we foldered them: **`final-presentation/`** = the `<stadt.hub>` scroll deck (the site homepage — repo-root `index.html` now just redirects to it), and **`wolfsburg-workflow/`** = the separate Reveal.js workflow/intro deck (was `presentation/`; doc is now `WORKFLOW.md`). `charts/`+`videos/` stay at repo root (shared). Also gave the hub-viewer game-style **Walk/Fly** navigation (drag-to-look, WASD + Shift sprint, click-to-pick, fullscreen). Live at ofa5406.github.io/wolfsburg/. Separately, recolored the Activity Map's Urban Design section to the hub-viewer palette (pushed to annestasiia/wolfsburg-activity-map).

---

## 2026-06-25 — Project name: `<stadt.hub>`

We have a name for the whole project: **`<stadt.hub>`**. Keeping "Post-Car Future of Wolfsburg" as the descriptive line. Updated README, CLAUDE.md, HANDOFF.md, project/current.md; logged in decisions.md. (Historical session logs/archives left as-is.)

---

## 2026-06-17 — Decided: build an HTML presentation

The team decided to prepare a single **HTML presentation** carrying the whole project.

**Scope agreed:**
- Concept and all related topics
- Spatial diagrams and visualizations
- Before/afters
- Videos
- **Strategy plan** — bigger scale, including outer settlements
- **Masterplan** — Wolfsburg city-centre scale: traffic plan, hubs, land acquisition,
  and L-hub reuse scenarios

Serves the June 25 / Summaery / competition deadlines. **Build deferred** — recorded as
a deliverable (`project/deliverables.md`) and a task for now. Most visuals (maps,
before/afters, renders, videos) still need producing; the live web tool can be embedded.

---

## 2026-06-17 — Hub concept reopened (tool places hubs from parking)

Long group debate on the hub system, triggered by how the web tool places hubs.

**The core issue (neutral):** the tool's hub placement is driven by **existing parking
infrastructure** — in the code, **M = underground car parks, L = multi-storey car
parks**. That collapses "hub" toward "garage": if a hub is only parking + AV pickup, it
is infrastructure, not the spatial, multi-mobility *place* our concept describes
("why anything on the surface if AVs are everywhere?").

**Provisional landing (nothing locked):**
- **S-hubs** → stay genuine spatial hubs (least parking-bound tier).
- **M-hubs** → currently matched to under/above-ground parking (proximity + fast AV
  service); may need new location logic to be real choice points.
- **L-hubs** → *unresolved.* Teammate frames them as peripheral fleet
  parking/maintenance (outside the city); the concept + `research/03` put L **in the
  centre** as neighbourhood anchors. Anchor-vs-depot is the open question.
- "Garage" is being used as a **working proxy name** for the parking-derived points.

Full neutral comparison: `project/hub_concept_vs_tool.md`. Side-finding: the deployed
methodology page (`HubAlgoPanel.jsx`) describes MCLP/AHP/KDE/isochrone methods the code
does not actually implement — flag before the jury reads it.

**RESOLVED later same day (see decisions.md):** protect the typology — separate *where*
a hub sits (parking can decide, for fast AV servicing) from *what* it is (the spatial
place stays). S unchanged. M = near underground parking **+** full surface typology;
residual parking goes underground. L broadened into **L-Anchor** (central reuse building,
mostly non-parking) **+ L-Gateway** (edge depot **and** park-and-switch interchange for
inbound commuters — the threshold of the locked 5-zone model). Both L types are genuine
hubs. Remaining items are implementation only: L-Gateway counts toward the 6?; add an
L-Gateway typology variant; web-tool code change (L excluded from centre); coverage radii;
methodology-vs-code.

---

## 2026-06-15 — Hub toolpalette built in Rhino

Built the 3D kit-of-parts in `toolpalette.3dm` (driven from terminal via the Rhino bridge).

**What's in the file:**
- 10 layers organised **by material** (Pavement, Concrete, Metal, Wood, Glass, Plastic +
  Greenery, Lighting, Context, Labels) — simple, uncrowded.
- **45 element blocks** (`EL_*`) — every element from `hub_typologies.md`, real scale (cm),
  diagrammatic massing. Each block carries its description as user text.
- A labelled **palette catalogue** grid + three **sample hub scenes** S / M / L
  (groups `SCENE_S/M/L`) with street context.
- Full written catalogue: `project/rhino_toolpalette.md`.
- Everything regenerates from `rhino/build_toolpalette.py` (idempotent — re-run to rebuild).

**Two things worth remembering:**
- The file's stock annotation style "Centimeters Architectural" has a **30× scale**, so
  text came out huge. Fixed by a dedicated `TP_Text` style at scale 1; labels are now 50 cm.
- The native Rhino MCP code tool (`execute_rhinoscript_python_code`) **is enabled**, so
  whole build scripts can be run inside Rhino — much faster than one object at a time.

**To decide next:** canopy form/character, L-hub building articulation, and fitting the
L-hub scene to the real VW-gate street geometry for the case study.

---

## 2026-06-14 — Workshop system setup

Set up the parallel workshop system alongside the project. Structure is now in place.

**Files created today:**
- `CLAUDE.md` — master briefing for all future sessions
- `project/current.md` — living project description (update this after every significant session)
- `decisions.md` — pre-populated from June 4 and June 11 consultations
- `briefs/competition_brief.md` — Wolfsburg Award brief converted from website
- `consultations/_template.md` — standard format for future consultation notes
- `web-tool/status.md` — current state of the Wolfsburg Activity Map

**To do before next session:**
- Paste in studio brief content into `briefs/studio_brief.md`
- Paste in midterm brief content into `briefs/midterm_brief.md`
- Update `web-tool/status.md` with any planned features the team is working on

**Open questions:**
- Where exactly should the M-hubs be located? (to be worked out in next sessions)
- Which street gets the first detailed transformation drawing?
- What is the most compelling "car-land" graphic format?
