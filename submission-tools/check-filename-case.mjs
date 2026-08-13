// Catch filename-case mismatches before GitHub Pages does.
//
// Windows and macOS treat Logo.PNG and logo.png as the same file; the Linux
// box that serves GitHub Pages does not. A mismatch works perfectly here and
// 404s once published, which is a round trip after the deadline. This compares
// every local path referenced in the HTML against what is actually on disk,
// case-sensitively.
//
// Run:  node "final submission/check-filename-case.mjs"

import { readdir, readFile, stat } from 'node:fs/promises'
import { join, dirname, resolve, sep } from 'node:path'
import { SITE } from './paths.mjs'


async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else yield p
  }
}

// Every real path on disk, as a lowercase -> actual map.
const actual = new Map()
for await (const f of walk(SITE)) actual.set(f.toLowerCase(), f)

const REF = /(?:src|href)\s*=\s*["']([^"'#?]+)/g

let checked = 0
const problems = []

for await (const file of walk(SITE)) {
  if (!/\.(html|css|js)$/.test(file)) continue
  const text = await readFile(file, 'utf8')

  for (const m of text.matchAll(REF)) {
    const ref = m[1].trim()
    // Skip anything that is not a relative file path.
    if (!ref || /^(https?:|data:|blob:|mailto:|javascript:|#|\/\/)/.test(ref)) continue
    // Minified bundles contain `src="${...}"` template literals — a runtime
    // value, not a path we can resolve here.
    if (ref.includes('${') || ref.includes('+')) continue

    const target = resolve(dirname(file), ref.split('?')[0])
    if (!target.startsWith(SITE + sep) && target !== SITE) continue

    checked++
    const onDisk = await stat(target).catch(() => null)
    if (onDisk) continue                      // resolves as written (or is a dir)

    const match = actual.get(target.toLowerCase())
    if (match) {
      problems.push(`CASE  ${file.slice(SITE.length + 1)}\n        refers to: ${ref}\n        on disk:   ${match.slice(SITE.length + 1)}`)
    } else if (!/\/$/.test(ref)) {
      problems.push(`MISSING  ${file.slice(SITE.length + 1)}  ->  ${ref}`)
    }
  }
}

console.log(`checked ${checked} local references in site/\n`)
if (problems.length) {
  for (const p of problems) console.log(p)
  console.log(`\n${problems.length} problem(s).`)
  process.exit(1)
}
console.log('OK — every reference matches a real file, case included.')
