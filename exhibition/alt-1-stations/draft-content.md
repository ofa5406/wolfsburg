# Summaery 2026 — Draft Exhibition Content

All copy below is production-ready draft: paste into layouts, adjust German where a native
speaker disagrees. Companion to [`concept.md`](concept.md).

> ## ⚠️ NUMBERS — READ BEFORE PRINTING
> Everything here uses the **locked, tutor-accepted figures** (`decisions.md`, June 11):
> **fleet 763** (131 e-bikes · 55 auto-shuttle pods · 33 autobuses · 369 auto-pods ·
> 175 car-sharing EVs) and **68 hubs** (6 L ~2,000 m² · 19 M ~300 m² · 43 S ~91 m²).
> The **live deck** currently shows the web-tool run instead (1,273 vehicles · 140 hubs ·
> 641 e-bikes · 49,648 cars · "1 replaces 39"). Do not mix the two sets.
> One figure is still **missing for the locked set**: the *number of private cars replaced*
> (the deck's 49,648 belongs to the 1,273 fleet). It is marked `[CARS-REPLACED]` below —
> recompute it from the June 11 calculation before printing, or keep the qualitative
> phrasing offered as fallback.

---

## 1. Title wall

Large type (A1 poster, or 6 tiled A3):

> **PARKING CITY → HUB CITY**
> `<stadt.hub>` — a post-car future for Wolfsburg
>
> The city that built the car asks what comes after it. We replace parking —
> the infrastructure of private ownership — with mobility hubs — the infrastructure
> of shared mobility — and give the saved ground back to public life.
>
> *DE: Die Stadt, die das Auto gebaut hat, fragt, was danach kommt. Wir ersetzen
> Parkplätze — die Infrastruktur des Besitzens — durch Mobilitäts-Hubs — die
> Infrastruktur des Teilens — und geben den gewonnenen Raum dem öffentlichen Leben zurück.*
>
> Urban Design Studio — Wolfsburg Future Mobility · Bauhaus-Universität Weimar
> Ömer Faruk Aslan · Anastasiia Mulyndina · Başak Pınar
>
> [QR: presentation] ofa5406.github.io/wolfsburg   [QR: interactive map] *(see §8)*

Under the title, one dot-matrix strip: a field of hollow dots (private cars, 1 dot = 10)
collapsing rightward into **76 solid dots + 1 half dot** (the 763 shared fleet).

## 2. Station A1 — "The 60-Second City" loop storyboard

Silent, 16:9, big type (min 5% of screen height), one message per shot, hard cuts or slow
crossfades only. Total ≈ 75 s, seamless loop. All assets exist today.

| # | Time | Visual (asset) | On-screen text |
|---|------|----------------|----------------|
| 01 | 0–6 s | `videos/hero1.mp4` (muted) | `<stadt.hub>` — PARKING CITY → HUB CITY |
| 02 | 6–11 s | `charts/problem_1.jpeg` | Wolfsburg was built around the car. |
| 03 | 11–16 s | `charts/problem_2.jpeg` | A parked car uses its space ~23 hours a day. |
| 04 | 16–21 s | `charts/problem_3.jpeg` | 100,000 trips a day. Public transport: 20%. Cycling: 8%. |
| 05 | 21–28 s | Dot-matrix animation: hollow dots collapse to 76.3 solid dots | What if the city shared its vehicles? `[CARS-REPLACED]` private cars → **763** shared vehicles *(fallback text: "One shared vehicle replaces dozens of parked ones")* |
| 06 | 28–33 s | Fleet icon row (from deck s02 styling) | 131 e-bikes · 55 shuttle pods · 33 autobuses · 369 auto-pods · 175 shared EVs |
| 07 | 33–38 s | `charts/masterplan_upper.jpg` → `_upper_catchment.jpg` crossfade | **68 hubs.** Every front door within a short walk of one. |
| 08 | 38–42 s | `charts/hub_profile_cards.png` (or L/M/S panel captures) | 6 Large · 19 Medium · 43 Small |
| 09 | 42–47 s | `charts/ba_v3_before.png` → `ba_v3_after.png` wipe | Kleiststraße — before / after |
| 10 | 47–52 s | `charts/ba_v4_before.png` → `ba_v4_after.png` wipe | Schillerstraße — before / after |
| 11 | 52–57 s | `charts/ba_v2_before.png` → `ba_v2_after.png` wipe | The canal edge — given back. |
| 12 | 57–63 s | `charts/thomas_after_1.png` | Thomas builds the fleet at VW — and rides it. L-hub → factory gate in 18 minutes. |
| 13 | 63–69 s | `charts/masterplan_hero.jpg` slow zoom | Not fewer trips. Less parking. More city. |
| 14 | 69–75 s | Black, title + QRs | PARKING CITY → HUB CITY · touch to explore ↓ · [QR ×2] |

**Behaviour:** any key/mouse/touch → opens the scroll deck (`index.html` root) full-screen
(kiosk mode, F11). After ~90 s without input → back to the loop. *(Small follow-up build —
either export as .mp4 from these assets or a `loop.html`; keep out of the live deployment
until after Summaery review.)*

## 3. Station labels (A6/A5 tent cards, one per station)

**A1 — The 60-Second City**
The whole idea in one minute. **Touch anything to explore the full presentation.**
*DE: Die ganze Idee in einer Minute. Berühren zum Erkunden.*

**A2 — Hub Anatomy**
Every part of a mobility hub, explained. **Move the mouse — hover any element.**
*DE: Jedes Element eines Hubs, erklärt. Einfach mit der Maus zeigen.*

**B — Choose a Life**
Four residents, four lives — before and after the private car. **Pick a person. Flip
Before/After.** *DE: Vier Leben — vorher und nachher. Person wählen, umschalten.*

**C — One Parking Space**
This rectangle is a real parking space, 5.0 × 2.5 m. Watch what it becomes.
*DE: Dieses Rechteck ist ein echter Parkplatz. Sehen Sie, was er werden kann.*

## 4. Persona tickets (DIN-long cards, transit-ticket style, rack at Station B)

Front: name, route strip Before→After, dot-matrix corner. Back: story + QR to `#s04`.
Order in the rack: **Thomas first** (the VW case study), then Sabine, Lukas, Gertrude.

**03 → 01 · THOMAS, 44 — Engineer at the VW plant**
Before: 30 minutes in traffic every morning. A new car every three years — an obligation
that just felt like the way things were.
After: an autonomous bus from the L-hub delivers him to the factory gate in 18 minutes,
no congestion. He helps build the fleet, and he rides it. *The city that made cars for
the world is now making the future for itself.*

**SABINE, 38 — Office worker, two children**
Before: two family cars — €400/month in insurance, inspections, repairs; parking stress;
mornings of traffic and running late.
After: the family gave up both cars. E-bike to the S-hub, shuttle to the office in
12 minutes. The kids ride the same shuttle to school on their own — safe, on schedule,
no drop-off needed.

**LUKAS, 13 — Secondary school student**
Before: everything outside his neighbourhood depended on whether a parent could drive him.
The city might as well have ended at the next street.
After: every day starts with an e-bike from the nearest S-hub — faster than the old bus.
Weekends at the lake with friends from other districts. *For the first time, the whole
city feels like his.*

**GERTRUDE, 85 — Retired**
Before: after her leg gave out, she stopped driving. Every trip meant asking her daughter.
Spontaneous outings quietly disappeared.
After: an autonomous pod arrives at her door — booked from a tablet, no transfers, no
steps. Market on Tuesdays again. *Not because technology improved — because the city is
finally arranged as if she lives in it too.*

## 5. Dot-matrix fact cards (A6, B/W + accent, 1 dot = 10 unless noted)

Six cards. Front: the number, huge, built from dots. Back: one sentence + QR.

1. **763** — The entire shared fleet that replaces the private cars of the city centre.
   131 e-bikes, 55 shuttle pods, 33 autobuses, 369 auto-pods, 175 shared EVs.
2. **68** *(1 dot = 1 hub, sized S/M/L)* — Mobility hubs instead of parking:
   6 Large (converted multi-storey car parks), 19 Medium, 43 Small.
3. **23 h** *(dots as a clock field, 23 of 24 filled)* — How long the average car is
   parked each day. It is not a vehicle. It is a land use.
4. **100,000** — Trips into, out of and within the centre every day — 17,000 residents,
   18,000 workers, 17,000 visitors. The system is sized for the 9,000-trip peak hour.
5. **8%** — Cycling's share of trips today. Groningen manages ~60. The street space
   exists; it is currently storing cars.
6. **`[CARS-REPLACED]`** — Private cars made unnecessary by the shared fleet.
   *(Print only after recomputing for the 763 fleet — see warning box.)*

## 6. Participation wall — "Where would you put a hub?"

Card next to the tiled masterplan + sticker sheets:

> **Where would you put a hub?**
> This is Wolfsburg's centre. The solid dots are our 68 hubs.
> Take a sticker. Put a hub where *you* would need one — your street, your school,
> your work. By Sunday this map belongs to everyone.
> *DE: Nehmen Sie einen Punkt und setzen Sie Ihren eigenen Hub — Ihre Straße, Ihre
> Schule, Ihre Arbeit.*

Print the masterplan (`charts/masterplan_upper.jpg` or the Rhino export at higher res)
tiled on 8–12 × A3. Pre-place our 68 hubs as printed dots so visitor stickers (accent
colour) read as additions. Photograph the map each evening — the four photos are a
ready-made "public consultation" figure for the August competition boards.

## 7. Station C — projection captions (floor edge, taped strips)

Static caption (always visible):
> **This is one parking space. 5.0 × 2.5 m. A parked car uses it ~23 hours a day.**

Cycling captions (one per projected scene, in-image, bottom edge):
1. …or shade. *(trees / green from `ba_v2_after.png` crop)*
2. …or a café. *(terrace crop from `ba_v3_after.png`)*
3. …or twelve bikes. *(bike dock crop from `ba_v4_after.png` or hub render)*
4. …or a place to play. *(play street crop from `ba_v5_after.png`)*
5. …×12,500: a city. *(cut to masterplan_hero crop)* — then loop.

## 8. QR targets

| QR | Target | Note |
|----|--------|------|
| Presentation | `https://ofa5406.github.io/wolfsburg/` | live now |
| Interactive map | `https://annestasiia.github.io/wolfsburg-activity-map/` | **verify this URL before printing** (owner's Pages domain) |
| This concept (team-internal) | `https://ofa5406.github.io/wolfsburg/exhibition/` | live only after this branch merges to `main` |

Generate QRs at ≥ 3 cm print size, test with two phones under room lighting.
