// Bring the images in `site/` down to web resolution.
//
// The guidelines ask for 2000 px on the long edge at JPEG quality 80, and the
// studio named our chart images specifically (several were 12-21 MB). The
// originals stay untouched in the repo — they are what goes to Nextcloud under
// `raw/`; only the web version belongs in the site.
//
// Run after build-site.mjs:  node "final submission/downsize-media.mjs"
//
// sharp is not a project dependency; install it wherever convenient and point
// NODE_PATH at it, or run this from a folder that has it.

import { readdir, stat, rename, unlink } from 'node:fs/promises'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SITE = join(dirname(fileURLToPath(import.meta.url)), 'site')

const MAX_EDGE = 2000
const QUALITY = 80
// Anything smaller than this is already fine; re-encoding it would only cost
// quality for no meaningful saving.
const MIN_BYTES = 600 * 1024

const mb = (n) => (n / 1024 / 1024).toFixed(2)

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else yield p
  }
}

let before = 0
let after = 0
let count = 0
const skipped = []

for await (const file of walk(SITE)) {
  const ext = extname(file).toLowerCase()
  // GIFs are animated here (network-layers.gif) and would lose their frames;
  // SVGs are vector and already small.
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue

  const { size } = await stat(file)
  if (size < MIN_BYTES) continue

  let meta
  try {
    meta = await sharp(file).metadata()
  } catch (err) {
    skipped.push(`${file} — unreadable (${err.message})`)
    continue
  }

  const longEdge = Math.max(meta.width || 0, meta.height || 0)
  const needsResize = longEdge > MAX_EDGE

  const tmp = `${file}.tmp`
  let pipeline = sharp(file)
  if (needsResize) pipeline = pipeline.resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })

  // Formats are preserved: every reference in the HTML points at these exact
  // filenames, so a .png stays a PNG even where JPEG would be smaller.
  try {
    if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9 }).toFile(tmp)
    } else {
      await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toFile(tmp)
    }
  } catch (err) {
    skipped.push(`${file} — ${err.message}`)
    try { await unlink(tmp) } catch {}
    continue
  }

  const newSize = (await stat(tmp)).size
  if (newSize >= size) {
    // Re-encoding made it bigger; keep the original.
    await unlink(tmp)
    continue
  }

  await unlink(file)
  await rename(tmp, file)

  before += size
  after += newSize
  count++
  console.log(`${mb(size).padStart(7)} -> ${mb(newSize).padStart(7)} MB  ${longEdge}px  ${file.slice(SITE.length + 1)}`)
}

console.log(`\n${count} images: ${mb(before)} MB -> ${mb(after)} MB (saved ${mb(before - after)} MB)`)
if (skipped.length) {
  console.log(`\nSkipped:\n  ${skipped.join('\n  ')}`)
}
