---
title: Capacity Analysis
type: tool
category: process
confidence: high
source:
  - research/02_mobility-system.md
  - research/07_weak-points-actions.md
tags: [deliverable, fleet, appendix]
---

# Capacity Analysis

The one-page appendix that neutralises the project's most dangerous question — *"763 vehicles for 100,000 trips: did you just make that up?"* A table, rows per vehicle class, columns for count, assumed peak trips per vehicle-hour, occupancy and hourly capacity, summing to ≥9,000 trips in the peak hour ([[Peak Hour Demand]], [[Trips per Vehicle per Day]]).

The analysis states the scary number itself before anyone discovers it: 131 trips/vehicle/day fleet-average — twenty times free-floating car-share utilisation (~6.5) — and then shows why it holds: the average is carried by high-cycle micro-modes and pooled high-occupancy trunk vehicles, not by cars doing taxi arithmetic ([[Modal Distribution Model]], [[Pooling Efficiency]]).

It also fixes the double-counting trap: residents, workers and visitors are person-pools, not trip-pools — many VW workers *are* residents — so demand is derived from trip rates per group with overlaps removed, stated on the page ([[Demand Basis]]). Every assumption is labelled an assumption; the upgrade path to agent-based simulation is named, not hidden ([[VW Shift Wave Simulation]], [[Methodology vs Code Gap]]).

## Connections
- part-of [[Proof Framework]]
- uses [[Fleet Sizing]]
- supports [[Shift Wave Capacity Check]]
