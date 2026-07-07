---
title: Rad Network Algorithm
type: tool
category: data
confidence: high
source:
  - web-tool/status.md
tags: [tool, algorithm, cycling]
---

# Rad Network Algorithm

The routing engine that draws the cycling network ([[Rad Network]]). It converts Wolfsburg's ~5,000 road segments into a weighted graph — cycleways cost ×0.5 (actively sought), residential streets ×0.7, minor roads ×1.0, secondary ×1.5, primary ×2.0, motorways ×3.0 (avoided) — then runs **Dijkstra pathfinding** between three destination tiers: Order 1 (hubs, Hauptbahnhof, neighbourhood centres), Order 2 (top-30% venues, historic sites), Order 3 (bike parking, bus stops) ([[Wolfsburg Hauptbahnhof]]).

Three route families result: **Type A** arterials from neighbourhood centres to the core, **Type B** hub-to-hub connections (each hub to its three nearest) plus village-to-hub links, **Type C** heritage routes for visitors ([[Hub Tier System]]).

The decisive output is the dashed lines: after routing, every segment is checked for existing protected infrastructure, and unprotected stretches are flagged — **the exact street segments which, if given protected lanes, complete the network**. The dashed map is the cycling investment programme, computed ([[Street Transformation Sections]], [[Active Travel]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- produces [[Rad Network]]
- informs [[Street Transformation Sections]]
