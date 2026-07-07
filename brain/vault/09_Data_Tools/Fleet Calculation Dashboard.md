---
title: Fleet Calculation Dashboard
type: tool
category: data
confidence: high
source:
  - web-tool/status.md
tags: [tool, mode, fleet]
---

# Fleet Calculation Dashboard

The Activity Map's Data mode: charts and statistics from the three chained Python calculations that quantify the system ([[Wolfsburg Activity Map]]).

**Calculation A — baseline:** from 17,400 residents, 18,000 workers and 7,080 visitors, with MiD-2017 modal shares adjusted for Wolfsburg (62% car), it derives 104,100 daily trips, ~49,650 private vehicles moving daily, and the 8–9 a.m. peak of 8,983 trips ([[Modal Distribution Baseline]], [[MiD 2017 Travel Survey]]). **Calculation B — fleet:** assuming 60% of short internal trips become walking, peak-hour trips divide by mode capacity and multiply by trip duration, plus 15–35% reserve → **1,273 vehicles** (408 e-bikes, 71 shuttles, 44 buses, 438 micro-pods, 210 EVs) — one shared vehicle per ~39 private cars ([[Fleet Number Conflict]]). **Calculation C — infrastructure:** vehicles per hub tier, ~50/25/15 charging points, footprints of ~600/120/35 m² — a total network footprint near 8,400 m², **under 0.25% of the centre**, against parking's 10%+ ([[Hub Toolpalette]]).

The chain is linked: change the fleet and hub sizing recomputes; move hubs and the cycle network redraws ([[Intermodal Hub Algorithm]], [[Capacity Analysis]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- produces [[Fleet Number Conflict]]
- uses [[MiD 2017 Travel Survey]]
