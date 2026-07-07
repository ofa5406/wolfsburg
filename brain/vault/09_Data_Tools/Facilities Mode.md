---
title: Facilities Mode
type: tool
category: tool
confidence: high
source:
  - web-tool/status.md
tags: [tool, mode, venues]
---

# Facilities Mode

The Activity Map's destination layer: individual venues as coloured dots — blue education, purple culture, green leisure, amber commercial — whose **size and brightness change with a time slider**. A restaurant at lunch is large and bright; the same dot at 3 a.m. fades. Sliding through the week animates where activity concentrates, hour by hour ([[Wolfsburg Activity Map]]).

The data is team-built: an Excel sheet of venues with addresses, categories and activity hours, geocoded via Nominatim and cached ([[Venue Dataset]]). Set the slider to 7 a.m. on a weekday and the VW commuter surge appears; Friday 6 p.m. lights the leisure cluster ([[VW Shift Wave]]).

Its analytical job is matching supply to demand: hubs belong near where people are actually going, so venue clusters are natural hub candidates and sparse areas argue for S-tier only ([[Intermodal Hub Algorithm]], [[Hub Tier System]]). It is also the project's chrono-urbanism instrument — the city read through time rather than plan, which is the 15-minute city's native analysis ([[Chrono-Urbanism]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- uses [[Venue Dataset]]
- informs [[Intermodal Hub Algorithm]]
