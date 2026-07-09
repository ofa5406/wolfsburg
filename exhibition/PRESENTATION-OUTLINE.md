# `<stadt.hub>` — Exhibition Presentation Outline

*Page-by-page spec for **`exhibition/deck/`** — the self-running 24-slide Summaery presentation (the exhibit). Section ids below map to `deck/index.html` (`#s1 … #s24`).*
*Refined + completed 2026-07-07. Working source is this file; `exhibition/draft/Exhibition presentation outline.docx` is the original editable copy.*
*Note: earlier drafts called the exhibit "kiosk"; that name now refers to the superseded `exhibition/kiosk/` folder. The live exhibit is `deck/`.*

---

## Sources this outline draws from
- `exhibition/draft/text for prints.docx` — source copy (manifesto, 3 analysis layers, vision, hub system, masterplan connections, outcomes). `" "` quotes are lifted from here.
- `exhibition/draft/booklet_new.pdf` + pages `1.1`–`7.4` — visual draft / design language.
- `project/hub_typologies.md` — S/M/L design logic + element palette (§6).
- `decisions.md` — locked figures + the L-Anchor/L-Gateway resolution (§5–§7).

## ⚠ Two number conflicts — team decision needed (not silently resolved)
- **Fleet:** **763** (locked, tutor-accepted, `decisions.md`) vs **~1,300** (print text / web tool). Uses 763 as primary; flagged at §4.2.
- **Trips/day:** **~100k** (`project/current.md`: 17k res + 18k workers + 17k visitors) vs **104k** (print text: 17,400 + 18,000 + 7,080). Flagged at §4.2.

---

## Global spec

**Purpose.** A self-running, no-narration exhibit that plays as a pitch talk: a viewer can
join at any point, read one big question/statement per page, and grasp what that page proves.
Never boring; creative; natural; a clear build from diagnosis → vision → system → proof.

**Template legend** (T1/T2/T3 exist in `exhibition/deck/`; the rest are new variants to add):

| ID | Form | Used for |
|----|------|----------|
| **T1** | Full-frame media, text over (dark) | Landing, Vision, Close |
| **T2** | Three-across gallery, heading above (light) | History, Problems |
| **T2.1** | 2 captioned tiles + connected landscape photo strip, green flow arrows | Today |
| **T2.2** | Four grouped bullet columns (heading left, groups right) | Potentials |
| **T3** | Text left · interactive gallery right | Urban structure, Hub connections, Locations |
| **THUB** | Full-frame dark shell wrapping a live iframe | Hub viewer, Brain |
| **T-STAT** *(new)* | Big-number stat blocks | Outcomes (numbers) |
| **T-DIAGRAM** *(new)* | Centred scale/relationship diagram + short labels | Hub system (S/M/L), connection hierarchy |
| **T-TYPO** *(new)* | Typology sheet: plan + section + axo + element key + statement | S/M/L hub pages |
| **T-PLAN** *(new)* | Large static plan/map + side text (T3 without interactivity) | Masterplan pages |
| **T-STATEMENT** *(new)* | Big centred statement on paper, no media | Manifesto |

**Design language** (locked from the draft): bracketed ALL-CAPS section word
(`<STADT.HUB>`, `<TODAY>`, `<POTENTIAL>`, `<VISION>`); ghost section number (01…08);
hand-drawn green flow arrows for sequence; yellow highlight on the page's key title line;
near-monochrome, grayscale imagery; all prose typed in; single accent `#E8500A`; thick L-frames.

**Content rules:** condense hard — source paragraphs collapse to short statements or
bullets. Each page opens with one big **question or statement**. `" "` = verbatim print quote.
Bold the **bridge terms** that hand off to the next page.

---

## THE OUTLINE

### §1 — OPENING · the hook

**1.1 · `<STADT.HUB>`** — Landing — **T1**
- Full-bleed dark aerial of the VW Werk + canal. Wordmark bottom-left, ghost `01`.
- Sub: *integrated multimodal mobility infrastructure*
- Statement: **"Cars sit unused 90% of the time. What if no one owned one at all?"**
- Credits: Bauhaus-Universität Weimar · M.Sc. IUDD · SoSe26 · Aslan · Mulyndina · Pınar
- Bridge → this is **Wolfsburg**, and it got this way for a reason →

**1.2 · `<HISTORY>`** — **T2** (3 beats, 3 galleries)
- Q: *"How did a city end up built around the car?"*
- Beat 1 — **1938, a city founded for a factory** (Fallersleben absorbed; the company town)
- Beat 2 — **the line sets the city's clock** (assembly line, three shifts)
- Beat 3 — **grown for the car** (wide roads, dispersed districts, disconnected villages)
- Quote: *"Volkswagen's production has shaped not only the economy but also the city's spatial logic."*

**1.3 · `<TODAY>`** — **T2.1** (2 captioned tiles + landscape strip)
- Q: *"What did that leave us with?"* — Wolfsburg today, in two reads:
- Read 1 — **a city that runs on the private car** (total car-dependence)
- Read 2 — **land given to storage and movement** (parking fields, oversized junctions)
- Landscape strip (green arrows): rush-hour traffic → surface parking aerial → junction
- Bridge → before proposing anything, **read the city** →

