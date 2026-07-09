# hubembed source snapshot

The `hubembed/` bundle (the interactive S/M/L element diagram on deck slides
6.2/6.3/6.4) is **built**, not hand-edited. Its source lives in the separate
`wolfsburg-activity-map` repo, where — as of this snapshot — `embed-hub/` and
`vite.hubembed.config.js` are **untracked** (never committed there). This folder
keeps a copy so the source can't be lost if that working tree is reset.

## Files here
- `main.jsx` — the embed entry (copy of `wolfsburg-activity-map/embed-hub/main.jsx`)
- `embed-index.html` — its HTML shell (`embed-hub/index.html`)
- `vite.hubembed.config.js` — the Vite build config
- `hubElements-name-dashes.patch` — the one tracked-file change: renamed
  `Seating — bench/group` → `Bench seating` / `Group seating` in
  `src/data/hubElements.jsx` (removes em dashes; this file IS tracked in the
  activity-map repo and should be PR'd there through the normal branch workflow —
  do NOT push straight to `master`, which auto-deploys the live tool).

## To rebuild
From the `wolfsburg-activity-map` repo root, with `embed-hub/main.jsx`,
`embed-hub/index.html` and `vite.hubembed.config.js` in place:

```
npx vite build --config vite.hubembed.config.js
```

Output goes to `../exhibition/deck/hubembed/` (config has `emptyOutDir: true`,
so it wipes and rewrites the bundle).

## What this build changed (2026-07-09)
- Element buttons keep their names at all times and stay rounded pills (they
  used to collapse to nameless icon chips once an element was selected).
- The selected element's description renders **below** the button row.
- Removed em dashes from two element names.
