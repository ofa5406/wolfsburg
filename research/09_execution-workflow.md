# 09 — Execution & Workflow Playbook

*Post-Car Future of Wolfsburg — practical production guide for a 3-person team*
*Written June 15, 2026. Covers June 25 studio final → July 9–12 exhibition → Aug 16 competition.*

This is the "how do we actually make all of this, with the tools we already have, in the time we have" document. It is written in plain language. Where a claim is about a tool or a current technique, there is a link you can click.

---

## TL;DR — the one-paragraph version

You have 10 working days to the studio final and seven concrete deliverables. The honest answer is: **the team can produce all seven at "good studio" quality if each person owns a track and you stop inventing new content.** Rhino + the kit-of-parts makes the hub sheets and street sections. The web map makes the coverage and car-land maps. Claude Code does the data wrangling, the VW-shift simulation logic, the persona text, and the diagram scripting. Image AI (ControlNet-guided) is only for the final atmosphere renders — last, not first. The single biggest risk is polishing one deliverable to perfection while another stays blank. Spread the effort.

---

## 1. The realistic plan to each deadline

### How to read this section
Three deadlines, three different "products":

| Deadline | What it really is | Audience | Implication for you |
|---|---|---|---|
| **June 25 — Studio final** | A *defended* argument | Tutors who know the project | Proof and logic matter more than polish |
| **July 9–12 — Summaery exhibition** | A *self-explaining* display | Walk-by public, no narration | Legibility and atmosphere matter most |
| **Aug 16 — Competition** | A *curated submission* | Jury, cold, no context | One clean narrative, board-ready |

Good news: it is the **same body of work**, re-cut three times. You build the assets once (June), make them self-explaining (July), and curate them tight (August). Do not treat them as three separate projects.

### Team structure: one owner per track
With three people, the failure mode is everyone touching everything and nothing finishing. Assign **owners**, not tasks:

- **Owner A — Spatial/GIS track:** the web map, car-land map, hub-coverage map, the S-hub Grasshopper placement, GeoJSON data.
- **Owner B — 3D/drawing track:** Rhino kit-of-parts, hub typology sheets, VW-gate case study, street sections.
- **Owner C — Narrative/AI track:** Anna persona journey, VW-shift simulation, implementation timeline, text, and running Claude Code tasks for everyone.

Owners are responsible for *their deliverable existing*; they pull help from the other two for the final push. A daily 15-minute stand-up ("what's blocking you, what's done") is enough.

### The 7 June-25 deliverables → who makes it, with what

| # | Deliverable | Owner | Production method (the tool that makes it) |
|---|---|---|---|
| 1 | **Car-land map** (land currently given to cars) | A | Web map (MapLibre) + OSM/Overpass: pull parking, carriageway, road polygons; shade them. Export as image; label in Illustrator/Figma. |
| 2 | **Hub-coverage map** (68 hubs + catchments) | A | Web map: hub points + walk/cycle catchment buffers (you already have the intermodal-scoring and Dijkstra modes). Screenshot at fixed zoom. |
| 3 | **Hub typology sheets** (L/M/S) | B | Rhino kit-of-parts → plan + section + axonometric per type via Make2D. One sheet per type. (See §2.) |
| 4 | **VW shift-change simulation** | C | Claude Code script: model the factory-gate peak (≈arrival/departure surge), how the 763 fleet + hub absorbs it. Output = a simple chart + a numbers table, not a heavy abstract sim. |
| 5 | **Anna persona journey** | C | Claude Code drafts the narrative beats; map a real door-to-door route on the web map; assemble as a journey strip (icons + map snippets + times). |
| 6 | **Street-transformation sections** | B | Rhino: before/after cross-sections of one or two representative streets, using kit-of-parts elements. (See §2.) |
| 7 | **4-phase implementation timeline** | C | Diagram — Figma or Illustrator. Claude Code can generate a first-pass timeline (e.g. as an SVG or a structured table) you then style. |

### Day-by-day to June 25 (10 working days)

This assumes ~6 productive hours/person/day. It is tight but real.

