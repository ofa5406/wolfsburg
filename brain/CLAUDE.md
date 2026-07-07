# brain/ — Briefing for a Claude session

This folder is the **project brain**: an Obsidian-compatible vault (`vault/`, 408 notes with typed wikilink edges) compiled by `scripts/build_graph.py` into `web/data/graph.js` for a self-contained 3D viewer (`web/index.html`). Read `README.md` first for the layout, note schema and viewer modes.

## Non-negotiables

1. **The validator is the gate.** After ANY vault edit run `python scripts/validate_vault.py` — it must exit 0 (zero broken `[[links]]`, zero orphans, whitelisted types/categories/relations from `scripts/vaultlib.py`). Then rerun `build_graph.py` so the viewer matches the vault.
2. **Never edit `web/data/graph.js` by hand** — it is generated.
3. **The viewer is offline-only.** No CDN scripts, no network fetches; libs are pinned in `web/vendor/`. Keep it that way — the exhibition machine may have no internet.
4. **Content rules:** one idea per note; 120–250-word bodies, never stubs; every claim sourced; contested numbers keep both values with `contradicts` edges (e.g. `Fleet Number Conflict` — 763 locked vs 1,273 in the web tool). English only.
5. **Deck integration is additive.** `exhibition/deck/` slide 5 (`#s5`, `brain-*` postMessage bridge in `deck.js`) embeds `web/index.html?kiosk=1`. If you change viewer message types, update both sides; rollback = delete `#s5` + the 5th SLIDES entry.

## Quick recipes

- **Add notes in bulk:** write a batch file (`=== FILE: folder/Title.md ===` separators), run `python scripts/ingest_batch.py <file>`, validate, build, commit.
- **Change the kiosk tour:** edit the `TOUR` id list in `web/brain.js` (ids are slugified filenames — check `data/graph.js`).
- **Verify end-to-end:** `python -m http.server` from the repo root → `/brain/web/index.html`, plus `?kiosk=1` and `?debug=1`; then `/exhibition/deck/` and confirm the 5-slide loop and that slide 4 (hub) still behaves.
