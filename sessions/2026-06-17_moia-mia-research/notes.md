# Session — 2026-06-17

**Date:** 2026-06-17
**Focus:** Auto-research of MOIA (VW's ridepooling subsidiary) and its MIA simulation tool → strategies, inspirations, new tasks, similar-tools landscape.
**Who:** Ömer + Claude

---

## What we did

- Explored MOIA's site (homepage, mobility-consulting, MIA) + blog + licensing news; cross-checked with web search.
- Key discovery: **MOIA is owned by Volkswagen** → directly defuses the "VW company-town politics" weak point. Reframe: Wolfsburg = the world's most logical pilot city for post-car mobility.
- Captured **MIA** structure (Explorer / Simulator / Presenter; draw → simulate → read), its engine (**MATSim + Simunto**, agent-based), and a citable validation case (**AMAG/Zurich: 600 AVs / 230k weekly trips / 5-min wait / 96% acceptance**).
- Mapped the similar-tools landscape (MATSim, FleetPy, SUMO, BEAM, ODySSEUS, CityMoS, OpenCAMS, Bentley OpenPaths) with "what we can obtain."
- Wrote the full research doc and wired it into the library, bibliography, and task tracker.

## Decisions made

- None formally locked. Proposed (not yet adopted): the MOIA "home-advantage" narrative frame. Left for the team to confirm.

## Files created / changed

| File | What changed |
|------|--------------|
| `research/10_moia-mia-precedent.md` | NEW — full research doc (facts, MIA workflow, weak-point counters, strategies, 7 new tasks, similar-tools landscape, caveats, sources) |
| `research/README.md` | Added doc `10` to index + a "prepping for June 25" pointer |
| `research/sources.md` | Added `## 10` bibliography block (MOIA + simulators) |
| `tasks.md` | Added 7 tasks under "From MOIA/MIA research (research/10)" |

## Open threads / unfinished

- Research is **paused** — user said "we will continue this research later." Not yet done:
  - Fold the home-advantage frame + AMAG/Zurich numbers into `research/06` (arguments) and `research/07` (weak points).
  - Spec the web-tool "Simulator slider" panel (fleet size / max wait / walking-conversion %) for the teammate who codes the Activity Map.
  - Optionally fetch the MOIA "Autonomous Ridepooling Across Germany" blog for national-scale figures (not yet read).
  - The 3 MIA step-image URLs (mia_step1/2/3 .webp) were not individually opened — workflow was captured from the page text instead.

## Next session — start here

1. Read `research/10_moia-mia-precedent.md` (esp. §3 weak-point counters, §4 strategies, §5 new tasks).
2. Decide with the team whether to adopt the "home-advantage" frame; if yes, edit `research/06` + `07`.
3. If continuing the tool thread: spec the MIA-style Simulator panel.
