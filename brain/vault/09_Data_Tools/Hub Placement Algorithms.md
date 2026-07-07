---
title: Hub Placement Algorithms
type: tool
category: tool
confidence: high
source:
  - web-tool/status.md
  - decisions.md
tags: [tool, algorithms, umbrella]
---

# Hub Placement Algorithms

The umbrella over the project's two computational siting methods — different engines, different tiers, one network.

The **Activity Map's intermodal algorithm** works from existing infrastructure: bus stops and parking sites scored by surrounding activity, spread by density filters, merged into intermodal candidates ([[Intermodal Hub Algorithm]]). It produced the evidence base for the 68-hub count ([[Hub Counts Accepted]]). The **Grasshopper placement** works from coverage geometry: the 43 S-hubs distributed parametrically for walking-distance and density targets inside Rhino, per the June 11 decision ([[Grasshopper S-Hub Placement]], [[Rhino Toolpalette Kit]]).

The division of labour is deliberate: the web algorithm asks *where does activity justify a hub*, the parametric one asks *where must a hub stand so no one is far from one* — demand logic for the M/L anchors, coverage logic for the S grain ([[Hub Tier System]], [[Walking Catchment]]).

Their disagreements are project knowledge too: the parking-based candidacy debate and the radius mismatch both live in the risk ledger ([[Hub System Rethink]], [[Coverage Radius Mismatch]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- uses [[Grasshopper S-Hub Placement]]
- produces [[Hub Coverage Map]]
