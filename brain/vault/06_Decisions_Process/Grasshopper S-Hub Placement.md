---
title: Grasshopper S-Hub Placement
type: decision
category: process
confidence: high
source:
  - decisions.md
tags: [decision, june-11, algorithm]
---

# Grasshopper S-Hub Placement

Locked June 11, 2026: the **43 S-hubs are placed algorithmically in Grasshopper** (Rhino's parametric design environment), while L- and M-hubs are designed manually. Tutors recommended exactly this split.

The reasoning is scale-honest: manually siting 43 fine-grain locations would consume weeks and still be arbitrary; an algorithm can optimise for coverage, walking distance and density, and re-run instantly when inputs change ([[Hub Placement Algorithms]]). The manual tiers are where design judgment matters most — six adaptive-reuse anchors and nineteen neighbourhood hubs each negotiate a specific context ([[L-Hub]], [[M-Hub]]).

The decision is also the project's honest answer to the studio's AI mandate: computation where it genuinely outperforms the hand (repetitive spatial optimisation), the hand where it doesn't (place design) — a division of labour, not decoration ([[Proof Framework]]).

The web tool implements a related but different placement logic from existing parking data, a divergence the brain tracks separately ([[Intermodal Hub Algorithm]], [[Methodology vs Code Gap]]).

## Connections
- part-of [[Hub Placement Algorithms]]
- informs [[S-Hub]]
- uses [[Rhino Toolpalette Kit]]
