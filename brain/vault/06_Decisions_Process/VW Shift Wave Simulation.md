---
title: VW Shift Wave Simulation
type: tool
category: process
confidence: medium
source:
  - research/10_moia-mia-precedent.md
  - project/current.md
tags: [deliverable, simulation, roadmap]
---

# VW Shift Wave Simulation

The methodological upgrade the project has promised itself: an **agent-based simulation of the shift wave** — each of the ~10,000 workers an agent with an origin, a shift time and mode options — replacing the static division formula with the method professionals use ([[MATSim]], [[Capacity Analysis]]).

The current fleet numbers are first-order analytical estimates; MOIA's MIA platform derives equivalent numbers from MATSim runs, and its AMAG/Zurich study (600 AVs, ~230,000 weekly trips, 5-minute wait, 96% acceptance) is the external validation the project cites in the meantime ([[MIA Mobility Impact Analyzer]]). The gap between the two methods is named openly in the risk register rather than discovered by a juror ([[Methodology vs Code Gap]]).

Scoped honestly: a full MATSim build is out of range before the deadlines, but a single validated scenario — the wave, in MATSim or the lighter FleetPy — is the achievable stretch goal that would let one slide say *simulated*, not *divided* ([[Fleet Sizing]], [[Dispatch Optimiser]]). Until then, the roadmap item itself is the answer: weakness converted to next step.

## Connections
- part-of [[Proof Framework]]
- uses [[MATSim]]
- supports [[Capacity Analysis]]