**June 15–17 (build the data + 3D backbone)**
- [ ] A: finalize the OSM/Overpass pulls; get the car-land polygons and hub catchments rendering correctly. This is the *foundation* — do it first.
- [ ] B: confirm the kit-of-parts model is clean (layers/blocks tidy — see §2) and decide the three hub-sheet view setups.
- [ ] C: run the Claude Code task for the VW-shift simulation logic and the Anna route data so the numbers exist early.
- [ ] **Checkpoint June 17 evening:** all three foundations (map data, 3D model, sim numbers) must *exist in rough form*. If one is missing, that is the day to raise the alarm.

**June 18–21 (produce the deliverables)**
- [ ] A: export car-land map + coverage map at final resolution; hand to C for labelling style.
- [ ] B: Make2D the three hub typology sheets and the street sections; export line drawings.
- [ ] C: write Anna's journey; build the timeline diagram; turn the sim numbers into a clean chart.

**June 22–23 (assemble + make consistent)**
- [ ] One person (suggest C) owns a **shared style sheet**: fonts, line weights, colour for each hub tier, north arrow, scale bars. Everything gets restyled to match. *This is what separates "studio-good" from "messy."*
- [ ] Drop everything into the presentation deck in argument order: problem (car-land) → proposal (hubs/coverage) → how it works (typology, sections, sim) → lived experience (Anna) → rollout (timeline).

**June 24 (rehearse + fix)**
- [ ] Full out-loud run-through, timed. Note every "this doesn't read" and fix only those.
- [ ] Render any atmosphere image (one hero image max — see §4) *only if* everything else is done.

**June 25 — present.**

### What to cut if you run short (in this order)
Decide this *now*, not at 2am on the 24th.

1. **First to go:** AI atmosphere renders. Nice, not load-bearing. A clean Rhino axonometric defends the argument fine.
2. **Then:** reduce street sections from many streets to **one** strong before/after pair.
3. **Then:** simplify the VW-shift sim to a single clear chart + table (drop any animation).
4. **Then:** Anna as a static strip instead of an animated/interactive journey.
5. **Never cut:** the car-land map, the hub-coverage map, and the hub typology logic. These *are* the thesis. If only three things exist, it's these.

### June 25 → July 9–12 (exhibition)
The shift is from *defended* to *self-explaining*. ~2 weeks.
- [ ] Add a short title/legend to every panel so a stranger gets it in 10 seconds.
- [ ] This is where the **atmosphere renders earn their place** — the public responds to "what would it feel like." Now you have time to do them well.
- [ ] If it's in the computer pool: consider one lightweight interactive — the existing web map, locked to clean preset views, is perfect and costs little.
- [ ] Make a 60-second looping explainer (slides or short screen-capture) so the display talks for itself.

### July → Aug 16 (competition)
The shift is from *display* to *curated submission*. ~5 weeks (with summer slack).
- [ ] Cut to the **single strongest narrative**. A jury sees hundreds of boards; one clear idea beats ten clever ones.
- [ ] Re-master every graphic to the competition's exact board format and DPI.
- [ ] Write the **AI-integration reflection** properly (see §5) — for the competition's "urban vision" framing this is a differentiator, not an afterthought.
- [ ] Final upscale/cleanup pass on the hero images.

---

## 2. Rhino + MCP workflow (the 3D/drawing track)

Goal: turn the 45-block kit-of-parts into clean, repeatable **plan / section / axonometric** drawings for the hub sheets, the VW-gate case study, and the street sections — without you needing to be a programmer. The MCP bridge means Claude Code can do the fiddly setup; you do the design judgement.

### Mental model
- **Layers = your filing cabinet.** Each material/element category on its own layer (already organized this way). Drawings are made by turning layers on/off.
- **Blocks = reusable parts.** Your kit-of-parts pieces are blocks. Place the *same* e-bike dock block 43 times; fix it once, all 43 update. This is the whole point of a "kit of parts" — use it.
- **Make2D = the drawing machine.** It takes the 3D model from a given viewpoint and spits out clean 2D line drawings (plan, section, axo) you can place on a sheet.

### Producing the hub typology sheets (deliverable #3)
For each of L / M / S, you want three views on one sheet:

1. **Plan** — set viewport to Top, parallel projection, turn on only the relevant layers, run Make2D. Result = a flat plan you can scale and label.
2. **Section** — cut a section plane through the hub, Make2D the cut. Shows level changes, canopy heights, charging bays.
3. **Axonometric** — set a parallel (not perspective) view from a corner-up angle, Make2D. This is the "hero" comprehension drawing for a hub.

