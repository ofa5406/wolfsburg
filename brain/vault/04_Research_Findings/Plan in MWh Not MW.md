---
title: Plan in MWh Not MW
type: finding
category: evidence
confidence: high
source:
  - research/08_future-projections.md
  - https://www.automotive-fleet.com/10232588/how-to-calculate-power-demand-for-your-ev-depot
tags: [energy, charging, method]
---

# Plan in MWh Not MW

The fleet-electrification planning principle that collapses grid anxiety: utilities care about **energy across a dwell window, not instantaneous peak power**. A depot that needs 40 MWh overnight is a routine industrial customer; the same energy demanded as simultaneous fast-charging peaks reads as a grid emergency. In one documented case, sharing the actual plug-in schedule with the utility cut a fleet's grid build-out forecast **from three years to three months**.

The Hub City's operation is built for exactly this discipline. Vehicles charge at the six L-hub depots during the predictable troughs between shift waves and overnight ([[Charging Window Strategy]]); the dispatch system knows every vehicle's state of charge and dwell schedule ([[Dispatch Optimiser]]); and managed charging can shift load away from grid peaks or even feed back (V2G) when the price is right.

The argument to quote: a shared, depot-charged, schedule-disciplined fleet is **far gentler on the grid** than the same trips served by privately owned, home-charged EVs plugging in at random ([[Fleet Energy in Tens of MWh]]).

## Connections
- supports [[Charging Window Strategy]]
- supports [[EV Fleet Charging at Scale]]
- informs [[Electric Mobility]]
