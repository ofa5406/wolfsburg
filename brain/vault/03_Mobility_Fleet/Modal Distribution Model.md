---
title: Modal Distribution Model
type: tool
category: fleet
confidence: high
source:
  - web-tool/status.md
  - wolfsburg-activity-map/analysis/modal_distribution.py
tags: [model, python, modal-split]
---

# Modal Distribution Model

The first stage of the capacity-analysis chain: a Python model (`modal_distribution.py` in the activity-map repo) that allocates the ~100,000 daily trips across modes — walking, cycling, public transport, and each shared-fleet class — from the demand basis and target modal split. Its output CSV (`results_baseline.csv`) feeds the fleet calculation downstream.

The model is where the project's most consequential assumption lives: the post-car modal split is a *scenario*, chosen and stated, not a prediction. Everything downstream — [[Fleet Sizing]], hub loading, charging demand — inherits it, which is why the model is kept as executable code rather than a spreadsheet: the whole chain re-runs when the assumption moves, and the assumption is visible to anyone who reads the source.

## Connections
- part-of [[Capacity Analysis]]
- produces [[Fleet Sizing]]
- uses [[Modal Split]]
