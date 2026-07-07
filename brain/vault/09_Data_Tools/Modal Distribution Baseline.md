---
title: Modal Distribution Baseline
type: dataset
category: tool
confidence: high
source:
  - web-tool/status.md
tags: [dataset, baseline, calculation]
---

# Modal Distribution Baseline

The project's picture of how Wolfsburg moves **today** — the "before" every claim is measured against. Computed by `modal_distribution.py` from the study population (17,400 residents, 18,000 in-commuting workers, 7,080 daily visitors) and national travel-survey shares adjusted for Wolfsburg's car saturation: **62% private car, 20% walking, 10% public transport, 8% cycling** ([[MiD 2017 Travel Survey]], [[Wolfsburg Highest Car Density]]).

Outputs: **104,100 trips per day**, ~64,500 of them by car, requiring ~**49,650 private vehicles in motion daily** at 1.3 occupancy; peak hour 8–9 a.m. with 8,983 trips — 8.6% of the day in sixty minutes ([[Peak Hour Demand]], [[Peaking Factor]]).

Two numbers carry the argument. The 49,650 moving cars set up the comparison the fleet calculation completes — tens of thousands of private vehicles versus a four-digit shared fleet ([[Fleet Calculation Dashboard]]). And the 62-versus-8 car-to-cycling ratio is the gap the whole design programme exists to close ([[Modal Split]], [[Modal Shift]]).

## Connections
- part-of [[Fleet Calculation Dashboard]]
- uses [[MiD 2017 Travel Survey]]
- informs [[Modal Split]]
