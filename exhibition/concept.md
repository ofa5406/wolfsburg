# Summaery 2026 — Exhibition Concept

**`<stadt.hub>` · Parking City → Hub City**
*Computer pool, July 9–12, 2026 · unattended · equipment shared across 5 class projects*

---

## 1. The big idea: the exhibit behaves like the thesis

The project's argument is *take space back from parked cars and give it to people*.
So the exhibit does exactly that, live, in the room:

> **We tape a real parking space (5.0 × 2.5 m) onto the computer-pool floor
> and spend four days showing what it could be instead.**

Everything else — the film loop, the 3D hub, the persona stories, the sticker map —
arranges itself around that rectangle. A visitor who reads nothing still walks *through*
a parking space that has become an exhibition. That is the thesis at 1:1 scale, and it
costs a roll of tape.

The visual grammar of the whole exhibit is the **dot-matrix** — the device the critic
singled out at finals as "an especially effective communication device", with the explicit
instruction to *develop more dot-matrix / before-after treatments and prioritise legibility
for exhibition format*. One dot = 10 vehicles. Black and white plus one accent colour
(the deck's existing accent). Cars are hollow dots; the shared fleet is solid dots.
Visitors add their own dots (sticker map). Even the takeaway is a dot.

## 2. The legibility ladder (how an unattended exhibit works)

The midterm brief's test: *"if a visitor cannot read the concept from the exhibit alone
in under a minute, it is not exhibition-ready."* We design for four depths of attention:

| Attention | What they get | From |
|---|---|---|
| **10 seconds** | Title + the taped parking space + one dot-matrix panel: *hollow dots collapse into solid dots* | Title wall, floor tape |
| **60 seconds** | The whole argument as a silent looping film | Station A1 loop |
| **5 minutes** | Free exploration: scroll deck, 3D hub anatomy, persona lives | Stations A1/A2/B |
| **Take-home** | A dot card or persona ticket with QR to the live deck & map | Print layer |

Diagram: [`diagrams/02_visitor-journey.svg`](diagrams/02_visitor-journey.svg)

## 3. The stations

Equipment is shared between 5 projects, so the plan is **tiered**: Tier A must happen with
computer-pool machines alone; B and C are what we request from the pool. Full matrix:
[`diagrams/03_equipment-tiers.svg`](diagrams/03_equipment-tiers.svg)

### A1 — "The 60-Second City" *(Tier A — pool PC or 1 large TV)*
A silent, auto-looping ~75 s film built entirely from existing assets
(`videos/hero1|2.mp4`, `charts/problem_*.jpeg`, the dot-matrix, `charts/ba_v1..v5_*`,
`charts/masterplan_*`). It is the exhibit's *attract mode*: big type, one message per shot,
no UI on screen. **Any key/mouse/touch interrupts into the existing scroll deck** for free
exploration; after ~90 s idle it returns to the loop.
Storyboard with timings and asset filenames: [`draft-content.md`](draft-content.md) §2 and
[`diagrams/04_loop-storyboard.svg`](diagrams/04_loop-storyboard.svg).
*Build note: the loop itself is a small follow-up build (video export or a `loop.html`
added later on a separate branch); the storyboard here is production-ready.*

### A2 — "Hub Anatomy" *(Tier A — a second pool PC)*
The existing **`hub-viewer/`** exactly as it is: offline, self-explanatory,
hover-to-learn — every element of the hub kit shows a one-line description card, with
eye-level and isometric named views. This is the "schematic diagrams showing what each
hub size looks like" the critic asked for, in interactive form. Zero build cost; needs
only a station label and a mouse.

### B — "Choose a Life" *(Tier B — 1 Galaxy Note tablet, requested)*
The deck's Scenarios section (`#s04`) opened full-screen on a tablet mounted/stood at the
edge of the taped parking space: pick **Sabine 38 / Lukas 13 / Thomas 44 / Gertrude 85**,
flip Before ↔ After. Thomas (VW engineer, L-hub → factory gate in 18 min) is the
critic-requested VW case study, placed first in reading order on the printed ticket rack
beside the tablet. Uses only existing persona image sets — no build beyond a browser
bookmark and the tablet request.

### C — "One Parking Space" *(Tier C — 1 XGIMI portable projector, requested; the centrepiece)*
The taped 5.0 × 2.5 m rectangle on the floor. The XGIMI Halo+ (short-throw, battery-capable)
stands on a plinth/table and projects **into the rectangle**, cycling what this exact
footprint becomes in Hub City — the after-renders cropped to the space: trees / café
terrace / bike dock / play street — over a slow ~40 s cycle. One caption line on the floor
edge (small print, taped):

> *"A parked car uses this space ~23 hours a day. One shared vehicle replaces dozens of parked ones."*

Physical, cheap, emotional — and photographable, which is how Summaery projects travel.
Setup diagram: [`diagrams/06_parking-space-projection.svg`](diagrams/06_parking-space-projection.svg).
**Fallback if no projector is granted:** the same rectangle is taped anyway, and its
interior is tiled with A3 prints of the after-renders + one A3 dot-matrix panel. The
rectangle is the idea; the projector is only its best version.

### Print layer — "Take a dot home" *(no equipment; small prints only)*
1. **Dot-matrix fact cards (A6, B/W + accent, laser-printable):** one number per card, dot-matrix
   on the front, one explaining sentence + QR on the back. Series of 6 — copy in
   [`draft-content.md`](draft-content.md) §5, mockups in
   [`diagrams/05_dot-matrix-cards.svg`](diagrams/05_dot-matrix-cards.svg).
2. **Persona tickets (DIN-long, styled like transit tickets):** one per persona; front =
   route Before→After, back = story + QR to `#s04`. A small rack of them next to Station B.
3. **Participation wall — "Where would you put a hub?":** the masterplan tiled from A3
   sheets (~A0 total) on the wall or a table, plus dot stickers in the accent colour.
   Visitors place their own hub. By Sunday the map is a crowd-made dot-matrix — the
   participation *is* the graphic system. Instructions card in
   [`draft-content.md`](draft-content.md) §6.
4. **Title wall (tiled A3 or one A1 if "really worth it" — it is):** exhibition title,
   one-sentence thesis, team credits, the two QR codes.

## 4. Floor layout

See [`diagrams/01_station-layout.svg`](diagrams/01_station-layout.svg). Principles:

- The **taped parking space is the room's centre of gravity**; screens face outward from it
  so the loop attracts from the corridor/door.
- A1 (loop) is the first thing visible from the entrance; A2 and B sit at its sides;
  the sticker map is at the exit side so people act *after* they understand.
- Nothing requires supervision; cables taped; tablet in kiosk/pinned mode.

## 5. Idea catalogue — considered, stretch, rejected

Kept honest so the team sees the trade-offs; adopt or discard at the July planning meeting.

**Adopted (above):** 60-second loop · hub-viewer station · persona tablet ·
1:1 parking-space projection · dot-matrix card series · sticker participation map.

**Optional, cheap, worth doing if time allows**
- **Activity Map preset station:** the web map locked to 3–4 clean preset views
  (hub network, coverage, cycling) on a third pool PC — already recommended in
  `research/09` §exhibition. Needs someone to define the presets; no code required
  if done as bookmarks.
- **Sound layer:** one pair of headphones at Station C playing a 60 s ambient loop —
  30 s of traffic (Before) crossfading into 30 s of birds/voices/bikes (After).
  The emotional register the visuals can't reach; trivial to produce with phone
  recordings + free SFX.
- **"Reserved" cones gag:** two real traffic cones + a printed sign *"Reserved: 23h/day,
  unused"* beside the taped space on opening day — a photo magnet. Costs nothing if
  cones can be borrowed.

**Stretch (only if the pool grants it AND someone owns it)**
- **VR eye-level hub walk** (headsets exist in the pool): a 360° render or the hub-viewer
  eye-level views in a headset. Rejected as a *core* element: high supervision need,
  hygiene/queue management, single-visitor throughput — the opposite of an unattended
  exhibit. Keep only as a supervised Saturday-afternoon special, if at all.
- **Second projector for the before/after wipe** on a wall. Nice but competes with C for
  the shared projectors; the same content works as a crossfade inside the A1 loop.

**Rejected (with reasons, so we don't re-litigate)**
- **Projecting the scroll deck itself as a passive slideshow** — a scrolling website
  projected without a hand on the mouse reads as a broken screen. The deck is for
  *touching* (A1 interrupt mode), the loop is for *watching*.
- **Traffic-light behavioural interactive** (the critic's Ampel idea as a game) — good
  studio content, but a build too far in 8 days; fold the idea into one loop caption.
- **Free-floating vs. fixed-hub operational exhibit** — inside-baseball; the consultation
  itself concluded operational detail is secondary to the spatial argument.
- **Printing large-format masterplans as the primary medium** — poster budget is "only if
  it really worth it"; the one poster that earns it is the title wall. The masterplan is
  better served tiled-A3 as the participation map, where it also *does* something.

## 6. Equipment request (to the class pool)

| Item | Qty | For | Priority | Fallback |
|---|---|---|---|---|
| Large TV (or pool PC + biggest monitor) | 1 | A1 loop + deck | Must | Pool PC monitor |
| Pool PC | 2 | A1, A2 | Must (in-room) | 1 PC, alternate A1/A2 by day |
| Galaxy Note tablet | 1 | B personas | High | Deck `#s04` on the A1 PC |
| XGIMI Halo+ | 1 | C projection | High | A3 prints inside the taped space |
| Headphones | 1 | Sound layer | Nice | skip |
| VR headset | 0–1 | Stretch only | Low | skip |

We deliberately **do not** request: the second/third TV, the Mogo, more tablets —
5 projects share the pool, and a modest, specific request is likelier to be granted.

## 7. Why this will score

- **Critic-aligned:** dot-matrix everywhere (his named favourite), before/after treatments
  of every dataset, the VW case study front-loaded, the "after"-state made physical.
- **Brief-aligned:** self-explaining in 10 s, durable artefacts (cards survive the weekend),
  the web tool present but as an instrument, not the deliverable.
- **Cheap:** one poster, small prints, tape, stickers — plus hardware we already have
  (deck, hub-viewer, renders) doing the heavy lifting.
- **Memorable:** people remember the room where a parking space became a garden —
  and they take a dot home.
