---
title: Fleet Rebalancing
type: concept
category: fleet
confidence: high
source:
  - research/02_mobility-system.md
tags: [operations, dispatch]
---

# Fleet Rebalancing

The repositioning of idle vehicles toward predicted demand — the hidden labour of every shared fleet. Demand is lumpy in space and time; vehicles accumulate where trips end, not where the next trips begin, and someone (an algorithm, in this system) must continuously move them back. The cost appears as [[Deadheading]] — empty vehicle-kilometres, 14–28% of total in MOIA-type simulations.

Wolfsburg's rebalancing advantage is its predictability: the [[VW Shift Wave]] announces tomorrow's biggest demand surge years in advance, and **pre-positioning for a known wave is the cheapest rebalancing there is** — vehicles staged at the corridor's hubs before the whistle, from the [[AV Staging Area]] at L-hubs. Modern dispatch increasingly applies reinforcement learning to the problem; the project's phasing lets algorithms mature alongside the fleet.

## Connections
- part-of [[Hub as Infrastructure]]
- uses [[Deadheading]]
- supports [[Fleet Sizing]]