---

### §2 — DIAGNOSIS · reading the city

**2.1 · `<URBAN STRUCTURE>`** — **T3** (live Activity-Map embed: 3 layers)
- Q: *"Read the city before fixing it."* Interactive maps; bold the bridge terms.
- **Mobility** — a **monocentric** satellite structure: one dominant core, dispersed low-intensity periphery (the gravitational pull of the Werk).
- **Livability & Facilities** — civic/commercial life concentrated in Stadtmitte, Schillerteich, Laagberg; periphery starved.
- **Centralities** — steep accessibility gradient without a car → structural **car dependency**. *"Even a modest displacement from the core sharply reduces what's reachable in 15 minutes on foot, bike, or transit."*
- Bridge → this dependency produces concrete **problems** →

---

### §3 — PROBLEM & POTENTIAL

**3.1 · `<PROBLEMS>`** — **T2** (3 themes, small gallery each)
- Quote: *"Wide roads, fragmented districts, villages disconnected from one another. The result is social disintegration and total dependence on private cars."*
- **Ecological** — emissions & air quality · land eaten by parking · fragmented green space · urban heat islands
- **Social** — car-based inequality · core–periphery divide · company-town legacy · unsafe streets for children & elderly
- **Urban** — monofunctional zoning · car infrastructure dominates public space · weak radial transit · no intermodal transfer points
- Bridge → but the same structure hides **potential** →

**3.2 · `<POTENTIAL>`** — **T2.2** (4 grouped columns)
- Statement: *"The very things that make Wolfsburg car-dependent make it ideal for shared autonomous mobility."*
- **Urban form** — monocentric = simple hub-and-spoke; compact core ~4 km²; oversized roads = reallocatable slack
- **Existing infrastructure** — ready-made parking stock (→ depots); dense bus-stop skeleton (→ last-mile nodes)
- **Industrial / economic** — VW as anchor + testbed (funding, political will); single employer = predictable demand
- **Travel demand** — 76,715 daily commuters through few corridors (natural Hub-L points); city of ~130,000 = pilot-scale
- Bridge → so what is the **vision**? →

---

### §4 — VISION

**4.1 · `<VISION>`** — Future of mobility as a service — **T1**
- Big statement over media: **"Future of mobility as a service."**
- Three pillars (short defs):
  - **Shared** — accessed on-demand, not owned; frees parking land; open to those who can't/won't own.
  - **Autonomous** — no driver cost → frequent service viable even in the low-density periphery.
  - **Electric** — charged at hubs; zero tailpipe; central 24/7 fleet management.
- Thesis line: *"The land currently used for parking becomes available for public life, greenery, housing, and civic space."*

**4.2 · `<OUTCOMES>`** — the numbers — **T-STAT**
- ⚠ **RECONCILE FLEET NUMBER before building** — locked **763** vs print **~1,300**.
- Stat blocks (using locked figures; swap if team decides otherwise):
  - **763** shared vehicles — 131 e-bikes · 55 shuttle pods · 33 buses · 369 micro-pods · 175 EVs
  - **~100k** trips/day served ⚠ (17k residents + 18k workers + 17k visitors)
  - **€7,596** saved / household / year — €727/mo private car → €94/mo shared · 87% reduction (ADAC 2024 / MOIA Hamburg)
- ⚠ verify claim: "replaces ~50,000 private units."

**4.3 · `<OUTCOMES>`** — the space returned — **T1** (before/after)
- Statement: **"Fewer cars is the mechanism. Space for people is the goal."**
- Full-bleed before → after wipe: car-choked street → reclaimed public space.

**4.4 · `<MANIFESTO>`** *(proposed new page)* — **T-STATEMENT**
- One line, big: *"Stadt.hub is not a plan to remove the car from Wolfsburg — it's a plan to replace what the car was hiding: space, access, and a city built for people first."*
- Optional 6 condensed principles: ownership is the problem, not the car · build on what exists · access is hierarchical · the periphery is not an afterthought · reclaimed street space is the deliverable · decisions follow data.

---

### §5 — STRATEGY & SYSTEM

**5.1 · `<STRATEGY>`** — **T2** (or T-STATEMENT)
- Q: *"How do you replace the car without breaking the city?"*
- The move: **a reallocation, not an expansion** — every hub sits on infrastructure that already exists (a parking structure, a bus stop).
- Three tiers, one job each; coverage judged by its **weakest district**, not its average.
- Bridge → the **hub system** made concrete →

**5.2 · `<VISION: HUB>` — City connection through the HUB system** — **T-DIAGRAM**
- Yellow-highlit title; S ↔ M ↔ L scale axis (*smaller-scale ↔ larger-scale connections*).
- Definition (COMoUK): *"highly visible, safe and accessible spaces where public, shared and active travel modes are co-located alongside improvements to public realm and community facilities."*
- **HUB S** — last-metre nodes that close coverage gaps · **HUB M** — intermodal transfer for the dense core · **HUB L** — city-centre anchors + full-fleet operations
- Candidate-source note per tier (bus stops/footfall → S; underground car parks → M; multi-storey car parks → L).

