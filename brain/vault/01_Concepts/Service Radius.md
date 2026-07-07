---
title: Service Radius
type: concept
category: mobility
confidence: high
source:
  - project/hub_concept_vs_tool.md
tags: [coverage, fleet]
---

# Service Radius

The vehicle-side counterpart of the walking catchment: the distance a hub's *fleet services* can usefully reach — how far a micro-pod ranges from its dock, how large an area an L-hub's maintenance and charging capacity supports. Service radii are properly measured in kilometres where walking catchments are measured in hundreds of metres.

Keeping the two concepts separate is a hard-won project lesson. The web tool's coverage constants (S 500 m, M 2000 m, L 4000 m) are service radii, but were at risk of being read as walking coverage — a category error documented in [[Coverage Radius Mismatch]] and in the concept-versus-tool comparison. The resolution: hubs are *placed* by walking catchments (where people are) and *sized* by service radii (what the fleet must cover), and any coverage map must state which of the two it shows.

## Connections
- contradicts [[Walking Catchment]]
- part-of [[Hub as Infrastructure]]
- informs [[Coverage Radius Mismatch]]
