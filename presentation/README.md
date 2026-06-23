# The Wolfsburg Workspace — Presentation

A Reveal.js slide deck explaining the team's project system to collaborators or tutors.

**File:** `index.html`
**Open:** drag `index.html` into any browser — no build step, no server needed.

---

## What it covers

| Slide | Topic |
|-------|-------|
| 1 | Title — "A project that remembers itself" |
| 2 | The problem: knowledge kept evaporating between sessions |
| 3 | The idea: the folder *is* the system |
| 4 | How it works — the read → do → write → remember loop |
| 5 | It's not hard to use — three steps |
| 6 | What's in the folder (CLAUDE.md, HANDOFF.md, research/, etc.) |
| 7 | Branches — parallel work without collisions |
| 8 | Use case: a teammate joins midweek |
| 9 | Use case: tutor consultation tomorrow |
| 10 | Use case: building a deliverable (Rhino / web tool) |
| 11 | Use case: session ends mid-work, nothing is lost |
| 12 | The whole routine — three habits (start / work / end) |
| 13 | Closing — repo links and call to action |

---

## Tech stack

- **[Reveal.js 5.1](https://revealjs.com/)** — slide framework (loaded from CDN)
- **[Mermaid 11.4](https://mermaid.js.org/)** — flowcharts and git graphs (loaded from CDN)
- **[Inter + JetBrains Mono](https://fonts.google.com/)** — typography (Google Fonts)
- No build step, no npm, no local server required.

---

## Keyboard shortcuts (Reveal.js defaults)

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `F` | Fullscreen |
| `S` | Speaker notes (none used here) |
| `Esc` | Overview mode |

---

## Editing

All content is in `index.html`. The CSS variables at the top of `<style>` control the colour palette:

```css
--bg0: #0b1220   /* darkest background */
--accent: #f6b53c  /* gold — headings, highlights */
--accent2: #37d4be /* teal — kicker labels, code */
```

Slides use Mermaid diagram blocks (flowchart and gitGraph). Diagram code is written inline in the HTML and rendered at load time.

---

## Updating the repo link on slide 13

The closing slide references `github.com/ofa5406/wolfsburg`. Update this if the repo URL changes.
