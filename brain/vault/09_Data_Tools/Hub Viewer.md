---
title: Hub Viewer
type: tool
category: tool
confidence: high
source:
  - hub-viewer/README.md
  - hub-viewer/CLAUDE.md
tags: [tool, 3d, exhibition]
---

# Hub Viewer

The project's standalone 3D instrument: a self-contained, embeddable browser viewer of one hub's complete element kit — the modelled hub scene explorable in the round, every element hoverable with its description card, with game-style Walk/Fly navigation (drag-look, WASD, click-to-pick) and ~110 low-poly figures populating the space ([[Rhino Toolpalette Kit]], [[Hub Toolpalette]]).

Technically it is the house pattern this brain's own viewer inherits: vendored libraries, no network, no build step, a baked `window.*` data global, and a **kiosk mode** (`?kiosk=1`) that runs a slow camera tour through saved views, yields to any visitor input, and resumes on idle — designed for the unattended exhibition screen ([[Summaery Exhibition]], [[Exhibition Deck]]).

Rhetorically it answers the tech-saviour critique in kind: the hero object is a *place*, walkable at eye level — the hub as public space, not an app diagram ([[Hub as Place]], [[Risk — Tech Saviour Critique]]). Its data files (elements, descriptions, views) are exported from the Rhino kit, so the viewer and the drawings can never drift apart ([[Kit-of-Parts]]).

## Connections
- uses [[Rhino Toolpalette Kit]]
- supports [[Hub as Place]]
- part-of [[Exhibition Deck]]
