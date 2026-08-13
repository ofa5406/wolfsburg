# Final Submission

**Deadline: 14 August 2026**

**Uploading your completed Nextcloud folder is the hand\-in\.** Grades are entered once a folder is uploaded and passes the checks\.

## What you are handing over

**A folder of files that we can put on a chair github and publish\.**

You are not required to deploy anything\. What we need is the finished project as a set of files that still works after you have graduated and your accounts are gone\.

**Why\.** Your projects currently live on personal accounts, free tiers, temporary tunnels and hosted services\. All of these expire\. We want to show this work to future students and to colleagues in five years \- from a university server, or from a laptop with no internet connection\. A static folder has no moving parts to break, and converting a project into one is exactly the kind of task Claude Code handles well\.

**Where it ends up\.** We republish the `site/` folder on GitHub Pages under a university account\. So your site moves to a different domain *and* into a subfolder, and it has to survive that\. That is what most of the rules below are about\.

## Do this in order

1. **Bring the project into one folder** — one project per team, everything reachable → Contents
2. **Cut the live dependencies** — APIs, CDNs, Firebase, Google Fonts, keys → Rule 1
3. **Seed it** so the project still does its thing with no backend → Rule 2
4. **Fix the paths** so it runs from any address → Rule 3
5. **Get the size down** → Rule 4
6. **Add `presentation/` and `materials/`** → Contents
7. **Write the `README\.md`**, including credits and permission → Rule 5
8. **Test it yourself** — the five checks → How we check
9. **Upload to Nextcloud** → Nextcloud

Your team's specific starting point is in Notes for each team\. Read that first — it says what we already found in your work\.

## The five rules

### Rule 1 — Nothing loads from the internet

With **wifi switched off**, your site must load and run\. Nothing it needs may live on a server other than the one it is sitting on — not now, and not in five years when the CDN version is pulled and the accounts have lapsed\.

Remove or replace:

- backends, APIs, inference servers, tunnels \(`trycloudflare\.com`, `ngrok`, …\)
- Firebase, Supabase, or any other hosted database
- CDN script tags \(`cdnjs\.cloudflare\.com`, `unpkg`, `jsdelivr`\) — copy the library into your folder
- Google Fonts — download the font files and `@font\-face` them locally
- **API keys of any kind\.** We publish these files\. Anything left in them becomes readable by anyone who visits\. Rotate any key that has ever been committed to a public repository\.

**How to find them\.** Open your project folder in Claude Code and paste this:

> Search this project for anything that loads from the internet: CDN script tags, Google Fonts, API endpoints, Firebase/Supabase config, tunnel URLs, and API keys of any kind\. For each one, tell me whether it is a link a person clicks \(fine\) or something the page loads \(must fix\)\. Then fix them one at a time\.

This reads your code, so it also catches the calls that only fire when someone presses a button — the ones you would never see by loading the page and looking at it\.

**How to confirm it worked\.** Test **your local copy, not your GitHub Pages URL\.** With the wifi off you cannot reach github\.io at all — it is a server on the internet like any other — so that test can only ever fail and tells you nothing\. Serve your folder locally instead \(`cd site` then `python \-m http\.server 8000`, as in Rule 3\), turn your wifi off, open a **new private/incognito window**, and load `http://localhost:8000` there\.

The private window matters: your normal browser has already stored a copy of every font and script it has seen, so it will load them happily with the wifi off and hide the problem\. A private window starts empty, so what you get is the real thing\.

### Rule 2 — The idea survives

You are **allowed to lose the database\.** Nothing has to persist between visitors, and a page reload may reset everything\.

You are **not allowed to lose the idea\.** Someone who opens your project alone, with no explanation from you, must be able to understand what it is and experience the thing it does\. Concretely: the central move — the one you would demonstrate if you had thirty seconds — has to be reachable, and it has to actually happen\.

The way to do this is to **seed it**: ship example data in the frontend as a JSON file, and hold state in memory or `localStorage` for the length of the visit\.

### Rule 3 — It runs from any address

This is the rule most likely to catch you out, because everything looks fine on your own deployment\. We will serve your folder from `Bauhaus\-InfAU\.github\.io/&lt;your\-project&gt;/` — a different domain, and one folder deep\. Nothing may assume it knows where it lives\.

- **No asset path may start with `/`\.** `/assets/model\.glb` breaks the moment we move it; `\./assets/model\.glb` and `assets/model\.glb` survive\.
- **Vite:** set `base: '\./'` in `vite\.config\.js` and rebuild\.
- **Next\.js:** set `output: 'export'` in `next\.config`, confirm nothing depends on a server, and build to a static folder\.
- **No hard\-coded hostnames** — no `https://yourname\.github\.io/\.\.\.` or `\*\.vercel\.app` in your own links\.

**Test it properly\.** Do not test on your deployed URL — that is the one place it is guaranteed to work\. Instead, serve the built folder locally and open it in a browser:

```javascript
cd site
python -m http.server 8000      # then open http://localhost:8000
```

Double\-clicking `index\.html` is a useful extra check, but many builds legitimately cannot work that way — a browser blocks `fetch\(\)` of your seed JSON over `file://`\. **Serving it locally is the check that counts\.**

#### Four things GitHub Pages does that your laptop does not

These break sites that work perfectly when you test them\. All four are quick to fix and impossible to spot without knowing about them\.

