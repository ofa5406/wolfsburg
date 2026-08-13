// Every third-party photograph must be credited in the README.
//
// Rule 5 makes the university the publisher, and the brief is explicit that "an
// honest gap is workable, a silent one is not". A photograph that is simply
// never mentioned is the silent kind: nothing fails, nothing warns, it just is
// not credited. This walks the two folders of sourced photographs and checks
// each filename appears in the README.
//
// Run:  node submission-tools/check-credits.mjs

import { readdir, readFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import { SITE, SUBMISSION_README } from './paths.mjs'

// Folders holding photographs that came from somewhere else.
const SOURCED = ['assets/history', 'assets/today']

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

const readme = await readFile(SUBMISSION_README, 'utf8')

let checked = 0
const uncredited = []

for (const rel of SOURCED) {
  const dir = join(SITE, rel)
  const files = await readdir(dir).catch(() => null)
  if (!files) {
    console.log(`!! missing folder: ${rel}`)
    continue
  }
  for (const f of files) {
    if (!IMAGE_EXT.has(extname(f).toLowerCase())) continue
    checked++
    // Credited by stem, so the README does not have to repeat file extensions.
    const stem = basename(f, extname(f))
    if (!readme.includes(stem)) uncredited.push(`${rel}/${f}`)
  }
}

console.log(`checked ${checked} sourced photographs against the README\n`)

let problems = uncredited.length
if (uncredited.length) {
  console.log(`NOT CREDITED (${uncredited.length}):`)
  for (const f of uncredited) console.log(`  - ${f}`)
}

// A leftover placeholder is worse than an admitted gap, because it reads as
// finished text until someone looks closely.
for (const marker of ['TO FILL IN', 'TODO', 'FIXME']) {
  if (readme.includes(marker)) {
    console.log(`\nPLACEHOLDER LEFT IN README: "${marker}"`)
    problems++
  }
}

console.log(problems === 0
  ? 'OK — every sourced photograph is credited, no placeholders left.'
  : `\n${problems} problem(s).`)
process.exit(problems === 0 ? 0 : 1)
