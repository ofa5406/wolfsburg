# Wolfsburg Activity Map — Tool Description

*Last updated: June 15, 2026*
GitHub: https://github.com/annestasiia/wolfsburg-activity-map.git

---

## What This Tool Is

The Wolfsburg Activity Map is an interactive browser-based map of Wolfsburg built specifically for this project. It pulls live geographic data from OpenStreetMap, processes it with several analysis algorithms, and displays the results as colour-coded maps. It runs in a web browser — no installation needed beyond the initial setup.

The tool has **7 analysis modes**, switchable from a bar at the top of the screen. Each mode answers a different spatial question about Wolfsburg.

**How to open it:**
1. Open a terminal inside the `wolfsburg-activity-map` folder
2. Type `npm run dev` and press enter
3. Open the address that appears (usually `http://localhost:5173`) in a browser

---

## The Seven Modes

---

### Mode 1 — Mobility

**What question it answers:** How well-connected is each neighbourhood to the city centre?

**What you see on the map:** All 44 Wolfsburg districts coloured from dark (low connectivity) to bright (high connectivity). A sidebar lets you switch between four sub-layers: Public Transport, Automobile, Cycling, and Walking/Pedestrian.

**How the score is calculated:**

The tool fetches the actual road and route network from OpenStreetMap — every bus line, road, and cycle path in Wolfsburg. It then counts, for each district, how many of those routes physically connect that district to the city centre (defined as the 9 central neighbourhoods: Stadtmitte, Schillerteich, Rothenfelde, Wohltberg, Volkswagenwerk, Alt-Wolfsburg, Hellwinkel, Heßlingen, Hohenstein).

A route "counts" for a district only if:
- At least one point on the route lies inside that district, AND
- At least one point on the same route reaches the city centre

If a route passes through a district but loops back without reaching downtown, it does not count. If a district has many routes connecting it to the centre, it gets a high score. The raw counts are then rescaled to a 1–10 scale, with the best-connected district scoring 10 and the worst scoring 1.

**What it means for the project:**

Each sub-layer tells a different story:
- **Public Transport** score: How many bus lines actually connect this neighbourhood to downtown? Low scores = underserved by transit.
- **Automobile** score: How many roads flow from this district to the centre? (Almost every district will score well here — useful as a baseline to show car dominance.)
- **Cycling** score: How many dedicated cycling routes connect to the centre? Low scores reveal where cycling infrastructure is missing.
- **Walking** score: How many footways and pedestrian paths reach the centre?

Comparing the cycling and public transport layers against the automobile layer shows exactly where the mobility gap is. Districts that score 8 on automobile but 2 on cycling are the priority zones for new infrastructure.

**Data source:** Live from OpenStreetMap via Overpass API (fetched each time you open the mode).

---

### Mode 2 — Facilities

**What question it answers:** Where are the venues and activities in Wolfsburg, and when are they busiest?

**What you see on the map:** Coloured dots representing individual venues. Dot size and brightness change based on the time of day and day of the week you set in the sidebar. Four categories shown:
- Blue — Schools and educational facilities
- Purple — Culture (theatres, museums, galleries)
- Green — Leisure (sports, parks, entertainment)
- Amber — Commercial (shops, restaurants, services)

**How the data works:**

Venue data is uploaded as an Excel file by the team. Each venue in the spreadsheet has a name, address, category, and activity hours (which days and times it is busy). The tool geocodes each address (converts it to map coordinates) and places a dot on the map.

The size and brightness of each dot change in real time as you move the time slider. A restaurant at lunchtime appears large and bright. The same restaurant at 3am is a faint small dot. This creates a picture of where activity is concentrated at different times.

**What it means for the project:**

This mode maps the destinations in Wolfsburg — the places people are travelling to. Overlaying this with hub locations shows whether hubs are placed close to where people actually want to go. Dense clusters of venues are natural hub candidates. Sparse areas with few facilities suggest lower demand and may need only S-hubs.

The time slider is particularly useful: showing the tool at 7am on a weekday reveals the Volkswagen commuter surge. At 6pm on a Friday, leisure venues light up.

**Data source:** Team-prepared Excel spreadsheet, uploaded manually. Addresses are geocoded via the Nominatim API (the official OpenStreetMap geocoder) with results cached locally so the same address is not looked up twice.

