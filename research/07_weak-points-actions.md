# 07 — Weak Points & Actions (Risk Register / Red-Team)

**Project:** Wolfsburg post-private-car city — "Prompt City" studio, Bauhaus-Universität Weimar + Wolfsburg Award for Urban Vision 2026.
**Purpose:** Anticipate the hardest objections a critical tutor (June 25 studio final) or competition jury (Aug 16) will raise, and arm the team with evidence-backed counters and concrete pre-deadline actions.
**How to read this:** Each weak point has (1) the **Objection** stated bluntly, (2) **Why it's a real risk**, (3) a **Counter** with cited evidence, (4) an **Action** the team can do before June 25 / Aug 16.

> **June 25 priority flag:** Objections marked 🔴 are the ones most likely to sink us at the studio final — they attack the *system proof*, which is exactly what the tutor asked for. 🟠 = likely raised, has a clean answer. 🟡 = jury/competition-level, can wait for Aug 16.

---

## Priority overview

| # | Weak point | Likelihood @ June 25 | Severity | Status of our answer |
|---|------------|----------------------|----------|----------------------|
| 1 | Autonomous vehicles aren't ready | 🔴 Very high | High | Needs phasing reframe |
| 2 | Demand double-counting / fleet-sizing soundness | 🔴 Very high | High | Needs sanity-check math |
| 3 | "Is this just an app / tech-saviour project?" | 🔴 High | High | Needs reframe to space, not tech |
| 4 | Politics — VW company town | 🟠 High | High | Strong counter (MOIA + job cuts) |
| 5 | Behaviour change / car culture | 🟠 High | Medium | Strong precedent evidence |
| 6 | Financing — who pays | 🟠 Medium | High | Plausible models exist |
| 7 | Equity & access | 🟠 Medium | High | Must design *in*, not bolt on |
| 8 | Induced traffic / freight / emergency access | 🟡 Medium | Medium | Filtered-permeability precedent |

---

## 1. 🔴 "Your system depends on autonomous vehicles that don't exist yet."

**Objection (blunt):** You allocate 369 autonomous micro-pods and 33 autonomous buses. Driverless shuttles have a graveyard of cancelled pilots. By what year do these run, and what happens if they never arrive? Without them the whole hub network is fiction.

**Why it's a real risk:** This is the single most defensible attack and it goes straight at *operational viability* — the tutor's explicit demand. The AV-shuttle sector has visibly contracted:

