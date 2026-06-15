# Session — 2026-06-15

**Date:** 2026-06-15
**Focus:** Purge the wrong project title "Postcard Future of Wolfsburg" → "Post-Car Future of Wolfsburg" everywhere, including git history and the live deck.
**Who:** Irem + Claude

---

## What we did

- Tracked down every occurrence of the mistyped title (9 hits across 8 files). Root finding: it was **not** auto-generated — it was the original June 4 project title (a transcription slip of *post-car* → *postcard*) baked into the docs, plus it lived in the **cross-session memory file**, which is why it kept reappearing each session.
- Replaced all instances with **"Post-Car Future of Wolfsburg"**.
- **Rewrote the entire git history** (both commits) with `git filter-branch`, dropped the backup refs, gc'd, and **force-pushed** to GitHub so the old word exists in no commit.
- **Redeployed** the corrected workspace-intro deck to Netlify (wolfsburg-workspace-intro.netlify.app).
- Fixed the auto-memory file `project_wolfsburg_semester.md` — the source of the recurrence.
- Verified zero "postcard" hits in the project tree, the memory dir, git history, and the live site.
- Also logged the prior (previously unlogged) session that built the workspace-intro deck.

## Decisions made

- Project title is **"Post-Car Future of Wolfsburg"** (not "Postcard…"). No design decisions changed.

## Files created / changed

| File | What changed |
|------|--------------|
| `CLAUDE.md`, `README.md`, `research/README.md`, `research/09_execution-workflow.md`, `consultations/2026-06-04_session.md`, `project/archive/v1_2026-06-04.md`, `presentation/index.html` | "Postcard" → "Post-Car" (via history rewrite) |
| `…/memory/project_wolfsburg_semester.md` | title corrected (root-cause fix) |
| entire git history | rewritten + force-pushed (new hashes) |
| Netlify production | redeployed corrected deck |

## Open threads / unfinished

- **Teammates with existing clones must re-clone or `git reset --hard origin/main`** — history was rewritten, so their old `main` will no longer match.
- The June 25 proof deliverables remain unstarted (see HANDOFF).

## Next session — start here

- Begin the **car-land map** and **hub-coverage map** (highest rhetorical value, June 25 deadline ~10 days out).
