---
title: Dijkstra's Algorithm
type: deepdive
category: theory
confidence: high
source:
  - https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
tags: [mathematics, algorithm, routing]
---

# Dijkstra's Algorithm

The twenty-minute idea that routes the world. Edsger W. Dijkstra conceived his shortest-path algorithm in 1956 — famously over coffee in an Amsterdam café, without pencil or paper, as a demonstration problem for a new computer: *what is the shortest way to travel from Rotterdam to Groningen?* Published in 1959, three pages. It remains the foundation of network routing — Google Maps' ancestors, internet packet routing, and every navigation system descend from it.

The mechanism suits cities because it is honest about them: it explores the **actual network** outward from the origin, always extending the cheapest known path — no straight-line shortcuts, no wishful geometry. Cost need not be distance: weight the edges by bike-friendliness and the "shortest" path becomes the *safest comfortable* one — precisely how the project's cycling engine routes, detouring hundreds of metres to stay on protected infrastructure ([[Rad Network Algorithm]], [[Rad Network]]).

Its presence in the brain marks the project's methodological continuity: the same graph mathematics from Euler's bridges ([[Seven Bridges of Königsberg]]) through Dijkstra's café to the [[Dispatch Optimiser]]'s live routing.

## Connections
- part-of [[Rad Network Algorithm]]
- informs [[Dispatch Optimiser]]
- mentions [[Seven Bridges of Königsberg]]
