# Wolfsburg — Image & Video Prompt Playbook

Project-specific companion to the general prompt-craft skill
(`D:\vibe_lab\skills\SKILL.md`, *gemini-media-prompts*). That skill is the
**engine** — which Google model to pick, how to phrase prompts, the output
format. **This file is the *Wolfsburg what*:** the project facts, the two
workflows, and ready-to-fill recipes for the images this competition needs.

> **How a request flows:** you describe an image → Claude pulls the right recipe
> below, drops in the **project facts** and **your style**, and hands back a
> copy-paste prompt + which model to paste it into. You run it in Gemini / AI
> Studio / Flow and download the result. Claude never generates the media.

---

## A. The one rule about style

**Style is yours, not the file's.** This playbook never hard-codes a look
(palette, render style, colours). For every image:

1. If you have **stated a style** (words or a reference image) → Claude folds it
   into the `[STYLE]` slot of the prompt.
2. If you **haven't** → Claude **asks first**, briefly, before writing the prompt.
   It will not invent a style and run with it.
3. **Reference images** are the strongest way to set style. Attach 1–2 in the
   Gemini app and say *"match the style of the reference."* Claude will phrase
   the prompt to lean on the reference instead of describing the look in words.

Optional — capture a reusable style once so you don't retype it:

```
STYLE SPEC (fill when you settle on a look)
- Medium / render:      e.g. photoreal drone shot · flat axonometric · watercolour
- Palette:              e.g. warm neutrals + green accents  (or "see reference.png")
- Mood / light:         e.g. soft overcast · golden hour · bright editorial
- Line / label style:   e.g. thin black labels, leader lines (for diagrams)
- Reference image(s):   filename(s) if any
```

Once filled, paste it under "Style:" in any recipe and Claude reuses it.

---

## A+. Anchored styles (locked — reuse these)

### ★ Aerial diagrammatic (anchored 2026-06-18)
**Anchor image:** `visuals/generated/style-anchor_aerial-diagrammatic_v1.jpeg`
Use for all oblique/aerial diagrammatic base views. To reuse: **attach the anchor
image** in Gemini as a reference and say *"match the style of the reference image,"*
then describe only the new content/area. The image carries the look more reliably
than words.

The look: clean Rhino-modelled massing finished by hand as a presentation diagram;
soft thin black edge lines; **all buildings white/uniform, no colour-coding by
type** (only faint shading for massing); water light blue-white; streets very light
grey; hard surfaces light neutral grey with faint texture; **trees as many small
individual stippled green canopies** (never flat patches); warm off-white paper
background; even shadowless light; pale and airy.

Locked prompt (Nano Banana Pro · attach the source aerial · 16:9):
```
Convert this oblique aerial photo of Wolfsburg into a clean architectural
illustration that looks like a Rhino 3D model finished by hand as a presentation
diagram. Keep the exact same oblique camera angle, and preserve every building
footprint, street, rail line and the canal in their real positions and shapes —
do not move, add, or remove any structure.

LINES & GEOMETRY: simplified clean massing with soft, slightly hand-drawn thin
black edge lines on all buildings and forms.

TREES & GREENERY: render trees as many small individual rounded canopies — little
stippled green domes — clearly visible and scattered through parks, along streets,
and between buildings; never flat green patches. Lawns and soft ground a soft,
muted green.

BUILDINGS: all white, uniform, with only the faintest neutral shading to read the
massing — no colour, no tint by building type. Let the black edge lines define them.

SURFACES: water light blue-white; streets and roads very light grey; hard surfaces
(paving, parking, plazas) light neutral grey with faint texture, clearly distinct
from the green soft surfaces.

ATMOSPHERE: warm off-white paper background, even shadowless lighting, pale and
airy overall — a warm, inviting presentation illustration, not a photo and not a
cold blank map.

Remove all text, watermarks and map interface elements. No annotations or labels
of any kind.
```

---

## B. Project context block — paste-in facts

Drop the relevant lines into a prompt so the image is *accurate to the project*,
not generic. (Source of truth: `project/current.md`, `decisions.md`.)

- **Big idea:** Wolfsburg as a post-private-car city — the organizing element
  shifts from **parking → mobility hubs**. *"Parking City → Hub City."*
- **Hub network:** 68 hubs total — **6 Large** (repurposed multi-storey car
  parks; backbone — charging, storage, fleet mgmt), **19 Medium** (neighbourhood
  — bikes, EV charging, shuttle stops, transfers), **43 Small** (last-mile nodes
  — e-bike dock, pod stop). Catchments: L 700–1000 m, M 300–500 m, S 150–250 m.
