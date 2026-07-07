---
title: Coverage Radius Mismatch
type: tension
category: risk
confidence: high
source:
  - decisions.md
  - project/hub_concept_vs_tool.md
tags: [tension, coverage, tool]
---

# Coverage Radius Mismatch

A units mismatch masquerading as a disagreement: the hub typology defines **walking catchments** — L 700–1000 m, M 300–500 m, S 150–250 m, the distances a person walks to reach a hub ([[Service Radius]], [[Walking Catchment]]) — while the web tool draws **service ranges** of L 4000 m and M 2000 m, the distances a *vehicle* can economically serve from a hub base ([[Wolfsburg Activity Map]]).

Both radii are legitimate; they measure different systems (pedestrian access versus fleet logistics) and neither replaces the other. The tension is representational: a map audience reading the tool's 4-kilometre circles as walking catchments would conclude the network is absurdly sparse, and one reading the typology's 250-metre circles as service ranges would conclude it is absurdly dense.

Resolution is labelling, tracked in `tasks.md` from the June 17 debate ([[Hub System Rethink]]): every coverage graphic names its radius type, and the [[Hub Coverage Map]] deliverable draws walking catchments exclusively — since coverage-for-people is what the proof framework promises ([[Proof Framework]], [[Hub Coverage]]).

## Connections
- contradicts [[Service Radius]]
- informs [[Hub Coverage Map]]
- part-of [[Hub System Rethink]]
