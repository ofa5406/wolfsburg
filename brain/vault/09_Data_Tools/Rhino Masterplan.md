---
title: Rhino Masterplan
type: tool
category: data
confidence: high
source:
  - project/rhino_masterplan.md
  - project/current.md
tags: [tool, rhino, masterplan]
---

# Rhino Masterplan

The project's spatial master file: `wolfsburg_masterplan.3dm`, holding the city-scale design as layered geometry — the **road hierarchy cleaned into five access tiers**, all 68 **hub points placed and intersected with the street network**, hub **catchment and effect areas** drawn, and **acquired-land / development zones** marked (state as of June 20, 2026; full layer reference in `project/rhino_masterplan.md`).

The masterplan is where the computational and manual siting strands land in one geometry: the algorithm's candidates ([[Hub Placement Algorithms]]), the Grasshopper S-grain ([[Grasshopper S-Hub Placement]]), and the manually designed M and L anchors, all intersected with the five-tier street structure that encodes the zone logic ([[Five-Zone Model]]).

Two proof deliverables are exports-in-waiting from these layers: the [[Hub Coverage Map]] (catchment areas exist, need export) and the [[Car-Land Composite Map]] (car-land layers exist, need the composite). The file is driven from the terminal through the Rhino bridge ([[Rhino MCP Bridge]]), and hub instances come from the kit ([[Rhino Toolpalette Kit]]).

## Connections
- produces [[Hub Coverage Map]]
- produces [[Car-Land Composite Map]]
- uses [[Rhino Toolpalette Kit]]
