// Assemble the InfAU submission `site/` folder from the project.
//
// The four pieces of <stadt.hub> live in different places in the repo (and one
// in a second repo). This gathers them into one self-contained folder that
// works with no internet, from any address, and leaves the originals alone —
// `exhibition/deck/` is still the live exhibition deck.
//
// Run from the project root:  node "final submission/build-site.mjs"

import { cp, mkdir, rm, writeFile, readFile, stat, rename, readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = join(ROOT, 'final submission', 'site')

// The five chart images the deck actually references. The rest of charts/
// (~120 MB) is working material and is not part of the site.
const CHARTS = [
  'ba_v3_before.png',
  'ba_v3_after.png',
  'masterplan_new.jpg',
  'masterplan_upper_catchment.jpg',
  'network-layers.gif',
]

const VIDEOS = ['hero1.mp4', 'hero2.mp4', 'hero3.mp4']

// Deck files that make up the presentation itself.
const DECK_FILES = ['index.html', 'deck.css', 'deck.js', 'typewriter.js']
const DECK_DIRS = ['assets']

// Everything that is only ever opened inside the deck lives under embeds/.
// brain/ and hub-viewer/ deliberately do NOT: the studio requires those two to
// be reachable as their own pages, for someone who never opens the slideshow.
const EMBEDS_DIR = 'embeds'

// The three map embeds are rebuilt from the activity-map source rather than
// copied: the versions committed in exhibition/deck/ predate the offline work
// and still call Overpass and MapLibre's demo glyph server. Each config writes
// its own entry filename, but the deck asks every embed for index.html.
const EMBED_BUILDS = [
  { config: 'vite.embed.config.js',       out: 'mapembed',   entry: 'index.html' },
  { config: 'vite.hubplacement.config.js', out: 'hpmapembed', entry: 'hubplacement.html' },
  { config: 'vite.fleetview.config.js',    out: 'fleetembed', entry: 'fleetview.html' },
]

// hubembed is copied rather than built — its source is the snapshot kept in
// exhibition/deck/hubembed/_source/, not a config in the activity map.
const EMBED_COPY = ['hubembed']

// index.html rewrites: the deck reaches out of its folder with ../../, points
// its iframes at embed folders that have moved, and links to three
// github.io/github.com URLs. Inside site/ everything it needs is local, and the
// rules forbid hard-coded hostnames in our own links.
const REWRITES = [
  [/\.\.\/\.\.\/charts\//g, 'assets/charts/'],
  [/\.\.\/\.\.\/videos\//g, 'assets/videos/'],
  [/\.\.\/\.\.\/brain\/web\//g, 'brain/'],
  [/\.\.\/\.\.\/hub-viewer\//g, 'hub-viewer/'],
  // Deck-internal embeds moved into embeds/. Anchored to src=" so it cannot
  // touch brain/ or hub-viewer/, which stay where they are.
  [/src="(mapembed|hpmapembed|fleetembed|hubembed)\//g, `src="${EMBEDS_DIR}/$1/`],
]

// The closing slide's three QR tiles pointed at two GitHub accounts and a
// github.io page. In the archive they become the way into the three sub-apps,
// which is also what the studio asked for: the analysis platform and the
// configurator have to be reachable on their own, not only as iframes.
const CLOSE_LINKS = [
  {
    href: 'https://ofa5406.github.io/wolfsburg/',
    to: 'map/',
    key: 'Activity Map',
    sub: 'Spatial analysis platform',
  },
  {
    href: 'https://github.com/ofa5406/wolfsburg',
    to: 'brain/',
    key: 'Project Brain',
    sub: '408-note knowledge graph',
  },
  {
    href: 'https://github.com/annestasiia/wolfsburg-activity-map',
    to: 'hub-viewer/',
    key: 'Hub Viewer',
    sub: '3D hub element configurator',
  },
]

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function copyInto(from, to, label) {
  if (!await exists(from)) {
    console.log(`  !! missing: ${label} (${from})`)
    return false
  }
  await cp(from, to, { recursive: true })
  console.log(`  ${label}`)
  return true
}

console.log(`Building ${SITE}\n`)
await rm(SITE, { recursive: true, force: true })
await mkdir(SITE, { recursive: true })

// ── 1. The deck becomes the site root: what opens is the project itself ─────
console.log('deck ->  site/')
for (const f of DECK_FILES) {
  await copyInto(join(ROOT, 'exhibition/deck', f), join(SITE, f), f)
}
for (const d of DECK_DIRS) {
  await copyInto(join(ROOT, 'exhibition/deck', d), join(SITE, d), `${d}/`)
}

// ── 2. Assets the deck reaches for outside its folder ───────────────────────
console.log('\nexternal assets ->  site/assets/')
await mkdir(join(SITE, 'assets/charts'), { recursive: true })
for (const f of CHARTS) {
  await copyInto(join(ROOT, 'charts', f), join(SITE, 'assets/charts', f), `charts/${f}`)
}
await mkdir(join(SITE, 'assets/videos'), { recursive: true })
for (const f of VIDEOS) {
  await copyInto(join(ROOT, 'videos', f), join(SITE, 'assets/videos', f), `videos/${f}`)
}

// ── 2b. Rebuild the map embeds from the offline-capable source ──────────────
// Each build copies the whole of public/ — 65 MB of OSM snapshots, 38 MB of
// GeoJSON and a 7.5 MB video — into every embed. Three embeds of that is over
// 300 MB of data none of them fully uses, so each is pruned to the files its
// own bundle actually names.
console.log(`\nmap embeds ->  site/${EMBEDS_DIR}/  (rebuilt from source, then pruned)`)
const MAP_SRC = join(ROOT, 'wolfsburg-activity-map')
await mkdir(join(SITE, EMBEDS_DIR), { recursive: true })

async function pruneEmbed(dir) {
  const bundles = (await readdir(join(dir, 'assets')))
    .filter(f => f.endsWith('.js'))
  let code = ''
  for (const b of bundles) code += await readFile(join(dir, 'assets', b), 'utf8')

  let removed = 0
  let freed = 0

  // Snapshot names are assembled at runtime (`${BASE}osm/${name}.json`), so
  // keep a snapshot only if its bare name appears as a literal in the bundle.
  const osmDir = join(dir, 'osm')
  for (const f of await readdir(osmDir).catch(() => [])) {
    const name = f.replace(/\.json$/, '')
    if (code.includes(`"${name}"`) || code.includes(`'${name}'`)) continue
    freed += (await stat(join(osmDir, f))).size
    await rm(join(osmDir, f))
    removed++
  }

  // Same test for the GeoJSON layers, which are fetched by full filename.
  for (const f of await readdir(dir)) {
    if (!f.endsWith('.geojson')) continue
    if (code.includes(f)) continue
    freed += (await stat(join(dir, f))).size
    await rm(join(dir, f))
    removed++
  }

  // The presentation video belongs to the standalone map, not to an embed.
  const video = join(dir, 'Video')
  if (await exists(video)) {
    await rm(video, { recursive: true })
    removed++
  }

  return { removed, freed }
}

for (const { config, out, entry } of EMBED_BUILDS) {
  const target = join(SITE, EMBEDS_DIR, out)
  // shell:true re-splits the argument list, and this path contains a space
  // ("final submission"), so the target has to be quoted explicitly.
  execFileSync('npx', ['vite', 'build', '--config', config, '--outDir', `"${target}"`, '--emptyOutDir'],
    { cwd: MAP_SRC, stdio: 'pipe', shell: true })
  if (entry !== 'index.html') await rename(join(target, entry), join(target, 'index.html'))
  const { removed, freed } = await pruneEmbed(target)
  console.log(`  ${EMBEDS_DIR}/${out}/  (from ${config}; pruned ${removed} unused files, ${(freed / 1024 / 1024).toFixed(0)} MB)`)
}
for (const d of EMBED_COPY) {
  await copyInto(join(ROOT, 'exhibition/deck', d), join(SITE, EMBEDS_DIR, d), `${EMBEDS_DIR}/${d}/`)
}

// ── 3. The other three pieces, each standing on its own ─────────────────────
console.log('\nsub-apps ->  site/')
await copyInto(join(ROOT, 'brain/web'), join(SITE, 'brain'), 'brain/')
await copyInto(join(ROOT, 'hub-viewer'), join(SITE, 'hub-viewer'), 'hub-viewer/')
await copyInto(join(ROOT, 'wolfsburg-activity-map/dist'), join(SITE, 'map'), 'map/  (activity map build)')

// ── 4. Rewrite the deck's paths and closing links ───────────────────────────
console.log('\nrewriting index.html')
const indexPath = join(SITE, 'index.html')
let html = await readFile(indexPath, 'utf8')

for (const [pattern, replacement] of REWRITES) {
  const n = (html.match(pattern) || []).length
  html = html.replace(pattern, replacement)
  console.log(`  ${n}x  ${pattern.source}  ->  ${replacement}`)
}

for (const link of CLOSE_LINKS) {
  if (!html.includes(link.href)) {
    console.log(`  !! close link not found: ${link.href}`)
    continue
  }
  html = html.replace(`href="${link.href}"`, `href="${link.to}"`)
  console.log(`  close link  ${link.href}  ->  ${link.to}`)
}

// Swap the QR captions for the sub-app names. The QR images encoded the old
// URLs, so they would be misleading here — the tile is now a link, not a code.
html = html
  .replace(/<span class="qr-k">Live presentation<\/span>\s*<span class="qr-u">[^<]*<\/span>/,
    `<span class="qr-k">${CLOSE_LINKS[0].key}</span><span class="qr-u">${CLOSE_LINKS[0].sub}</span>`)
  .replace(/<span class="qr-k">Project repository<\/span>\s*<span class="qr-u">[^<]*<\/span>/,
    `<span class="qr-k">${CLOSE_LINKS[1].key}</span><span class="qr-u">${CLOSE_LINKS[1].sub}</span>`)
  .replace(/<span class="qr-k">Activity Map tool<\/span>\s*<span class="qr-u">[^<]*<\/span>/,
    `<span class="qr-k">${CLOSE_LINKS[2].key}</span><span class="qr-u">${CLOSE_LINKS[2].sub}</span>`)

await writeFile(indexPath, html)

// ── 5. GitHub Pages needs this or it drops every _underscore folder ─────────
await writeFile(join(SITE, '.nojekyll'), '')
console.log('\nwrote .nojekyll')

// ── 6. presentation/ — the deck is the presentation, so point at it ─────────
await mkdir(join(SITE, 'presentation'), { recursive: true })
await writeFile(join(SITE, 'presentation', 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>stadt.hub — Presentation</title>
<meta http-equiv="refresh" content="0; url=../">
<script>location.replace('../' + location.search + location.hash)</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<p>The presentation is the site itself — <a href="../">open it here</a>.</p>
</body>
</html>
`)
console.log('wrote presentation/index.html  (redirects to the deck)')

// ── 6a. Printed material, at web resolution ─────────────────────────────────
// The print-resolution originals live in final submission/materials/ and go to
// Nextcloud; these are the 150 dpi versions made by prepare-materials.py.
await mkdir(join(SITE, 'materials'), { recursive: true })
const MATERIALS_WEB = join(ROOT, 'final submission', 'materials-web')
if (await exists(MATERIALS_WEB)) {
  const files = (await readdir(MATERIALS_WEB)).filter(f => !f.startsWith('.'))
  for (const f of files) await cp(join(MATERIALS_WEB, f), join(SITE, 'materials', f))
  console.log(`materials/  (${files.length} web-resolution file(s): ${files.join(', ')})`)
} else {
  console.log('created materials/  (empty — run prepare-materials.py to fill it)')
}

// ── 6b. Launchers, so the folder opens without a terminal ───────────────────
// Opening index.html directly leaves every Vite-built embed blank — browsers
// refuse ES modules over file://. These serve the folder they sit in. The map
// gets its own pair so it can be opened without going through the deck; the
// ports differ so both can run at once.
console.log('\nlaunchers')
const LAUNCHERS = join(ROOT, 'final submission', 'launchers')
for (const [dest, port] of [[SITE, 8777], [join(SITE, 'map'), 8778]]) {
  for (const name of ['open-offline.cmd', 'open-offline.sh']) {
    const template = await readFile(join(LAUNCHERS, name), 'utf8')
    await writeFile(join(dest, name), template.replaceAll('__PORT__', String(port)))
  }
  console.log(`  ${dest === SITE ? 'site/' : 'site/map/'}  (port ${port})`)
}

// ── 6c. The activity map explains itself as its own piece ───────────────────
const MAP_README = join(ROOT, 'final submission', 'map-README.md')
if (await exists(MAP_README)) {
  await cp(MAP_README, join(SITE, 'map', 'README.md'))
  console.log('copied README.md into site/map/')
}

// ── 7. The README lives beside this script so a rebuild cannot lose it ──────
const README = join(ROOT, 'final submission', 'README.md')
if (await exists(README)) {
  await cp(README, join(SITE, 'README.md'))
  console.log('copied README.md into site/')
} else {
  console.log('!! final submission/README.md missing — site/ has no README')
}

console.log('\nDone.')