**5.3 · `<VISION: HUB>` — Connections** — **T3 + T-DIAGRAM** (network maps)
- Hierarchy L→M→S with catchment radii:
  - **Hub L** — city-scale anchors at main entries, ~4 km sectors; L↔L on autonomous **bus** lines (heaviest flows)
  - **L → M** — shuttle/pod within ~1.5 km; city-scale traffic broken into district-scale (~2 km M catchments)
  - **M ↔ M** — ≤1 km lateral links between adjacent districts (no need to route back through L)
  - **M → S** — pod + e-bike within ~600 m; shared-vehicle scale → human scale
  - **Hub S** — ~400 m catchment at bus stops; S↔S ≤400 m e-bike, block-to-block
- Three network reads (maps): **Hub network** (coverage grows centre→periphery) · **Facility network** (peripheral access gains most) · **External flows** (Hub L at entries lets Einpendler leave the car outside the city).

---

### §6 — TYPOLOGY · what a hub actually is

**6.1 · `<HUB TYPOLOGIES>`** — the design system — **T2/T3**
- Q: *"A hub is not a bus shelter."* Five principles (condensed from `hub_typologies.md`):
  - **Ground field** — reddish stone paving that spans the carriageway (a street-section redesign, not a sidewalk add-on)
  - **Vertical beacon** — canopy readable from 50 m
  - **Three-zone logic** — Vehicle edge → Threshold → Dwelling edge
  - **Smooth usage** — legible without signage, both directions
  - **Catalyst, not shelter** — mobility is the anchor; public life is the ambition

**6.2 · `<S-HUB>` — The Moment** — **T-TYPO**
- *43 hubs · last-mile · e-bike + micro-pod · 150–250 m walk*
- "A moment in the street: arrive, grab a bike or wait briefly for a pod, leave."
- Key elements: e-bike dock, micro-pod zone, charging, identity marker, canopy, bench, ground lighting.
- Visual: plan + section + axo + element key.

**6.3 · `<M-HUB>` — The Choice Point** — **T-TYPO**
- *19 hubs · neighbourhood · multimodal transfer · 300–500 m*
- "Where you have options — see live availability, then decide."
- Adds: cargo-bike dock, real-time terminal, shared-EV bay, AV drop-off, group seating, water, repair, bioswale, vendor slot.

**6.4 · `<L-HUB>` — The Neighbourhood Anchor** — **T-TYPO**
- *6 hubs · repurposed car parks · full fleet · 700–1000 m*
- "A different category — the building IS the identity."
- Two sub-types (from `decisions.md`): **L-Anchor** (central car-park reuse — gastronomy/shops/community/housing above) · **L-Gateway** (edge depot + park-and-switch interchange for inbound commuters).
- Adds: AV staging, fleet charging at scale, maintenance, ground-floor programme, living wall, memory/history marker, market slot.

---

### §7 — MASTERPLAN · proof in plan

**7.1 · `<LOCATIONS>`** — all 68 hubs on the map — **T3** (interactive)
- Q: *"Where do the 68 hubs land?"* Live map, all tiers + walking catchments; coverage read.

**7.2 · `<STRATEGY MASTERPLAN>`** — traffic & zones — **T-PLAN**
- 5-zone Groningen model, filtered permeability, one-way internal streets.
- Hub M on the district periphery pulls cars to the edge → inner streets freed.
- **Porschestraße** becomes the reclaimed spine linking south city ↔ across the river.

**7.3 · `<MASTERPLAN>`** — the outcome in plan — **T-PLAN**
- Statement: *"The centre becomes largely car-free — not by restricting mobility, but by replacing private cars with a dense shared-mobility layer, so every need is still met."*
- Detailed coloured masterplan (hubs marked, reclaimed space shaded).

**7.4 · `<NETWORKS>`** — connections on the plan — **T-PLAN**
- L/M/S nodes + connection lines (bus / shuttle-pod / e-bike) overlaid on the masterplan — the §5.3 hierarchy made spatial.

---

### §8 — TOOLS & CLOSE · "these are live"

**8.1 · `<HUB VIEWER>`** — live 3D hub — **THUB**
- "This model is live." Walk/Fly the element kit; hover any element for its description.

**8.2 · `<BRAIN>`** — the visualized database — **THUB**
- "The brain of the project" — 408-note 3D knowledge graph; wander the reasoning behind every decision.

**8.3 · `<STADT.HUB>`** — Close — **T1**
- **PARKING CITY → HUB CITY**, credits, `ofa5406.github.io/wolfsburg`. Loops back to 1.1.

---

## Open flags to resolve
1. **Fleet number** — 763 vs ~1,300 (blocks §4.2). Which is canonical for the exhibit?
2. **Trips/day** — ~100k vs 104k (and visitor count 17k vs 7,080).
3. **Manifesto page (4.4)** — include as its own page, fold into 5.1 Strategy, or drop?
4. **Outcomes split** — keep 4.2 (numbers) + 4.3 (before/after) as two pages, or merge?
5. **Length** — 24 pages is a lot for a loop; candidates to compress: 4.2+4.3, 7.3+7.4.
