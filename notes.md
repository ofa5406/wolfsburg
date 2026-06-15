# Project Notes

Running log of ideas, quick thoughts, group decisions, and things to follow up on.
Newest entries at the top. Add freely — this is a scratchpad, not a formal document.

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
