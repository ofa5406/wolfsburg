/* =====================================================================
   Hub element descriptions. EDIT THIS FILE FREELY.
   ---------------------------------------------------------------------
   Two objects:
     HUB_CATEGORIES   the colour + label for each element category
     HUB_DESCRIPTIONS one entry per block, keyed by the block name
                      lower-cased with non-letters turned to "_".

   Each description: { title, cat, text }. Keep text to one short sentence.
   If a key is missing here, the viewer falls back to the raw block name.
   ===================================================================== */

/* Clean, light pastel palette. Same hues, lower saturation, higher
   lightness. Hover brightens + re-saturates these (see saturate() in index.html). */
window.HUB_CATEGORIES = {
  hub:  { name: "Hub zones / structure", color: "#d98c82" },
  mob:  { name: "Mobility",              color: "#7fa8e0" },
  shel: { name: "Shelter & comfort",     color: "#6cc2bd" },
  env:  { name: "Environment",           color: "#8bc48f" },
  way:  { name: "Wayfinding & access",   color: "#a99be0" },
  soc:  { name: "Social & cultural",     color: "#e09bc4" },
  lit:  { name: "Lighting",              color: "#eccd86" },
  str:  { name: "Street & crossing",     color: "#9aa6b3" },
  opt:  { name: "Optional elements",     color: "#efab7e" }
};

