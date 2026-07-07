---
title: Rhino Toolpalette Kit
type: tool
category: data
confidence: high
source:
  - project/rhino_toolpalette.md
  - rhino/build_toolpalette.py
tags: [tool, rhino, kit]
---

# Rhino Toolpalette Kit

The hub system's physical vocabulary, built: `toolpalette.3dm`, the Rhino file in which **all 45 hub elements are modelled as reusable blocks on material-based layers** — pavement, concrete, metal, wood, glass, plastic, greenery, lighting — with a labelled palette catalogue and three sample hub scenes (S, M, L) standing in street context ([[Hub Toolpalette]], [[Kit-of-Parts]]).

The kit is the design method made file: one element modelled once, instanced everywhere, so 68 context-specific hubs stay one recognisable system — the same modular strategy West Midlands and Copenhagen run in built form ([[West Midlands Local Travel Points]], [[System Identity]]). The material layer structure is itself design intelligence: it encodes the palette's material logic ([[Material — Wood]], [[Material — Concrete]]) and drives consistent rendering everywhere the kit appears.

It is rebuildable from script (`rhino/build_toolpalette.py`) via the Rhino bridge ([[Rhino MCP Bridge]]), and it exports downstream: the [[Hub Viewer]]'s 3D data, the typology drawings, and the masterplan's hub instances all derive from these blocks ([[Rhino Masterplan]]).

## Connections
- implements [[Kit-of-Parts]]
- produces [[Hub Viewer]]
- supports [[Hub Toolpalette]]
