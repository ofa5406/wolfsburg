# Summaery 2026 — Production Checklist

Countdown to **Thursday July 9**. Owners are placeholders — assign at the next team meeting.
Fallbacks are listed per station so nothing blocks on the equipment pool's decision.

## Week 1 — decide & request (by Fri July 3)

- [ ] Team meeting: adopt/adjust [`concept.md`](concept.md) — especially the Tier C
      parking-space centrepiece and the equipment request list (§6).
- [ ] Submit equipment request to the class pool: **2 pool PCs (in-room), 1 large TV,
      1 Galaxy Note tablet, 1 XGIMI Halo+**. Ask early — 5 projects are competing.
- [ ] Resolve `[CARS-REPLACED]` for the locked 763 fleet (redo the June 11 arithmetic);
      update `draft-content.md` §2/§5. **Blocking for card 6 and loop shot 05 text.**
- [ ] Decide the accent colour = the deck's existing accent (consistency across screen/print).
- [ ] Verify the Activity Map public URL (`draft-content.md` §8) and lock QR targets.
- [ ] Measure the computer pool: confirm a free 5.0 × 2.5 m floor area + wall for the map.

## Week 2 — build & print (July 6–8)

### Screen builds
- [ ] **A1 loop (~75 s):** assemble per storyboard (`draft-content.md` §2).
      Fastest path: 14 slides → screen-record → .mp4 in a fullscreen looping player.
      Better path: small `loop.html` with crossfades + input-interrupt into the deck +
      90 s idle return. *(Separate branch; do NOT merge to `main` before testing —
      `main` auto-deploys.)*
- [ ] **A2 hub-viewer:** copy `hub-viewer/` onto the pool PC (fully offline), test
      hover cards + named views, hide the cursor-idle screensaver of the OS.
- [ ] **B tablet:** open deck `#s04` full-screen (Chrome kiosk / pinned app mode),
      disable sleep, mount/stand at the taped space's edge.
- [ ] **C projection:** export the 5 caption-scene crops (`draft-content.md` §7) as a
      looping slideshow/video on the XGIMI; focus test on the actual floor surface
      (matte floor? if glossy, project onto a taped white paper field inside the rectangle).

### Print (all laser-printable except the title poster)
- [ ] Title wall: 1 × A1 (worth the poster budget) or 6 tiled A3 — copy in §1.
- [ ] 6 dot-matrix fact cards (A6), ~40 copies each to start — §5.
- [ ] 4 persona tickets (DIN-long), ~40 each, Thomas first in the rack — §4.
- [ ] 4 station tent cards (A6/A5) — §3.
- [ ] Participation map: masterplan tiled 8–12 × A3 + pre-printed 68 hub dots — §6.
- [ ] Floor caption strips for Station C — §7.
- [ ] 2 QR test prints → verify with two different phones before the full run.
- [ ] Buy: floor tape (white/accent, ~50 m), dot stickers (accent colour, ≥500),
      card rack or two, blu-tack/tape for the map wall.

## Setup day (Wed July 8)

- [ ] Tape the 5.0 × 2.5 m rectangle; corners square; caption strips on the long edge.
- [ ] Stations per [`diagrams/01_station-layout.svg`](diagrams/01_station-layout.svg):
      A1 facing the entrance, C in the middle, map near the exit path.
- [ ] Cable-tape everything walkable; set all machines to never-sleep; screens to full
      brightness; A1 in kiosk full-screen.
- [ ] Full unattended dry run: leave the room 10 minutes, come back — is everything
      still looping? Ask a neighbour-project student to "visit" cold and watch what
      they do for 60 seconds. Fix what confuses them.
- [ ] Photograph the clean setup (for documentation + competition boards).

## Daily routine (July 9–12)

- **Open:** power on in order TV/PCs → tablet → projector; confirm loop + idle-return;
  restock cards and stickers.
- **Midday check:** tablet battery (charge over lunch if needed), sticker map tidy-up
  (photograph before removing any vandalism).
- **Close:** photograph the sticker map (daily evolution series!), power down projector
  first (battery), collect the card racks.

## Fallback matrix

| If… | Then… |
|---|---|
| No TV granted | A1 runs on the biggest pool monitor; loop type sizes already assume this |
| Only 1 pool PC | A1 and A2 alternate: hub-viewer as the idle screen on even days |
| No tablet | Persona tickets carry the content; deck `#s04` reachable from A1 |
| No projector | Tape the rectangle anyway; tile its interior with A3 after-render prints + one dot-matrix panel |
| Deck numbers still unreconciled by July 8 | A1 loop + all print use locked numbers (they already do); the deck is one click deeper and can differ for now — the loop is the exhibition voice |
| Overpass/Wi-Fi dead in the pool | Everything critical is offline-capable: loop (local), hub-viewer (local), deck (clone the repo locally and open `index.html` from disk) — prepare the local clone on both PCs on setup day |

## After Summaery (feeds the Aug 16 competition)

- [ ] Keep: the 4 daily sticker-map photos, visitor-count guesses, any comments overheard.
- [ ] The loop storyboard = the narrative spine for the competition submission's
      "single strongest narrative" cut.
- [ ] Write the session log + update `HANDOFF.md` per workshop protocol.
