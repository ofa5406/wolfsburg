# `<stadt.hub>` — Project Workspace

A shared workspace for our urban-design project **`<stadt.hub>`** — *Post-Car Future of Wolfsburg* — reimagining Wolfsburg as a **post-private-car city** where the organizing element of mobility shifts from **parking → mobility hubs**, freeing car-dominated land for public life.

> Studio project, Bauhaus-Universität Weimar ("Prompt City" studio) + entry for the **Wolfsburg Award for Urban Vision 2026**.

---

## What this is

This repository is the **single source of truth** for the project: the concept, the locked decisions, the research that backs our arguments, the consultation history, the 3D/Rhino workflow, and a memory system so work continues smoothly across sessions and between the three of us.

It is **not** the final deliverable — it's the workshop behind it. The final outputs (maps, drawings, the competition submission) are produced *from* this material.

## What's inside

| Folder / file | What it holds |
|---|---|
| **`CLAUDE.md`** | The project briefing — read this first. Thesis, locked decisions, folder map, working protocol. |
| **`HANDOFF.md`** | "Where are we right now" — current state, deadlines, and the next actions. **Read this second.** |
| **`project/`** | The living project: `current.md` (latest description), `deliverables.md`, `hub_typologies.md`, `rhino_toolpalette.md`. |
| **`research/`** | 📚 **Research library** — 10 cited documents (arguments, weak-points, hub typologies, mobility, precedents, behavioral shift, theory, future, workflow) + a 199-source bibliography. |
| **`decisions.md`** | Formally locked design decisions, with reasoning. |
| **`notes.md`** | Running scratchpad of ideas and quick decisions. |
| **`tasks.md`** | Work tracker (open / in-progress / done). |
| **`briefs/`** | What we must respond to: competition brief, studio brief, midterm brief. |
| **`consultations/`** | One file per tutor consultation — feedback and decisions. |
| **`sources/`** | Precedents and data sources. |
| **`sessions/`** | Log of every working session (`INDEX.md` + one folder per session) — our memory across time. |
| **`rhino/`** | Bridge to drive our Rhino 8 model from the terminal (the 45-block hub "kit-of-parts"). |
| **`web-tool/`** | Status of the **Wolfsburg Activity Map** (the interactive analysis tool). |

> 🔗 **The web tool itself** lives in its own repository: **[annestasiia/wolfsburg-activity-map](https://github.com/annestasiia/wolfsburg-activity-map)** — React + MapLibre, 7 analysis modes (mobility, facilities, greenery, intermodal-hub placement, cycling network, satellite, data). It's excluded here to avoid duplicating it.

## What it offers

- **A defensible argument bank** — every claim backed by a cited number or real precedent (e.g. Wolfsburg has Germany's highest car density, 956 cars / 1,000 residents).
- **A red-team risk register** — the hardest jury objections (AV realism, fleet math, VW-company-town politics, financing) each with a counter and a concrete fix.
- **A precedent library** — Groningen, Ghent, Houten, Barcelona, Paris, Bremen mobility hubs… with hard outcome numbers and what's transferable.
- **A realistic production plan** to June 25 / July 9–12 / Aug 16, plus Rhino and AI/agentic workflow guidance.
- **A memory system** so a new session (or teammate) can resume in minutes instead of starting cold.

## How to use this system

**Starting a work session (the 60-second resume):**
1. Open **`CLAUDE.md`** → the project briefing.
2. Open **`HANDOFF.md`** → what's done, what's next, what's blocked.
3. Need an argument, number, or precedent? → **`research/README.md`** is the index.
4. Do the work.

**Ending a work session (so nothing is lost):**
1. Write a session log — copy `sessions/_template.md` to `sessions/YYYY-MM-DD_topic/notes.md`.
2. Add a line to `sessions/INDEX.md`.
3. Update `HANDOFF.md` (state + next actions) and, if a decision was locked, `decisions.md`.

**For the 3D model (Rhino):** see `rhino/README.md` — Rhino 8 must be open with `mcpstart`, then the model is editable from the terminal.

## The project in one minute

- **Thesis:** Parking City → Hub City. Replace privately-owned, idle, space-hungry cars with a shared, multimodal, partly-autonomous system organized around hubs.
- **The network:** 68 hubs in three tiers — 6 Large (repurposed multi-storey car parks), 19 Medium, 43 Small.
- **The fleet:** 763 shared vehicles (e-bikes, shuttle pods, autonomous buses, micro-pods, shared EVs), sized for ~100,000 trips/day.
- **The proof case:** the Volkswagen factory shift wave — ~10,000 workers arriving in ~1 hour is *predictable, concentrated* demand, making Wolfsburg an unusually strong prototype for shared mobility.

## Deadlines

| Date | Milestone |
|---|---|
| **June 25, 2026** | Studio final presentation — prove the system works |
| **July 9–12, 2026** | Summaery exhibition |
| **August 16, 2026** | Wolfsburg Award submission |

---

*Team: 3 urban-design master's students, Bauhaus-Universität Weimar.*

> 🎤 **New to this workspace?** Watch the 3-minute intro deck: **https://wolfsburg-workspace-intro.netlify.app** (source + speaker notes in [`PRESENTATION.md`](PRESENTATION.md)).