---

### Mode 3 — Greenery

**What question it answers:** Where are Wolfsburg's green spaces, and how are they distributed across districts?

**What you see on the map:** Green and blue areas overlaid on the city map, representing different types of natural space. A sidebar lets you toggle 8 categories on and off:
- Parks (maintained public parks)
- Grass (lawns, meadows, open grass areas)
- Forests (wooded areas)
- Agriculture (farmland and allotments)
- Vegetation (gardens, hedges, scrubland)
- Individual plants (significant single trees)
- Protected areas (conservation zones and nature reserves)
- Network (rivers, canals, waterways)

A "District Borders" overlay can be turned on to see how green space is distributed across neighbourhoods.

**How the data works:**

OpenStreetMap contains detailed records of land use. The tool fetches all green and natural features within the Wolfsburg city boundary, classifies each one into one of the 8 categories, and draws them as filled polygons or lines on the map.

**What it means for the project:**

This mode is most useful in combination with the Greenery Analysis in the sidebar, which scores each district on green space access. Districts with little green showing on this map but dense housing are candidates for reclaimed car space to become parks or pocket gardens — directly supporting the "what does freed parking space become?" argument.

The canal network (shown under "Network") is particularly relevant — the canal-side parking lot transformation proposal needs this layer to visualise before/after.

**Data source:** Live from OpenStreetMap via Overpass API.

---

### Mode 4 — Greenery Analysis (Social Vitality Scoring)

**What question it answers:** Which districts are socially alive — with parks, meeting spots, and places to linger — and which are social deserts?

**What you see on the map:** Districts coloured by one of four scores. A dropdown in the sidebar lets you switch between:
1. **Green Coverage** — How much green space does this district contain?
2. **Social Density** — How many places to meet and gather are in this district?
3. **Green Accessibility** — Can residents reach a quality park nearby?
4. **Encounter Potential** — Overall: how likely are people to bump into each other outdoors?

**How each score is calculated:**

**Green Coverage:** The tool measures what percentage of each district's area is covered by parks and forests. It uses a polygon-clipping algorithm (technically: Sutherland-Hodgman clipping) that accurately calculates the overlap between each green area and each district boundary — not just whether they touch, but exactly how much of the forest lies inside this neighbourhood. The resulting area is weighted and normalised to a 1–10 scale.

**Social Density:** The tool counts social amenities within each district and weights them by importance:
- Playgrounds: 5 points each (most important for community life)
- Sports pitches: 4 points each
- Cafés and outdoor seating areas: 3 points each
- Benches: 1 point each
- Water fountains, BBQ areas, shelters, public toilets: 1 point each

The total weighted count is divided by district area (to avoid larger districts always winning) and normalised to 1–10.

**Green Accessibility:** Rather than measuring how much green is *inside* the district, this measures how reachable quality green is *from* the district. A quality green space that falls directly inside the district scores 3 points. A quality space just outside the district boundary (within a short walk) scores 1 point. This distinction matters: a district with no internal park but surrounded by accessible parks can still score well.

**Encounter Potential Index:** A composite score combining all factors:
- 35% Green Coverage
- 30% Social Density
- 20% Transit Access (how many bus stops are nearby)
- 15% Pedestrian Path density

This index predicts which neighbourhoods already have the conditions for spontaneous social interaction — and which need investment.

**What it means for the project:**

This mode directly supports the "reclaimed car space" argument. Low Encounter Potential districts are where converting parking into pocket parks, benches, and play areas would have the most impact. High scores show where the city already has urban vitality to build on.

**Data source:** District boundaries from pre-processed GeoJSON files. Green features and social amenities fetched live from OpenStreetMap.

---

### Mode 5 — Intermodal Hub Analysis

**What question it answers:** Where should the mobility hubs be placed, and which existing locations are the best candidates?

**What you see on the map:** Dots marking proposed hub locations across the city. Colour indicates priority (high-priority vs. potential sites). Size indicates the hub's score. A sidebar shows hub statistics and lets you filter by type.

**How the hub placement algorithm works:**

This is the most complex calculation in the tool. It runs in five steps:

