---
title: "Hub Placement Method"
type: "method"
status: "generated"
confidence: "medium"
source_path:
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\src\utils\intermodalAlgorithm.js"
  - "D:\vibe_lab\wolfsburg\wolfsburg-activity-map\src\utils\hubLMAlgorithm.js"
  - "D:\vibe_lab\wolfsburg\project\hub_concept_vs_tool.md"
tags:
  - "method"
  - "hub-placement"
---

# Hub Placement Method

There are two implemented hub-placement logics: an intermodal bus/car candidate algorithm and an L/M parking-derived algorithm. They do not fully match the public methodology narrative.

## Implemented Logic

- Intermodal algorithm scores bus stops and car parking by nearby facilities, parks, bike parking, and residential zones, then density-thins and merges nearby bus/car pairs.
- Hub L/M algorithm selects multi-storey/garage and underground parking candidates by estimated area and distribution score.
- S-hub generation is closer to bus-stop/intermodal logic than parking logic.

## Related

- [[Methodology Versus Implemented Code]]
- [[Hub System Concept Versus Tool]]
