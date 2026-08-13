// Assemble the rest of the Nextcloud folder around `site/`.
//
// Nextcloud already has 02_StadtHub/ waiting with these subfolders; this fills
// the ones that can be filled from the repo. `materials/`, `exhibition/` and
// most of `raw/` need files that only exist off this machine — they are created
// empty with a note saying what belongs in each.
//
// Run after build-site.mjs:  node "final submission/build-submission.mjs"

import { cp, mkdir, writeFile, readFile, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')

// Everything the site was built from. Excludes build output and dependencies —
// those are regenerated, not archived.
const SKIP = new Set(['node_modules', 'dist', '.git', '.netlify'])
const filter = (src) => !SKIP.has(src.split(/[\\/]/).pop())

async function exists(p) {
  try { await stat(p); return true } catch { return false }
}

async function copyInto(from, to, label) {
  if (!await exists(from)) { console.log(`  !! missing: ${label}`); return }
  await cp(from, to, { recursive: true, filter })
  console.log(`  ${label}`)
}

// ── source/ — what the site was built from ─────────────────────────────────
console.log('source/')
const SOURCE = join(HERE, 'source')
await mkdir(SOURCE, { recursive: true })

await copyInto(join(ROOT, 'wolfsburg-activity-map'), join(SOURCE, 'wolfsburg-activity-map'),
  'wolfsburg-activity-map/  (Vite app: src, public, scripts, analysis)')
await copyInto(join(ROOT, 'brain'), join(SOURCE, 'brain'),
  'brain/  (408-note vault + validator/graph scripts + viewer)')
await copyInto(join(ROOT, 'hub-viewer'), join(SOURCE, 'hub-viewer'),
  'hub-viewer/  (3D element viewer + baked model data)')
await copyInto(join(ROOT, 'exhibition/deck'), join(SOURCE, 'deck'),
  'deck/  (the presentation — plain HTML, same files as site/)')
await copyInto(join(ROOT, 'rhino'), join(SOURCE, 'rhino'),
  'rhino/  (Rhino bridge + kit-of-parts build script)')
await copyInto(join(ROOT, 'final-presentation'), join(SOURCE, 'final-presentation'),
  'final-presentation/  (earlier scroll presentation)')

// The two scripts that assemble the site belong with the source, since the
// README tells a future reader to run them.
for (const f of ['build-site.mjs', 'downsize-media.mjs', 'build-submission.mjs']) {
  await cp(join(HERE, f), join(SOURCE, f))
}
console.log('  build-site.mjs, downsize-media.mjs, build-submission.mjs')

// ── raw/ — the originals that the site only carries downsized ──────────────
// site/ ships 2000 px / q80 images; these are what they were made from, plus
// the source photographs and survey material too large to belong in a website.
console.log('\nraw/  (originals — site/ carries downsized versions)')
const RAW = join(HERE, 'raw')
await mkdir(RAW, { recursive: true })

const RAW_SOURCES = [
  [join(ROOT, 'charts'), join(RAW, 'charts'), 'charts/  (full-resolution charts + masterplans)'],
  [join(ROOT, 'videos'), join(RAW, 'videos'), 'videos/  (source hero videos)'],
  [join(ROOT, 'exhibition/visual content'), join(RAW, 'exhibition-photographs'), 'exhibition-photographs/  (source photographs)'],
  [join(ROOT, 'wolfsburg-activity-map/cycle paths'), join(RAW, 'cycle-paths'), 'cycle-paths/  (cycling survey material)'],
]
for (const [from, to, label] of RAW_SOURCES) await copyInto(from, to, label)

// ── The folders that need files from outside this repo ─────────────────────
const NOTES = {
  materials: `# materials/

The printed exhibition work, at print resolution. The 150 dpi copies of the same
files are in \`site/materials/\`; both are produced by \`prepare-materials.py\`.

- \`graphic-and-content.pdf\` — 9 boards at A2 (594 x 420 mm), the exhibition
  graphics and text. 12.4 MB; the web copy is 7.1 MB.
- \`before-after.pdf\` — 8 sheets at A3 (420 x 297 mm), before/after views of the
  hub sites. 6.0 MB; already web-sized, so the web copy is identical.

The source images behind the before/after sheets are in
\`raw/exhibition-prints/before-after-images/\`.

Still missing: photographs of the physical competition model, if one was built.
`,
  exhibition: `# exhibition/

Photographs of the Summaery 2026 exhibit (9-12 July).

Nothing is here yet. What belongs:
- the installation itself, as visitors met it
- the screen running the presentation
- anything printed or built for the show
- people using it
`,
  raw: `# raw/

Originals too large or too high-resolution for the site. \`site/\` carries
2000 px / quality-80 versions of these.

Copied here by \`build-submission.mjs\`:
- \`charts/\` — full-resolution charts and masterplan images
- \`videos/\` — the three hero videos at source resolution
- \`exhibition-photographs/\` — the source photographs used across the deck
- \`cycle-paths/\` — cycling survey material

Still to add from outside the repository:
- \`wolfsburg_masterplan.3dm\` and \`toolpalette.3dm\` — the Rhino models. Neither
  is in the repository; they are the source of the hub viewer and of the
  masterplan drawings, and should be archived here.
- photographs of the physical competition model
`,
}

console.log('\nfolders needing files from elsewhere:')
for (const [name, note] of Object.entries(NOTES)) {
  const dir = join(HERE, name)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'README.md'), note)
  console.log(`  ${name}/  (README.md explains what goes here)`)
}

// ── README.md at the top of the folder, same file as site/README.md ────────
const readme = join(HERE, 'site', 'README.md')
if (await exists(readme)) {
  await cp(readme, join(HERE, 'README.md'))
  console.log('\nREADME.md  (copy of site/README.md, as required)')
} else {
  console.log('\n!! site/README.md not found — run build-site.mjs first')
}

console.log('\nDone.')
