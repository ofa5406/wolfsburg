# Workspace Intro — presentation

A short, visual deck introducing **how this workspace system and workflow works** (not the project content) — for presenting to the team.

## ▶ Live deck (present from here)

**https://wolfsburg-workspace-intro.netlify.app**

Open it full-screen and use → / ← (or space) to advance. Press **`S`** for speaker view, **`F`** for fullscreen, **`Esc`** for the slide overview.

The source is in [`presentation/index.html`](presentation/index.html) (reveal.js + Mermaid diagrams, self-contained). To redeploy after edits:

```bash
netlify deploy --dir=presentation --prod --site ade2dc5a-7c0a-4b31-bdd6-65e8f934437d
```

## What the deck covers

1. **The problem** — knowledge evaporates when chats end and files scatter.
2. **The idea** — the folder *is* the system; you work, the AI agent maintains it.
3. **How it works** — the loop: ask → Claude reads the rules → does the work → writes it back & logs it → memory persists.
4. **It's not hard** — open the folder, say what you want, it does the rest.
5. **The folder as interface** — `CLAUDE.md` (rules) + `HANDOFF.md` (state) carry the memory.
6. **Branches** — parallel work without collisions; `main` stays clean.
7. **Four use cases** — new teammate onboarding · prepping a tutor consultation · building a deliverable · a session/usage ending mid-work.
8. **The routine** — Start / Work / End, three habits.

## Talking points (≈3 minutes)

- *"This isn't a folder of files — it's a system that remembers."* The agent reads the project's rules every time, so it always has full context.
- *"You don't manage it. You just work."* No setup, no filing — you ask for what you need and the agent does the bookkeeping (logging sessions, updating the handoff).
- *"Keep it alive by ending your sessions."* The only discipline is: when you stop, let Claude write the session log and update `HANDOFF.md`.
- *"Work in branches."* Each new piece on its own branch, reviewed, then merged — same as the web tool already does.
- *"Onboarding = read two files."* `README.md` then `HANDOFF.md`, and you're current.
