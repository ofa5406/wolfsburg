# `exhibition/` — Summaery 2026 Exhibition Concepts

**Event:** Summaery, Bauhaus-Universität Weimar — **July 9–12, 2026**
**Venue:** Computer pool (equipment shared with 4 other class projects)
**Constraint:** Visitors browse **without narration** — the exhibit must explain itself.

> ## ▶ THE EXHIBIT IS `deck/`
> **What runs on the exhibition PC is [`deck/`](deck/)** — a self-running 24-slide
> vertical presentation (one slide per screen, auto-plays and loops). Typed headlines
> and hooks, question-led sections, live embedded maps, the 3D hub viewer and the
> project-brain knowledge graph; any input hands control to the visitor (Discover mode)
> and it resumes presenting when idle. **It is the site homepage**, deployed at
> [ofa5406.github.io/wolfsburg](https://ofa5406.github.io/wolfsburg/).
>
> **To run it on the exhibition PC:** open `deck/index.html` full-screen (F11, or launch
> Chrome with `--kiosk`), and turn screen-sleep off.
>
> The page-by-page spec is **[`PRESENTATION-OUTLINE.md`](PRESENTATION-OUTLINE.md)**.
>
> ### Superseded, kept on disk
> - **`kiosk/`** — an earlier 11-beat take that `deck/` replaced. Do not run it. It stays
>   only because `deck/` slide 1.3 still borrows two images from `kiosk/assets/`; deleting
>   the folder would break the deck.
> - **`alt-1-stations/` · `alt-2-parking-space/`** — the pre-2026-07-06 multi-station
>   concepts, from before the pool granted only a single screen. Reference only.

### History — 2026-07-06 pivot to one screen
The pool granted the team **a single screen**, superseding the two multi-station
alternatives (Alt 1 / Alt 2) below. Those docs are kept for reference and for the shared
copy they contain.

## The two alternatives

| | **Alt 1 — Station constellation** | **Alt 2 — One Parking Space (purified)** |
|---|---|---|
| Idea | Stations (loop screen, 3D hub, personas, projection) orbit a taped, projected-on parking space | The taped 5.0 × 2.5 m space is **the entire exhibit** — furnished as reclaimed street: café table + chairs, pots, bike, chalk drawings, one screen. Everything fits inside |
| Equipment | 2 PCs + TV + tablet + projector | 1 screen + 1 PC + 1 tablet (no projector) |
| Effort risk | Tech (projector grant, kiosk babysitting) | Logistics (furniture sourcing, chalk management) |
| Visitor role | Watch → explore → act | **Sit inside the argument** from second one |
| Folder | [`alt-1-stations/`](alt-1-stations/) | [`alt-2-parking-space/`](alt-2-parking-space/) |

**Combo option:** Alt 2's furnished space + Alt 1's projector cycle aimed at the chalk
field for the Summaery evenings — the maximal version if the pool grants everything.

## Contents

| Path | What it is |
|------|-----------|
| [`deck/`](deck/) | **The exhibit.** Self-running 24-slide deck (`index.html` + `deck.js` + `deck.css`), with embedded map/hub/brain modules under `deck/*embed/`. Page spec in `PRESENTATION-OUTLINE.md`. |
| `kiosk/` | Superseded 11-beat predecessor. Do not run. Keep — 1.3 borrows two of its images. |
| `alt-1-stations/concept.md` · `draft-content.md` · `production-checklist.md` | Superseded multi-station concept, all copy, build plan |
| `alt-2-parking-space/concept.md` · `draft-content.md` · `production-checklist.md` | The purified single-space concept, its manifest/menu/label copy, build plan |
| [`diagrams/`](diagrams/) | Shared SVGs: 01 layout (Alt 1) · 02 legibility ladder · 03 equipment tiers (Alt 1) · 04 loop storyboard · 05 dot-matrix cards · 06 projection setup (Alt 1) · **07 furnishing plan (Alt 2)** · **08 fit manifest (Alt 2)** |
| [`index.html`](index.html) | Visual concept page presenting both alternatives (auto-deploys at `/wolfsburg/exhibition/` after merge to `main`; root presentation untouched) |

## Shared foundation (used by both alternatives)

- **60-Second City loop** — storyboard in `alt-1-stations/draft-content.md` §2
- **Dot-matrix card series + persona tickets** — copy in `alt-1-stations/draft-content.md` §4–5
- **Title wall** — §1 (Alt 2 adds one line)
- **Accent colour `#E8500A`** — validated (contrast + CVD) on the deck's light and dark surfaces

## ⚠️ Before printing anything

All materials use the **locked figures** (fleet **763**, hubs **68** = 6 L / 19 M / 43 S —
`decisions.md`). The live deck still shows the web-tool run (1,273 / 140). Two figures
need verification: **`[CARS-REPLACED]`** (recompute for the 763 fleet) and Alt 2's
**"~12,500 spaces"** manifest claim (check against the parking inventory).