**Step 1 — Identify candidates.** The algorithm starts with every existing bus stop and every car parking location in Wolfsburg (fetched from OpenStreetMap). These are the candidate hub sites — places where a hub *could* be placed because infrastructure already partially exists.

**Step 2 — Score each candidate.** For each bus stop and parking location, the algorithm counts up activity in the surrounding area:
- Venues (restaurants, shops, schools, cultural sites) within 1,500 metres, weighted by their foot-traffic level. More visitors = higher weight.
- Parks within 500 metres add bonus points (green spaces attract people).
- Existing bike parking within 300 metres adds points (hub-ready infrastructure already in place).
- Residential buildings within 300 metres add a small bonus (direct catchment population).

The total is a single score: "how much activity is within reach of this location?"

**Step 3 — Spread hubs across the city.** Raw scoring would cluster all hubs in the city centre where activity is highest. The algorithm prevents this with a density filter:
- A top-scoring hub (top 30%) blocks other candidates within 400 metres — no need for two hubs this close together.
- A mid-scoring hub (middle 40%) blocks candidates within 700 metres.
- A lower-scoring hub (bottom 30%) blocks candidates within 1,200 metres.

This forces the algorithm to spread hubs outward to underserved areas.

**Step 4 — Merge nearby pairs.** If a bus stop and a car parking location sit within 200 metres of each other, they are merged into a single hub (using the location with the higher score). This reflects how real intermodal hubs combine transit and parking in one place.

**Step 5 — Assign priority.** Hubs above the median score become "priority" sites (to be built or activated first). Those below the median become "potential" sites (to be built in later phases).

**What the hub types mean:**
- **Combined bus + bike hub:** A bus stop with bike parking added. For the Wolfsburg plan, this is a typical M or S-hub.
- **Combined car + bike hub:** A car parking facility converted into a hub with bike parking and shared mobility docking. This is the L-hub model (repurposing multi-storey car parks).
- **Existing:** The hub already has some infrastructure in place. Lower investment needed.
- **Proposed:** New infrastructure is required at this site.

**What it means for the project:**

This mode is the spatial proof of the hub system. It shows not just where hubs *could* go, but ranks them by the actual activity they would serve. The 68-hub count (6L + 19M + 43S) came from running this algorithm and classifying the results by size and activity level.

**Data source:** Bus stops, car parking, bike parking, venues, parks from OpenStreetMap. Venue data supplemented by team-uploaded Excel.

---

### Mode 6 — Rad Network (Cycling Network)

**What question it answers:** How should cycling routes connect the hubs, the city centre, the neighbourhoods, and the landmarks — and where does new cycling infrastructure need to be built?

**What you see on the map:** A network of cycling routes drawn on the street map. Three route types shown in different shades of green. Dashed lines indicate routes that currently lack protected cycling infrastructure (these are the priority intervention zones). A sidebar shows network statistics and lets you filter by route type.

**How the cycling network algorithm works:**

**Step 1 — Build the city as a graph.** Every intersection and road segment in Wolfsburg is turned into a mathematical network where intersections are points and road segments are connections between them. Each connection is given a "cost" based on how bike-friendly the road type is:
- Dedicated cycleways and separated bike lanes: cost ×0.5 (strongly preferred — the algorithm actively seeks these out)
- Shared residential streets and footpaths: cost ×0.7 (acceptable)
- Minor roads: cost ×1.0 (neutral)
- Secondary roads: cost ×1.5 (discouraged)
- Primary roads (major arterials): cost ×2.0 (strongly avoided)
- Motorways and trunks: cost ×3.0 (avoided entirely where possible)

**Step 2 — Define the destinations.** The algorithm identifies four tiers of destinations:
- Order 1 (core): All mobility hubs, Wolfsburg Hauptbahnhof, and village/neighbourhood centres. These form the backbone of the network.
- Order 2 (attractors): The 30% highest-activity venues and all historic sites (castles, monuments). These are destinations worth cycling to.
- Order 3 (access points): Remaining bike parking locations and bus stops.

**Step 3 — Find the best routes using Dijkstra pathfinding.** Dijkstra's algorithm is the same method used by Google Maps and cycling navigation apps. It finds the genuinely shortest path through the actual street network — not a straight line, but the route that minimises total "cost" (accounting for road type weights above). This means the algorithm will detour several hundred metres to use a protected cycleway rather than taking the direct route on a busy road.

