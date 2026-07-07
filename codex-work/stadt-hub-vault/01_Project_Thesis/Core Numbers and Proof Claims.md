---
title: "Core Numbers and Proof Claims"
type: "claim-index"
status: "generated"
confidence: "medium"
source_path:
  - "D:\vibe_lab\wolfsburg\decisions.md"
  - "D:\vibe_lab\wolfsburg\HANDOFF.md"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\analysis\outputs\results_fleet.csv"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\analysis\outputs\results_baseline.csv"
tags:
  - "numbers"
  - "proof"
  - "risk"
---

# Core Numbers and Proof Claims

## Locked Design Numbers

- 68 hubs total: 6 Large, 19 Medium, 43 Small.
- Locked fleet in `decisions.md`: 763 vehicles total.
- Locked fleet composition: 131 e-bikes, 55 shuttle pods, 33 autonomous buses, 369 micro-pods, 175 shared EVs.
- 5-zone Groningen-style filtered permeability model.
- VW factory-gate hub is the primary case study.

## Analysis Output Numbers

- `results_baseline.csv`: 104,100 trips/day; 49,647.69 car vehicles/day; peak 08:00 around 8,983 trips.
- `results_fleet.csv`: e-bikes 641, shuttles 55, buses 33, pods 369, car-share EVs 175, total 1,273.
- `results_hub_summary.csv`: Hub L 6, Hub M 19, Hub S 43, with per-hub footprints and charging estimates.

## Interpretive Status

The 68 hub count is stable across design decisions and analysis outputs. The fleet total is not stable. Treat [[Fleet Number Conflict]] as an unresolved evidence issue before public or jury-facing claims are reused.

## Related

- [[Fleet Number Conflict]]
- [[Capacity Analysis Method]]
- [[Wolfsburg Activity Map]]
