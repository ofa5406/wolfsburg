# Session — 2026-07-07 · The Project Brain

**Goal:** atomise the entire `<stadt.hub>` project into an Obsidian-style knowledge graph and present it as an interactive 3D "brain" on the exhibition kiosk — both standalone and as a new deck slide. (Continued from an interrupted 2026-07-07 early-morning session that hit the usage limit mid-Batch-3; all its work was recovered.)

## What was done

**The vault (`brain/vault/`) — 408 notes, 2,439 typed edges, 0 errors / 0 orphans:**
- Batches 1–2 (recovered from the interrupted session): ~68 concepts + ~89 hub-system notes (tiers, zones, all 45 toolpalette elements, 9 materials).
- Batch 3: 31 mobility/fleet notes — 18 recovered from the old session's scratchpad + 13 new service-design notes (demand basis, corridor, dispatch, phased autonomy, car-sharing variants…).
- Batch 4: 58 research findings — one sourced claim per note with supports/contradicts edges (parking economics, substitution corridor, AV reality check, behaviour evidence, Wolfsburg hero stats).
- Batch 5: 26 precedents (Groningen → Ghent → Houten lineage, Barcelona/Paris/Pontevedra/Oslo, Bremen mobil.punkt, MOIA + MIA, BerlKönig, Whim, Stockholm, Nottingham, Karparc, Vauban…).
- Batch 6: 39 decisions/process/risk notes — all 9 locked decisions, the 3 deadlines, the Proof Framework + its 6 deliverables, the full risk register, and 4 tracked tensions incl. **Fleet Number Conflict (763 vs 1,273)** with `contradicts` edges both ways.
- Batch 7: 36 personas/places/tools — Anna + the kiosk persona cycle (Thomas/Sabine/Lukas/Gertrude), 10 places, 21 data & tool notes (every Activity-Map mode + algorithm documented from `web-tool/status.md`).
- Batch 8: 54 deep dives — the Jacobs→Moreno lineage, etymologies (hub, Stadt, kiosk, *parking = a park with the trees deleted*), histories (Wolfsburg/KdF, woonerf, superblock, car sharing, parking meter), theory (induced demand, Braess, Marchetti, motonormativity, Vision Zero, Third Place, Right to the City), meta (Zettelkasten, Königsberg, Dijkstra) — each with citations and links back into the project graph. Plus Home + 12 index MOCs.

**The viewer (`brain/web/`):** self-contained offline 3D force graph (vendored three + spritetext + 3d-force-graph + marked; `window.BRAIN` baked by `build_graph.py`). Deck identity: ink field, monochrome category shades, `#E8500A` selection only, L-frames, blinking-caret wordmark. Click → camera fly-to + paper detail panel (rendered markdown with clickable wikilinks, typed connections, sources, confidence). Search, category chips, `?debug=1` FPS, `?kiosk=1` guided tour (8 stops × 9 s, `brain-cycle-complete` / `embed-interaction` / `brain-pause|resume` bridge).

**The deck (`exhibition/deck/`):** additive slide 5 — `#s5` reuses the thub shell (zero CSS changes), `deck.js` gains mirrored `brain-*` helpers, a typed headline ("Every idea, *conected* → connected."), a 5th SLIDES entry and pause/resume in `place()`. Rollback = delete `#s5` + the SLIDES entry.

## Verification

- `validate_vault.py` exit 0 — 0 broken links, 0 orphans, 408 nodes (gate: 400–600). Avg body 155 words.
- Offline audit: no runtime network references in `brain/web/`.
- Headless (Playwright/Edge): viewer — data load, search→select, panel + wikilink nav, chip filter, FPS, kiosk tour + messages: **all pass, 0 console errors**. Deck — 5-slide loop, counter 05/05, brain veil/activate, hub slide unchanged, map tabs intact, wheel nav: **all pass, 0 errors**.

## Commits (all on `ofa5406/wolfsburg` main)

`f340276` scaffold + batches 1–3 · `ce3f450` batch 4 · batch 5 · batch 6 · batch 7 · `8db7e39` batch 8 + indexes · `46d73c8` web viewer · `77bf590` deck slide 5 · (this commit) docs + handoff.

## Open / next

- The brain is content-complete for Summaery; future sessions can grow it (new findings, more deep dives) — batch-ingest + validator workflow documented in `brain/README.md` + `brain/CLAUDE.md`.
- Kiosk tour stops and per-category shades are tunable in `brain/web/brain.js`.
- The seven June-25 proof deliverables remain the priority work queue (unchanged by this session).
