---
title: Modal Split
type: concept
category: mobility
confidence: high
source:
  - research/02_mobility-system.md
  - web-tool/status.md
tags: [metrics, data]
---

# Modal Split

The percentage distribution of trips across transport modes — the standard scoreboard of urban mobility. Germany's national travel survey (MiD 2017) provides the baseline data the project calibrates against; Wolfsburg's split is unusually car-heavy even by German standards, consistent with the highest car-ownership density in the country ([[Wolfsburg Highest Car Density]]).

In the project's capacity model, the target split for the central districts drives everything downstream: the [[Modal Distribution Model]] allocates the ~100,000 daily trips among walking, cycling, public transport and the shared fleet; the fleet share then determines vehicle counts through the [[Fleet Sizing]] chain. The modal split is thus the single assumption that most deserves scrutiny — which is why it is stated openly as a scenario ("what must be true for 763 vehicles to suffice") rather than smuggled in as a prediction.

## Connections
- produces [[Fleet Sizing]]
- uses [[Modal Distribution Model]]
- informs [[Capacity Analysis]]
