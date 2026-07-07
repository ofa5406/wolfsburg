---
title: Intermodal Hub Algorithm
type: tool
category: tool
confidence: high
source:
  - web-tool/status.md
tags: [tool, algorithm, siting]
---

# Intermodal Hub Algorithm

The Activity Map's most complex computation — the five-step siting engine behind the hub network ([[Hub Placement Algorithms]]):

**1. Candidates:** every existing bus stop and car-parking location — sites where infrastructure already partially exists. **2. Scoring:** activity within reach — venues within 1,500 m weighted by foot traffic, parks within 500 m, bike parking within 300 m, residential catchment within 300 m ([[Venue Dataset]]). **3. Spreading:** a density filter stops the centre from hoarding — top scorers block rivals within 400 m, mid within 700 m, low within 1,200 m, forcing coverage outward ([[Stadtmitte]]). **4. Merging:** a bus stop and parking site within 200 m fuse into one intermodal hub. **5. Priority:** above-median sites build first ([[Implementation Timeline]]).

The 68-hub count came from running this and classifying results by tier ([[Hub Counts Accepted]]). Its honest edges are tracked: parking-based candidacy sparked the "garages, not hubs" debate ([[Hub System Rethink]]), it cannot currently place central L-Anchors ([[L-Hub Anchor vs Depot]]), and its radii are service ranges, not walking catchments ([[Coverage Radius Mismatch]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- part-of [[Hub Placement Algorithms]]
- produces [[Hub Counts Accepted]]
