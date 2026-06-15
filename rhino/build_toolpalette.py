# -*- coding: utf-8 -*-
# Wolfsburg Hub Toolpalette builder
# Runs INSIDE Rhino 8 via the rhinomcp bridge:
#   execute_rhinoscript_python_code -> exec(open(this_file).read())
# Units: centimeters. Real scale. Diagrammatic massing (not detailed design).
#
# Builds: 10 material/category layers, ~45 element BLOCKS (EL_*),
# a labelled palette catalogue, and three sample hub scenes (S/M/L).
# Idempotent: clears its own objects/blocks and rebuilds from scratch.

import rhinoscriptsyntax as rs
import scriptcontext as sc

# ----------------------------------------------------------------------------
# Layer palette  (name -> calm, distinct RGB)
# ----------------------------------------------------------------------------
LAYERS = [
    ("01_Pavement", (197, 138, 110)),   # reddish stone field / paving
    ("02_Concrete", (168, 168, 162)),   # kerbs, plinths, structure, walls
    ("03_Metal",    (122, 142, 165)),   # frames, posts, racks, canopy structure
    ("04_Wood",     (156, 116,  74)),   # bench tops, planters, decking
    ("05_Glass",    (168, 208, 219)),   # screens, glazing, shelter panels
    ("06_Plastic",  (216, 178,  92)),   # markings, dock units, signage panels
    ("07_Greenery", (112, 158,  92)),   # trees, planting, bioswale
    ("08_Lighting", (244, 224, 150)),   # ground / ambient glow elements
    ("09_Context",  (208, 208, 208)),   # carriageway, surrounding buildings
    ("10_Labels",   ( 92,  92,  92)),   # catalogue text
]
L_PAVE, L_CONC, L_MET, L_WOOD, L_GLASS, L_PLAS, L_GREEN, L_LIGHT, L_CTX, L_LBL = [n for n, _ in LAYERS]


def setup_layers():
    for name, rgb in LAYERS:
        if not rs.IsLayer(name):
            rs.AddLayer(name, rgb)
        else:
            rs.LayerColor(name, rgb)
    rs.CurrentLayer(L_PAVE)
    # remove the stock placeholder layers (model already cleared, so they are empty)
    for old in ["Layer 01", "Layer 02", "Layer 03", "Layer 04", "Layer 05", "Layer 06"]:
        if rs.IsLayer(old):
            try:
                rs.DeleteLayer(old)
            except Exception:
                pass


def clear_model():
    objs = rs.AllObjects()
    if objs:
        rs.DeleteObjects(objs)
    for bn in (rs.BlockNames() or []):
        if bn.startswith("EL_"):
            try:
                rs.DeleteBlock(bn)
            except Exception:
                pass

# ----------------------------------------------------------------------------
# Geometry helpers  (cx,cy = footprint centre in XY; z0 = base height)
# ----------------------------------------------------------------------------

