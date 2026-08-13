## Notes for each team

Specific to what we found in your work on **4 August 2026**\. Repository names are given so<br>you know where to look — you are not being asked to keep those repositories alive, only to<br>harvest them into one folder\.

### 01 — Agentic Square

> your work is on three accounts and none of the AR models or Westhagen<br>renderings is reachable from the main site\. Decide what the visitor sees, then bring it<br>into one folder\.

*[Table view](https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764679964093801&cot=14)*

| Where | What |
| --- | --- |
| zhasmin\-roumieh/AGENTIC\-SQUARE \(200 MB\) | the chat \+ 3D square — the main site |
| dikshyapokharel16/Agentic\-Square \(184 MB\) | the AR models — 16\.glb, 12 \.usdz |
| dikshyapokharel16/AR\-Model\-Viewer \(21 MB\) | marker\-based AR viewer, MindAR vendored |
| MareikeSophie/Wolfsburg\-Marktplatz \(290 MB\) | Westhagen demos \+ 46 renderings |

- **Consolidate\.** The AR furniture \(Brick Stand, Table Tennis, Stepped Playground\) and the Westhagen renderings are part of the project and are currently unreachable\.
- **Set `base: '\./'`** — your assets are absolute \(`/AGENTIC\-SQUARE/…`\), so the build only works at that one address\.
- **Confirm the chat replays with wifi off** and the 3D square still updates in step with it\. That link between the conversation and the square changing *is* the project — it is the one thing that must not break\. Make sure the **conflict and voting moment** is in the seeded transcript, slow enough to read\.
- **Compress the heavy assets:** `bricks\.pdf` \(35\.6 MB\), `INTRO\.png` \(32\.6 MB\),` spread\.gif` \(10\.4 MB\), `storyboard\.gif` \(7 MB\)\. At 133 MB you are inside the limit, but a 32 MB PNG is a slow first impression\.
- **The assembly instructions are already there** as `public/brochures/\*\.pdf` — nothing to scan\. Surface them under `materials/` so a visitor can find and download them\.
- **The posters are not in the repo\.** Export them from the source files into `materials/`\.
- Slideshow → `presentation/`\. The Canva file → `source/`\.

### 02 — STADT\.HUB

> **Start here:** technically you are in the best condition — paths are already relative and the sub\-apps embed correctly\. Your work is packaging\.

Four pieces, and all four count:

- the interactive slideshow — `ofa5406\.github\.io/wolfsburg/exhibition/deck/`
- the analysis platform — `/brain/web/` \("stadt\.hub brain"\)
- the hub configurator — `/hub\-viewer/` \("Wolfsburg Mobility Hub — Element Viewer"\)
- the activity map — `annestasiia\.github\.io/wolfsburg\-activity\-map/`, on a second account
- **The analysis platform and the configurator must be reachable on their own**, not only as `?kiosk=1` iframes inside the deck\. Someone who never opens the slideshow should still find them, and each should work as its own page\.
- **Bring the activity map in\.** It is on a second account and is not part of the same delivery — as it stands it would simply not be submitted\.
- **Downsize the chart images** — several are 12–21 MB\.
- The deck is your presentation\. Link it clearly and `presentation/` is satisfied\.
- Confirm all four run with wifi off, served from a local folder\.

### 03 — Third Home

> **Start here:** your work is spread over four repositories on two accounts — three of them<br>near\-duplicates — plus one deployment whose source we cannot find\. Nothing else can be checked until it is one project\.

*[Table view](https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764679964093802&cot=14)*

| Where | What | Size |
| --- | --- | --- |
| third\-home\-wolfsburg\.vercel\.app | the exhibition site — hotspots, dialogue, embedded PDFs | no source found |
| samsam8620/third\-home\-interface | the booking interface;clone/\*\_model\.json | 249 MB |
| dya99bau/third\-home\-interface\-1 | a near\-identical copy of the same models | 245 MB |
| dya99bau/deployables\-webapp | the modules app, on Verceland Pages | 47 MB |
| dya99bau/third\-home\-interface | a third variant | 6\.6 MB |
| zizisma/HOME\-governance\-model | guests / members / keepers, funding, events | 0\.2 MB |

- **Find the source of the Vercel exhibition site\.** It is in none of the four repositories —<br>it looks deployed straight from a laptop\. That page is the one a visitor met at the<br>exhibition, and it currently exists only as a build on a free account\.
- **Pick one copy and drop the rest\.** `third\-home\-interface` and `third\-home\-interface\-1`<br>are the same ~250 MB of model data twice, on two accounts\. Fold `deployables\-webapp` in as a subfolder and fix its paths\.
- **`HOME\-governance\-model` is a Next\.js app and will not run as a plain folder as itstands\.** Set `output: 'export'`, confirm nothing depends on a server, and build it out\.<br>The guests / members / keepers model is the social half of the project — it belongs in the<br>main site, not stranded on its own\.
- **Convert the model JSON to glTF\.** `cafe\-bar\_model\.json` \(67 MB\), `model\.json` \(64 MB\),<br>`open\-studios\_model\.json` \(34 MB\) and the rest are geometry stored as raw JSON\. Exported as `\.glb` with Draco compression they typically shrink tenfold or more\. As they stand, the booking interface is a 250 MB download\.
- **Vendor `pdf\.js`** \(currently from cdnjs\) and the Google Fonts\.
- Keep `map\.pdf`, `plans\.pdf` and `personas descriptions\.pdf` as local files under  `materials/`\.
- **Scan your printed sheets with the building versions\.** They exist only on paper and they<br>are part of the project — 300 dpi, into `materials/` in the site and full resolution on<br>Nextcloud\.

