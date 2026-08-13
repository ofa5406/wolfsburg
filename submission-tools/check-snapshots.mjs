// Cross-check every snapshot the code asks for against the files on disk.
//
// loadOsm() failures are quiet by design — the calling code catches them and
// carries on with empty data — so a missing snapshot would not show up as a
// console error. It would just mean a layer silently renders nothing. This
// compares the names used in the source with public/osm/ and the built site.
//
// Run:  node "final submission/check-snapshots.mjs"

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { PROJECT as ROOT, SITE } from './paths.mjs'

const SRC = join(ROOT, 'wolfsburg-activity-map', 'src')

const LOCATIONS = [
  { label: 'source  public/osm', dir: join(ROOT, 'wolfsburg-activity-map', 'public', 'osm') },
  { label: 'built   site/map/osm', dir: join(SITE, 'map', 'osm') },
]

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else if (['.js', '.jsx'].includes(extname(p))) yield p
  }
}

// loadOsm('name') and loadOsm(`district_${name}`)-style template literals.
const wanted = new Set()
const dynamic = []

for await (const file of walk(SRC)) {
  const text = await readFile(file, 'utf8')
  for (const m of text.matchAll(/loadOsm\(\s*'([^']+)'\s*\)/g)) wanted.add(m[1])
  for (const m of text.matchAll(/loadOsm\(\s*`([^`]+)`\s*\)/g)) dynamic.push({ file, expr: m[1] })
  // SNAPSHOT_BY_MODE and similar lookup tables
  for (const m of text.matchAll(/^\s*\w+:\s*'(mv_[a-z_]+)'/gm)) wanted.add(m[1])
}

// The district snapshots are built from a list rather than written out.
const boundaries = await readFile(join(SRC, 'utils', 'osmBoundaries.js'), 'utf8')
const districtBlock = /const DISTRICTS = \[([\s\S]*?)\]/.exec(boundaries)
if (districtBlock) {
  for (const m of districtBlock[1].matchAll(/'([^']+)'/g)) wanted.add(`district_${m[1]}`)
}

console.log(`${wanted.size} snapshots referenced by the code\n`)
if (dynamic.length) {
  console.log('template-literal calls (resolved above if they are districts):')
  for (const d of dynamic) console.log(`  ${d.expr}  in ${d.file.slice(ROOT.length + 1)}`)
  console.log()
}

let bad = 0
for (const { label, dir } of LOCATIONS) {
  const present = new Set(
    (await readdir(dir).catch(() => [])).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, ''))
  )
  const missing = [...wanted].filter(n => !present.has(n)).sort()
  const extra = [...present].filter(n => !wanted.has(n)).sort()

  console.log(`${label}: ${present.size} files`)
  if (missing.length) {
    bad += missing.length
    console.log(`  MISSING (${missing.length}):`)
    for (const n of missing) console.log(`    - ${n}`)
  }
  if (extra.length) console.log(`  unused: ${extra.join(', ')}`)
  if (!missing.length) console.log('  all referenced snapshots present')
  console.log()
}

// A snapshot that captured nothing is as broken as a missing one.
const dir = LOCATIONS[0].dir
for (const f of (await readdir(dir).catch(() => []))) {
  if (!f.endsWith('.json')) continue
  const { size } = await stat(join(dir, f))
  const data = JSON.parse(await readFile(join(dir, f), 'utf8'))
  const n = data.elements?.length ?? 0
  if (n === 0) { console.log(`EMPTY: ${f} (${size} bytes, 0 elements)`); bad++ }
}

console.log(bad === 0 ? 'OK — every referenced snapshot exists and has data.' : `${bad} problem(s).`)
process.exit(bad === 0 ? 0 : 1)
