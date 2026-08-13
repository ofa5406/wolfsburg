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

// ── The folders that need files from outside this repo ─────────────────────
const NOTES = {
  materials: `# materials/

Print-resolution (300 dpi or better) posters, boards, brochures, plans and
drawings. The web-resolution copies of the same files go in \`site/materials/\`.

Nothing is here yet. What belongs:
- any printed sheets or boards shown at the Summaery exhibition
- the plan drawings and hub typology sheets, exported to PDF
- anything that exists only on paper, scanned at 300 dpi, straight-on, evenly lit

If it was in the exhibition and is not in this folder, it is gone.
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

Originals too large or too high-resolution for the site.

Already available in the repo but NOT yet copied here (they are large):
- \`charts/\` — full-resolution chart and masterplan images; \`site/\` carries
  2000 px / q80 versions of the five it uses
- \`videos/\` — the three hero videos at source resolution
- \`exhibition/visual content/\` — the source photographs
- \`wolfsburg-activity-map/cycle paths/\` — 8.8 MB of cycling survey material

Still to add from outside the repo:
- \`wolfsburg_masterplan.3dm\` and \`toolpalette.3dm\` — the Rhino models. Neither
  is in the repository; they are the source of the hub viewer and the masterplan
  drawings and should be archived here.
- master video files, if any exist above the versions in \`site/\`
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