window.HUB_DESCRIPTIONS = {

  /* ---------- HUB ZONES / STRUCTURES (h_) ---------- */
  "h_av_bay": { title:"AV Bay (zone)", cat:"hub",
    text:"Marked kerbside bay where shuttle pods and autobuses pull in to drop off and pick up." },
  "h_pt_bay": { title:"Public Transport Bay (zone)", cat:"hub",
    text:"Fixed boarding zone where a bus or tram route meets the hub, often merged under the canopy." },
  "h_canopy_1": { title:"Hub Canopy (structure)", cat:"hub",
    text:"The hub's vertical beacon, sheltering the threshold where people wait and transfer." },
  "h_bahnhof_canopy": { title:"Station Canopy (Bahnhof)", cat:"hub",
    text:"Larger canopy at the station hub, scaled for the city's main interchange of rail, bus and fleet." },
  "h_park": { title:"Hub Park / Green Space", cat:"hub",
    text:"Green dwelling space of trees, planting and seating that makes the hub a place for public life." },
  "h_private_shareholder_allocation": { title:"Private Shareholder Allocation", cat:"hub",
    text:"Land in the masterplan set aside for private development, folding investment into the public hub." },
  "h_vendor_kiosk": { title:"Vendor / Kiosk Zone", cat:"hub",
    text:"Space for a small vendor like coffee or local goods that keeps the hub active through the day." },
  "h_s_hub": { title:"S-Hub (zone)", cat:"hub",
    text:"The compact last-mile tier, 43 across Wolfsburg, for grabbing an e-bike or micro-pod and leaving." },
  "h_bike_station": { title:"Bike Station (zone)", cat:"hub",
    text:"Concentrated cycle zone grouping shared e-bikes, private bike parking and cargo docks with charging." },
  "h_shared_ground": { title:"Shared Ground", cat:"hub",
    text:"Level shared surface where pedestrians and slow vehicles mix without kerbs." },
  "hub_ground": { title:"Hub Ground Surface", cat:"hub",
    text:"The continuous paved field that defines the hub, reclaimed from former car parking." },
  "h_av_car": { title:"Autonomous Shared Vehicle", cat:"hub",
    text:"A shared autonomous vehicle from the 763-strong fleet that replaces the private car." },
  "h_av_car_maintemance_and_parking_area_underground_ramp": { title:"Underground Fleet Ramp", cat:"hub",
    text:"Ramp to the underground level where the shared fleet is stored, charged and serviced, freeing the surface." },
  "h_pt_vehicle": { title:"Public Transport Vehicle", cat:"hub",
    text:"A scheduled bus or autobus at its boarding bay where a fixed route meets the hub." },
  "h_interaction_buildings": { title:"Hub Buildings (active ground floor)", cat:"hub",
    text:"Buildings framing the hub whose active ground floors hold shops and services that draw people in." },

  /* ---------- MOBILITY (EL_mob_) ---------- */
  "el_mob_avdropoff": { title:"AV Drop-off / Pickup", cat:"mob",
    text:"Marked drop-off and pickup zone for autonomous shuttle pods and buses at M and L hubs." },
  "el_mob_cargobikedock": { title:"Cargo Bike Dock", cat:"mob",
    text:"Docking for shared or private cargo bikes, supporting car-free deliveries and family trips." },
  "el_mob_chargingpoints": { title:"Charging Points", cat:"mob",
    text:"Charging built into docking furniture and structure rather than freestanding posts." },
  "el_mob_ebikedock": { title:"E-bike Docking Rack", cat:"mob",
    text:"Shared e-bike docking with charging, the last-mile backbone at every hub tier." },
  "el_mob_infoterminal": { title:"Real-time Information Terminal", cat:"mob",
    text:"Digital display of live arrivals, vehicle availability and the system map, at M and L hubs." },
  "el_mob_micropodzone": { title:"Micro-pod Zone", cat:"mob",
    text:"Marked area in the stone field where autonomous micro-pods stop." },
  "el_mob_privatebike": { title:"Private Bike Parking", cat:"mob",
    text:"Secure parking for personally owned bikes near the threshold zone." },
  "el_mob_sharedevbay": { title:"Shared EV Bay", cat:"mob",
    text:"Parking and charging bay for shared electric cars at M and L hubs." },

  /* ---------- SHELTER & COMFORT (EL_shel_) ---------- */
  "el_shel_bench": { title:"Bench", cat:"shel",
    text:"A linear bench in the dwelling zone that helps the hub read as a place to stay." },
  "el_shel_canopy": { title:"Canopy / Structural Element", cat:"shel",
    text:"Overhead structure at the threshold, the hub's beacon, sometimes housing the transit shed." },
  "el_shel_drinkingwater": { title:"Drinking Water Point", cat:"shel",
    text:"Public water access in the dwelling zone that supports longer stays." },
  "el_shel_groupseating": { title:"Group Seating", cat:"shel",
    text:"Larger seating for social groups in the dwelling zone, at M and L hubs." },
  "el_shel_repairstation": { title:"Bike Repair Station", cat:"shel",
    text:"Self-service bike tools and a pump set at the dwelling-zone edge." },

  /* ---------- ENVIRONMENT (EL_env_) ---------- */
  "el_env_treegrate": { title:"Tree with Stone Grate", cat:"env",
    text:"A tree set in the stone field with a flush grate, giving shade and identity." },
  "el_env_planting": { title:"Planting Bed / Bioswale", cat:"env",
    text:"A planted bed that can double as a stormwater channel between zones." },
  "el_env_permeable": { title:"Permeable Surface Zone", cat:"env",
    text:"Permeable paving sections that let stormwater soak into the ground." },

  /* ---------- WAYFINDING & ACCESS (EL_way_) ---------- */
  "el_way_directionallines": { title:"Directional Lines", cat:"way",
    text:"Lines set into the stone field guiding people to each mobility element." },
  "el_way_identitymarker": { title:"Hub Identity Marker", cat:"way",
    text:"Panel carrying the hub name, tier and a map of nearby hubs." },
  "el_way_tactilestrips": { title:"Tactile Paving Strips", cat:"way",
    text:"Tactile paving at every transition, boarding area and crossing for accessibility." },

  /* ---------- SOCIAL & CULTURAL (EL_soc_) ---------- */
  "el_soc_artmarker": { title:"Art / Cultural Marker", cat:"soc",
    text:"A site-specific artwork, one per hub, giving each a distinct identity." },
  "el_soc_communityboard": { title:"Community Information Board", cat:"soc",
    text:"A noticeboard for local events and neighbourhood information in the dwelling zone." },
  "el_soc_flexsurface": { title:"Flexible Surface Area", cat:"soc",
    text:"Clear paved area for temporary events, markets and gatherings, at M and L hubs." },
  "el_soc_kiosk": { title:"Vendor / Kiosk Slot", cat:"soc",
    text:"A defined slot for a small vendor that activates the hub, at M and L hubs." },

  /* ---------- LIGHTING (EL_lit_) ---------- */
  "el_lit_groundlight": { title:"Ground-embedded Lighting", cat:"lit",
    text:"Lighting set into the stone field so the hub stays navigable after dark." },
  "el_lit_ambientlight": { title:"Ambient Responsive Lighting", cat:"lit",
    text:"Canopy lighting that brightens on approach and stays low at quiet hours." },

  /* ---------- STREET & CROSSING (EL_str_) ---------- */
  "el_str_hubcrossing": { title:"Hub-integrated Crossing", cat:"str",
    text:"A crossing absorbed into the hub, linking both sides as one continuous surface." },
  "el_str_raisedcarriage": { title:"Raised / Narrowed Carriageway", cat:"str",
    text:"A raised or narrowed carriageway that slows vehicles at the crossing." },
  "el_str_bothsides": { title:"Elements Across Both Sides", cat:"str",
    text:"Hub elements spread across both sides of the street, joined by the crossing." },

  /* ---------- OPTIONAL (EL_opt_) ---------- */
  "el_opt_wildflower": { title:"Wildflower / Meadow Strip", cat:"opt",
    text:"Low-maintenance seasonal planting for biodiversity where manicured beds do not fit." },
  "el_opt_popupmarket": { title:"Pop-up Market Slot", cat:"opt",
    text:"A serviced surface for regular vendors, suited to the open space of L-hubs." },
  "el_opt_playelement": { title:"Children's Play Element", cat:"opt",
    text:"A play element near schools or homes that makes the hub a family destination." },
  "el_opt_gametable": { title:"Game Table", cat:"opt",
    text:"A chess or ping-pong table at larger hubs with social space." },
  "el_opt_memorymarker": { title:"Memory / History Marker", cat:"opt",
    text:"A marker telling the Wolfsburg transformation story, especially on former car parks." },
  "el_opt_livingwall": { title:"Living Wall / Vertical Garden", cat:"opt",
    text:"Planting on repurposed L-hub car-park walls offering large vertical surface." },
  "el_opt_cargolibrary": { title:"Cargo Bike Lending Library", cat:"opt",
    text:"A lending point for cargo bikes where demand is high." },
  "el_opt_solarcanopy": { title:"Solar Canopy", cat:"opt",
    text:"A canopy that generates energy where viable, shown as a design statement." },
  "el_opt_heatedzone": { title:"Heated Waiting Zone", cat:"opt",
    text:"Enclosed heated seating for cold or exposed spots, relevant to Wolfsburg winters." },
  "el_opt_devicecharging": { title:"Personal Device Charging", cat:"opt",
    text:"USB and wireless charging in a bench or canopy at high-dwell spots." },
  "el_opt_fitnesselement": { title:"Outdoor Fitness Element", cat:"opt",
    text:"A simple bar or balance element for all ages, at M and L hubs." },
  "el_opt_parcellockers": { title:"Parcel / Pickup Lockers", cat:"opt",
    text:"Delivery lockers that cut van traffic where parcel volume is high." },
  "el_opt_luggage": { title:"Luggage Storage", cat:"opt",
    text:"Storage near factory gates, rail links or major interchanges." },
  "el_opt_microlibrary": { title:"Micro-library / Book Exchange", cat:"opt",
    text:"A book exchange built into the structure at high-dwell neighbourhood hubs." },
  "el_opt_toollending": { title:"Tool / Equipment Lending", cat:"opt",
    text:"A small neighbourhood tool library near residential areas." },
  "el_opt_adaptivedock": { title:"Adaptive Mobility Dock", cat:"opt",
    text:"A dock for adaptive mobility equipment near care or medical facilities." }

};
