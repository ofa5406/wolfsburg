---
title: Risk — Fleet Math Challenged
type: risk
category: risk
confidence: high
source:
  - research/07_weak-points-actions.md
tags: [risk, fleet, red]
---

# Risk — Fleet Math Challenged

The quantitative gotcha at the heart of the proof: *"763 vehicles for 100,000 trips a day — did you make that up? And aren't residents, workers and visitors partly the same people?"* If the ratio is indefensible, the whole quantified case collapses — and a jury with one transport modeller will probe it.

The exposure is real: 131 trips/vehicle/day fleet-average is twenty times typical car-share utilisation (~6.5). The number only holds because high-cycle micro-modes carry the trip count and pooled trunk vehicles carry the passenger volume — which means the defence is to **publish the per-mode arithmetic ourselves** ([[Capacity Analysis]], [[Trips per Vehicle per Day]], [[Modal Distribution Model]]).

The double-counting trap has a specific fix: person-pools are not trip-pools — many VW workers *are* residents — so demand derives from trip rates per group with overlaps removed, stated explicitly ([[Demand Basis]]). The deeper methodological exposure (formula, not simulation) is named openly and converted into the roadmap ([[Methodology vs Code Gap]], [[VW Shift Wave Simulation]]). Related but distinct: the tool and the docs carry two different fleet totals ([[Fleet Number Conflict]]).

## Connections
- part-of [[Risk Register]]
- informs [[Capacity Analysis]]
- informs [[Fleet Sizing]]
