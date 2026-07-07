# Session — 2026-07-07 (Kiosk presentation build)

**Date:** 2026-07-07
**Focus:** Refine + complete the exhibition presentation outline, then build the full 24-page self-running kiosk presentation; make the deck the live homepage.
**Who:** Ömer (İrem's machine) + Claude

---

## What we did

- **Repointed the site homepage** from `final-presentation/` to `exhibition/deck/` (root `index.html` redirect). The exhibition deck is now the deployed homepage. Also committed local assets (`visuals/`, `rhino/toolpalette_layers.json`, `codex-work/` vault).
- **Refined + completed the presentation outline** → `exhibition/PRESENTATION-OUTLINE.md` (English). Filled the empty §5–§8 from `text for prints.docx`, `hub_typologies.md`, `decisions.md`; added a template legend (T2.1/T2.2 + 5 new variants), a proposed Manifesto page, and flagged two number conflicts.
- **Built the full 24-page presentation** by growing `exhibition/deck/` on its existing engine:
  - 7 new CSS template variants (T2.1 today, T2.2 potential, T-STAT outcomes, T-DIAGRAM S/M/L + hierarchy, T-TYPO S/M/L sheets, T-PLAN masterplans, T-STATEMENT manifesto) + shared bracket titles / ghost numbers / accent / before-after wipe.
  - `deck.js`: 24-slide array with a generic `txtSlide` builder + counter animation; **map/hub/brain found by slide `kind`** instead of hardcoded index (this was the key fix so autoplay/loop/idle-resume survive the longer deck).
  - Copied curated M/L-hub aerials + scenes from `D:\ıudd\prompt city\vision images` into `exhibition/deck/assets/` (dropped 26 MB GIFs + oversized PNGs).
- **Verified headless** (Chrome DevTools Protocol via Node, no deps): 24 slides, 24 dots, 0 console/exception errors across a stepped run, no broken images, live map + brain embeds load. Eyeballed 7 slide screenshots — cohesive and on-brand.
- **Committed + pushed** (`ofa5406/wolfsburg` main `ca34c09`); confirmed **live** at ofa5406.github.io/wolfsburg/ (deck serves `01 / 24`).

## Decisions made

- Exhibition **deck is the canonical presentation + homepage**; the old `exhibition/kiosk/` (11-beat) is superseded (kept, like alt-1/2).
- Build by **extending the deck engine**, not a new folder — it already had templates + typewriter + mapembed + present/loop; only the autopilot generalization was missing.
- No formal design decisions changed (fleet number still unresolved — see below).

## Files created / changed

| File | What changed |
|------|--------------|
| `index.html` (root) | redirect → `exhibition/deck/` |
| `exhibition/PRESENTATION-OUTLINE.md` | NEW — refined + completed outline |
| `exhibition/deck/index.html` | 5 → 24 sections |
| `exhibition/deck/deck.js` | 24-slide engine, txtSlide, counters, kind-based embeds |
| `exhibition/deck/deck.css` | 7 new template variants + shared motifs + ba-wipe |
| `exhibition/deck/assets/` | NEW — curated M/L-hub aerials, scenes, mhub.mp4 |

## Open threads / unfinished

- ⚠ **Fleet number** 763 vs ~1,300 — §4.2 Outcomes shows **763** with a visible "figure to confirm" tag. Team must decide, then remove the tag.
- ⚠ **S-hub visual** — uses a Wolfsburg street scene stand-in; no clean S-hub typology sheet exists yet (M/L use real aerials).
- Trips/day ~100k vs 104k, and the "~50,000 private units replaced" claim — verify.
- Not yet done: a full-loop **pacing/timing pass** (some holds may run long); swapping the low-res placeholder history images for hi-res; exhibition-PC setup (Chrome `--kiosk`, screen-sleep off).
- Optional: use the M-hub **video** (`assets/mhub.mp4`) on the M-hub slide instead of the still, with off-screen pause wiring.

## Next session — start here

1. Resolve the **fleet number** (763 vs 1,300) with the team → update §4.2 in `exhibition/deck/index.html` + remove the TODO tag; sync `PRESENTATION-OUTLINE.md`.
2. Full-loop **playthrough** on the exhibition PC (F11 / Chrome `--kiosk`): tune slide hold timings, condense any slide that runs long, confirm idle→takeover→resume + clean loop restart.
3. Swap the **S-hub** stand-in image (and low-res history images) for proper assets.