- **Navya (France)** — the dominant slow-shuttle maker — stopped producing shuttles in early 2024 and filed for cessation of payments (insolvency) with the Lyon Commercial Court on 25 Jan 2025. [Sustainable Bus](https://www.sustainable-bus.com/its/autonomous-bus-public-transport-driverless-driverless/)
- **CAVForth (Scotland)**, Europe's flagship full-size autonomous bus route, ended 14 Feb 2025 and was **not renewed** because passenger numbers were far below target. [Sustainable Bus](https://www.sustainable-bus.com/its/autonomous-bus-public-transport-driverless-driverless/)
- **Toronto, Treasure Island (SF), Fairfax County VA** shuttle pilots all ended 2023–2024, several when the supplier folded. [CP24](https://www.cp24.com/news/toronto-s-self-driving-shuttle-pilot-project-ends-without-servicing-the-public-1.5759596) · [SFCTA](https://www.sfcta.org/projects/treasure-island-autonomous-shuttle-pilot)
- Robotaxi reliability is still contested: GM **Cruise recalled ~1,200 vehicles** and was investigated after a pedestrian-dragging incident; **Waymo recalled 1,200 robotaxis** after collisions with barriers. [EV.com](https://ev.com/news/gms-cruise-recalls-nearly-1200-autonomous-vehicles-amid-safety-concerns) · [Digital Trends](https://www.digitaltrends.com/computing/waymo-recalled-1200-robotaxis-following-collisions-with-road-barriers/)

**Counter (evidence-backed):**
- The relevant industrial reality is in our favour and *local*: **MOIA, Volkswagen's own mobility subsidiary**, unveiled the series-production **ID. Buzz AD** (Level 4, Mobileye stack, 13 cameras / 9 LiDAR / 5 radar) on 17 June 2025 as a **turnkey package for operators**, with commercial launch in **Hamburg from 2026** under the federally funded **ALIKE** project, then scale-up across Europe and the US. [Volkswagen Group](https://www.volkswagen-group.com/en/articles/moia-unveils-series-production-version-id-buzz-ad-and-turnkey-solution-for-fully-autonomous-mobility-services-19392) · [Electrek](https://electrek.co/2025/06/19/id-buzz-ad-vw-fully-autonomous-moia/)
- The honest move is **phasing with a non-AV fallback**, not betting the city on day-one autonomy. The Detroit "Connect" shuttle shows the credible path: it launched **driver-supervised in Aug 2024** and is moving to fully autonomous operation in 2025 — autonomy as an *upgrade*, not a precondition. [City of Detroit](https://detroitmi.gov/government/mayors-office/office-mobility-innovation/connect-av-shuttle-service)

**Frame for the jury:** Every "autonomous" vehicle class in our fleet has a **same-day human-driven equivalent that already operates commercially** (shuttle bus with driver, on-demand pooled van à la MOIA Hamburg/Hanover, e-bike, shared EV). Autonomy lowers operating cost over time; it is **not** load-bearing for the urban argument. The city works on day one with drivers.

**Action before June 25:**
- [ ] Add a **3-phase rollout diagram** to the deck: **Phase 1 (2026–2030) driver-operated** pooled shuttles + e-bikes + shared EVs (proves the hub geometry and modal shift *now*); **Phase 2 (2030–2035) supervised autonomy** on the VW-factory trunk corridors; **Phase 3 (2035+) full L4** fleet-wide. Tie Phase 2 explicitly to MOIA/ALIKE timelines.
- [ ] Relabel "autonomous micro-pods / buses" → **"pooled shuttles (driver now → autonomous later)"** so we stop *inventing vehicle types* (tutor's direct note) and instead point at the real ID. Buzz AD.
- [ ] One slide: "What if AVs are 10 years late?" → show the network still functions with drivers, only the per-trip cost curve shifts.

---

## 2. 🔴 "763 vehicles for 100,000 trips/day — did you just make that number up?"

**Objection (blunt):** 100,000 trips/day with peak ~9,000 trips/hr, served by 763 vehicles? Either you're double-counting demand (residents + workers + visitors who are partly the same people) or your fleet is implausibly small/large. Show the arithmetic.

**Why it's a real risk:** Fleet-sizing is the heart of "prove the system works." A jury with any transport-modelling member will probe utilisation. If the ratio is indefensible, the whole quantified case collapses.

**Counter (sanity-check against real ratios):**
- **Top-down check:** 100,000 trips ÷ 763 vehicles ≈ **131 trips per vehicle per day** fleet-average. That is *far* above typical free-floating car-share utilisation (~**6.5 trips/vehicle/day**) — which means our number only holds if the fleet is dominated by **high-cycle, short-trip modes** (e-bikes, micro-pods doing many short hops) and **high-occupancy pooled shuttles** (each shuttle/bus run carries many passengers per "trip"). The arithmetic is *plausible but only with pooling and high-frequency micro-modes — we must show that explicitly.* [Car-sharing utilisation ~6.5 trips/veh/day](https://www.mdpi.com/2071-1050/13/13/7384)
- **Peak check (the binding constraint):** Peak ~9,000 trips/hr is what actually sizes the fleet, not the daily total. With 33 buses + 55 shuttle pods carrying, say, 10–20 pax/hr each on short loops, plus 131 e-bikes and 369 micro-pods cycling 4–6 trips/hr at peak, the order of magnitude is reachable — **but only if we publish the occupancy and cycle-time assumptions per mode.**
- **Replacement logic supports the optics:** one shared car typically replaces **5–13 private cars** (CoMoUK/Zipcar/SHARE NOW evidence), so a small shared fleet legitimately serving a large population is consistent with the literature — it's the *standard* shared-mobility multiplier, not a trick. [T&E](https://www.transportenvironment.org/articles/does-car-sharing-really-reduce-car-use) · [SHARE NOW study](https://www.sciencedirect.com/science/article/pii/S0965856420307291)

**The double-counting trap to fix:** 17k residents + 18k VW workers + 17k visitors are **person-pools, not trip-pools**. Many VW workers *are* residents. State trips as **trips generated**, derived from trip-rates per person-group, and show you have **not** added a resident's commute twice.

**Action before June 25:**
- [ ] Build a **one-page fleet-sizing appendix**: rows = vehicle class; columns = count, peak trips/veh/hr (assumed), occupancy, hourly capacity → sum to ≥9,000 trips/hr peak. This single table neutralises the objection.
- [ ] Add a **demand-derivation line**: person-groups → trip rate → daily trips, with an explicit note "VW-worker commutes counted once; overlap with residents removed." Kills double-counting.
- [ ] State the **fleet-average 131 trips/veh/day** figure *ourselves* and explain it (micro-mode + pooling), so the jury can't "discover" it as a gotcha.
- [ ] Cite the ~6.5 trips/veh/day car-share baseline to show we know where our number sits relative to reality.

---

## 3. 🔴 "Isn't this just an app? A tech-saviour project?" (the midterm warned against this)

**Objection (blunt):** Strip away the renders and this is a smartphone app that dispatches pods. You're solving a *spatial and political* problem with a *technology product*.

**Why it's a real risk:** The midterm brief explicitly warned against tech-solutionism, and there's a strong academic critique that "smart" urbanism is supply-driven technocracy that conceals the real urban conflicts. [Tandfonline — smart urban governance](https://link.springer.com/article/10.1007/s10708-020-10326-w) · [SAGE — knowledge politics of the smart city](https://journals.sagepub.com/doi/10.1177/00420980231177688) A jury primed for this will read an app-centric pitch as shallow.

**Counter:**
- The **load-bearing move in our thesis is spatial, not digital**: the organizing element shifts from *parking* to *mobility hubs*, and **freed car-land becomes public life**. The app is plumbing; the *project* is the reallocation of ~50% of street/parking area to people. Lead with the **land**, not the interface.
- The literature's own prescription backs us: shift from "technology-pushed" to **"demand-pulled" governance that starts with the urban issue, not the 'smart'.** [Smart urban governance](https://link.springer.com/article/10.1007/s10708-020-10326-w) Our urban issue is the post-car land question — exactly the right entry point.
- The precedents we lean on (Groningen, Ghent, Barcelona superblocks) achieved modal revolutions **with paint, bollards and circulation plans, not apps** — proof the transformation is fundamentally about *street design and rules*. [Groningen sectors](https://www.girugten.nl/the-revolutionary-four-sections-of-the-groningen-city-centre/)

**Action before June 25:**
- [ ] **Reorder the narrative**: open with before/after of *freed car-land* (a multi-storey car park → hub + housing/public space), and only introduce dispatch logic as the operational layer. The hero image is a *place*, not a phone.
- [ ] Add a slide "**What stays if the app dies?**" — the hubs, the filtered streets, the public space, the frequencies are all physical/scheduled. The app optimises; it isn't the city.
- [ ] Drop any framing that makes the app the protagonist.

---

## 4. 🟠 "You're proposing a post-private-car city in the home of Volkswagen."

**Objection (blunt):** Wolfsburg exists because VW sells private cars. You're attacking the city's economic base and identity — this is politically naïve and locally offensive.

**Why it's a real risk:** Wolfsburg is a company town; the car is its identity. A jury (and the *Wolfsburg* Award itself) will test whether we understand the local economy. Mishandled, it reads as outsiders lecturing autoworkers.

**Counter (this is actually our strongest reframe):**
- **VW is already pivoting from car-seller to mobility-services provider.** MOIA's ID. Buzz AD is a **turnkey product VW sells to cities to run exactly the kind of pooled, autonomous fleet our hubs need.** [Volkswagen Group](https://www.volkswagen-group.com/en/articles/moia-unveils-series-production-version-id-buzz-ad-and-turnkey-solution-for-fully-autonomous-mobility-services-19392) VW also signed a long-term deal with **Uber to deploy autonomous ID. Buzz** vehicles. [Uber Investor](https://investor.uber.com/news-events/news/press-release-details/2025/Volkswagen-and-Uber-Launch-Long-Term-Strategic-Partnership-to-Deploy-Autonomous-ID--Buzz-Vehicles-on-the-Uber-Platform/default.aspx) **Wolfsburg can be VW's showroom for the post-ownership business model.**
- The "threat to jobs" framing is **already overtaken by reality**: VW is cutting **~50,000 German jobs by 2030**, with **~15,000 in Wolfsburg**, and the plant is converting to EV-only (ID.3/Cupra Born) with a likely temporary four-day week. [electrive](https://www.electrive.com/2026/03/10/vw-group-to-cut-around-50000-jobs-in-germany/) · [Euronews](https://www.euronews.com/business/2026/03/10/volkswagen-slashes-50000-jobs-after-profits-collapse-by-nearly-half) The status quo is *not* a safe harbour — the car-manufacturing monoculture is already contracting. Our project offers Wolfsburg a **second economic identity** (mobility-services pilot city) instead of riding the decline.

**Reframe one-liner for the deck:** *"We're not against VW — we're with the VW that's becoming MOIA. Wolfsburg becomes the city where VW proves the post-ownership product on its own streets."*

**Action before June 25:**
- [ ] Add a **"VW as partner, not adversary"** slide: MOIA turnkey + Uber deal + EV conversion + the 15k job cuts → conclusion: the city *needs* a non-manufacturing future and we supply one.
- [ ] Frame the factory shift-wave special case (10,000 workers/shift in ~1hr) as a **gift to VW**: a guaranteed anchor demand that makes Wolfsburg the ideal *proving ground* for MOIA-style pooled autonomy.

---

## 5. 🟠 "Germans love their cars — nobody will give them up."

**Objection (blunt):** Modal-shift resistance in car-cultural Germany is brutal. People won't abandon private cars for shared pods.

**Why it's a real risk:** Southern-German "car state" mobility culture is documented and politically entrenched. [Tandfonline — car state](https://www.tandfonline.com/doi/full/10.1080/15487733.2020.1756188) LTNs and superblocks attract loud opposition.

**Counter (German + European evidence that shift is real):**
- **Deutschlandticket (49€)** produced **+16% local-transport ridership, +30% rail journeys, and a 4.7% drop in total transport CO₂ (~6.7 Mt) in year one**, with ~8% of users new to public transport — a national-scale demonstration that Germans *do* shift when the offer is good. [MCC Berlin / PIK](https://www.mcc-berlin.net/en/news/information/information-detail/article/49-euro-ticket-resulted-in-significant-modal-shift-from-road-to-rail.html)
- **German acceptability research (Frankfurt)** found "surprisingly high" support for car-reduction measures **when local benefits are tangible**, and that **push measures (making driving costlier/slower) are the most effective lever**. [PMC — German acceptability study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10231855/)
- **Groningen** reaches **~60–65% bicycle mode share** after its 1977 four-sector circulation plan. [BicycleDutch](https://bicycledutch.wordpress.com/2016/03/08/groningen-cycling-city-of-the-netherlands/) **Ghent** (1997 centre ban + 300 km of cycle routes) and **Barcelona superblocks** (measured gains in well-being, air quality, walkability) show the shift sticks and becomes popular. [Euronews](https://www.euronews.com/green/2022/03/12/car-free-futures-how-european-cities-are-experimenting-with-green-transport)

**Action before June 25:**
- [ ] Add a **"modal shift is real" evidence strip**: Deutschlandticket numbers + Groningen 60% + Frankfurt acceptability, as a row of cited stats.
- [ ] Pair every *pull* (great hubs, frequency) with an honest *push* (parking removal pricing the freed land) — the research says push is what actually moves people, so don't hide it.

---

## 6. 🟠 "Who pays for 763 vehicles, 68 hubs, and converting 6 car parks?"

**Objection (blunt):** This is enormous capital. Who funds it and what's the operating business model?

**Why it's a real risk:** "Beautiful but unfinanceable" is a standard jury kill-shot. Mobility-hub economics are genuinely hard — providers often won't operate unless the public sector carries the financial risk. [FHWA](https://international.fhwa.dot.gov/sum/ch3.cfm)

**Counter (real models exist):**
- **Public–private partnership is the proven structure:** Berlin's **Jelbi** and Vancouver's **Mobi** run as city + multi-operator PPPs; cities fund the *sites/infrastructure*, operators fund and run their *own vehicles* and pay rent toward upkeep. [Mobility-as-a-Service blog](https://mobility-as-a-service.blog/mobility-hubs/) · [FHWA](https://international.fhwa.dot.gov/sum/ch3.cfm)
- **"Rail + Property" self-financing:** Hong Kong MTR operates **profitably without subsidy** by capturing land value around stations — directly applicable since **our hubs are repurposed car parks on valuable freed land**; the land-value uplift funds the hub. [MDPI — hub business models](https://www.mdpi.com/2071-1050/13/12/6939)
- **VW/MOIA turnkey** removes the city's fleet-capex risk: the operator supplies and finances the autonomous fleet as a service. [Volkswagen Group](https://www.volkswagen-group.com/en/articles/moia-unveils-series-production-version-id-buzz-ad-and-turnkey-solution-for-fully-autonomous-mobility-services-19392)

**Action before June 25:**
- [ ] Add a **one-slide funding stack**: City funds hub shells (from freed car-park land + EU/federal sustainable-mobility grants) → operators (MOIA, car-share, e-bike) finance vehicles → revenue from fares + freed-land development + parking-removal value capture. Cite Jelbi/MTR.
- [ ] Note the **risk-sharing tension** openly (operators want the public sector to carry risk) and answer it with the land-value-capture mechanism.

---

## 7. 🟠 "Does this actually serve the elderly, disabled, families, and night-shift workers?"

**Objection (blunt):** Shared/on-demand systems routinely fail people with disabilities, the digitally excluded, and shift workers. Is this a system for fit young app-users only?

**Why it's a real risk:** Research is blunt: shared mobility is "largely designed without considering the access needs of people with disabilities," apps and vehicles are often inaccessible, and on-demand is **more expensive than scheduled transit**, excluding low-income users. [ETRR / Springer](https://etrr.springeropen.com/articles/10.1186/s12544-022-00559-w) Night-shift VW workers need guaranteed 24/7 service, not surge-priced pods.

**Counter (designable, with evidence):**
- On-demand mobility **can** improve access **if regulated and designed for it**: wheelchair-accessible vehicles in the fleet, accessible booking (phone + app + at-hub kiosks), and integration with paratransit. [Urban Institute](https://www.urban.org/urban-wire/shared-autonomous-vehicles-could-improve-transit-access-people-disabilities-if-regulated) · [SUMC](https://learn.sharedusemobilitycenter.org/casestudy/mod-and-accessibility-policies-and-programs-2020/)
- The ID. Buzz AD's **flat-floor van** form is intrinsically more accessible than a car; pooled shuttles can be specced wheelchair-accessible from day one.
- **Walking distance is the real equity metric** — our three-tier 68-hub network must guarantee a hub within a short walk (target ~300–400 m) so mobility-impaired users aren't stranded. Make this a *stated design standard*, not an afterthought.

**Action before June 25:**
- [ ] Add an **equity design-standard box**: (a) max walk-to-hub distance, (b) % wheelchair-accessible vehicles, (c) non-app booking channel, (d) **guaranteed 24/7 service on the VW-factory corridor** for night shifts, (e) capped/flat fares so it's not pricier than transit.
- [ ] Show the **walking-catchment map** (isochrones around the 68 hubs) to prove coverage for non-drivers — this doubles as fleet/coverage proof.

---

## 8. 🟡 "Filtered permeability breaks freight, emergencies, and just pushes traffic elsewhere."

**Objection (blunt):** Your 5-zone Groningen-style scheme blocks through-traffic — so deliveries can't reach businesses, ambulances get delayed, and cars pile onto the boundary roads.

**Why it's a real risk:** It's the standard, emotionally potent attack on every LTN. Freight/logistics and emergency access in a filtered city must be explicitly solved.

**Counter (strong, well-evidenced):**
- **Traffic doesn't just relocate — it evaporates.** A study of **46 LTNs across 11 London boroughs found internal traffic fell ~46.9% on average with no corresponding rise on boundary roads.** [Wikipedia — LTN, citing Aldred/Goodman](https://en.wikipedia.org/wiki/Low_Traffic_Neighbourhood)
- **Emergency services are consulted before implementation and typically report no change in response times**; residents, deliveries, refuse and emergency vehicles **retain access** — only *through*-traffic is filtered, often via ANPR cameras rather than hard barriers. [Wikipedia — LTN](https://en.wikipedia.org/wiki/Low_Traffic_Neighbourhood)
- **Groningen proves the model at city scale:** cars still *enter* every sector, they just can't drive *through* the centre — access preserved, through-traffic removed. [Girugten](https://www.girugten.nl/the-revolutionary-four-sections-of-the-groningen-city-centre/)

**Action before Aug 16 (can wait, but prep a line for June 25):**
- [ ] Add a **"who can still drive" layer** to the zone map: residents/access, freight (with time-windowed delivery + hub-based micro-logistics/last-mile cargo-bike), emergency (ANPR/retractable bollards), waste — all permitted; only through-traffic filtered.
- [ ] One stat slide: "**46% internal traffic reduction, no boundary-road increase, no emergency-response delay**" with the London LTN citation.

---

## Action plan before June 25

Highest-leverage fixes, in priority order. These convert "pretty images" into "system proof," which is exactly the tutor's demand.

1. **🔴 Fleet-sizing appendix (one page).** Per-mode table: count × peak trips/veh/hr × occupancy → must sum to ≥9,000 trips/hr peak. State the 131 trips/veh/day fleet average ourselves and explain it. *Neutralises the #1 quantitative gotcha.*
2. **🔴 Demand-derivation line.** Person-groups → trip rates → daily trips, with explicit "VW commutes counted once" note. *Kills double-counting.*
3. **🔴 3-phase AV rollout diagram** with non-AV (driver) fallback in Phase 1; tie autonomy to MOIA/ALIKE 2026+ timeline. *Stops "AVs aren't real" and the "inventing vehicle types" critique.*
4. **🔴 Reorder the story to lead with freed land, not the app.** Hero image = a place (car park → hub + public life). Add "what stays if the app dies?" slide. *Defuses tech-saviour critique.*
5. **🟠 "VW as partner" slide:** MOIA turnkey + Uber deal + 15k Wolfsburg job cuts → Wolfsburg as VW's post-ownership proving ground.
6. **🟠 Modal-shift evidence strip:** Deutschlandticket (+16% / +30% / −6.7 Mt CO₂), Groningen 60%, Frankfurt acceptability.
7. **🟠 Funding stack slide:** city-funds-shells + operator-funds-fleet + land-value capture (Jelbi / MTR cited).
8. **🟠 Equity design-standard box** + walking-catchment isochrone map (≤300–400 m to a hub; 24/7 factory-corridor service; non-app booking; accessible vehicles).
9. **🟡 "Who can still drive" zone layer** + the 46% / no-boundary-increase / no-emergency-delay LTN stat (prep the line; full map can mature for Aug 16).

---

## Sources

- [Sustainable Bus — autonomous bus status (Navya insolvency, CAVForth ended)](https://www.sustainable-bus.com/its/autonomous-bus-public-transport-driverless-driverless/) — sector contraction; key cancelled/ended AV pilots.
- [CP24 — Toronto autonomous shuttle pilot cancelled after supplier folds](https://www.cp24.com/news/toronto-s-self-driving-shuttle-pilot-project-ends-without-servicing-the-public-1.5759596) — pilot failure evidence.
- [SFCTA — Treasure Island shuttle pilot (ended Jan 2024)](https://www.sfcta.org/projects/treasure-island-autonomous-shuttle-pilot) — pilot end.
- [City of Detroit — The Connect AV shuttle (driver→autonomous phasing)](https://detroitmi.gov/government/mayors-office/office-mobility-innovation/connect-av-shuttle-service) — credible phased-autonomy precedent.
- [EV.com — Cruise recalls ~1,200 AVs](https://ev.com/news/gms-cruise-recalls-nearly-1200-autonomous-vehicles-amid-safety-concerns) — robotaxi reliability.
- [Digital Trends — Waymo recalls 1,200 robotaxis](https://www.digitaltrends.com/computing/waymo-recalled-1200-robotaxis-following-collisions-with-road-barriers/) — robotaxi reliability.
- [Volkswagen Group — MOIA ID. Buzz AD turnkey solution](https://www.volkswagen-group.com/en/articles/moia-unveils-series-production-version-id-buzz-ad-and-turnkey-solution-for-fully-autonomous-mobility-services-19392) — VW's own AV pooled-mobility product; AV credibility + VW-as-partner + financing.
- [Electrek — ID. Buzz AD ready for series production](https://electrek.co/2025/06/19/id-buzz-ad-vw-fully-autonomous-moia/) — corroborates MOIA launch.
- [Uber Investor — VW + Uber autonomous ID. Buzz partnership](https://investor.uber.com/news-events/news/press-release-details/2025/Volkswagen-and-Uber-Launch-Long-Term-Strategic-Partnership-to-Deploy-Autonomous-ID--Buzz-Vehicles-on-the-Uber-Platform/default.aspx) — VW's services pivot.
- [electrive — VW to cut ~50,000 German jobs](https://www.electrive.com/2026/03/10/vw-group-to-cut-around-50000-jobs-in-germany/) — ~15k Wolfsburg cuts; company-town reframe.
- [Euronews — VW slashes 50,000 jobs after profit collapse](https://www.euronews.com/business/2026/03/10/volkswagen-slashes-50000-jobs-after-profits-collapse-by-nearly-half) — corroborates job-cut scale.
- [MCC Berlin — Deutschlandticket modal shift](https://www.mcc-berlin.net/en/news/information/information-detail/article/49-euro-ticket-resulted-in-significant-modal-shift-from-road-to-rail.html) — +16%/+30%/−6.7 Mt CO₂; German modal-shift proof.
- [PMC — German acceptability of car-reduction measures (Frankfurt)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10231855/) — push measures most effective; tangible local benefits drive support.
- [BicycleDutch — Groningen cycling city (~60% bike mode share)](https://bicycledutch.wordpress.com/2016/03/08/groningen-cycling-city-of-the-netherlands/) — modal-shift precedent.
- [Girugten — Groningen four-sector circulation plan](https://www.girugten.nl/the-revolutionary-four-sections-of-the-groningen-city-centre/) — filtered-permeability + access-preserved model.
- [Euronews Green — European car-free city experiments (Ghent, Barcelona)](https://www.euronews.com/green/2022/03/12/car-free-futures-how-european-cities-are-experimenting-with-green-transport) — precedent breadth.
- [Tandfonline — "car state" mobility culture in Southern Germany](https://www.tandfonline.com/doi/full/10.1080/15487733.2020.1756188) — documents the resistance we must counter.
- [MDPI — car-sharing & ownership in Germany (utilisation/replacement)](https://www.mdpi.com/2071-1050/13/13/7384) — ~6.5 trips/veh/day baseline; fleet-sizing sanity check.
- [T&E — does car-sharing reduce car use](https://www.transportenvironment.org/articles/does-car-sharing-really-reduce-car-use) — replacement-ratio evidence.
- [ScienceDirect — SHARE NOW free-floating car-share & ownership](https://www.sciencedirect.com/science/article/pii/S0965856420307291) — shared-car replacement multiplier.
- [MDPI — Business Model Blueprints for Shared Mobility Hub Network](https://www.mdpi.com/2071-1050/13/12/6939) — MTR "rail+property" / value-capture financing.
- [FHWA — Shared-use mobility, European lessons](https://international.fhwa.dot.gov/sum/ch3.cfm) — PPP financing; provider risk tension.
- [Mobility-as-a-Service blog — mobility hubs (Jelbi, Mobi PPPs)](https://mobility-as-a-service.blog/mobility-hubs/) — real PPP hub financing.
- [ETRR/Springer — accessibility of shared mobility for people with disabilities](https://etrr.springeropen.com/articles/10.1186/s12544-022-00559-w) — equity risk evidence.
- [Urban Institute — shared AVs can improve disabled access if regulated](https://www.urban.org/urban-wire/shared-autonomous-vehicles-could-improve-transit-access-people-disabilities-if-regulated) — equity counter.
- [SUMC — MOD & accessibility policies/programs](https://learn.sharedusemobilitycenter.org/casestudy/mod-and-accessibility-policies-and-programs-2020/) — accessible-design precedents.
- [Wikipedia — Low Traffic Neighbourhood (46% traffic cut, emergency access)](https://en.wikipedia.org/wiki/Low_Traffic_Neighbourhood) — traffic evaporation; emergency/freight access preserved.
- [Springer — smart urban governance vs technocratic "smartness"](https://link.springer.com/article/10.1007/s10708-020-10326-w) — demand-pulled vs tech-pushed; anti-solutionism counter.
- [SAGE — knowledge politics of the smart city](https://journals.sagepub.com/doi/10.1177/00420980231177688) — tech-saviour critique we must pre-empt.
