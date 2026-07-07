---
title: Catchment Area
type: concept
category: mobility
confidence: high
source:
  - research/03_transfer-hubs.md
tags: [analysis, geometry]
---

# Catchment Area

The general analytical concept behind the walking catchment: the territory from which a node draws its users, whether measured as a crow-flies radius, a network-distance isochrone, or an observed travel-behaviour zone. The choice of measurement changes results dramatically — a 300 m radius circle ignores severance (railways, canals, arterial roads), while a network isochrone respects the actual walkable paths.

The project uses catchments in two directions. Forward: placing hubs so that catchments tile the city with minimal gaps and acceptable overlap, the optimisation behind the [[Grasshopper S-Hub Placement]] and the tool's placement modes. Backward: auditing the result as [[Hub Coverage]], the share of residents inside any catchment. In the masterplan Rhino file, catchment and effect areas are drawn as explicit geometry layers, making the abstraction visible and checkable.

## Connections
- defines [[Walking Catchment]]
- informs [[Hub Placement Algorithms]]
- uses [[Service Radius]]
