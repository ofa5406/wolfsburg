---
title: Rhino MCP Bridge
type: tool
category: tool
confidence: high
source:
  - rhino/README.md
  - rhino/rhino_client.py
tags: [tool, rhino, automation]
---

# Rhino MCP Bridge

The project's hand inside the 3D model: a socket bridge (`rhino/rhino_client.py`, with a PowerShell shortcut) that lets a terminal session — including a Claude working session — **read and edit the live Rhino 8 document**: query objects and layers, run commands, execute RhinoScript/Python, capture viewports. Rhino runs `mcpstart`; the client connects on `127.0.0.1:1999`; `ping` confirms the link.

The bridge is why the project's 3D assets are *reproducible* rather than artisanal: the entire 45-block kit rebuilds from `build_toolpalette.py` ([[Rhino Toolpalette Kit]]), masterplan layers are scriptable ([[Rhino Masterplan]]), and exports for the viewers and maps can be regenerated on demand instead of resurrected from memory ([[Hub Viewer]]).

Methodologically it extends the project's automation stance from analysis into modelling: the same session that computes a coverage score can draw its geometry — the workshop's AI mandate applied where it genuinely compounds, with the human hand kept on design judgment ([[Grasshopper S-Hub Placement]], [[Proof Framework]]).

## Connections
- uses [[Rhino Toolpalette Kit]]
- uses [[Rhino Masterplan]]
- supports [[Proof Framework]]
