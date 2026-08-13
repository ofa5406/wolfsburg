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
> **To run it on the exhibition PC:** double-click **`deck/start-exhibition.cmd`**. It
> starts a tiny local web server and opens the deck fullscreen in Chrome kiosk mode,
> fully offline. To quit: `Alt+F4`, then close the small server window it leaves behind.
> **Turn screen-sleep off** first (Settings → Power, or `powercfg`), or the loop will
> sleep during the show.
>
> ⚠ **Do not just double-click `deck/index.html`.** Opening it as a file (`file://`) leaves
> the map/hub embeds (2.1, 5.4, 6.x) blank — browsers refuse to load their ES-module
> bundles over `file://`. The deck must be *served over http://*, which the `.cmd` (or the
> deployed URL) does. Needs Python 3 installed (for the built-in `http.server`).
>
> The page-by-page spec is **[`PRESENTATION-OUTLINE.md`](PRESENTATION-OUTLINE.md)**.
>
> ### Superseded, kept on disk
> - **`kiosk/`** — an earlier 11-beat take that `deck/` replaced. Do not run it. It stays
>   only because `deck/` slide 1.3 still borrows two images from `kiosk/assets/`; deleting
>   the folder would break the deck.

### History — 2026-07-06 pivot to one screen
The pool granted the team **a single screen**, superseding two earlier multi-station
exhibition concepts. `deck/` is the concept that replaced them.

## Contents

| Path | What it is |
|------|-----------|
| [`deck/`](deck/) | **The exhibit.** Self-running 24-slide deck (`index.html` + `deck.js` + `deck.css`), with embedded map/hub/brain modules under `deck/*embed/`. Page spec in `PRESENTATION-OUTLINE.md`. |
| `kiosk/` | Superseded 11-beat predecessor. Do not run. Keep — 1.3 borrows two of its images. |
| [`diagrams/`](diagrams/) | Shared SVGs: 01 layout · 02 legibility ladder · 03 equipment tiers · 04 loop storyboard · 05 dot-matrix cards · 06 projection setup · 07 furnishing plan · 08 fit manifest |

## Shared design foundation

- **Accent colour `#E8500A`** — validated (contrast + CVD) on the deck's light and dark surfaces

## ⚠️ Before printing anything

All materials use the **locked figures** (fleet **763**, hubs **68** = 6 L / 19 M / 43 S —
`decisions.md`). The live deck still shows the web-tool run (1,273 / 140). Two figures
need verification: **`[CARS-REPLACED]`** (recompute for the 763 fleet) and Alt 2's
**"~12,500 spaces"** manifest claim (check against the parking inventory).