- **5 mobility modes (fleet 763):** 33 autonomous buses · 55 autonomous shuttle
  pods · 369 autonomous micro-pods · 175 shared EV cars · 131 e-cargo bikes.
- **Zones:** 5-zone Groningen model — filtered permeability (no through-traffic),
  one-way internal streets, priority for shared mobility / cycling / pedestrians.
- **Reclaimed land becomes:** wide footpaths, protected cycle lanes, street
  trees & climate infrastructure, pocket parks, seating, gardens, active
  ground floors, new housing; **canal-side surface parking → park**.
- **Real places to name:** **VW factory gate** (primary L-hub case study),
  **Kleiststraße** (street before/after), **canal-side** parking → park.
- **Persona:** "Anna", a VW factory worker — home → factory gate without a
  private car (journey storyboard).

---

## C. Models & aspect — quick defaults

Full picker is in the skill. For this project:

| Need | Model | Why |
|------|-------|-----|
| Anything with **readable text/labels** (diagrams, maps, board panels, timelines) | **Nano Banana Pro** | best legible text, up to 4K |
| **Hero** street/aerial renders | **Nano Banana Pro** | top fidelity |
| Quick everyday variants / edits | **Nano Banana 2** | fast, near-Pro |
| Animating a still or short flythrough | **Veo** (newest) | image-to-video + audio |

Aspect: board panels & street hero **16:9**; full plans/aerials often **1:1**
or a square crop; storyboard frames **16:9**; phone-format reels **9:16**.

---

# Workflow 1 — Generate from text (no input image)

Use when there's no base image — you're inventing the view. Fill the `[...]`
slots; keep the project facts; add **Style:**.

### 1.1 Aerial / axonometric diagrammatic (masterplan, hub network, car-land, zones)
> Deliverables: car-land map, hub network map, zone/strategy plan, masterplan.
> Model: **Nano Banana Pro**. Aspect: **1:1** or **16:9**.

```
A [top-down aerial / 3D axonometric] view of the centre of Wolfsburg, Germany,
showing [WHAT THIS MAP PROVES — e.g. all 68 mobility hubs with walking-catchment
circles: 6 large, 19 medium, 43 small]. [Optional second layer — e.g. the
5 traffic zones with filtered-permeability boundaries]. Hubs are marked with
clear symbols and a small legend; labels read "[L]", "[M]", "[S]". Streets and
city blocks are legible. Style: [STYLE]. Aspect ratio [1:1 / 16:9].
```
*Tip:* generate the base aerial first, then add labels in a second pass (it
renders cleaner). For the "car-land" anchor: ask for *all parking lots, surface
parking, on-street parking and car lanes highlighted in one colour* over a muted
city base — title idea "The City Stored in Cars".

### 1.2 Street view / eye-level (reclaimed street, hub at street level, public life)
> Deliverables: street before/after "after" frames, hub-at-street-level, vision shots.
> Model: **Nano Banana Pro**. Aspect: **16:9**.

```
Eye-level street view in Wolfsburg, Germany: a [former car-dominated street /
Kleiststraße] reclaimed for public life — [wide footpaths, protected cycle lane,
street trees, pocket park seating, people walking and cycling], with a
[small / medium] mobility hub where shared e-bikes and an autonomous shuttle pod
are docked. No private parked cars. Daytime, lively but calm. Style: [STYLE].
Aspect ratio 16:9.
```

### 1.3 System / concept diagrams (mode legend, network flow, hub cutaway, timeline)
> Deliverables: hub typology functions, mode legend, 4-phase timeline, how-it-works.
> Model: **Nano Banana Pro** (text-heavy). Aspect: **16:9** or **1:1**.

```
A clean [infographic / isometric cutaway / flow] diagram explaining [WHAT —
e.g. how a Medium hub works: shared bikes, EV charging, shuttle stop, transfer].
Each element is labelled with short text: [list the exact labels in quotes].
[For timeline: 4 phases left to right — "Pilot", "Hub backbone",
"Network reshaping", "Post-car centre"]. Legible, well-spaced labels.
Style: [STYLE]. Aspect ratio [16:9 / 1:1].
```
*Put every word you want rendered in quotes* and keep to Nano Banana Pro.

### 1.4 Typology / section sheet (plan · section · axonometric per hub tier)
> Deliverables: hub typology sheets (L / M / S).
> Model: **Nano Banana Pro**. Aspect: **16:9** (panel) or **1:1**.

