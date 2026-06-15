# Data Sources

---

## Population and Mobility

| Data | Source | Notes |
|------|--------|-------|
| 17,000 city centre residents | Team estimate / city data | Used for fleet sizing |
| 18,000 daily VW workers | VW shift data | Used for fleet sizing |
| 17,000 daily visitors | Team estimate | Used for fleet sizing |
| 100,000 trips/day total | Derived from above | Peak hour ~9,000 trips |

---

## Geographic / Map Data

| Data | Source | Format |
|------|--------|--------|
| District boundaries (44 districts) | OpenStreetMap / team pre-processed | GeoJSON |
| Bus stops | OpenStreetMap / Overpass API | GeoJSON |
| Car parking locations | OpenStreetMap / Overpass API | GeoJSON |
| Bike parking | OpenStreetMap / Overpass API | GeoJSON |
| Cycling routes | OpenStreetMap / Overpass API | GeoJSON |
| Footways / pedestrian network | OpenStreetMap / Overpass API | GeoJSON |
| Roads | OpenStreetMap / Overpass API | GeoJSON (~5,000 segments) |
| Green spaces (parks, forests, water) | OpenStreetMap / Overpass API | GeoJSON |
| Satellite imagery | CARTO base map tiles | Map tiles |
| Venue data | Team-uploaded Excel files | XLSX → GeoJSON |

**Lower Saxony OpenGeoData portal** (official competition resource):
- Topographic maps
- Aerial photographs
- Cadastral information (land ownership / plot boundaries)

---

## Analysis Tools

| Tool | Location | What it does |
|------|----------|-------------|
| `hub_calculation.py` | `wolfsburg-activity-map/analysis/` | Hub placement density calculation |
| `fleet_calculation.py` | `wolfsburg-activity-map/analysis/` | Fleet sizing based on trip demand |
| `modal_distribution.py` | `wolfsburg-activity-map/analysis/` | Mode share distribution |

---

*Add data sources as new material is collected.*