Practical tips:
- **Work in millimetres at real-world scale** so scale bars are honest. Decide sheet scale (e.g. 1:200 for hubs, 1:100 for sections) *before* exporting.
- **Use parallel projection** for plans/sections/axos — perspective distorts measurable drawings. Save these as **named views** so every hub is drawn from the identical angle (consistency reads as rigour).
- **Make2D onto a dedicated "2D-drawing" layer**, then hide the 3D so you can clean stray lines.
- **Annotate in Rhino or export to Illustrator/Figma.** Line drawings export cleanly as vector; do the text/scale bars/colour fills in the 2D tool where typography is easier.
- **Viewport capture** (`mcp__rhino__capture_viewport`) gives you a quick coloured 3D image for slides; Make2D gives you the precise line drawing for sheets. Use both: capture for atmosphere context, Make2D for the technical drawing.

### The VW-factory-gate case study
This is your primary case study, so spend the most Rhino effort here.
- Build **one detailed hub scene** at the VW gate using kit-of-parts blocks — this becomes the recurring "money shot."
- Produce the full set for it: plan, two sections (one along the commuter flow, one across), an axonometric, and one atmosphere viewport capture.
- Tie it to deliverable #4 (the shift simulation): the drawing shows *where* the surge is absorbed; the sim shows *that* it is.

### Street-transformation sections (deliverable #6)
- Model a **before** (car-dominated) and **after** (hub/reclaimed) cross-section of the same street, side by side, same scale.
- Reuse street furniture, trees, bike-lane, pod-lane blocks from the kit. The before/after contrast is the single most persuasive image type in mobility-transition projects — make it crisp.

### Letting Claude Code drive Rhino (so you don't have to script)
You have native Rhino MCP tools available. Good "ask Claude to do it" jobs:
- *"Set up three named parallel views (plan, front section, corner axo) and a clean 2D-drawing layer for the hub sheets."*
- *"Place the S-hub block at these 43 coordinates from the Grasshopper output."*
- *"Make2D the current view onto layer X and capture the viewport to a PNG."*
- *"Audit the model: list layers, count blocks, flag anything not on a material layer."* (Keeps the file tidy.)

You stay in charge of *what looks right*; Claude handles the repetitive setup.

### Rhino + Grasshopper for the 43 S-hubs
- **Grasshopper** is the right tool for the placement *algorithm* (locked-in decision): feed it candidate points + your coverage/demand criteria, let it select/space the 43 small hubs. The MCP bridge can build and run the Grasshopper graph for you.
- Workflow: Grasshopper computes the 43 points → **bake** them into Rhino → place the S-hub block at each → those same points also export as GeoJSON/CSV for Owner A's coverage map. *One algorithm feeds both the 3D model and the 2D map* — that's a strong methodology point for §5.
- Keep Grasshopper for *logic that changes* (if criteria shift, re-run). Bake to Rhino once the result is final, so drawings are stable.

---

## 3. AI / agentic workflow with Claude Code

Claude Code (this CLI) is your "do the tedious technical work" partner. The skill is **giving it well-scoped jobs and checking the output**, not trusting it blindly. For an urban-design studio that rewards AI integration, every one of these is also evidence for your reflection (§5).

### Where it genuinely saves you time
| Task type | Concrete example for this project |
|---|---|
| **Research synthesis** | "Summarise how Groningen's filtered-permeability model handled freight access; cite sources." Then *you* verify the cites. |
| **Data wrangling** | "Take this Overpass parking export and compute total car-land area in m² by zone; output a table + GeoJSON." |
| **Scripting Rhino/GH** | The §2 jobs — view setup, block placement, Make2D, model audit. |
| **Drafting text** | First drafts of Anna's journey, panel captions, the implementation-phase descriptions. You rewrite in your voice. |
| **Web-tool dev** | New analysis modes for the MapLibre map, fixing the Dijkstra routing, styling layers. |
| **Diagram generation** | "Generate an SVG of a 4-phase timeline with these milestones" or a Mermaid flow of the hub network. |
| **Sanity-checking numbers** | "Given 763 vehicles and these mode splits, does the VW shift-peak math add up?" |

### Concrete "productive agentic tasks" to run this week
These are jobs you can hand off and let run, then review:

