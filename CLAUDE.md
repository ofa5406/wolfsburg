# `<stadt.hub>` — Workshop Briefing

*Project name: **`<stadt.hub>`** (working subtitle: Post-Car Future of Wolfsburg).*

**Read this file at the start of every session — then read `HANDOFF.md`.**

> **Memory across sessions:** `HANDOFF.md` (project root) is the "where are we right now" file and `sessions/INDEX.md` logs every past session. Reading `HANDOFF.md` first, and updating it + writing a session log at the end, is what keeps work from being lost when a chat ends or usage resets. See the Start/End-of-Session protocol below.

---

## The Project

**Team:** 3 urban design master's students, Bauhaus-Universität Weimar
**Studio:** Urban Design Studio — Wolfsburg Future Mobility
**Type:** Open ideas competition entry + studio semester project
**Competition deadline:** August 16, 2026 (Wolfsburg Award for Urban Vision)

**Thesis in one sentence:**
Wolfsburg is reimagined as a post-private-car city where the organizing element of urban mobility shifts from **parking** to **mobility hubs** — enabling autonomous shared vehicles, cycling, public transport, and the reclaiming of car-dominated land for public life.

The key concept: **Parking City → Hub City**

---

## Current Phase (update this after each major shift)

*Last updated: June 14, 2026 — after June 11 consultation*

The quantitative foundation has been accepted by tutors. Now moving into the **proof phase** — demonstrating that the hub system actually works through spatial analysis, coverage maps, fleet simulations, and persona journeys.

**Critical: two separate deadlines:**
- **June 25, 2026 — Studio Final Presentation** (Studio 11 — 11 days away)
- **July 9–12, 2026 — Summaery Exhibition** (computer pool, visitors without narration)
- **August 16, 2026 — Wolfsburg Award competition digital submission**

---

## Design Decisions Already Locked In

| Decision | Outcome | Source |
|----------|---------|--------|
| Fleet sizing formula | Accepted by tutors | June 11 |
| Hub counts | 6 L-hubs, 19 M-hubs, 43 S-hubs | June 11 |
| Zone structure | 5-zone Groningen-inspired model, filtered permeability | June 11 |
| Small hub placement | Use Grasshopper algorithm | June 11 |
| L-hub locations | Convert 6 existing multi-storey car parks | June 4 + 11 |
| Fleet composition | 131 e-bikes, 55 auto-shuttle pods, 33 autobuses, 369 auto-pods, 175 car-sharing EVs | June 11 |
| Project focus | Prove hub system, do not keep inventing vehicle types | June 4 |

Full log with reasoning in `decisions.md`.

---

## The Hub System

| Hub Type | Count | Role |
|----------|-------|------|
| L (Large) | 6 | Repurposed multi-storey car parks. Backbone of the network. Charging, storage, fleet management. |
| M (Medium) | 19 | Neighbourhood hubs. Shared bikes, EV charging, shuttle stops, transfer. |
| S (Small) | 43 | Minimal nodes. E-bike dock, pod stop, micro-transfer. Last-mile coverage. |

**5 mobility modes:** autonomous buses, shuttle pods, shared EV cars, e-cargo bikes, autonomous micro-pods.

---

## Workshop Folder Map

