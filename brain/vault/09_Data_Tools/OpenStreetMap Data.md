---
title: OpenStreetMap Data
type: dataset
category: tool
confidence: high
source:
  - web-tool/status.md
tags: [dataset, osm, live]
---

# OpenStreetMap Data

The geographic substrate of the whole toolchain: the Activity Map fetches Wolfsburg live from **OpenStreetMap via the Overpass API** — bus stops, car and bike parking, the ~5,000-segment road network, footways, cycling routes, and every green and water feature — each time a mode opens, so the analyses run on current data rather than a frozen extract ([[Wolfsburg Activity Map]]).

District boundaries for the 44 Stadtteile are the one pre-processed layer, held as GeoJSON ([[Wolfsburg Districts]]); venues come from the team's own dataset ([[Venue Dataset]]); base tiles from CARTO.

The choice is methodological as much as practical. Open data makes the analyses **reproducible and inspectable** — a juror can check any input on osm.org — which suits a project whose epistemic stance is "name the assumption, show the source" ([[Proof Framework]]). It is the same open-models posture MOIA cites for its MATSim foundation ([[MATSim]]). The trade-off is OSM's unevenness: completeness varies by feature type, and the brain treats OSM-derived counts as good relative signals rather than survey-grade absolutes ([[Mobility Mode]]).

## Connections
- part-of [[Wolfsburg Activity Map]]
- supports [[Proof Framework]]
- informs [[Wolfsburg Districts]]