Three types of routes are calculated:
- **Type A (dark green):** Village/neighbourhood centres to the city centre — the main arterial cycling routes. These are highest priority.
- **Type B (medium green):** Hub-to-hub connections (each hub connected to its 3 nearest hubs) + each village to its nearest hub. These form the operational network for users switching between modes.
- **Type C (light green):** Historic sites connected to their nearest hub. These are secondary routes for visitors and tourism.

**Step 4 — Flag missing infrastructure.** After routing is complete, the algorithm checks each route segment: does it use a road that has no existing cycling infrastructure (no dedicated cycleway, no bike lane, no safe shared path)? Routes on unprotected major or secondary roads are flagged as "needs infrastructure" and shown as dashed lines on the map.

**What it means for the project:**

The dashed lines are the most important output for urban design decisions. They show exactly which street segments, if given protected cycling infrastructure, would complete the network. These are the priority streets for transformation in the project's proposals.

The solid lines show the existing cycleway network as it can already be used. Comparing solid versus dashed reveals how fragmented Wolfsburg's cycling infrastructure currently is.

**Data source:** Road network from OpenStreetMap (approximately 5,000 road segments). Hub locations from the Intermodal Hub algorithm. Venue activity from team-uploaded Excel.

---

### Mode 7 — Earth

**What question it answers:** What does the city actually look like from above?

**What you see:** Satellite base map replacing the standard map tiles. All other layers (hubs, routes, district borders) remain visible on top of the satellite imagery.

**What it is for:** Quick cross-reference between analysis results and real urban conditions. Useful for checking whether a proposed hub location makes physical sense, or whether a street flagged for cycling infrastructure is actually wide enough.

---

### Mode 8 — Data (Fleet and Modal Distribution)

**What question it answers:** How many vehicles does the post-car system need, and where does that number come from?

**What you see:** Charts and summary statistics from the Python analysis scripts. This mode is a dashboard view of the calculations that underpin the fleet sizing decisions.

**The three calculations behind this mode:**

---

#### Calculation A — Modal Distribution (Baseline)

**What it establishes:** The current situation — how Wolfsburg moves today.

**Inputs:**
- Population: 17,400 residents in the study area
- Workers: 18,000 people commuting to workplaces in the zone (primarily VW)
- Visitors: 7,080 per day
- Modal share from the German national mobility survey (MiD 2017), adjusted for Wolfsburg's higher car dependency: 62% private car, 20% walking, 10% public transit, 8% cycling

**Outputs:**
- Total daily trips: 104,100
- Car trips per day: 64,542
- Private vehicles in motion daily: 49,648 (accounting for average occupancy of 1.3 persons per car)
- Peak hour: 8:00–9:00am with 8,983 trips (8.6% of all daily trips happen in this one hour)

**What this tells the project:** Wolfsburg currently has nearly 50,000 cars moving daily. The 8am peak is the critical design constraint — the shared mobility system must handle 9,000 trips in that single hour. The 62% car share (vs. 8% cycling) is the gap the project is trying to close.

---

#### Calculation B — Fleet Sizing (The Proof)

**What it establishes:** How many shared vehicles are needed in the post-car scenario.

**Inputs:**
- The 104,100 daily trips from Calculation A
- Walking assumption: 60% of internal (short-distance) trips become walking in the post-car city — people no longer drive 400 metres because they no longer have a car outside their door
- This leaves 42,000 trips that need a shared vehicle
- Peak hour: 8,983 trips, of which inbound commuters (from outside) split across modes: 35% autonomous buses, 25% shuttles, 25% car-sharing, 15% pods; internal short trips split: 45% e-bikes, 35% pods, 20% shuttles
- Vehicle parameters: how many people each mode carries, how long each trip takes on average

**The core calculation:**

Shared vehicles work differently from private cars. A private car is used for 1–2 hours a day and sits parked for the remaining 22–23 hours. A shared vehicle, dispatched on demand, can make 6–10 trips per day. This is why far fewer shared vehicles are needed than private cars.