```
wolfsburg/
├── CLAUDE.md              ← This file — read first every session
├── HANDOFF.md             ← "Where are we right now" — read 2nd, update at session end
├── notes.md               ← Running notes: ideas, quick thoughts, group decisions
├── decisions.md           ← Formally locked design decisions
│
├── research/              ← Durable research library (arguments, precedents, workflow…)
│   └── README.md             ← Index — start here for arguments/data/precedents
│
├── briefs/                ← What the project must respond to
│   ├── competition_brief.md  ← Wolfsburg Award 2026
│   ├── studio_brief.md       ← University studio brief (paste your content here)
│   └── midterm_brief.md      ← Midterm reference
│
├── consultations/         ← One file per professor consultation
│   └── _template.md          ← Use this format for every new session
│
├── project/               ← The living project
│   ├── current.md            ← Always the latest description — update frequently
│   ├── deliverables.md       ← What needs to be produced and by when
│   └── archive/              ← Saved versions before major updates
│
├── hub-viewer/            ← Standalone, embeddable 3D viewer of one hub's element kit
│   ├── README.md             ← How to open / embed + the data schema
│   └── CLAUDE.md             ← Briefing for reusing or embedding the tool
│
├── web-tool/
│   └── status.md             ← Current state of the Wolfsburg Activity Map tool
│
├── visuals/               ← Image/video generation for the project
│   ├── image-prompts.md      ← Prompt playbook + anchored styles (read for any image task)
│   └── generated/            ← Downloaded outputs + style-anchor reference images
│
├── sessions/              ← One folder per working session with Claude
│   ├── INDEX.md              ← Running log of all sessions (newest first)
│   └── _template.md          ← Copy this for each new session
│
├── sources/               ← Research and precedents
│   ├── precedents.md
│   └── data_sources.md
│
└── rhino/                 ← Bridge to control the running Rhino 8 from the terminal
    ├── README.md             ← How to connect and use it (start here)
    ├── CLAUDE.md             ← Briefing for a Claude session driving Rhino
    ├── commands.md           ← Full Rhino command catalogue + examples
    ├── rhino_client.py       ← The tool (Python CLI + importable function)
    └── rhino.ps1             ← PowerShell shortcut
```

## Working with Rhino

To read or edit the 3D model from the terminal, see `rhino/README.md`.
Rhino 8 must be open with `mcpstart` run in its command line; then
`python rhino/rhino_client.py ping` confirms the connection.

---

## The Web Tool

The **Wolfsburg Activity Map** (`wolfsburg-activity-map/`) is an interactive browser tool for spatial analysis of Wolfsburg. It has 7 analysis modes: Mobility, Facilities, Greenery, Intermodal Hub, Rad (cycling) Network, Earth (satellite), and Data (fleet planning).

Run it locally: `npm run dev` inside `wolfsburg-activity-map/`
GitHub: https://github.com/annestasiia/wolfsburg-activity-map.git

See `web-tool/status.md` for what it currently does and what's planned.

**The tool is a design and analysis instrument — it is not the final project deliverable.**

---

## Starting a Design / Workshop Session

1. Read this file
2. **Read `HANDOFF.md`** — the current state, deadlines, and the "resume here" next actions
3. Read `project/current.md` — fuller detail on where the project stands
4. Check recent entries in `notes.md` and the top of `sessions/INDEX.md`
5. If a consultation happened recently, read the latest file in `consultations/`
6. Skim `research/README.md` if the task needs arguments, data, precedents, or workflow guidance
7. State what today's focus is

## Ending a Session (do this every time — this is the memory)

1. Write a session log: copy `sessions/_template.md` to `sessions/YYYY-MM-DD_topic/notes.md` and fill it in
2. Add a one-line entry at the top of `sessions/INDEX.md` linking to it
3. **Update `HANDOFF.md`** — the "Last updated" date, the deliverable checkboxes, and "Resume here"
4. Update `notes.md` (quick thoughts) and, if anything was formally decided, `decisions.md`
5. If a research insight is worth keeping, add it to the right `research/` doc and append the source to `research/sources.md`

## Starting a Web Tool Session

1. Pull latest: `git pull` inside `wolfsburg-activity-map/`
2. Create a branch: `git checkout -b [topic]-YYYY-MM-DD` (e.g., `hub-sidebar-2026-06-18`)
3. Work on the branch, commit clearly
4. Push when done and open a pull request for the team to review

---

## What Gets Updated When

| File | Updated when |
|------|-------------|
| `CLAUDE.md` | Project phase changes or major direction shift |
| `project/current.md` | After consultations, group decisions, significant sessions, milestones |
| `notes.md` | Anytime — this is the scratchpad |
| `decisions.md` | When a decision is formally agreed and locked |
| `consultations/` | New file after each professor session |
| `web-tool/status.md` | When the tool's capabilities change |
| `HANDOFF.md` | At the END of every session — current state + resume-here |
| `sessions/` | New folder per session; add a line to `sessions/INDEX.md` at session end |
| `research/` | When a research insight worth keeping is found; cite it in `research/sources.md` |
