---
title: Venue Dataset
type: dataset
category: tool
confidence: high
source:
  - web-tool/status.md
tags: [dataset, venues, team-built]
---

# Venue Dataset

The team's own data contribution: an Excel-maintained inventory of Wolfsburg's venues — name, address, category (education, culture, leisure, commercial) and **activity hours**: which days and times each place is actually busy. Addresses geocode via Nominatim (OpenStreetMap's official geocoder) with a local cache ([[OpenStreetMap Data]]).

The activity-hours column is what makes the dataset more than a POI list. It gives the Facilities Mode its time dimension — dots that swell at lunch and fade at midnight ([[Facilities Mode]]) — and it feeds foot-traffic weights into the hub algorithm's scoring, so hub candidacy responds to *when and how much* a place is used, not merely that it exists ([[Intermodal Hub Algorithm]]).

Methodologically it is the project's admission that not everything worth knowing is in open data: opening hours and busyness required local judgment, collected by hand. The brain flags its subjectivity honestly — the weights are team estimates, tunable, and documented as assumptions in the proof discipline ([[Proof Framework]], [[Chrono-Urbanism]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- informs [[Facilities Mode]]
- informs [[Intermodal Hub Algorithm]]