### 04 — RoboNexus

> **Start here:** roughly **1\.3 GB across three accounts and a dozen repositories**, most of<br>them copies of each other\. Consolidating is the bulk of your work\.

*[Table view](https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764679964093805&cot=14)*

| Where | What |
| --- | --- |
| PragathiBhat/umbau\-new\-webpage \(488 MB\) | the main site |
| PragathiBhat/Robonexus \(1 MB\) | the kiosk page —videos/ is an empty placeholder |
| PragathiBhat/ROBONEXUS\-OPENING \(119 MB\) | opening sequence, point clouds,\.obj, narration |
| Phyllis0001/RoboNexus\_opening \(90 MB\) | near\-copy of the same |
| Phyllis0001/Video\-Webpage \(204 MB\) | the 20 videos — market, playground, event, deploy |
| PragathiBhat/New\-Website, Website\-umbau, Project\-Umbau\-Final, \-Neu, Project\-Umbau | earlier iterations |
| 84191010mathankumar\-crypto/the\-simulation\-, umbau\-, PROJECT\-UMBAU | more copies |

- **Your videos are not lost — they are in `Phyllis0001/Video\-Webpage`\.** `starting\.mp4`,<br>`Deploy\.mp4`, the market, playground and event shots: exactly the reconfiguration sequence the project is about\. The kiosk page has an empty `videos/` folder because the media lives on a different account\. Bring them together\.
- **Pick one version as the canonical site\.** Everything else gets folded in or dropped\.<br>`site\-points\-forming\.bin` \(45 MB\) alone appears in at least three copies\.
- **Good news:** three\.js is already vendored \(`vendor/three\.min\.js`\) in the opening repo —<br>no CDN work there\.
- **Firebase carries only `\{"activeMarker":true,"displayReload":true\}`** — a phone\-to\-screen toggle\. Replace it with on\-page controls \(buttons or keys\) so a single visitor can trigger the same states\. Remove the Firebase SDK and the `apiKey`\.
- **`server\.js` and `open\-video\-kiosk\.bat` are a local kiosk, not a website\.** The reconfiguration sequence has to play for a visitor who just opens the folder\.
- **Size:** `scanning\-wolfsburg\.mp4` \(70 MB\) appears **twice** in `umbau\-new\-webpage` — keep<br>one\. Transcode `Scenario\_2\.mp4` \(62 MB\), `configuration\.mp4` \(49 MB\), `robot\-video\.mp4`<br>\(47 MB\), `vn\-site\-loop\.mp4` \(30 MB\)\. Keep the point clouds\.
- Set relative paths and vendor the Google Fonts\.

### 05 — MemoHaus

> **Start here:** your backend is already off, so the upload→splat feature no longer works\.<br>Replacing it with a static gallery is your main task\.

- **Replace the inference flow with a static gallery\.** `runtime\-config\.js` ships with<br>`MEMO\_API\_BASE = ""` and pointed at a temporary tunnel\. You already have **66 `\.ply` files committed** — pick around six, ship them in the frontend, and turn the upload flow into<br>"choose a sample photograph → view its pre\-computed splat\." No inference at runtime\.
- **Your presentation\.** The deleted `presentation` repo was only a deploy<br>target — the content is still in `apps/presentation/`\. Restore it at `presentation/`\.
- `final presentation\.pptx` \(24 MB\) converts to the HTML presentation; PDF into `materials/`, the `\.pptx` itself into `source/`\.
- **`mobile uploads/` is your size problem** — 273 photographs at 8–13 MB each, over the 1 GB limit on its own\. Originals to `raw/`, web\-sized versions in the site\.
- Set relative paths and remove the remaining API code paths\.

```html
# <Project Title>

Prompt City. Urban Vision Wolfsburg 2026 — Design studio SoSe 2026
Bauhaus-Universität Weimar, InfAU

**Team:** <names>
**Contact:** <one email that will still work after you graduate>

## Abstract

<About 150 words: the urban issue, your response, and the role AI plays in it.>

## The urban issue

<Two or three sentences on the problem in Wolfsburg you are addressing.>

## How to use this site

<Where to start, what to click, what a visitor should look at first.>

## What is frozen

<What worked live at the exhibition but no longer runs, and what replaces it.
For example: "The splat viewer loaded results from an inference backend. It now shows
six pre-computed splats shipped with the site.">

## Contents

- `presentation/` — final presentation
- `materials/` — posters, boards, brochures, plans
- <anything else worth pointing at>

## How to run it

<How to serve this folder, and how to rebuild it from `source/` if it ever needs changing.
For example: "Static — serve the folder. Rebuild: `npm install && npm run build` in
source/, output lands in dist/.">

## Credits

<Every photograph, dataset, base map, 3D model, library and font that is not ours,
with its source and licence. Say so if a licence is unknown.>

## Permissions

We agree that InfAU may republish this work under a university account or domain —
including on GitHub Pages — host and mirror these files, and show the work in teaching,
exhibitions and documentation, with credit to the team.
```

