# `<stadt.hub>` — Project Brain

An Obsidian-style knowledge graph of the entire project: **408 notes, ~2,400 typed links** covering every concept, hub element, fleet number, research finding, precedent, decision, persona, place, tool, risk — plus researched deep dives (etymologies, histories, theory, the people of the lineage). Rendered as an interactive **3D force graph** for the Summaery exhibition kiosk.

## What's here

```
brain/
├── vault/            ← the knowledge base (open this folder in Obsidian)
│   ├── 00_Index/        Home + 12 index MOCs (start at Home.md)
│   ├── 01_Concepts/     core urbanism & mobility concepts
│   ├── 02_Hub_System/   tiers, zones, 45 toolpalette elements, materials
│   ├── 03_Mobility_Fleet/ 5 modes + fleet math + service design
│   ├── 04_Research_Findings/ atomised evidence, 1 claim = 1 note
│   ├── 05_Precedents/   Groningen, Ghent, Bremen, MOIA…
│   ├── 06_Decisions_Process/ locked decisions, deadlines, proof deliverables
│   ├── 07_Personas/     Anna + the exhibition persona cycle
│   ├── 08_Places/       Wolfsburg, VW, factory gate, canal, districts
│   ├── 09_Data_Tools/   Activity Map modes, algorithms, Rhino kit, viewers
│   ├── 10_Risks_Tensions/ risk register + tracked contradictions
│   └── 12_Deep_Dives/   etymology / history / theory satellites
├── scripts/
│   ├── validate_vault.py  link integrity — MUST exit 0 (zero broken links/orphans)
│   ├── build_graph.py     vault → web/data/graph.js (refuses if validation fails)
│   ├── vaultlib.py        shared parser (stdlib only)
│   └── ingest_batch.py    split a concatenated batch file into notes
└── web/              ← the 3D viewer (self-contained, offline, no build step)
    ├── index.html / brain.css / brain.js
    ├── vendor/          three, three-spritetext, 3d-force-graph, marked (pinned)
    └── data/graph.js    GENERATED — window.BRAIN
```

## Using it

**As a vault:** open `brain/vault/` in Obsidian. Start at `00_Index/Home.md`.

**As the viewer:** serve the repo (`python -m http.server` from the repo root) and open `/brain/web/index.html`. It is fully offline — vendored libs, baked data, no network.

- `?kiosk=1` — exhibition mode: slow orbit + guided tour of 8 nodes (~9 s each), posts `brain-cycle-complete` after a full cycle; any input stops the tour and posts `embed-interaction`. Honors host messages `brain-kiosk-start/stop` and `brain-pause/resume`.
- `?debug=1` — FPS overlay.

**In the deck:** slide 5 of `exhibition/deck/` embeds the kiosk mode and drives it with the same pause/resume bridge the hub viewer uses.

## Editing notes

Every note: frontmatter (`title, type, category, confidence, source, tags`) + a 120–250-word body + a `## Connections` section whose bullets (`- reltype [[Target]]`) become typed graph edges. Closed relation vocabulary: `defines, part-of, instance-of, informs, supports, contradicts, implements, precedent-for, located-in, uses, produces, led-to, mentions`. Allowed types/categories are whitelisted in `scripts/vaultlib.py`.

After any edit:

```
python brain/scripts/validate_vault.py   # must exit 0
python brain/scripts/build_graph.py      # regenerates web/data/graph.js
```

## House rules

- Numbers carry sources and confidence; contested figures keep their caveats.
- Contradictions are `contradicts` edges, never silently reconciled (see *Fleet Number Conflict*).
- Zero broken links, zero orphans — the validator is the gate; the builder refuses a broken vault.
