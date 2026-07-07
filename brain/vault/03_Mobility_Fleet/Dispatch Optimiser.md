---
title: Dispatch Optimiser
type: concept
category: fleet
confidence: high
source:
  - research/02_mobility-system.md
tags: [fleet, software, drt]
---

# Dispatch Optimiser

The invisible sixth mode: the software layer that assigns every trip request to a vehicle and recomputes routes on the fly. Riders request in an app; requests are aggregated into clusters; an optimiser inserts pickups and drop-offs into live vehicle tours while respecting wait-time and detour limits — trading **passenger cost** (waiting, detouring) against **operator cost** (vehicle-kilometres, fleet size).

Modern systems use rolling-horizon insertion heuristics, increasingly assisted by reinforcement learning for dispatch and [[Fleet Rebalancing]]. This is proven technology, not speculation: MOIA runs it daily at city scale in Hamburg ([[MOIA]]), and its simulation research established the density-pooling relationship the Hub City leans on ([[Pooling Efficiency]]).

In the Hub City the optimiser is what makes 763 vehicles behave like many more — every [[Shuttle Pod]] tour braids several passenger trips, every [[Micro-Pod]] is released to its next rider seconds after docking, and the [[Charging Window Strategy]] feeds on its demand forecasts to choose when each vehicle can afford to charge. The [[Mobility as a Service]] app is its public face.

## Connections
- part-of [[Fleet]]
- implements [[Demand-Responsive Transit]]
- uses [[Pooling Efficiency]]
- produces [[Fleet Rebalancing]]
