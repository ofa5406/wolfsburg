---
title: Fleet Sizing
type: concept
category: fleet
confidence: high
source:
  - research/02_mobility-system.md
  - decisions.md
tags: [math, proof, core]
---

# Fleet Sizing

The quantitative heart of the proof: the argument that **763 vehicles can plausibly serve ~100,000 trips per day**. The chain runs: demand basis (17k residents + 18k workers + 17k visitors → [[Daily Trip Demand]]) → target modal split ([[Modal Distribution Model]]) → per-mode trip loads → vehicle counts at realistic cycle rates ([[Trips per Vehicle per Day]]) → stress test against the worst hour ([[Peak Hour Demand]] and the [[VW Shift Wave]]).

The claim is anchored as *conservative* against the literature: the OECD/ITF Lisbon simulation delivered a city's trips with ~3% of its car fleet ([[ITF Lisbon Study]]), and real car-sharing replaces ~11 private cars per shared one. The sizing formula was accepted by tutors on June 11 ([[Fleet Sizing Formula Accepted]]). Its stated operating conditions — good pooling, working rebalancing, adequate charging windows, an integrated MaaS layer — are named openly, and the diverging web-tool figure is tracked as [[Fleet Number Conflict]].

## Connections
- part-of [[Proof Framework]]
- uses [[Trips per Vehicle per Day]]
- uses [[Daily Trip Demand]]
- produces [[Fleet]]
