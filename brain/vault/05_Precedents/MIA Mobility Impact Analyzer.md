---
title: MIA Mobility Impact Analyzer
type: tool
category: precedent
confidence: high
source:
  - research/10_moia-mia-precedent.md
  - https://www.moia.io/en/solutions/mobility-consulting/mia
tags: [precedent, tool, simulation]
---

# MIA Mobility Impact Analyzer

MOIA's simulation-based consulting platform — the professional benchmark for what the project's own web tool aspires to be. MIA lets a city design, test and evaluate a shared-mobility service *before building anything*, through three modules: **Explorer** (draw the service area, overlay demand data), **Simulator** (configure fleet size, vehicle types, wait time, detour allowance; compare scenarios) and **Presenter** (dashboards for non-experts, a present-to-a-room mode). Under the hood runs **MATSim**, the open-source agent-based transport simulation framework, wrapped by Simunto ([[MATSim]]).

Its citable validation case: an MIA study for AMAG in Zurich simulated **600 autonomous vehicles serving ~230,000 weekly trips at a 5-minute average wait and 96% ride acceptance** — independent, VW-ecosystem corroboration of the small-fleet-serves-a-city arithmetic ([[Fleet Sizing]]).

MIA also names the project's honest gap: Wolfsburg's fleet number comes from a static formula, MIA's from agent-based simulation ([[Methodology vs Code Gap]]). The roadmap answer — a MATSim/FleetPy run for the shift-wave scenario — turns the weakness into a stated next step ([[VW Shift Wave Simulation]]).

## Connections
- precedent-for [[Wolfsburg Activity Map]]
- supports [[Fleet Sizing]]
- informs [[VW Shift Wave Simulation]]
- uses [[MATSim]]
