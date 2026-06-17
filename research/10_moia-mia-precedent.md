# 10 — MOIA & MIA: The Volkswagen Ridepooling Precedent

*Auto-research of MOIA (Volkswagen's ridepooling subsidiary) and its **Mobility Impact Analyzer (MIA)** simulation platform — and what it gives the Post-Car Wolfsburg project. Built: 2026-06-17.*

> **Why this document is unusually important.** MOIA is **owned by the Volkswagen Group**. Wolfsburg is **Volkswagen's headquarters and company town**. That means the single biggest "weak point" in our project — *"a post-private-car proposal is politically impossible in a VW company town"* — is partly answered by VW itself: its own subsidiary is building, simulating, and now **licensing to cities** exactly the autonomous shared-fleet future our project describes. This is not a competitor to argue against; it is an **ally precedent to stand on**. Read this alongside [`07_weak-points-actions.md`](07_weak-points-actions.md) and [`02_mobility-system.md`](02_mobility-system.md).

---

## 1. What MOIA is (the facts)

| | |
|---|---|
| **What** | Europe's largest public-transport **on-demand ridepooling** service |
| **Owner** | **Volkswagen Group** (MOIA is a VW Group company) |
| **Operates** | Hamburg (and historically Hanover); ~11M+ rides to date |
| **Network** | 12,500+ "virtual stops" (10,000 wheelchair-accessible) — *digital* stops, not built infrastructure |
| **App rating** | 4.8/5 on both app stores |
| **Vehicle** | Moving to the **VW ID. Buzz AD** — the *autonomous-drive* version of the ID. Buzz, co-developed with VW Commercial Vehicles |
| **Direction** | Shifting from running its own consumer service → **B2B: licensing a turnkey ridepooling system to cities and local transit operators** |

**The mission line, in their words:** mobility that is *"safe, autonomous, and driven by cities and their people,"* and *"autonomous ridepooling can make a decisive contribution to closing the gap between individual and public transport."*

That sentence is essentially our thesis written by Volkswagen.

---

## 2. MIA — the Mobility Impact Analyzer (the part most relevant to our web tool)

MIA is MOIA's **simulation-based consulting platform**: a self-service tool that lets a city design, test and evaluate a shared/ridepooling service **before building anything**. It is the closest existing thing to what our **Wolfsburg Activity Map** is trying to be.

### 2.1 The three modules (this is a model for our tool's architecture)

| MIA module | What it does | Our nearest equivalent |
|---|---|---|
| **Explorer** | Analyses regional mobility demand; lets the user draw the **study boundary / service area** and overlay data layers (population density, POIs, transit) | Our *Strategy* + *Facilities/Greenery* layers + service-area selection (**we don't really have boundary-drawing yet**) |
| **Simulator** | Configure **fleet size, service area, vehicle types, max wait time, detour allowance** → run scenarios | Our *Data* mode (fleet sizing) — but ours is a **static formula**, not a scenario sandbox (**biggest gap**) |
| **Presenter** | Interactive dashboards + graphics for **non-experts**, plus a "presenter mode" for sharing with a room | Our charts; we lack a clean **present-to-jury** mode |

### 2.2 The three-step user workflow (clean narrative we can borrow)

1. **Design the service area** — pick the geography, overlay the data that matters.
2. **Test scenarios** — change wait time, detour ratio, fleet size; generate and **compare** multiple scenarios.
3. **Analyze findings** — read out what shared mobility could *realistically* deliver here.

> **Why this matters to us:** this is the exact rhetorical arc a jury wants — *define the place → test the system → show it works*. Our current tool jumps between 7–8 analytical modes; MIA shows the value of a **single guided "draw → simulate → read result" spine**.

### 2.3 What MIA is built on (credibility + a real upgrade path for us)

- **MATSim** — the open-source, **agent-based** transport simulation framework (each traveller is an agent with a daily plan). This is the scientific engine under MIA.
- **Simunto** — MOIA's partner that wraps MATSim so non-experts can use it.
- MOIA describes the foundation as *"scientifically proven, open-source models"* and stresses **open data**.

> **The gap this exposes in our work (important, honest):** our fleet number (1,273 vehicles) comes from a **static division formula** (peak trips ÷ capacity × duration + reserve). MIA's equivalent number comes from an **agent-based simulation**. A sharp juror may ask *"did you simulate the system, or just divide?"* We don't need to build MATSim — but we should (a) **name the methodology gap before they do**, and (b) **cite MIA/MATSim results as external validation** of our order-of-magnitude. See §4.

### 2.4 The validation case study we can cite (gold)

**AMAG, Zurich — autonomous ridepooling simulated in MIA:**
- **600 autonomous vehicles** serve **~230,000 weekly trips**
- **5-minute** average wait time
- **96%** ride-acceptance rate

This is an **independent, VW-ecosystem, peer-of-our-claim** number. It corroborates our central proof — that a *small shared fleet replaces a huge private one* — using a real consulting study rather than our own arithmetic. (230k weekly ≈ ~33k daily trips on 600 AVs; the order of magnitude is squarely in line with our "1 shared vehicle ≈ 39 private cars.")

---

## 3. The strategic gift: MOIA defuses our hardest weak points

Cross-reference `07_weak-points-actions.md`. MOIA gives us a concrete counter to **three** of the toughest jury objections:

| Jury objection | MOIA-based counter |
|---|---|
| *"Autonomous shared fleets are sci-fi / not real."* | VW's own subsidiary already runs Europe's largest on-demand pooling service and is deploying the **ID. Buzz AD**. The tech is productised, not speculative. |
| *"In a VW company town, killing the private car is political suicide."* | VW is **itself** pivoting to shared/autonomous mobility-as-a-service. Our plan aligns Wolfsburg with **its own flagship company's stated strategy** — it's pro-VW, not anti-VW. (Reframes the whole company-town narrative from threat → home-advantage.) |
| *"Who would operate and pay for all this?"* | MOIA's **new licensing model** sells cities a **turnkey** ridepooling system: software (booking app, demand forecasting, dynamic pricing, fleet management), service-design consulting, and vehicle integration. Wolfsburg wouldn't have to invent an operator — there's a ready B2B pathway, headquartered next door. |

**Reframe to adopt:** *Wolfsburg isn't a risky place to try post-car mobility — it is the **single most logical pilot city in the world** for it, because the company building the vehicles, the software, and the operating model is headquartered there.* That is a genuinely strong, defensible competition narrative.

---

## 4. Strategies that fall out of this research

### A. Narrative / competition strategy
1. **Adopt the "home-advantage" frame.** Make VW/MOIA the *protagonist's employer and enabler*, not the antagonist. The ID. Buzz AD can literally be the vehicle Anna rides to the factory gate — a real VW product, built in the region.
2. **Borrow MIA's three-beat arc for the presentation spine:** *Define Wolfsburg → Simulate the hub system → Read the proof.* Mirrors how professional mobility consultants pitch cities; reads as rigorous.
3. **Cite the AMAG/Zurich numbers** as third-party validation next to our own fleet math — "our formula says X; an independent MIA study in Zurich found a comparable ratio."
4. **Name our methodology honestly:** state that our fleet figure is a **first-order analytical estimate**, and that the professional-grade next step is an **agent-based simulation (MATSim/FleetPy)** — turning a weakness into a credible roadmap item rather than a hidden flaw.

### B. Web-tool strategy (Wolfsburg Activity Map)
5. **Add a "service-area draw" step** (MIA Explorer): let the user define/See the operating zone instead of always city-wide. Even a fixed 5-zone toggle reads as "service area design."
6. **Turn the Data mode into a mini-Simulator** (MIA's core): expose 3 sliders — **fleet size, max wait time, walking-conversion %** — and recompute fleet/coverage live. This is the highest-impact single upgrade; it converts our static dashboard into a *scenario sandbox* and directly mirrors MIA.
7. **Add a "Presenter" view:** one clean, full-screen, low-text scenario readout for June 25 / Summaery (where there is **no narrator** — exactly MIA's presenter use case).
8. **Vocabulary alignment:** adopt MIA's parameter language in our UI — *service area, fleet size, max wait time, detour ratio, acceptance rate, service quality vs. economic viability vs. policy goals.* It signals professional literacy to the jury.

### C. Methodology strategy (optional, only if time allows after June 25)
9. **Spike a MATSim or FleetPy run** for one scenario (the VW shift wave) to produce a single agent-based number we can stand behind. See §6 for the toolchain. *Scope this as post-June-25 / Aug-16 stretch, not a critical-path item.*

---

## 5. New tasks this research generates

Added to `tasks.md`. Summary here:

- [ ] **Add the MOIA "home-advantage" frame** to the competition narrative + `research/06_arguments-evidence.md` (VW subsidiary already building this; Wolfsburg = ideal pilot). *High leverage, low effort.*
- [ ] **Add MOIA counters** to the three weak points in `research/07_weak-points-actions.md` (AV-realism, VW-politics, who-operates-it). *High leverage, low effort.*
- [ ] **Cite AMAG/Zurich (600 AVs / 230k weekly trips / 5-min / 96%)** next to our fleet math as third-party validation. *Low effort.*
- [ ] **Web tool: prototype a "Simulator" panel** — 3 live sliders (fleet size, max wait, walking-conversion %) recomputing fleet + coverage. *Medium effort, highest tool value.*
- [ ] **Web tool: add a "service-area" definition step** (Explorer-style) and a clean **Presenter** full-screen scenario view for unattended exhibition. *Medium effort.*
- [ ] **Adopt MIA parameter vocabulary** across tool UI + presentation. *Low effort.*
- [ ] *(Stretch, post-June-25)* **Run one agent-based scenario in MATSim/FleetPy** (VW shift wave) for a defensible simulated fleet number. *High effort.*

---

## 6. Other similar sources — the tool & methodology landscape

What else exists, what it offers, and what **we** can take from it. Grouped by how directly we can use it.

### Tier 1 — Directly usable methodology engines (open-source)

| Tool | What it is | What it offers us | What to obtain |
|---|---|---|---|
| **MATSim** | Java, **agent-based** multimodal day-simulation; the engine *under MIA* | The credible way to actually *simulate* (not divide) our fleet; same tool the pros use | A single validated VW-shift scenario number; methodology language to cite |
| **FleetPy** (TU München) | Modular **open-source** mobility-on-demand / ridepooling fleet simulator | Purpose-built for *exactly* our question (pooling + fleet control); lighter than full MATSim | A fleet-sizing sanity-check run for our 763/1,273 vehicle figure |
| **SUMO** (DLR) | Microscopic, free traffic sim (cars, transit, bikes, pedestrians, AVs) | Street-level animation of the shift wave / a corridor; good for *visuals* | A rendered before/after corridor or peak-hour flow clip for the presentation |
| **BEAM** (LBNL Berkeley) | Agent-based regional model with pooling + repositioning algorithms | Reference for repositioning logic (how empty pods rebalance to hubs) | Concepts/diagrams on fleet repositioning between hubs |

### Tier 2 — Shared-mobility / e-mobility simulators (research-grade)

| Tool | What it offers us | What to obtain |
|---|---|---|
| **ODySSEUS** (Politecnico di Torino) | Origin-Destination simulator of **shared e-mobility** using real city data; easy framework | A quick shared-EV/e-bike utilisation estimate for our 175 EVs / 408 e-bikes |
| **CityMoS** | Agent-based microscopic sim focused on **mixed human + autonomous** driving | Evidence/visuals on how AVs and human drivers coexist in transition phases |
| **OpenCAMS** | Open connected-and-automated-mobility co-simulation platform | Reference only — for the AV-realism argument |

### Tier 3 — Professional / commercial planning platforms (for vocabulary & credibility, not for us to run)

| Tool | What it offers us |
|---|---|
| **MOIA MIA** | The benchmark we're modelling our tool's *story* on (Explorer/Simulator/Presenter) |
| **Bentley OpenPaths** | Industry transport-planning suite — shows what "serious" planning output looks like (useful as an aesthetic/format reference for our dashboards) |
| **PTV Visum / Vissim** (industry standard, not in search but worth knowing) | The German-standard macro/micro modelling tools city planners use — naming them signals we know the field |

### Tier 4 — Evidence & precedent reading (numbers, not tools)

| Source | What to obtain |
|---|---|
| MOIA blog: *Mobility Impact Analyzer* | The MIA workflow + AMAG Zurich numbers (already extracted above) |
| MOIA blog: *Autonomous Ridepooling Across Germany: A Simulation* | National-scale AV ridepooling figures — potential macro context for our claims |
| MATSim **"Show Case: MOIA"** (matsim.org/examples/moia) | Proof MOIA runs on MATSim; a citable methodological anchor |
| Sapio/MDPI *"Rethinking Pooled Ride-Hailing… System Limits"* | The **counter-evidence** — where pooling underperforms. Read it so we can pre-empt the skeptical juror, not just cite the optimistic side. |

---

## 7. The honest caveats (so we don't over-claim)

- **Virtual stops ≠ our physical hubs.** MOIA's model deliberately uses *digital* curbside stops and **no built infrastructure** — the opposite of our hub-as-architecture thesis. We must be clear our contribution is the **spatial/architectural** layer (hubs, reclaimed land, urban form) that MOIA's operational model **does not address**. MOIA validates the *fleet/operations*; *we* design the *city*.
- **MOIA operates in dense Hamburg**, with a mature transit spine. Wolfsburg is lower-density and car-saturated; transfer is not automatic. Acknowledge it.
- **AMAG/Zurich is a simulation, not a deployment** — strong directional evidence, not a built proof. Cite it as such.
- MIA's exact engine is named in MOIA's *blog* (MATSim + Simunto) but not on the product page — cite the blog, not the product page, for that claim.

---

## How to use this in the project

- **June 25 (studio final):** Pull the **home-advantage frame** (§3) into the opening; add the **AMAG/Zurich validation** beside the fleet slide; if time allows, ship the **Simulator slider panel** (§4 B6) so the tool *demonstrates* scenarios live instead of showing a fixed number.
- **July 9–12 (Summaery, unattended):** Build the **Presenter view** (§4 B7) — MIA's presenter mode is designed for exactly this no-narrator situation.
- **Aug 16 (competition):** Lead the narrative with *"Wolfsburg is the world's most logical pilot for post-car mobility"* (§3), backed by MOIA/VW. Add the **methodology-roadmap** honesty (§4 A4) so the jury reads rigour, not hand-waving.
- **Defending the tool/fleet math:** §2.3 + §4 A4 are your script for the "did you simulate or just divide?" question.

---

## Sources

- [MOIA — homepage](https://www.moia.io/en)
- [MOIA — Mobility Consulting](https://www.moia.io/en/solutions/mobility-consulting)
- [MOIA — MIA (Mobility Impact Analyzer) product page](https://www.moia.io/en/solutions/mobility-consulting/mia)
- [MOIA blog — *Mobility Impact Analyzer: How simulations pave the way for the future of mobility*](https://www.moia.io/en/blog/mobility-impact-analyzer)
- [MOIA blog — *Autonomous Ridepooling Across Germany: A Simulation*](https://www.moia.io/en/blog/autonomous-ridepooling-germany-simulation)
- [MOIA news — *New licensing model: MOIA opens ridepooling ecosystem to cities and local transport operators*](https://www.moia.io/en/news/new-licensing-model-moia-opens-ridepooling-ecosystem-to-cities-and-local-transport-operators)
- [Volkswagen Group — same licensing announcement](https://www.volkswagen-group.com/en/articles/new-licensing-model-moia-opens-ridepooling-ecosystem-to-cities-and-local-transport-operators-17664)
- [MATSim — *Show Case: MOIA*](https://matsim.org/examples/moia/)
- [FleetPy — *A Modular Open-Source Simulation Tool for Mobility On-Demand Services* (arXiv)](https://arxiv.org/pdf/2207.14246)
- [SUMO — Simulation of Urban Mobility (SourceForge)](https://sourceforge.net/projects/sumo/)
- [BEAM — Behavior, Energy, Autonomy, and Mobility (LBNL)](https://transportation.lbl.gov/beam)
- [ODySSEUS — Origin-Destination Simulator of Shared e-mobility (GitHub)](https://github.com/smartdatapolito/odysseus)
- [CityMoS — City Mobility Simulator](https://citymos.net/)
- [OpenCAMS — Open Connected and Automated Mobility Co-Simulation Platform (arXiv)](https://arxiv.org/html/2507.09186v3)
- [Bentley OpenPaths — transportation planning software](https://www.bentley.com/software/openpaths/)
- [MDPI Smart Cities — *Rethinking Pooled Ride-Hailing… System Limits*](https://doi.org/10.3390/smartcities9040062)
