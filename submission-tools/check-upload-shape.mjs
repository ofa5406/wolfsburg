// The submission folder must contain exactly what Nextcloud expects.
//
// The studio's folder is already there with its subfolders ready, and the brief
// says plainly: "Do not create new ones — upload into the existing structure so
// everything stays comparable across teams."
//
// So `final submission/` is pure output. Anything else that appears in it would
// be uploaded by mistake and land outside the agreed structure. This check
// exists so that cannot happen quietly — the build tooling lives in
// submission-tools/, one level up, and is copied into source/build/ for the
// archive.
//
// Run:  node submission-tools/check-upload-shape.mjs

import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { SUBMISSION, UPLOAD_SHAPE } from './paths.mjs'

const entries = (await readdir(SUBMISSION)).filter(e => e !== '.DS_Store' && e !== 'Thumbs.db')

const expected = new Set(UPLOAD_SHAPE)
const unexpected = entries.filter(e => !expected.has(e)).sort()
const missing = UPLOAD_SHAPE.filter(e => !entries.includes(e))

console.log(`${SUBMISSION}\n`)
for (const name of entries.sort()) {
  const info = await stat(join(SUBMISSION, name))
  const kind = info.isDirectory() ? 'dir ' : 'file'
  const mark = expected.has(name) ? ' ' : '!'
  console.log(` ${mark} ${kind}  ${name}`)
}

let problems = 0

if (unexpected.length) {
  problems += unexpected.length
  console.log(`\nNOT PART OF THE UPLOAD (${unexpected.length}):`)
  for (const e of unexpected) console.log(`  - ${e}`)
  console.log('  Move these into submission-tools/ or delete them. Uploading the')
  console.log('  folder as it stands would put them at the top of 02_StadtHub/.')
}

if (missing.length) {
  problems += missing.length
  console.log(`\nMISSING (${missing.length}): ${missing.join(', ')}`)
  console.log('  Run build-site.mjs then build-submission.mjs.')
}

console.log(problems === 0
  ? '\nOK — exactly the six entries Nextcloud expects.'
  : `\n${problems} problem(s).`)
process.exit(problems === 0 ? 0 : 1)
