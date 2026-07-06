# Session — 2026-07-06

**Date:** 2026-07-06
**Focus:** Summaery pivot to a single screen — built the self-running kiosk presentation (`exhibition/kiosk/`) + hub-viewer scene-tour mode
**Who:** İrem + Claude

---

## What we did

- **Pivot recorded:** the computer pool granted only **one screen**. Alt 1 / Alt 2 exhibition concepts superseded (kept for reference/copy); the exhibit is now a single self-running browser kiosk.
- **Built `exhibition/kiosk/`** — a new standalone deck (untouched: the deployed root presentation):
  - 8 question-led beats, one viewport each: Vision → Problem → Idea (dot-field collapse to the 763 fleet) → Network (68 hubs, 6/19/43) → Streets (before/after wipes: Kleiststraße, Schillerstraße, canal edge) → People (4 personas) → Close → Explore (hub-viewer).
  - **Typewriter presenter** (`typewriter.js`): human-paced typing with authored typo→fix moments; after typing, the caret "draws" underline/bold emphasis.
  - **Autopilot engine** (`kiosk.js`): auto-scrolls beat to beat; any mouse/keyboard/touch pauses it and completes the whole deck for free browsing; resumes from the nearest beat after 30 s idle; full loop restarts fresh.
  - Uses the **locked figures** (fleet 763 = 131/55/33/369/175 · 68 hubs = 6 L/19 M/43 S · 100k trips/day · 9k peak). The unresolved `[CARS-REPLACED]` number is avoided via the qualitative fallback line from `exhibition/alt-1-stations/draft-content.md`.
- **Hub-viewer kiosk mode** (`hub-viewer/index.html`, additive behind `?kiosk=1`): tweened camera tour through the 9 saved views, 6 s dwell each; people turned on; postMessage bridge (`hub-kiosk-start/stop`, `hub-interaction`, `hub-cycle-complete`). After the tour + 18 s with no interaction, the deck loops to the top.
- **Verified headless (Chrome + playwright-core):** full 8-beat unattended run with zero console/page errors; hub tour completes and reports; interaction inside the viewer notifies the deck; takeover freezes autopilot and manual scroll holds; camera provably moves between scenes.
- Pulled `wolfsburg-activity-map` (5 commits: A3 map export + per-tier coverage circles).

## Decisions made

- Exhibition = single-screen kiosk loop (circumstance-driven; Alt 1/Alt 2 superseded — noted in `exhibition/README.md`).
- Kiosk deck uses locked numbers only; live deck's 1,273/140 set not copied.

## Files created / changed

| File | What changed |
|------|--------------|
| `exhibition/kiosk/index.html` | new — 8-beat kiosk deck markup |
| `exhibition/kiosk/style.css` | new — deck styling (deck visual language + #E8500A accent) |
| `exhibition/kiosk/kiosk.js` | new — autopilot engine, beats, hub bridge |
| `exhibition/kiosk/typewriter.js` | new — typing presenter |
| `hub-viewer/index.html` | kiosk mode behind `?kiosk=1` (scene tour + postMessage); normal mode unchanged |
| `exhibition/README.md` | pivot notice: one screen, Alt 1/2 superseded, kiosk is the exhibit |

## Open threads / unfinished

- **Reconcile beat structure with the team's Miro board** — the narrative was drafted by Claude first; İrem will compare against the Miro layout and adjust copy/order.
- Voiceover (Google AI Studio) once content is signed off — beats are timed, so audio cues can map 1:1.
- Idle-resume verified headless up to the manual-scroll check; do one **live pass on the actual exhibition PC** (F11/Chrome `--kiosk`, sound off, screen-sleep disabled).
- `[CARS-REPLACED]` for the 763 fleet still unverified — kiosk avoids it; print materials still blocked on it.

## Next session — start here

1. Review the kiosk in a real browser (`exhibition/kiosk/index.html`, F11) — content/copy pass against the Miro board.
2. Tune pacing (per-beat `hold` values in `kiosk.js`) + any copy edits from the team.
3. Set up the exhibition PC: Chrome `--kiosk`, disable screen sleep, test mouse+keyboard takeover on site.
