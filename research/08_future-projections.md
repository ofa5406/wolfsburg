# 08 · Future Projections & Scenarios

*Forward-looking document: when L4/L5 shared fleets become viable in a mid-size German city, what the energy/grid picture looks like, how to phase the Hub City to 2035/2050, **what the reclaimed land actually becomes** (quantified from real projects), and the demographic/behavioural trends that support — or threaten — the vision.*

*Built 2026-06-15, web-researched with citations. AV timelines are genuinely uncertain — this document flags where the evidence is contested rather than papering over it.*

---

## 1. AV adoption timelines — realistic, and honestly uncertain

### The state of play (mid-2026)

- **It works, narrowly, today.** Waymo runs ~**450,000 paid driverless rides/week** (Dec 2025) with ~2,500 vehicles, expanding across US Sun-Belt cities ([CNBC](https://www.cnbc.com/2025/12/08/waymo-paid-rides-robotaxi-tesla.html)). So L4 robotaxis are **real and scaling** — but only in select, well-mapped geographies.
- **It can fail fast.** GM **shut down Cruise** in Dec 2024 after a safety incident and >$10 B in losses ([CNBC](https://www.cnbc.com/2024/12/10/gm-halts-funding-of-robotaxi-development-by-cruise.html)). Autonomy is not a one-way ratchet.

### Forecasts (cite the slippage honestly)

McKinsey's biannual AV survey (most authoritative industry forecast):

| Horizon | Expectation | Source |
|---------|-------------|--------|
| **~2030** | Large-scale *global* L4 robotaxi rollout expected; ~12% of new cars sold with L3+; ~2.6 M cars/yr with L4 capability (~2.9% attach rate) | [McKinsey](https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/autonomous-drivings-future-convenient-and-connected) |
| **~2035** | ~37% of new cars with advanced AD tech | McKinsey |
| **~2040** | L3+ could be ~80% of new-car sales in Europe; AVs reshape urban life | McKinsey |
| **Caveat** | Timelines **slipped 1–2 years** vs the 2023 survey; private urban AV pilots pushed to ~2032 | McKinsey |

**Honest read for a mid-size German city like Wolfsburg:**
- A **geofenced, supervised L4 shared fleet** on defined corridors (the VW commuter spine, key hub-to-hub trunk routes) is plausibly viable in the **early-to-mid 2030s** — *especially* because **VW/MOIA's production L4 ID. Buzz AD launches in Hamburg in 2026** ([New Atlas](https://newatlas.com/automotive/volkswagen-moia-id-buzz/); [Automotive World](https://www.automotiveworld.com/articles/vws-moia-launches-series-production-id-buzz-robotaxi/)). Hamburg → other German cities is the natural diffusion path, and Wolfsburg sits inside it.
- **Full L5 (go-anywhere, no geofence, no supervision)** remains **uncertain and should not be assumed** within the project horizon. Design for *phased, supervised, corridor-first* autonomy — that is the defensible position, and a jury will respect the honesty.

> **Framing rule:** treat AV as a **capability that arrives in waves on the easiest geometries first** (predictable corridors, the VW shift wave), not a switch that flips in 2035.

---

## 2. EV / charging — energy demand of the shared fleet & grid implications

### The fleet's energy appetite (order-of-magnitude)

A useful reference point: a study of **15,000 EVs** serving an Austin-metro passenger fleet estimated **~806 MWh/day** of charging energy — *"about the same daily electricity as 27,400 US homes"* ([osti.gov](https://www.osti.gov/servlets/purl/2404516)). Our fleet is **763 vehicles** — roughly **1/20th** of that — so a rough scale-down lands in the order of **tens of MWh/day** (and much of our fleet is *small*: e-bikes and micro-pods use a fraction of a car's energy). The number is **modest at city scale**, but real and worth quantifying for the L-hubs.

### Grid planning principles (use these in the proof)

- **Plan in MWh, not MW.** Utilities care about *energy across a dwell window*, not instantaneous peak. Sharing the actual plug-in schedule once cut a utility's build-out forecast from **3 years to 3 months** ([Automotive Fleet](https://www.automotive-fleet.com/10232588/how-to-calculate-power-demand-for-your-ev-depot)).
- **Managed / smart charging** shifts charging away from grid peaks and can even feed power back (V2G), lowering total system cost ([osti.gov](https://www.osti.gov/servlets/purl/2404516)). Our charging happens at the **6 L-hubs** (converted multi-storey car parks) — ideal controllable depots.
- **Dwell scheduling is our friend:** the predictable VW shift rhythm creates predictable charging troughs (vehicles charge between shift waves and overnight), making the load far easier to manage than random private-EV home charging.

> **Argument:** a *shared, depot-charged, schedule-disciplined* fleet is **far gentler on the grid** than the same number of trips served by privately owned home-charged EVs — managed charging is the whole point. (See fleet-ops detail in [`02_mobility-system.md`](02_mobility-system.md) §4.5.)

---

## 3. Scenario framing & phasing — 2035 / 2050 Wolfsburg

A clean three-phase story (assumptions, not predictions — label them as such):

| Phase | ~Years | Mobility | Autonomy | Land |
|-------|--------|----------|----------|------|
| **Phase 1 — Seed** | now → ~2030 | MaaS app + integrated ticketing; e-bike/car-share + DRT shuttles with **safety drivers**; first L-hubs built by converting 6 car parks | Supervised L4 on the **VW commuter corridor** (mirrors MOIA Hamburg 2026) | Pilot parking-to-plaza conversions; on-street parking starts shrinking |
| **Phase 2 — Shift** | ~2030 → 2035 | Hub network fully operational (6 L / 19 M / 43 S); pooled autonomous shuttles + micro-pods scale; private-car trips fall sharply | **Geofenced driverless L4** on corridors + dense zones; supervision thinning | Most surface + on-street parking reclaimed; first wave of housing / greenery / water-retention on freed land |
| **Phase 3 — Post-car** | 2035 → 2050 | The 763-vehicle shared fleet is the primary system; walking/cycling dominant in core | Wide L4; L5 *if/when* it matures — **not assumed** | Car-dominated land fully repurposed; streets re-sectioned for people, trees, stormwater |

**Phasing logic:** sequence by **predictability of demand** and **buildability of land**, not by waiting for L5. Start where autonomy is easiest (the shift wave), reclaim land incrementally as parking demand provably falls, and keep each phase reversible enough to survive an AV-timeline slip.

---

## 4. What the reclaimed land becomes — the payoff (quantified)

This is the emotional and political core of the project. The evidence that freed car-space becomes valuable public good is strong.

### The opportunity, sized

- A car is **parked ~95% of its life** ([Reinventing Parking](https://www.reinventingparking.org/2013/02/cars-are-parked-95-of-time-lets-check.html)).
- A parking bay = **~25–40 m²** including circulation ([Drlogy](https://www.drlogy.com/calculator/faq/how-many-square-meters-is-car-parking)). Multiply by a car-dependent city's parking stock and the land at stake is enormous — on-street parking alone is **~20% of kerb-to-kerb space** in the ITF Lisbon model ([ITF](https://www.itf-oecd.org/sites/default/files/docs/shared-mobility-liveable-cities.pdf)).
- German/Dutch/Swiss minimum-parking mandates produce **50–100% more parking than actually needed** ([Streetsblog / VTPI](https://usa.streetsblog.org/2025/10/22/study-removing-parking-minimums-leads-to-more-affordable-housing)) — so much of the reclaimable land is *surplus by design*.

### What it converts into — real projects with before/after numbers

| Use | Evidence | Quantified outcome |
|-----|----------|--------------------|
| **Public space / greenery** | **Barcelona Superblocks (Superilles)** | Reclaim up to **~60–70% of street space** for people while removing only ~25% of through-traffic; Eixample plan converts **1 in 3 streets** to green space + 21 new plazas, target green space within **200 m of every home**; up to **~33% drop in NO₂** in early superblocks ([Urban Land/ULI](https://urbanland.uli.org/planning-design/barcelonas-experiment-superblocks); [Dezeen](https://www.dezeen.com/2020/11/19/barcelona-eixample-masterplan-streets-green-space/)) |
| **Housing** | Parking-minimum reform studies | A single surface lot can hold **dozens of homes**; Houston "courtyard" infill = 3–8 homes per former lot; removing minimums measurably *increases affordable housing supply* ([APA](https://www.planning.org/planning/2018/oct/peopleoverparking/); [Streetsblog](https://usa.streetsblog.org/2025/10/22/study-removing-parking-minimums-leads-to-more-affordable-housing)) |
| **Affordability lever** | London parking reform | Cut residential parking provision by **~49%** post-reform (0.76 fewer spaces/unit) — land + cost that flows to housing instead ([ITDP](https://itdp.org/2024/02/01/in-these-us-cities-parking-reform-is-gaining-momentum/)) |
| **Climate / water adaptation** | De-paving freed parking | Replacing impervious asphalt with permeable green = stormwater retention, urban cooling, biodiversity — the "sponge" function (general superblock + de-paving evidence above) |
| **Local economy** | Barcelona superblocks | Documented uptick in **pedestrian activity and local commerce vitality** after reclaiming street space ([Urban Land/ULI](https://urbanland.uli.org/planning-design/barcelonas-experiment-superblocks)) |

> **The before/after to put on a slide:** *parking lot (asphalt, idle 95% of the day, surplus by mandate) → housing + trees + plaza + stormwater sponge, within 200 m of every home.* Barcelona supplies the percentages; parking-reform research supplies the housing logic.

**Honest caveat:** Barcelona/Houston/London are not 1:1 Wolfsburg — Wolfsburg is a low-density, VW-built company town with a very different parking and ownership pattern. Use these as **proof-of-mechanism**, then quantify Wolfsburg's *own* parking stock via the Activity Map to make the before/after local.

---

## 5. Demographic & behavioural trends — tailwinds and headwinds

### Tailwinds (support the vision)

- **Young Germans are driving — and licensing — less.** Fewer young adults obtain licences; car *use* among young adults has fallen since ~2000, with rising **multimodality**; ~two-thirds of the 1998–2008 ownership decline among young adults was socio-economic, and the historic gender gap in car travel has largely closed (young men reduced car use toward young women's levels) ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0966692312001317); [Clean Energy Wire](https://www.cleanenergywire.org/news/german-millennials-want-their-own-car-prefer-combustion-models-survey)).
- **Cost pressure:** rising car-ownership costs push people toward access-over-ownership — **66% of owners plan to keep cars longer** for financial reasons ([Mintel](https://store.mintel.com/report/germany-car-consumer-market-report)).
- **Remote/hybrid work** flattens commute peaks (helpful for fleet sizing) — though it also thins midday demand density, which *hurts* pooling efficiency (a double-edged trend).
- **MaaS proof:** where an integrated app exists (Helsinki/Whim), **~12% of users gave up a car** ([CCV](https://www.ccv.eu/en/about-ccv/news/customer-experiences/case-mobility-as-a-service-maas-in-public-transport)).

### Headwinds (threaten the vision — name them)

- **Stated preference is sticky:** surveys still show many German millennials *want to own a car* — and often prefer combustion ([Clean Energy Wire](https://www.cleanenergywire.org/news/german-millennials-want-their-own-car-prefer-combustion-models-survey)). Attitudes lag behaviour.
- **Company-town identity:** Wolfsburg exists *because of* the car (VW). Asking it to become post-private-car is culturally loaded — a strength (VW owns MOIA; can pilot the future) **and** a risk (livelihoods, identity tied to private-car production).
- **AV timeline risk:** if L4-at-scale slips (Cruise-style setbacks, regulation), the autonomous backbone arrives late — hence the **phased, supervised, corridor-first** design that does not bet everything on L5.
- **Density:** Wolfsburg is not Barcelona-dense; thin demand pools less efficiently. The **VW shift wave is the density that rescues the model** — lean on it.

---

## How to use this in the project

**For the June 25 studio final:**

1. **Implementation timeline slide** → use the **§3 three-phase table** (Seed / Shift / Post-car). Anchor Phase 1 on the **real MOIA ID. Buzz AD Hamburg-2026 launch** so the timeline reads as *extrapolation from VW's actual roadmap*, not fantasy. State the AV-slippage caveat (§1) openly — phased & supervised, not L5-now.
2. **Reclaimed-space vision slide (the payoff)** → use **§4**: the before/after ("parking lot → housing + trees + plaza + sponge, within 200 m of every home"), carried by **Barcelona percentages** + **parking-reform housing logic**. Then localise with Wolfsburg's own parking stock from the Activity Map (Greenery / Facilities modes).
3. **Trends slide** → §5: lead with declining youth car ownership + MaaS-gives-up-cars as tailwinds; **name the headwinds** (sticky preferences, company-town identity, AV risk, low density) and answer each — the VW shift wave answers the density one.
4. **Energy/grid reassurance** → §2: tens-of-MWh/day, managed depot charging at L-hubs, "plan in MWh," gentler than private home-charging. Cross-link fleet-ops in [`02_mobility-system.md`](02_mobility-system.md) §4.5.
5. Distil the strongest lines into `06_arguments-evidence.md`; route the honest risks (AV slip, identity, density) into `07_weak-points-actions.md` with the counters above.

---

## Sources

- CNBC — Waymo 450k weekly paid rides (Dec 2025): https://www.cnbc.com/2025/12/08/waymo-paid-rides-robotaxi-tesla.html
- CNBC — GM exits robotaxi / Cruise shutdown: https://www.cnbc.com/2024/12/10/gm-halts-funding-of-robotaxi-development-by-cruise.html
- McKinsey — The future of autonomous vehicles (timelines, slippage): https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/autonomous-drivings-future-convenient-and-connected
- New Atlas — VW ID. Buzz autonomous robotaxi 2026 debut: https://newatlas.com/automotive/volkswagen-moia-id-buzz/
- Automotive World — VW/MOIA series-production ID. Buzz robotaxi: https://www.automotiveworld.com/articles/vws-moia-launches-series-production-id-buzz-robotaxi/
- OSTI — Multi-stage charging/discharging of EV fleets (Austin 15k-EV = ~806 MWh/day; V2G): https://www.osti.gov/servlets/purl/2404516
- Automotive Fleet — Calculating EV depot power demand ("plan in MWh"; 3yr→3mo): https://www.automotive-fleet.com/10232588/how-to-calculate-power-demand-for-your-ev-depot
- ITF / OECD — *Shared Mobility: Liveable Cities* (on-street parking ≈ 20% of kerb space; 3%-of-fleet): https://www.itf-oecd.org/sites/default/files/docs/shared-mobility-liveable-cities.pdf
- Reinventing Parking — cars parked ~95% of the time: https://www.reinventingparking.org/2013/02/cars-are-parked-95-of-time-lets-check.html
- Drlogy — parking space ~25–40 m² incl. circulation: https://www.drlogy.com/calculator/faq/how-many-square-meters-is-car-parking
- Urban Land / ULI — Barcelona Superblocks (60–70% reclaimed; NO₂; commerce): https://urbanland.uli.org/planning-design/barcelonas-experiment-superblocks
- Dezeen — Barcelona Eixample: 1-in-3 streets to green space, 21 plazas, 200 m access: https://www.dezeen.com/2020/11/19/barcelona-eixample-masterplan-streets-green-space/
- APA Planning — People Over Parking (a surface lot = dozens of homes): https://www.planning.org/planning/2018/oct/peopleoverparking/
- Streetsblog USA — Removing parking minimums → more affordable housing (50–100% over-provision): https://usa.streetsblog.org/2025/10/22/study-removing-parking-minimums-leads-to-more-affordable-housing
- ITDP — Parking reform momentum (London −49% residential parking): https://itdp.org/2024/02/01/in-these-us-cities-parking-reform-is-gaining-momentum/
- ScienceDirect — Travel trends among young adults in Germany (multimodality, declining car use): https://www.sciencedirect.com/science/article/abs/pii/S0966692312001317
- Clean Energy Wire — German millennials want their own car / combustion preference: https://www.cleanenergywire.org/news/german-millennials-want-their-own-car-prefer-combustion-models-survey
- Mintel — Germany Car Consumer Market Report (66% keep cars longer): https://store.mintel.com/report/germany-car-consumer-market-report
- CCV — MaaS / Whim Helsinki (12% gave up a car): https://www.ccv.eu/en/about-ccv/news/customer-experiences/case-mobility-as-a-service-maas-in-public-transport