1. **Add an empty `\.nojekyll` file at the top of `site/`\.** GitHub Pages runs everything through Jekyll first, and Jekyll silently drops every file and folder whose name starts with an underscore\. A Next\.js export is almost entirely inside `\_next/`; Astro uses `\_astro/`\. Without this one empty file, those sites publish as an unstyled blank page\. Just create it — it costs nothing even if you do not need it\.
2. **Filename capitalisation has to match exactly\.** GitHub serves from Linux, where `Logo\.PNG` and `logo\.png` are two different files\. Windows and macOS do not care, so a mismatch between your HTML and your actual filenames works on your machine and 404s once published\. If something is missing after we publish, this is usually why\.
3. **No Git LFS\.** Files stored in LFS do not serve over Pages — visitors download a pointer file instead of your video\. If you ever ran `git lfs track`, take those files out of LFS or, better, just hand us the folder with the real files in it\.
4. **No server, so no custom routing\.** If your app uses history\-based routing, a visitor who lands directly on a sub\-URL gets a 404\. Either switch to hash routing \(`\#/page`\) or include a `404\.html` that loads your app\.

Most of these only show up once a site is actually on Pages, so you cannot fully test them from your laptop\. We hit them when we publish and will come back to you — but that is a round trip after the deadline, so deal with them now if any of them apply to you\.

### Rule 4 — It fits

*[Table view](https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764680075257221&cot=14)*

| Limit | Value |
| --- | --- |
| Your whole site/ folder | under 1 GB |
| Any single file | under 100 MB |

These are GitHub Pages' own limits, not ours — beyond them it refuses to publish\. Most of you are well over on media\.

- **Delete duplicates\.** The same file in two places, or the same project copied onto a second account, is the most common cause\.
- **Transcode video:** `ffmpeg \-i in\.mp4 \-c:v libx264 \-crf 26 \-vf scale=\-2:1080 \-c:a aac \-b:a 128k out\.mp4` usually cuts 70 MB to under 15 MB with no visible loss on screen\.
- **Resize images\.** Nothing on a web page needs to be 20 MB\.

Originals go to Nextcloud under `raw/`\. Only the web version goes in the site\.

**Resolutions — use these numbers:**

*[Table view](https://miro.com/app/board/uXjVGCtKivA=/?moveToWidget=3458764680075257222&cot=14)*

| Column 1 | In site/ | On Nextcloud |
| --- | --- | --- |
| Images | 2000 px on the long edge, JPEG quality 80 | untouched original |
| PDFs \(posters, boards\) | web resolution: 150 dpi, under 10 MB per file | print resolution: 300 dpi or better |
| Scans of printed work | 300 dpi, straight\-on, evenly lit | same file, full resolution |
| Video | 1080p, transcoded as above | master file |

### Rule 5 — We are allowed to publish it

Because the university becomes the publisher, two things have to be in your `README\.md`:

- **The permissions paragraph** from the template, unchanged\.
- **Credits\.** Every photograph, dataset, base map, 3D model, font and library that is not yours, with its source and its licence\. If you do not know the licence of something, say so rather than leaving it out — an honest gap is workable, a silent one is not\.

If a third\-party asset cannot be republished, replace it or remove it now, and note the replacement under *What is frozen*\.

## Contents

**The site is your project, running\.** Do not build a portfolio page about the project\. What opens should be the thing itself, working, exactly as a visitor met it at the exhibition\. Whatever it needs to explain itself, it should already do\.

```
site/
  index.html          your project — the working thing
  presentation/       your presentation
  materials/          printed work, as web-resolution PDF
  assets/             fonts, images, video, data — all local
  README.md
```

**One project per team\.** If your work currently spans several repositories or deployments, merge them into one — or make one the entry point and link the others clearly and prominently from it\. Anything not reachable from `index\.html` will not be seen and does not count as submitted\.

### `presentation/`

If you presented from slides, they go in too, as web pages\. Exporting the slides as images is a legitimate route — the result only has to be something someone can scroll or click through in a browser\.

The Canva, PowerPoint or Keynote file itself is a source file\. It goes in `source/`, not in the site\.

### `materials/`

Posters, boards, brochures, plans, drawings — as web\-resolution PDF, with print\-resolution originals on Nextcloud\.

**Anything that exists only on paper must be scanned\.** Physical models: photograph them properly\. **If it was in the exhibition and is not in your folder, it is gone\.**

### `README\.md`

Use the template at the end of this document\. Put it in `site/` and at the top of your Nextcloud folder\. This is part of the submission, not paperwork — it is what tells someone in five years what they are looking at\.

## Nextcloud

**[https://nextcloud\\\.uni\\\-weimar\\\.de/s/FWbp8dKzAFt4AZ8](https://nextcloud.uni-weimar.de/s/FWbp8dKzAFt4AZ8)**

Password: `xAqeqpSzPt`

**Your folder is already there with its subfolders ready\. Do not create new ones** — upload into the existing structure so everything stays comparable across teams\.

```
01_AgenticSquare/
02_StadtHub/
03_ThirdHome/
04_RoboNexus/
05_MemoHaus/

  …each containing:

    site/          the finished site — the folder we publish
    source/        what the site was built from — see below
    materials/     print-resolution posters, boards, brochures
    exhibition/    photographs of your exhibit — see below
    raw/           originals too large for the site: source photos, master video,
                   3D models, point clouds, scans, recordings
    README.md      same file as in site/ — at the top of your folder
```

### `source/` — what it was built from

The project as it stands today\. **No git history needed**

Include anything that never made it into the site: backend services, notebooks, scripts, prompt collections, the Canva or PowerPoint originals, `\.blend` and `\.3dm` files\.

If your project is plain HTML with no build step, `site/` and `source/` are the same files — just copy them into both\.

### `exhibition/` — everyone

Upload your photographs of the exhibition\. Include the installation itself, whatever was printed or built, and people using it\.

