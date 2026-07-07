---
title: "Capacity Analysis Method"
type: "method"
status: "generated"
confidence: "medium"
source_path:
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\docs\capacity.md"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\analysis\fleet_calculation.py"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\src\utils\capacityCalc.js"
tags:
  - "method"
  - "capacity"
---

# Capacity Analysis Method

The capacity method chains baseline modal demand, post-car fleet sizing, hub count/footprint, and per-tier allocation.

## Method Chain

`modal_distribution.py -> fleet_calculation.py -> hub_calculation.py -> hub_area.py`

## Risk

Different documents and outputs contain different fleet totals. Use [[Fleet Number Conflict]] before quoting final numbers.