```
An architectural [section / plan / axonometric] drawing of a [Large / Medium /
Small] mobility hub for post-car Wolfsburg. Show [the functions for that tier —
e.g. for L: repurposed multi-storey car park with EV charging, fleet storage,
bus bays, bike parking, active ground floor]. Include scale figures and short
labels in quotes: [labels]. Style: [STYLE]. Aspect ratio [16:9 / 1:1].
```

### 1.5 Video from scratch (Veo)
> Establishing flythrough, atmospheric vision clip.
> Model: **Veo** (newest). Length 6s to start. Aspect **16:9** (or **9:16** reel).

```
[Wide aerial / eye-level] shot of post-car central Wolfsburg: [the reclaimed
scene]. Camera: [slow dolly in / aerial push-forward]. Daytime, calm, green.
One clear action: [people cross a car-free plaza as a shuttle pod glides past].
Style: [STYLE].
Audio: [gentle city ambience, birdsong, soft electric-vehicle hum; no traffic noise].
```
Negative prompts as **nouns** ("parked cars, traffic jams, on-screen watermark").

---

# Workflow 2 — Manipulate an input image

This is the high-leverage path for you — you already have base imagery. The
prompt is an **instruction**: describe **only the change + what to keep**, so the
model doesn't redraw everything. Attach the input in the Gemini app, paste the
instruction. Iterate in small steps rather than one giant edit.

### 2.1 Rhino viewport capture → photoreal / styled render
> Input: a screenshot from the Rhino model (kit-of-parts, hub scene, toolpalette
> scenes — see `project/rhino_toolpalette.md`; capture via the rhino bridge).
> Model: **Nano Banana 2** (quick) / **Pro** (hero).

```
This is a 3D model screenshot of a [Small/Medium/Large] mobility hub in
Wolfsburg. Render it as a [STYLE] image: keep the exact geometry, layout, and
camera angle from the model; add [realistic materials, people, shared vehicles
docked, street trees, daytime lighting]. Do not move or redesign any element.
```

### 2.2 Satellite / aerial photo → annotated diagram or vision
> Input: satellite tile of Wolfsburg (web tool **Earth mode**,
> `wolfsburg-activity-map/`) or any aerial.
> Model: **Nano Banana Pro** (annotation = text).

```
This is a satellite image of central Wolfsburg. Keep the real streets and
buildings exactly. [Add the hub network on top — mark 6 large, 19 medium,
43 small hubs with symbols and walking-catchment circles, plus a small legend]
/ [Recolour all car parking and car lanes in one highlight colour to show
car-dedicated land]. Style of overlay: [STYLE]. Keep the base map readable.
```

### 2.3 Real Wolfsburg street photo → reclaimed "after"
> Input: a present-day photo of Kleiststraße / a car-dominated street.
> Model: **Nano Banana 2** then **Pro** to refine.

```
This is a present-day photo of [Kleiststraße], Wolfsburg. Keep the buildings,
the street's geometry, and the camera viewpoint exactly the same. Transform it
into a post-car future: remove all parked and moving cars; add [wide footpaths,
a protected cycle lane, street trees, pocket-park seating, people walking, an
e-cargo bike and a shared shuttle pod]. Style: [STYLE — or "photorealistic,
matching the original photo's lighting"].
```
*Before/after tip:* run this on the photo, keep the original as "before" — the
geometry stays aligned, which makes the pair convincing. Big day→night or heavy
edits can artifact; iterate ("now soften the shadows", "add more greenery").

### 2.4 Restyle to match a reference / unify the set
> Input: any image of yours + (ideally) a style reference image.
> Model: **Nano Banana 2** / **Pro**.

```
Restyle this image to match the attached reference: apply the reference's
[colour palette / line style / rendering look], but keep this image's content,
layout and labels unchanged.
```
Use this last pass to make a batch of mixed images look like **one entry**.

---

## D. Output naming & storage

Save downloads to `wolfsburg/visuals/generated/` with descriptive names so they
map to deliverables:

```
visuals/generated/
  carland_aerial_v1.png
  hubnetwork_map_v1.png
  kleiststrasse_after_v2.png
  hub-M_section_v1.png
  anna_journey_03.png
```
Pattern: `<deliverable>_<view>_v<N>.png`. Note the model used + the winning
prompt back in the relevant deliverable doc if it's a keeper.

---

## E. When Claude writes a prompt for you, it returns

1. The **filled prompt** in a copy-paste code block (project facts in, your
   style in — or a question if style is missing).
2. **→ Paste into** [model] [aspect] (and "attach your input image" for Workflow 2).
3. A one-line offer to tweak framing / aspect / style.
```