1. **Car-land quantifier.** Point it at the Overpass data → returns total m² of car-dedicated land, per zone, plus a reclaimed-land figure if hubs replace parking. Directly feeds deliverable #1 and a headline statistic.
2. **VW shift-peak simulator.** A small script: commuter arrival/departure curve at the gate × mode split × fleet capacity → does the hub clear the peak? Output chart + table. Feeds #4.
3. **Anna route builder.** Give it origin, destination, and the network; it returns a realistic door-to-door itinerary with modes, transfers, and times. Feeds #5.
4. **Hub sheet automator.** The Rhino view/Make2D/capture pipeline for all three hub types in one go. Feeds #3.
5. **Coverage gap finder.** "Which addresses/areas are >X min walk from any hub?" — both a map layer and a credibility check on the 68-hub claim.
6. **Citation + consistency pass.** Near the deadline: "Check every number in the deck matches decisions.md and flag contradictions." Cheap insurance against a tutor catching a mismatch.

### How to work with it well (non-programmer tips)
- **One job per request, with the output format named.** "Give me a table" / "write a `.geojson`" / "a 150-word draft."
- **Always say what you have and where.** Point it at the actual file (the GeoJSON, decisions.md) rather than describing it.
- **Treat first output as a draft.** It's a fast junior collaborator, not an oracle. Verify numbers and citations yourself — this verification *is* part of "reflection on AI's role."
- **Keep a running log** of which tasks you delegated and what you changed afterward. That log becomes your §5 reflection almost for free.

---

## 4. Other agents & tools beyond Claude

Adopt these *selectively*. For each: what it's good for **here**, and the effort to start.

### Image generation (atmosphere, collage, perspective)
**Use these for the exhibition and competition hero images — not for technical drawings, and not before the analysis is done.**