def box(cx, cy, z0, sx, sy, sz, layer):
    x0, x1 = cx - sx / 2.0, cx + sx / 2.0
    y0, y1 = cy - sy / 2.0, cy + sy / 2.0
    z1 = z0 + sz
    pts = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
           (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    o = rs.AddBox(pts)
    rs.ObjectLayer(o, layer)
    return o


def cyl(cx, cy, z0, r, h, layer):
    o = rs.AddCylinder((cx, cy, z0), h, r, True)
    rs.ObjectLayer(o, layer)
    return o


def sph(cx, cy, cz, r, layer, squash=1.0):
    o = rs.AddSphere((cx, cy, cz), r)
    if squash != 1.0:
        rs.ScaleObject(o, (cx, cy, cz), (1, 1, squash))
    rs.ObjectLayer(o, layer)
    return o

# ----------------------------------------------------------------------------
# Text  (the file's stock annotation style has DimScale 30, which blows text up
# 30x; TP_Text is a dedicated style at scale 1 so a height of 50 means 50 cm.)
# ----------------------------------------------------------------------------
TP_STYLE = "TP_Text"

def ensure_text_style():
    if not rs.IsDimStyle(TP_STYLE):
        rs.AddDimStyle(TP_STYLE)
    ds = sc.doc.DimStyles.FindName(TP_STYLE)
    ds.DimensionScale = 1.0
    ds.TextHeight = 50.0
    sc.doc.DimStyles.Modify(ds, ds.Index, True)
    rs.CurrentDimStyle(TP_STYLE)


def txt(text, pt, height):
    o = rs.AddText(text, pt, height, "Arial")
    rs.ObjectLayer(o, L_LBL)
    st = sc.doc.DimStyles.FindName(TP_STYLE)
    ro = sc.doc.Objects.FindId(o)
    te = ro.Geometry
    te.DimensionStyleId = st.Id
    te.TextHeight = height
    sc.doc.Objects.Replace(o, te)
    return o

# ----------------------------------------------------------------------------
# Element builders  -> each returns a list of object ids, built around origin
# ----------------------------------------------------------------------------

def b_ebikeDock():
    g = [box(0, 0, 0, 360, 80, 6, L_PAVE)]
    for i in range(6):
        x = -150 + i * 60
        g.append(cyl(x, 0, 6, 4, 95, L_MET))
    g.append(box(0, 0, 95, 360, 8, 8, L_MET))
    g.append(box(195, 0, 6, 40, 80, 70, L_PLAS))   # dock terminal
    return g

def b_privateBike():
    g = [box(0, 0, 0, 300, 70, 6, L_PAVE)]
    for i in range(5):
        x = -120 + i * 60
        g.append(box(x, 0, 6, 6, 70, 75, L_MET))
    return g

def b_cargoBikeDock():
    g = [box(0, 0, 0, 320, 130, 6, L_PAVE)]
    for i in range(3):
        x = -100 + i * 100
        g.append(box(x, 0, 6, 8, 120, 70, L_MET))
    g.append(box(150, 0, 6, 36, 120, 90, L_PLAS))
    return g

def b_microPodZone():
    g = [box(0, 0, 0, 520, 300, 4, L_PAVE)]
    # painted outline
    g.append(box(0, 145, 4, 520, 10, 2, L_PLAS))
    g.append(box(0, -145, 4, 520, 10, 2, L_PLAS))
    # pod proxy
    g.append(box(0, 0, 4, 320, 170, 150, L_GLASS))
    g.append(box(0, 0, 4, 330, 180, 90, L_PLAS))
    return g

def b_sharedEVbay():
    g = [box(0, 0, 0, 500, 250, 4, L_PAVE)]
    g.append(box(0, 125, 4, 500, 8, 2, L_PLAS))
    g.append(box(0, -125, 4, 500, 8, 2, L_PLAS))
    g.append(box(0, 0, 4, 450, 180, 120, L_GLASS))   # car body glazing
    g.append(box(0, 0, 4, 460, 185, 70, L_PLAS))     # car body
    g.append(cyl(-230, 110, 4, 8, 120, L_MET))       # charge post
    g.append(box(-230, 110, 124, 40, 12, 40, L_GLASS))
    return g

def b_avDropoff():
    g = [box(0, 0, 0, 1200, 350, 4, L_PAVE)]
    g.append(box(0, 170, 4, 1200, 12, 3, L_PLAS))
    g.append(box(0, -170, 4, 1200, 12, 3, L_PLAS))
    g.append(box(0, 0, 4, 420, 220, 160, L_GLASS))   # shuttle pod
    g.append(box(0, 0, 4, 430, 230, 90, L_PLAS))
    g.append(cyl(560, 150, 4, 8, 230, L_MET))        # marker post
    return g

def b_chargingPoints():
    g = [box(0, 0, 0, 60, 60, 6, L_PAVE)]
    g.append(cyl(0, 0, 6, 10, 110, L_MET))
    g.append(box(0, 0, 116, 44, 12, 44, L_GLASS))
    return g

def b_infoTerminal():
    g = [box(0, 0, 0, 60, 30, 20, L_MET)]
    g.append(box(0, 0, 20, 24, 14, 70, L_MET))
    g.append(box(0, 0, 90, 80, 12, 130, L_GLASS))
    return g

def b_ptShed():
    g = []
    for sx in (-160, 160):
        g.append(cyl(sx, -80, 0, 6, 250, L_MET))
        g.append(cyl(sx, 80, 0, 6, 250, L_MET))
    g.append(box(0, 0, 250, 360, 190, 12, L_MET))     # roof
    g.append(box(0, 90, 0, 340, 8, 250, L_GLASS))     # back glass
    g.append(box(0, 0, 42, 280, 40, 8, L_WOOD))       # bench
    return g

def b_directionalLines():
    g = [box(0, 0, 0, 320, 300, 4, L_PAVE)]
    for i in range(4):
        y = -90 + i * 60
        g.append(box(0, y, 4, 240, 8, 2, L_PLAS))
    return g

def b_tactileStrips():
    g = [box(0, 0, 0, 240, 70, 4, L_PAVE)]
    g.append(box(0, 0, 4, 240, 60, 4, L_PLAS))
    for i in range(7):
        x = -90 + i * 30
        g.append(cyl(x, 0, 8, 4, 3, L_PLAS))
    return g

def b_identityMarker():
    g = [box(0, 0, 0, 40, 40, 8, L_CONC)]
    g.append(cyl(0, 0, 8, 6, 230, L_MET))
    g.append(box(0, 0, 120, 90, 8, 150, L_PLAS))
    return g

def b_canopy():
    g = []
    for sx in (-240, 240):
        for sy in (-180, 180):
            g.append(cyl(sx, sy, 0, 12, 350, L_MET))
    g.append(box(0, 0, 350, 540, 440, 20, L_MET))     # roof
    g.append(box(0, 0, 360, 480, 380, 6, L_GLASS))    # rooflight
    return g

def b_bench():
    g = [box(0, 0, 42, 180, 45, 8, L_WOOD)]
    g.append(box(-78, 0, 0, 12, 45, 42, L_MET))
    g.append(box(78, 0, 0, 12, 45, 42, L_MET))
    return g

def b_groupSeating():
    g = [box(0, 0, 42, 240, 45, 8, L_WOOD)]
    g.append(box(98, 78, 42, 45, 200, 8, L_WOOD))
    for x in (-100, 0, 100):
        g.append(box(x, 0, 0, 12, 45, 42, L_MET))
    g.append(box(98, 150, 0, 45, 12, 42, L_MET))
    return g

def b_drinkingWater():
    g = [box(0, 0, 0, 50, 40, 10, L_CONC)]
    g.append(cyl(0, 0, 10, 12, 90, L_MET))
    g.append(box(0, 0, 90, 50, 40, 15, L_CONC))
    return g

def b_repairStation():
    g = [box(0, 0, 0, 40, 40, 6, L_PAVE)]
    g.append(cyl(0, 0, 6, 6, 120, L_MET))
    g.append(box(0, 18, 110, 50, 16, 10, L_MET))   # tool arm
    g.append(box(0, -16, 30, 18, 14, 60, L_PLAS))  # pump
    return g

def b_treeGrate():
    g = [box(0, 0, 0, 220, 220, 4, L_PAVE)]
    g.append(box(0, 0, 4, 200, 8, 3, L_MET))       # grate bars
    g.append(box(0, 0, 4, 8, 200, 3, L_MET))
    g.append(cyl(0, 0, 4, 12, 300, L_WOOD))        # trunk
    g.append(sph(0, 0, 430, 220, L_GREEN, 0.8))    # canopy
    return g

def b_plantingBioswale():
    g = [box(0, 0, 0, 400, 80, 25, L_CONC)]        # kerb
    g.append(box(0, 0, 10, 384, 64, 22, L_GREEN))  # planting
    for x in (-130, 0, 130):
        g.append(sph(x, 0, 40, 30, L_GREEN))
    return g

def b_permeableSurface():
    g = [box(0, 0, 0, 400, 300, 6, L_PAVE)]
    for i in range(5):
        x = -160 + i * 80
        g.append(box(x, 0, 6, 4, 300, 2, L_GREEN))  # joint planting
    return g

def b_communityBoard():
    g = []
    for sx in (-85, 85):
        g.append(cyl(sx, 0, 0, 5, 220, L_MET))
    g.append(box(0, 0, 90, 180, 10, 110, L_WOOD))
    g.append(box(0, -6, 95, 170, 4, 100, L_GLASS))
    return g

def b_kioskSlot():
    g = [box(0, 0, 0, 300, 250, 250, L_MET)]
    g.append(box(0, -125, 30, 280, 6, 200, L_GLASS))   # front glass
    g.append(box(0, -125, 90, 300, 30, 12, L_WOOD))    # counter
    g.append(box(0, 0, 250, 320, 270, 12, L_MET))      # roof
    return g

def b_artMarker():
    g = [box(0, 0, 0, 90, 90, 20, L_CONC)]
    g.append(cyl(0, 0, 20, 10, 300, L_MET))
    g.append(sph(0, 0, 360, 80, L_MET))
    return g

def b_flexibleSurface():
    g = [box(0, 0, 0, 600, 600, 4, L_PAVE)]
    for cx, cy in [(-290, -290), (290, -290), (290, 290), (-290, 290)]:
        g.append(cyl(cx, cy, 4, 5, 4, L_PLAS))   # corner studs
    return g

def b_groundLight():
    g = [box(0, 0, 0, 100, 100, 4, L_PAVE)]
    for cx, cy in [(-30, 0), (30, 0)]:
        g.append(cyl(cx, cy, 4, 6, 2, L_LIGHT))
    return g

def b_ambientLight():
    g = [box(0, 0, 0, 30, 30, 6, L_CONC)]
    g.append(cyl(0, 0, 6, 5, 450, L_MET))
    g.append(box(0, 12, 440, 40, 22, 14, L_LIGHT))
    return g

def b_hubCrossing():
    g = [box(0, 0, 0, 600, 400, 12, L_PAVE)]       # raised table
    for i in range(6):
        x = -250 + i * 100
        g.append(box(x, 0, 12, 40, 360, 2, L_PLAS))  # zebra bars
    g.append(box(0, 190, 12, 600, 20, 4, L_PLAS))    # tactile edges
    g.append(box(0, -190, 12, 600, 20, 4, L_PLAS))
    return g

def b_raisedCarriageway():
    g = [box(0, 0, 0, 800, 600, 15, L_PAVE)]
    g.append(box(0, 0, 15, 760, 12, 2, L_PLAS))      # centre line
    g.append(box(-410, 0, 0, 20, 600, 15, L_CONC))   # ramp edge
    g.append(box(410, 0, 0, 20, 600, 15, L_CONC))
    return g

def b_bothSidesDistribution():
    g = [box(0, 0, 0, 1000, 250, 6, L_CTX)]          # road context band
    g.append(box(-380, 0, 6, 220, 220, 4, L_PAVE))   # pad A
    g.append(box(380, 0, 6, 220, 220, 4, L_PAVE))    # pad B
    g.append(box(0, 0, 6, 240, 240, 6, L_PAVE))      # crossing link
    return g

# --- optional ---

def b_heatedZone():
    g = []
    for sx in (-95, 95):
        g.append(cyl(sx, -55, 0, 5, 210, L_MET))
        g.append(cyl(sx, 55, 0, 5, 210, L_MET))
    g.append(box(0, 55, 0, 200, 6, 210, L_GLASS))    # back
    g.append(box(0, 0, 210, 210, 130, 10, L_MET))    # roof
    g.append(box(0, -10, 42, 160, 40, 8, L_WOOD))    # heated bench
    g.append(box(0, 50, 30, 180, 4, 12, L_LIGHT))    # heater strip
    return g

def b_deviceCharging():
    g = [box(0, 0, 42, 130, 45, 8, L_WOOD)]
    g.append(box(-50, 0, 0, 12, 45, 42, L_MET))
    g.append(box(50, 0, 0, 12, 45, 42, L_MET))
    g.append(box(0, 0, 50, 30, 20, 6, L_PLAS))       # charge panel
    g.append(box(0, 0, 56, 10, 8, 2, L_LIGHT))
    return g

def b_solarCanopy():
    g = []
    for sx in (-240, 240):
        g.append(cyl(sx, -180, 0, 12, 320, L_MET))
        g.append(cyl(sx, 180, 0, 12, 380, L_MET))    # tilt
    g.append(box(0, 0, 360, 520, 400, 10, L_GLASS))  # PV roof
    return g

def b_wildflowerStrip():
    g = [box(0, 0, 0, 400, 100, 10, L_GREEN)]
    import random
    for i in range(10):
        x = -180 + i * 40
        g.append(sph(x, (-20 if i % 2 else 20), 12, 14, L_GREEN))
    return g

def b_livingWall():
    g = [box(0, 0, 0, 300, 24, 300, L_MET)]
    g.append(box(0, -12, 10, 280, 8, 280, L_GREEN))
    return g

def b_cargoBikeLibrary():
    g = [box(0, 0, 0, 360, 140, 6, L_PAVE)]
    for sx in (-200, 200):
        g.append(cyl(sx, 0, 6, 6, 220, L_MET))
    g.append(box(0, 0, 220, 420, 150, 10, L_MET))
    for x in (-100, 0, 100):
        g.append(box(x, 0, 6, 180, 50, 90, L_PLAS))  # cargo bikes
    return g

def b_adaptiveDock():
    g = [box(0, 0, 0, 320, 320, 4, L_PAVE)]
    g.append(box(0, 0, 4, 240, 8, 2, L_PLAS))        # access symbol
    g.append(box(0, 0, 4, 8, 240, 2, L_PLAS))
    g.append(cyl(120, 120, 4, 6, 110, L_MET))
    g.append(box(120, 120, 90, 30, 30, 6, L_PLAS))
    return g

def b_parcelLockers():
    g = [box(0, 0, 0, 240, 60, 200, L_MET)]
    for r in range(3):
        for c in range(4):
            g.append(box(-90 + c * 60, -31, 20 + r * 60, 50, 4, 50, L_PLAS))
    return g

def b_luggageStorage():
    g = [box(0, 0, 0, 200, 80, 180, L_MET)]
    for c in range(2):
        for r in range(2):
            g.append(box(-50 + c * 100, -41, 20 + r * 80, 85, 4, 70, L_PLAS))
    return g

def b_microLibrary():
    g = [cyl(0, 0, 0, 6, 90, L_MET)]
    g.append(box(0, 0, 90, 60, 40, 80, L_WOOD))
    g.append(box(0, -20, 95, 50, 4, 70, L_GLASS))
    return g

def b_gameTable():
    g = [box(0, 0, 69, 140, 80, 6, L_WOOD)]
    for cx, cy in [(-60, -34), (60, -34), (60, 34), (-60, 34)]:
        g.append(box(cx, cy, 0, 10, 10, 69, L_CONC))
    g.append(box(0, -60, 38, 120, 28, 6, L_WOOD))    # bench
    g.append(box(0, 60, 38, 120, 28, 6, L_WOOD))
    return g

def b_playElement():
    g = [box(0, 0, 0, 300, 300, 6, L_PAVE)]
    for sx in (-100, 100):
        g.append(cyl(sx, -100, 6, 6, 180, L_MET))
    g.append(box(0, -100, 186, 220, 12, 12, L_MET))  # top bar
    g.append(box(80, 60, 6, 80, 200, 70, L_PLAS))    # slide
    g.append(sph(-90, 90, 30, 30, L_GREEN))
    return g

def b_fitnessElement():
    g = [box(0, 0, 0, 220, 120, 6, L_PAVE)]
    for sx in (-90, 90):
        g.append(cyl(sx, 0, 6, 5, 240, L_MET))
    g.append(box(0, 0, 240, 200, 8, 8, L_MET))       # high bar
    g.append(box(0, 0, 60, 200, 8, 8, L_MET))        # low bar
    return g

def b_popupMarket():
    g = [box(0, 0, 0, 300, 250, 6, L_PAVE)]
    for sx in (-130, 130):
        g.append(cyl(sx, -110, 6, 5, 220, L_MET))
        g.append(cyl(sx, 110, 6, 5, 240, L_MET))
    g.append(box(0, 0, 240, 320, 270, 8, L_PLAS))    # fabric roof
    g.append(box(0, -110, 90, 280, 30, 12, L_WOOD))  # counter
    return g

def b_memoryMarker():
    g = [box(0, 0, 0, 80, 40, 90, L_CONC)]
    g.append(box(0, -21, 30, 70, 4, 40, L_PLAS))     # plaque
    g.append(box(70, 0, 0, 40, 40, 130, L_CONC))     # car-park column fragment
    return g

def b_toolLending():
    g = [box(0, 0, 0, 200, 150, 220, L_WOOD)]
    g.append(box(0, -75, 10, 70, 4, 200, L_MET))     # door
    g.append(box(0, 0, 220, 220, 170, 10, L_MET))    # roof
    g.append(box(80, -75, 150, 30, 4, 20, L_PLAS))   # sign
    return g

# ----------------------------------------------------------------------------
# Element registry  (order = catalogue order)
# key, label, builder, category, materials, tier, zone, description
# ----------------------------------------------------------------------------
ELEMENTS = [
 ("EL_mob_ebikeDock","E-bike docking rack",b_ebikeDock,"Mobility","metal/pavement/plastic","S/M/L","Zone 1","Shared e-bike docking with integrated charging at the vehicle edge."),
 ("EL_mob_privateBike","Private bike parking",b_privateBike,"Mobility","metal/pavement","S/M/L","Zone 2","Secure parking for personally owned bikes, near the threshold zone."),
 ("EL_mob_cargoBikeDock","Cargo bike dock",b_cargoBikeDock,"Mobility","metal/pavement/plastic","M/L","Zone 1","Docking bays for shared or private cargo bikes."),
 ("EL_mob_microPodZone","Micro-pod arrival/departure",b_microPodZone,"Mobility","pavement/glass/plastic","S/M/L","Zone 1","Marked stop within the stone field where autonomous micro-pods arrive and depart."),
 ("EL_mob_sharedEVbay","Shared EV bay",b_sharedEVbay,"Mobility","pavement/glass/metal","M/L","Zone 1","Parking and charging bay for shared electric cars."),
 ("EL_mob_avDropoff","AV drop-off / pickup",b_avDropoff,"Mobility","pavement/glass/plastic","M/L","Zone 1","Dedicated marked zone sized for autonomous shuttle pods and buses."),
 ("EL_mob_chargingPoints","Charging point",b_chargingPoints,"Mobility","metal/glass","S/M/L","Zone 1","Charging integrated into furniture/structure rather than freestanding posts."),
 ("EL_mob_infoTerminal","Real-time info terminal",b_infoTerminal,"Mobility","metal/glass","M/L","Zone 2","Digital display: live arrivals and vehicle availability at this hub."),
 ("EL_mob_ptShed","Public transport shed",b_ptShed,"Mobility","metal/glass/wood","all","Zone 2","Shelter at fixed bus/tram stops; may merge with the canopy as one structure."),
 ("EL_way_directionalLines","Directional lines",b_directionalLines,"Wayfinding","pavement/plastic","S/M/L","Field","Lines embedded in the stone field pointing toward each mobility element."),
 ("EL_way_tactileStrips","Tactile paving strips",b_tactileStrips,"Wayfinding","pavement/plastic","S/M/L","Transitions","Raised tactile surface at all zone transitions, boarding areas, and crossings."),
 ("EL_way_identityMarker","Hub identity marker",b_identityMarker,"Wayfinding","concrete/metal/plastic","S/M/L","Zone 2","Panel with hub name, tier (S/M/L), and map of nearby hubs."),
 ("EL_shel_canopy","Canopy / beacon",b_canopy,"Shelter","metal/glass","S/M/L","Zone 2","The vertical beacon, readable from 50 m; overhead structure at the threshold."),
 ("EL_shel_bench","Bench",b_bench,"Shelter","wood/metal","S/M/L","Zone 3","Linear bench for individual users at the dwelling edge."),
 ("EL_shel_groupSeating","Group seating",b_groupSeating,"Shelter","wood/metal","M/L","Zone 3","Larger seating configuration for social groups."),
 ("EL_shel_drinkingWater","Drinking water point",b_drinkingWater,"Shelter","concrete/metal","S/M/L","Zone 3","Public drinking water access."),
 ("EL_shel_repairStation","Bike repair station",b_repairStation,"Shelter","metal/plastic","S/M/L","Zone 3","Self-service tools and pump at the dwelling edge."),
 ("EL_env_treeGrate","Tree with stone grate",b_treeGrate,"Environment","wood/metal/greenery","S/M/L","Field","Tree in the stone field with a flush grate; shade, identity, climate benefit."),
 ("EL_env_planting","Planting / bioswale",b_plantingBioswale,"Environment","concrete/greenery","M/L","Zone 3","Linear planted bed that can double as a stormwater channel."),
 ("EL_env_permeable","Permeable surface",b_permeableSurface,"Environment","pavement/greenery","M/L","Field","Permeable paving sections for stormwater infiltration."),
 ("EL_soc_communityBoard","Community board",b_communityBoard,"Social","wood/glass/metal","S/M/L","Zone 3","Physical noticeboard for local events and neighbourhood information."),
 ("EL_soc_kiosk","Vendor / kiosk slot",b_kioskSlot,"Social","metal/glass/wood","M/L","Zone 3","Defined position for a small vendor (coffee, local goods)."),
 ("EL_soc_artMarker","Art / cultural marker",b_artMarker,"Social","concrete/metal","S/M/L","Field","Site-specific artwork integrated into the hub, one per hub."),
 ("EL_soc_flexSurface","Flexible surface area",b_flexibleSurface,"Social","pavement/plastic","M/L","Zone 3","Clear paved area for temporary events, markets, and gatherings."),
 ("EL_lit_groundLight","Ground-embedded lighting",b_groundLight,"Lighting","pavement/lighting","S/M/L","Field","Lighting set into the stone field so the hub is navigable after dark."),
 ("EL_lit_ambientLight","Ambient responsive lighting",b_ambientLight,"Lighting","metal/lighting","S/M/L","Zone 2","Lighting that brightens on approach, atmospheric at low-use hours."),
 ("EL_str_hubCrossing","Hub-integrated crossing",b_hubCrossing,"Street","pavement/plastic","S/M/L","Carriageway","Raised crossing tying the two sides of the street into the hub."),
 ("EL_str_raisedCarriage","Raised / narrowed carriageway",b_raisedCarriageway,"Street","pavement/concrete","M/L","Carriageway","Raised or narrowed road table that calms traffic and integrates the crossing."),
 ("EL_str_bothSides","Both-sides distribution",b_bothSidesDistribution,"Street","pavement/context","M/L","Carriageway","Hub elements distributed across the street, linked by the crossing."),
 ("EL_opt_heatedZone","Heated waiting zone",b_heatedZone,"Optional","glass/metal/wood/lighting","opt","Zone 3","Semi-enclosed heated seating for cold or exposed locations."),
 ("EL_opt_deviceCharging","Personal device charging",b_deviceCharging,"Optional","wood/plastic/lighting","opt","Zone 3","USB / wireless charging in bench or canopy at high-dwell locations."),
 ("EL_opt_solarCanopy","Solar canopy",b_solarCanopy,"Optional","metal/glass","opt","Zone 2","Energy-generating canopy where PV is viable and visible as a statement."),
 ("EL_opt_wildflower","Wildflower / meadow strip",b_wildflowerStrip,"Optional","greenery","opt","Zone 3","Low-maintenance seasonal planting for biodiversity."),
 ("EL_opt_livingWall","Living wall",b_livingWall,"Optional","metal/greenery","opt","L facade","Vertical garden on L-hub facades / repurposed car-park walls."),
 ("EL_opt_cargoLibrary","Cargo bike lending library",b_cargoBikeLibrary,"Optional","pavement/metal/plastic","opt","Zone 1","Covered cargo-bike lending where cargo demand is high."),
 ("EL_opt_adaptiveDock","Adaptive mobility dock",b_adaptiveDock,"Optional","pavement/metal/plastic","opt","Zone 1","Dock for accessible vehicles near care/medical facilities."),
 ("EL_opt_parcelLockers","Parcel pickup lockers",b_parcelLockers,"Optional","metal/plastic","opt","Zone 3","Last-mile delivery lockers that reduce van traffic."),
 ("EL_opt_luggage","Luggage storage",b_luggageStorage,"Optional","metal/plastic","opt","Zone 3","Luggage lockers near factory gates or interchange points."),
 ("EL_opt_microLibrary","Micro-library / book exchange",b_microLibrary,"Optional","wood/glass/metal","opt","Zone 3","Book exchange integrated into the structure at high-dwell hubs."),
 ("EL_opt_gameTable","Game table",b_gameTable,"Optional","wood/concrete","opt","Zone 3","Chess / ping-pong table at hubs with social ambition."),
 ("EL_opt_playElement","Children's play element",b_playElement,"Optional","pavement/metal/plastic/greenery","opt","Zone 3","Simple play element making the hub a family destination."),
 ("EL_opt_fitnessElement","Outdoor fitness element",b_fitnessElement,"Optional","pavement/metal","opt","Zone 3","Minimal fitness bars serving all ages."),
 ("EL_opt_popupMarket","Pop-up market slot",b_popupMarket,"Optional","pavement/metal/plastic/wood","opt","Zone 3","Serviced regular vendor surface in L-hub open spaces."),
 ("EL_opt_memoryMarker","Memory / history marker",b_memoryMarker,"Optional","concrete/plastic","opt","Field","Marks the transformation story, esp. L-hubs on former car parks."),
 ("EL_opt_toolLending","Tool lending point",b_toolLending,"Optional","wood/metal/plastic","opt","Zone 3","Small neighbourhood tool library near residential areas."),
]

# ----------------------------------------------------------------------------
# Build all blocks
# ----------------------------------------------------------------------------

def build_blocks():
    made = []
    for key, label, fn, cat, mats, tier, zone, desc in ELEMENTS:
        ids = fn()
        ids = [i for i in ids if i]
        rs.AddBlock(ids, (0, 0, 0), key, True)
        made.append(key)
    return made

# ----------------------------------------------------------------------------
# Palette catalogue layout
# ----------------------------------------------------------------------------

def layout_palette():
    cols = 6
    cell = 1100
    txt("WOLFSBURG HUB TOOLPALETTE", (-450, 900, 0), 120)
    txt("kit-of-parts  -  diagrammatic massing  -  scale cm", (-450, 700, 0), 55)
    for idx, (key, label, fn, cat, mats, tier, zone, desc) in enumerate(ELEMENTS):
        col = idx % cols
        row = idx // cols
        x = col * cell
        y = -row * cell
        inst = rs.InsertBlock(key, (x, y, 0))
        rs.SetUserText(inst, "element", label)
        rs.SetUserText(inst, "category", cat)
        rs.SetUserText(inst, "materials", mats)
        rs.SetUserText(inst, "tier", tier)
        rs.SetUserText(inst, "zone", zone)
        rs.SetUserText(inst, "description", desc)
        txt(label, (x - cell * 0.45, y - cell * 0.33, 0), 50)
        txt("%s  |  %s" % (cat, tier), (x - cell * 0.45, y - cell * 0.42, 0), 40)

# ----------------------------------------------------------------------------
# Scenes
# ----------------------------------------------------------------------------

def ground_field(cx, cy, w, l):
    # w across street (Y), l along street (X)
    o = box(cx, cy, 0, l, w, 3, L_PAVE)
    return o

def carriageway(cx, cy, w_road, l):
    o = box(cx, cy, 0, l, w_road, 4, L_CTX)
    rs.ObjectLayer(o, L_CTX)
    return o

def building_edge(cx, cy, l, depth, h):
    return box(cx, cy, 0, l, depth, h, L_CTX)

def place(key, cx, cy, dx, dy, ang=0):
    return rs.InsertBlock(key, (cx + dx, cy + dy, 0), (1, 1, 1), ang)


def scene_S(cx, cy):
    g = [ground_field(cx, cy, 1300, 1800)]
    g.append(carriageway(cx, cy, 600, 1800))
    g.append(building_edge(cx, cy + 800, 1800, 200, 900))   # one building side
    # Zone 1 (vehicle edge, just off carriageway)
    g.append(place("EL_mob_microPodZone", cx, cy, -300, 400))
    g.append(place("EL_mob_ebikeDock", cx, cy, 450, 400))
    g.append(place("EL_mob_chargingPoints", cx, cy, 650, 360))
    # Zone 2 (threshold)
    g.append(place("EL_shel_canopy", cx, cy, 0, 560))
    g.append(place("EL_way_identityMarker", cx, cy, -550, 560))
    g.append(place("EL_mob_privateBike", cx, cy, 500, 600))
    # Zone 3 (dwelling)
    g.append(place("EL_shel_bench", cx, cy, -300, 720))
    g.append(place("EL_env_treeGrate", cx, cy, 250, 740))
    g.append(place("EL_soc_communityBoard", cx, cy, 650, 720))
    g.append(place("EL_lit_groundLight", cx, cy, -550, 300))
    g.append(place("EL_soc_artMarker", cx, cy, -700, 700))
    # crossing in the carriageway
    g.append(place("EL_str_hubCrossing", cx, cy, 0, 0))
    grp = rs.AddGroup("SCENE_S")
    rs.AddObjectsToGroup([x for x in g if x], grp)
    txt("SCENE  S  -  The Moment", (cx - 700, cy - 850, 0), 130)
    return g


def scene_M(cx, cy):
    g = [ground_field(cx, cy, 2200, 3000)]
    g.append(carriageway(cx, cy, 900, 3000))
    g.append(building_edge(cx, cy + 1300, 3000, 250, 1200))
    g.append(building_edge(cx, cy - 1300, 3000, 250, 900))
    # Zone 1 both sides
    g.append(place("EL_mob_avDropoff", cx, cy, 0, -650))
    g.append(place("EL_mob_sharedEVbay", cx, cy, -900, 650))
    g.append(place("EL_mob_ebikeDock", cx, cy, 500, 600))
    g.append(place("EL_mob_cargoBikeDock", cx, cy, 950, 620))
    g.append(place("EL_mob_chargingPoints", cx, cy, 250, 560))
    # Zone 2
    g.append(place("EL_shel_canopy", cx, cy, -200, 950, 90))
    g.append(place("EL_mob_infoTerminal", cx, cy, 300, 900))
    g.append(place("EL_way_identityMarker", cx, cy, -800, 950))
    g.append(place("EL_lit_ambientLight", cx, cy, 700, 950))
    # Zone 3
    g.append(place("EL_shel_groupSeating", cx, cy, -600, 1150))
    g.append(place("EL_shel_bench", cx, cy, 100, 1180))
    g.append(place("EL_shel_drinkingWater", cx, cy, 450, 1150))
    g.append(place("EL_shel_repairStation", cx, cy, 650, 1150))
    g.append(place("EL_env_treeGrate", cx, cy, -1100, 1150))
    g.append(place("EL_env_treeGrate", cx, cy, 1100, 1150))
    g.append(place("EL_env_planting", cx, cy, -200, 1280))
    g.append(place("EL_soc_kiosk", cx, cy, 1000, 1100))
    g.append(place("EL_soc_flexSurface", cx, cy, -1150, 700))
    # carriageway
    g.append(place("EL_str_raisedCarriage", cx, cy, 700, 0))
    g.append(place("EL_str_hubCrossing", cx, cy, -600, 0))
    grp = rs.AddGroup("SCENE_M")
    rs.AddObjectsToGroup([x for x in g if x], grp)
    txt("SCENE  M  -  The Choice Point", (cx - 1100, cy - 1400, 0), 130)
    return g


def scene_L(cx, cy):
    g = [ground_field(cx, cy, 4000, 5200)]
    # repurposed multi-storey car park building (concrete), ground-floor reveal
    g.append(box(cx, cy + 1300, 0, 3600, 1400, 1500, L_CONC))       # building mass
    g.append(box(cx, cy + 700, 0, 3600, 200, 360, L_GLASS))         # ground-floor gastronomy/shops glazing
    g.append(box(cx - 1500, cy + 700, 360, 24, 200, 900, L_GREEN))  # living wall
    g.append(box(cx + 1500, cy + 700, 360, 24, 200, 900, L_GREEN))
    # AV staging + fleet charging at perimeter (Zone 1)
    g.append(place("EL_mob_avDropoff", cx, cy, -800, -1400))
    g.append(place("EL_mob_avDropoff", cx, cy, 1100, -1400))
    g.append(place("EL_mob_sharedEVbay", cx, cy, -1900, -300))
    g.append(place("EL_mob_sharedEVbay", cx, cy, 1900, -300))
    for i in range(4):
        g.append(place("EL_mob_chargingPoints", cx, cy, -1500 + i * 1000, -1000))
    g.append(place("EL_mob_ebikeDock", cx, cy, -400, -1200))
    g.append(place("EL_mob_cargoBikeDock", cx, cy, 300, -1200))
    g.append(place("EL_opt_cargoLibrary", cx, cy, 1000, -1100))
    # social heart in the open space (Zone 3)
    g.append(place("EL_soc_flexSurface", cx, cy, -200, -300))
    g.append(place("EL_opt_popupMarket", cx, cy, -900, 100))
    g.append(place("EL_opt_gameTable", cx, cy, 400, 100))
    g.append(place("EL_shel_groupSeating", cx, cy, 1000, 0))
    g.append(place("EL_opt_memoryMarker", cx, cy, -1600, 200))
    g.append(place("EL_soc_kiosk", cx, cy, 1600, 200))
    for i in range(4):
        g.append(place("EL_env_treeGrate", cx, cy, -1500 + i * 1000, 300))
    g.append(place("EL_mob_infoTerminal", cx, cy, 0, -600))
    g.append(place("EL_way_identityMarker", cx, cy, -1900, -700))
    grp = rs.AddGroup("SCENE_L")
    rs.AddObjectsToGroup([x for x in g if x], grp)
    txt("SCENE  L  -  The Neighbourhood Anchor", (cx - 1800, cy - 2200, 0), 130)
    return g

# ----------------------------------------------------------------------------
# Run
# ----------------------------------------------------------------------------

def main():
    rs.EnableRedraw(False)
    clear_model()
    setup_layers()
    ensure_text_style()
    names = build_blocks()
    layout_palette()
    scene_S(0, 3500)
    scene_M(6500, 4200)
    scene_L(16000, 5600)
    rs.CurrentLayer(L_PAVE)
    rs.EnableRedraw(True)
    rs.ZoomExtents(all=True)
    print("BLOCKS_BUILT %d" % len(names))
    print("OBJECTS_TOTAL %d" % len(rs.AllObjects()))
    print("LAYERS %d" % len(rs.LayerNames()))

main()
