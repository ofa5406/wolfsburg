# Session — 2026-07-06 (exhibition deck rebuild)

**Date:** 2026-07-06
**Focus:** Scrapped the kiosk look; built a new template-driven exhibition deck (`exhibition/deck/`) from scratch — vertical fullpage, real embedded deployment maps, full-typewriter identity.
**Who:** İrem + Claude

*(Second session today — earlier one built `exhibition/kiosk/`. İrem didn't like it and asked to start over with proper templates.)*

---

## What we did

Built **`exhibition/deck/`** — a new self-running exhibition deck, iterated across three rounds (v1 → v2 → v3) plus a fix pass. It reuses the kiosk's proven `typewriter.js` but nothing else.

**Templates (mock-up = 4 example slides):**
- **T1** full-frame media, text over — slide 1 (hero video) + slide 4 (hub viewer).
- **T2** three-across square gallery — slide 2 (history), each frame cycles several images.
- **T3** text left · square interactive gallery right — slide 3 (the 3 analyses).

**Key build — the maps are the REAL deployment, not a redraw.** Added a standalone offline bundle of the activity-map's three landing map components:
- New `wolfsburg-activity-map/embed/` (`index.html` + `main.jsx`) + `vite.embed.config.js`
  (`root:embed`, `publicDir:../public`, `base:./`, `outDir:../exhibition/deck/mapembed`).
- `main.jsx` fills the Zustand store exactly like `src/App.jsx`, lazy-mounts `MobilityMapSection` /
  `LivabilityMapSection` / `CentralityMapSection` (each renders its own tab controls / scale / popups),
  and bridges to the deck via postMessage (`deck-set-section` ↔ `embed-section` / `embed-interaction`).
- Build: `npx vite build --config vite.embed.config.js` → `exhibition/deck/mapembed/` (then prune
  `Video/` + `wolfsburg_centrality_hubs.geojson`). Fully offline (maplibre + geojson vendored).

**Deck engine (`deck.js` / `deck.css` / `index.html`):**
- Vertical **fullpage** track (`translate3d`, one wheel/key/swipe = one page, ease-in-out, snapped).
- **Present button** (auto-plays on load + loops; toggles auto-run; **resumes from the current slide**).
- Modes: any input → Discover; **15 s** idle resume from current, **30 s** on hub → restart from top.
- Thick **L-frame** corners + deep content inset.
- **All prose typed** live (typewriter got an optional `speed` factor for brisk body text).
- **Per-image history captions** (each image its own year/label/typed sentence; per-frame ◀▶ arrows).
- **`<stadt.hub>` logo** (angle brackets) — large on slide 1, always-blinking caret beside it + in the brand.
- **Click-to-activate** embeds: maps + hub ignore scroll until clicked (armed overlay → page scroll;
  click → interactive). Hub's render loop **pauses off-screen** (fixed the choppy video/transitions).
- Map framing: one shared fitted view (`window.__DECK_MAP_VIEW`, zoom 10.55) so Wolfsburg fits the
  square and all three analyses match scale. Export/view panel moved bottom-right (embed only).

Verified headless throughout (playwright + system Chrome): one-scroll-one-page, present toggle,
auto-advance, iframe section bridge, click-to-activate arming, gallery fit at 1920/1600/1366 — 0 errors.

## Decisions made

- Exhibition deck **starts over** from the kiosk; new home = `exhibition/deck/` (kiosk kept, untouched).
- Maps must be **exactly the deployment** → embed the real components (not a maplibre redraw).
- Near-monochrome identity; colour only inside the live maps. Auto-play on load + loop.
- Present **resumes from current slide** (changed from an earlier "restart from top").
- Small edits to shared files are gated so the **live deployment is unchanged**: the 3 sections read an
  optional `window.__DECK_MAP_VIEW`; `ExportControl` only moves bottom-right when embedded; hub-viewer
  render loop only starts paused when `window.parent !== window`.

## Files created / changed

| File | What changed |
|------|--------------|
| `exhibition/deck/index.html` `deck.css` `deck.js` `typewriter.js` | new deck (typewriter copied from kiosk, extended with `speed`) |
| `exhibition/deck/mapembed/**` | built output of the real map embed (generated) |
| `wolfsburg-activity-map/embed/{index.html,main.jsx}` + `vite.embed.config.js` | new standalone embed of the 3 landing maps |
| `wolfsburg-activity-map/src/components/landing/{Mobility,Livability,Centrality}MapSection.jsx` | honor `window.__DECK_MAP_VIEW` override |
| `wolfsburg-activity-map/src/components/landing/ExportControl.jsx` | bottom-right when embedded |
| `hub-viewer/index.html` | pausable render loop (`hub-pause` / `hub-resume`; starts paused when embedded) |

## Open threads / unfinished

- **Live pass on the exhibition PC** (F11 / Chrome `--kiosk`): confirm the smoothness fix feels right,
  screen-sleep off, mouse+keyboard takeover.
- **Offline map labels:** district name labels use online glyphs (`demotiles.maplibre.org`) → absent on a
  fully offline PC. Vendor a glyph set if the labels matter.
- History images are still the **low-res kiosk placeholders**; per-image caption copy is first-draft.
- Content/copy still Claude-drafted — reconcile with the team's Miro narrative; voiceover after sign-off.
- The map embed rebuild is **not automatic** — re-run the vite embed build after any change to the 3
  sections / `ExportControl` / `embed/main.jsx`, then re-prune.
- **Committed + pushed** (end of session): `ofa5406/wolfsburg` `main` `bb46ed2` (deck + hub-viewer +
  session memory), `annestasiia/wolfsburg-activity-map` `master` `264cd3f` (embed + gated overrides,
  rebased on the teammate's re-center). Both redeploy on push; activity-map edits are gated so the live
  tool is unchanged.
- **Not done:** align the embed's fitted center to the teammate's new `[10.7769, 52.4056]` (embed still
  uses the old `[10.7865, 52.4227]`, zoom 10.55 — fits fine, just not the team's exact midpoint).

## Next session — start here

1. `python -m http.server` at the wolfsburg root → open `exhibition/deck/index.html` (F11); live review.
2. Reconcile beat copy + per-image captions with the team's Miro board; swap in real (hi-res) history images.
3. (Optional) align embed center to `[10.7769, 52.4056]`, rebuild embed, push. Vendor maplibre glyphs for
   offline labels; set hub-viewer tour dwell to 5 s (currently 6 s).
   *(Commit/push already done this session — see Open threads.)*