- **ControlNet (inside Stable Diffusion / ComfyUI)** — *the* tool for architects who need the AI to **keep your geometry**. You feed it your Rhino line drawing or massing as a control image, and it paints atmosphere/materials/people *on top of your real design* instead of inventing a different building. The relevant control types: **M-LSD / MLSD** locks straight architectural lines, and depth/canny keep form. Set a fixed seed and disable auto-resize to keep results stable. This is exactly how studios turn a grey Rhino axo into a convincing render while staying honest to the design. ([ComfyUI ControlNet guide](https://www.runcomfy.com/tutorials/mastering-controlnet-in-comfyui); [ControlNet × ComfyUI in architecture, Studio Carlos Banon](https://parametric-architecture.com/taking-control-4-0-controlnet-x-comfyui-in-architecture-studio-carlos-banon/); [ComfyUI Wiki ControlNet tutorial](https://comfyui-wiki.com/en/tutorial/advanced/how-to-install-and-use-controlnet-models-in-comfyui))
  *Effort:* medium-high. ComfyUI has a learning curve; budget a half-day to get one working graph. Worth it for the control. Claude Code can help install/configure it.
- **Midjourney** — fastest for mood/reference imagery and quick atmosphere when you *don't* need exact geometry (e.g. "what does a car-free Wolfsburg street feel like"). Less geometric control than ControlNet.
  *Effort:* low. Prompt and go.
- **Krea** — friendly web app for generating and especially **upscaling**; free/alpha tier, aggressive resolution (up to very large outputs), softer/more faithful enhancement — good when you want to enlarge a render without it inventing detail. ([Krea vs Magnific comparison](https://educk.org/improve-your-renders-with-ai-magnific-vs-krea-vs-leonardo/); [Magnific alternatives 2026](https://www.sketchto.com/posts/product-reviews/magnific-alternatives-2026))
  *Effort:* low.
- **Magnific** — premium upscaler; extremely sharp and detailed but its "Creativity" mode can *change* your image, so use low creativity for architecture or it'll add fake windows. Paid only (from ~€39/mo). ([Magnific vs Krea](https://educk.org/improve-your-renders-with-ai-magnific-vs-krea-vs-leonardo/))
  *Effort:* low, but costs money — skip unless you need billboard-size final boards.
- **Photoshop generative fill** — best for *finishing*: remove a stray car, extend a sky, add a few people, fix an edge. Surgical, controllable, inside a tool you may already know.
  *Effort:* low if you have Photoshop.

**Honest/ethical use for a studio that values AI:** generate atmosphere *over your own geometry*, disclose what was AI-assisted, and never let an AI image imply a design decision you didn't actually make. The render illustrates the proposal; it doesn't invent it. Saying this out loud is itself good reflection.

### GIS / data tools
- **QGIS (+ plugins)** — the serious desktop GIS for stacking layers (roads, transit, land use, population) and doing real spatial analysis. The **GTFS-2-GIS plugin** turns transit feeds into styled routes/stops with frequency heatmaps, coverage and "transit desert" detection — directly useful for arguing where hubs are needed. ([QGIS GTFS plugin](https://plugins.qgis.org/plugins/qgis_gtfs_plugin/))
  *Effort:* medium. Heavier than your web map, but the analytical depth is much greater. Use it if a tutor pushes on rigour.
- **kepler.gl** — drag-and-drop, browser-based, beautiful large-dataset visuals (flows, heatmaps, arcs); great for an exhibition-grade animated map of trips or hub flows with little coding. ([kepler.gl on transport networks](https://www.maplibrary.org/1267/unique-approaches-to-visualizing-transport-networks/))
  *Effort:* low. Export GeoJSON from your existing pipeline, drop it in.
- **OSM / Overpass** — your existing source; keep it. It's the practical backbone for car-land, road, and parking data.
- **GTFS (transit feeds)** — the standard format for bus/rail schedules and stops. If you can get Wolfsburg's GTFS feed, you can show *real* transit coverage to contrast with your hub network and back up "this integrates with existing transit." ([GTFS visualizations](https://old.gtfs.org/resources/visualizations/))
  *Effort:* low-medium to obtain; pairs with the QGIS plugin or kepler.gl.

### Other AI coding/agent tools
You're well served by Claude Code; these are situational. Most professionals *combine* tools rather than switch. ([Claude Code vs Cursor vs Copilot 2026](https://www.sitepoint.com/claude-code-vs-cursor-vs-copilot-the-2026-developer-comparison/); [Built In comparison](https://builtin.com/articles/claude-code-codex-cursor-github-copilot-comparison))
- **Cursor** — an AI code editor; nicer if Owner A wants to *see and hand-edit* the web-map code visually while AI assists. *Effort:* low; only worth it if someone prefers an IDE over the terminal.
- **GitHub Copilot** — cheap autocomplete in your editor; fine for small web-tool tweaks. *Effort:* low. Redundant with Claude Code for big jobs.
- **Local LLMs via Ollama** — run a model offline on your laptop; useful only if you need privacy or have no internet at the exhibition. *Effort:* medium; not needed for this project.

### Diagram / mapping tools
- **Figma** — collaborative, browser-based; ideal for the **implementation timeline**, the persona strip, panel layout, and keeping all three students on one shared canvas. *Effort:* low.
- **Adobe Illustrator (+ map plugins like MAPublisher / Avenza)** — the precision tool for final boards and turning exported maps/Make2D drawings into polished, typographically clean graphics. *Effort:* medium; the standard for competition-grade boards if someone knows it.

### Quick adoption verdict
| Tool | Adopt now? | Why |
|---|---|---|
| ControlNet/ComfyUI | For July | Honest, geometry-true renders |
| Krea (upscale) | When rendering | Free, easy enlargement |
| QGIS + GTFS plugin | If rigour challenged | Deeper analysis than web map |
| kepler.gl | Maybe, exhibition | Easy beautiful flow maps |
| Figma | Yes, now | Shared layout for 3 people |
| Illustrator | For boards | Competition polish |
| Cursor/Copilot/Ollama | Only if a pain point | Claude Code covers the need |

---

## 5. The AI-integration narrative (worth 20% of your grade)

The studio grades **meaningful AI integration (20%)** and **reflection on AI's role (10%)** — together as much as design quality. The trap is treating AI as a render generator bolted on at the end. Your real story is stronger: **the computational/AI workflow *is* your design method.** Here are talking points, each tied to something you actually did.

### Talking points (each is a defensible claim)
1. **Algorithmic hub placement, not intuition.** The 43 small hubs are placed by a Grasshopper algorithm against coverage/demand criteria — the network is *derived*, not hand-drawn. You can re-run it if assumptions change. This is computational urbanism, not decoration.
2. **One model, many outputs.** The same hub coordinates drive the 3D kit-of-parts *and* the GeoJSON coverage map. Parametric consistency between the spatial argument and the drawings is a methodology, not a coincidence.
3. **Scripted parametric 3D (kit-of-parts).** A 45-block kit, driven from the terminal via the Rhino MCP bridge, means hubs are assembled from reusable, swappable parts and drawn identically every time. The "kit of parts" is both a design idea *and* a production system.
4. **AI as research synthesizer — with a human check.** Claude Code accelerated literature synthesis (Groningen model, fleet sizing) and data wrangling, but every number and citation was verified by the team. State this plainly: AI widened the search, humans made the judgements.
5. **Custom analytical tooling.** You didn't just *use* AI tools — you *built* one: the Wolfsburg Activity Map with intermodal-hub scoring and Dijkstra cycling routing. Building bespoke analysis software is the deepest form of "meaningful integration."
6. **AI rendering kept honest by ControlNet.** Atmosphere images are generated *over* your own geometry, so visualization never overstates the design. Disclosing this is itself reflection.

### Framing for the reflection (the 10%)
A good reflection is honest about **division of labour between human and machine**:
- *What AI did well:* speed on tedious, repetitive, or search-heavy work — data extraction, view setup, first drafts, breadth of references.
- *What it got wrong / where you overrode it:* note real cases (a miscalculated figure you caught, a render you rejected, a citation that didn't check out). This honesty reads as rigour, not weakness.
- *The principle:* AI expanded the option space and removed drudgery; the *urban-design decisions* — what a post-car Wolfsburg should be — stayed human. That sentence is the heart of your reflection.

Keep the delegation log from §3 as evidence; it makes this section almost write itself.

---

## How to use this in the project

The most important next actions, in order:

1. **Assign the three tracks today** (A = GIS/map, B = Rhino/drawings, C = narrative/AI). Owners own *delivery*, not just tasks.
2. **Hit the June 17 checkpoint:** map data, 3D model, and VW-sim numbers must all *exist in rough form* by then. This is the early-warning gate.
3. **Decide the cut-list now** (atmosphere renders first to go; car-land map, coverage map, hub typology never cut).
4. **Run the high-leverage Claude Code tasks this week:** car-land quantifier, VW shift simulator, Anna route builder, hub-sheet automator (§3). Hand them off, then verify.
5. **Use the kit-of-parts properly:** named parallel views + Make2D for repeatable, consistent hub sheets and before/after street sections (§2).
6. **Hold image AI until everything else is done** — then ControlNet over your own geometry, for July and August only.
7. **Keep a delegation log** so the AI-integration reflection (§5) writes itself for the competition.

The biggest single risk remains: over-polishing one deliverable while another stays blank. Spread effort across all seven; a complete "good" set beats one perfect panel.

---

## Sources

- ControlNet in ComfyUI — mastering guide: https://www.runcomfy.com/tutorials/mastering-controlnet-in-comfyui
- ControlNet × ComfyUI in architecture (Studio Carlos Banon, Parametric Architecture): https://parametric-architecture.com/taking-control-4-0-controlnet-x-comfyui-in-architecture-studio-carlos-banon/
- ComfyUI Wiki — installing/using ControlNet models: https://comfyui-wiki.com/en/tutorial/advanced/how-to-install-and-use-controlnet-models-in-comfyui
- Magnific vs Krea vs Leonardo for renders: https://educk.org/improve-your-renders-with-ai-magnific-vs-krea-vs-leonardo/
- Magnific alternatives 2026 (upscaler comparison): https://www.sketchto.com/posts/product-reviews/magnific-alternatives-2026
- QGIS GTFS-2-GIS plugin: https://plugins.qgis.org/plugins/qgis_gtfs_plugin/
- kepler.gl & transport-network visualization: https://www.maplibrary.org/1267/unique-approaches-to-visualizing-transport-networks/
- GTFS visualization resources: https://old.gtfs.org/resources/visualizations/
- Claude Code vs Cursor vs Copilot (2026, SitePoint): https://www.sitepoint.com/claude-code-vs-cursor-vs-copilot-the-2026-developer-comparison/
- Claude Code vs Codex vs Cursor vs Copilot (Built In): https://builtin.com/articles/claude-code-codex-cursor-github-copilot-comparison