The formula: at peak hour, divide the number of trips per mode by the vehicle's carrying capacity, then multiply by the average trip duration in hours. This gives the number of vehicles that need to be in motion simultaneously. Add a 15–35% reserve (vehicles being charged, in maintenance, or waiting nearby) to get the total fleet size.

**Outputs:**
- E-bikes: 408 total (340 in motion at peak + 68 reserve)
- Autonomous shuttle pods: 71 total
- Autonomous buses: 44 total
- Autonomous micro-pods: 438 total
- Car-sharing EVs: 210 total
- **Total fleet: 1,273 vehicles**

**The comparison that matters:** 49,648 private cars today → 1,273 shared vehicles tomorrow. One shared vehicle replaces approximately 39 private cars. This is possible because shared vehicles circulate continuously; private cars spend 95% of their time parked.

**What this tells the project:** The fleet sizing calculation is the quantitative proof that the hub system is viable. 1,273 vehicles is a manageable fleet for a city like Wolfsburg — comparable to a modest bus network expansion, not a science-fiction scenario.

---

#### Calculation C — Hub Infrastructure Sizing

**What it establishes:** How much physical space and charging infrastructure is needed at each hub tier.

**Inputs:**
- The 1,273 vehicles from Calculation B
- Distribution rules: Large hubs handle all buses and car-sharing; Medium hubs handle shuttles and pods; Small hubs handle e-bikes primarily
- 20% of the fleet is always offline (charging or maintenance) — so total fleet is 20% larger than peak fleet
- Space requirements per vehicle type

**Outputs per hub tier:**

| | L-Hub (6 total) | M-Hub (19 total) | S-Hub (43 total) |
|--|--|--|--|
| E-bikes | 11 | 7 | 11 |
| Shuttles | 6 | 3 | — |
| Buses | 4 | — | — |
| Micro-pods | 10 | 10 | 3 |
| Car-sharing EVs | 15 | — | — |
| Charging points | ~50 | ~25 | ~15 |
| Footprint | ~600 m² | ~120 m² | ~35 m² |

Total network footprint: approximately 8,400 m² — **less than 0.25% of the city centre area**. Compare this to surface parking, which occupies more than 10% of the same area.

**What this tells the project:** Even accounting for charging infrastructure and vehicle storage, the physical footprint of the entire hub network is tiny compared to the parking it replaces. This is the land-efficiency argument for the transformation.

---

## How the Calculations Connect

The three Python calculations form a chain:

```
Current situation (modal_distribution.py)
        ↓
How many vehicles needed (fleet_calculation.py)
        ↓
How much space per hub (hub_calculation.py)
        ↓
Where exactly to place hubs (intermodalAlgorithm.js)
        ↓
How to connect them by bike (radAlgorithm.js)
        ↓
Which districts are served and which are left behind (greenSocialAnalysis.js + mobility scoring)
```

Each calculation is built on the one before it. If the fleet size changes, hub infrastructure sizing changes. If hub locations shift, the cycling network recalculates. Everything is linked.

---

## Data Sources Summary

| Data | Where it comes from | Updated |
|------|---------------------|---------|
| District boundaries (44 districts) | Pre-processed GeoJSON from OpenStreetMap | Static |
| Bus stops | OpenStreetMap via Overpass API | Live (fetched on use) |
| Car parking locations | OpenStreetMap via Overpass API | Live |
| Bike parking | OpenStreetMap via Overpass API | Live |
| Cycling routes and roads | OpenStreetMap via Overpass API | Live |
| Footways and pedestrian paths | OpenStreetMap via Overpass API | Live |
| Green spaces (parks, forests, water) | OpenStreetMap via Overpass API | Live |
| Base map tiles | CARTO (map tile service) | Live |
| Venue/facility locations and hours | Team Excel file uploaded manually | Manual |
| Population and mobility statistics | MiD 2017 (German national survey) + VW workforce data | Static |

---

## Planned / In Progress

*(Update this section as work progresses)*

- [ ] (add planned features here)

---

## Running the Tool Locally

```
cd wolfsburg-activity-map
npm install    (first time only)
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`).

To run the Python analysis scripts:
```
cd wolfsburg-activity-map/analysis
python hub_calculation.py
python fleet_calculation.py
python modal_distribution.py
```
Outputs are saved as CSV files and visualisation charts in the `analysis/outputs/` folder.
