// The wifi-off check, automated.
//
// Serves the submission folder so that `site/` sits one level deep — the same
// shape as Bauhaus-InfAU.github.io/<project>/ — then blocks every request that
// would leave the machine, loads all four pieces, and reports console errors,
// page exceptions, failed requests and broken images.
//
// Blocking at the browser is stricter than switching wifi off, and it removes
// the cache problem the guidelines warn about: nothing external can resolve,
// whether or not the browser has seen it before.
//
// Run:  node "final submission/verify-offline.mjs"

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, dirname, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const HERE = dirname(fileURLToPath(import.meta.url))

// playwright is a dependency of the activity map, not of this folder, so
// resolve it from there rather than requiring an install alongside this script.
const require = createRequire(join(HERE, '..', 'wolfsburg-activity-map', 'package.json'))
const { chromium } = require('playwright')
const PORT = 8347
const BASE = `http://127.0.0.1:${PORT}/site/`

const TYPES = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.pbf': 'application/x-protobuf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
}

// Pages to check. `wait` gives slower ones (3D, force graph) time to settle.
//
// The map gets a `clickThrough` pass: most of its OSM snapshots only load when
// a section is opened, so simply loading the landing page would prove very
// little. Each label is clicked in turn and given time to fetch and render.
const PAGES = [
  { name: 'Deck (presentation)', url: BASE, wait: 6000 },
  {
    // The map opens on a long landing page whose analysis sections (mobility,
    // livability, centrality, hubs, comparison) mount as they scroll into view
    // and load their snapshots then. Scrolling is what exercises them; the nav
    // sections are reached afterwards.
    name: 'Activity Map', url: `${BASE}map/`, wait: 9000,
    scrollThrough: true,
    clickThrough: ['Capacity Analysis', 'Urban Design'],
  },
  { name: 'Project Brain', url: `${BASE}brain/`, wait: 7000 },
  { name: 'Hub Viewer', url: `${BASE}hub-viewer/`, wait: 7000 },
]

// ── Static server ───────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    let filePath = normalize(join(HERE, urlPath))
    // Never serve outside the submission folder.
    if (!filePath.startsWith(HERE + sep)) { res.writeHead(403).end(); return }

    let s = await stat(filePath).catch(() => null)
    if (s?.isDirectory()) {
      filePath = join(filePath, 'index.html')
      s = await stat(filePath).catch(() => null)
    }
    if (!s) { res.writeHead(404).end('not found'); return }

    const type = TYPES[extname(filePath).toLowerCase()] || 'application/octet-stream'
    const body = await readFile(filePath)

    // Video elements request byte ranges. Without a 206 the browser aborts the
    // request, which would show up here as a broken local file — a false alarm
    // caused by the test server, not by the site.
    const range = req.headers.range
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range)
      const start = m?.[1] ? parseInt(m[1], 10) : 0
      const end = m?.[2] ? parseInt(m[2], 10) : body.length - 1
      res.writeHead(206, {
        'Content-Type': type,
        'Content-Range': `bytes ${start}-${end}/${body.length}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
      })
      res.end(body.subarray(start, end + 1))
      return
    }

    res.writeHead(200, { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Length': body.length })
    res.end(body)
  } catch (err) {
    res.writeHead(500).end(String(err))
  }
})

await new Promise(r => server.listen(PORT, '127.0.0.1', r))
console.log(`serving ${HERE} at http://127.0.0.1:${PORT}/\n`)

// ── Browser ─────────────────────────────────────────────────────────────────
const browser = await chromium.launch()
let totalProblems = 0

for (const page of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } })
  const tab = await ctx.newPage()

  const errors = []
  const external = []
  const failed = []

  // Anything not on 127.0.0.1 is a dependency on the outside world.
  await ctx.route('**/*', (route) => {
    const url = route.request().url()
    if (url.startsWith(`http://127.0.0.1:${PORT}/`) || url.startsWith('data:') || url.startsWith('blob:')) {
      return route.continue()
    }
    external.push(url)
    return route.abort()
  })

  tab.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  tab.on('pageerror', (e) => errors.push(`EXCEPTION: ${e.message}`))
  tab.on('requestfailed', (r) => {
    const url = r.url()
    if (!url.startsWith(`http://127.0.0.1:${PORT}/`)) return
    // A video that is still streaming when the page closes reports ERR_ABORTED.
    // That is the browser giving up on a request we cut short, not a missing
    // file — the <video> readyState check below is what actually decides.
    if (r.failure()?.errorText === 'net::ERR_ABORTED' && /\.(mp4|webm)$/.test(url)) return
    failed.push(`${url} — ${r.failure()?.errorText}`)
  })
  tab.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.url()} — HTTP ${r.status()}`) })

  process.stdout.write(`${page.name} … `)
  const visited = []
  try {
    await tab.goto(page.url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await tab.waitForTimeout(page.wait)

    if (page.scrollThrough) {
      // The landing page scrolls inside its own container, not the document,
      // so find whichever element actually has overflowing content.
      const height = await tab.evaluate(() => {
        const all = [document.scrollingElement, ...document.querySelectorAll('*')]
        let best = document.scrollingElement
        let max = 0
        for (const el of all) {
          if (!el) continue
          const over = el.scrollHeight - el.clientHeight
          if (over > max) { max = over; best = el }
        }
        window.__scroller = best
        return best.scrollHeight
      })
      const steps = Math.min(30, Math.max(4, Math.ceil(height / 700)))
      for (let i = 1; i <= steps; i++) {
        await tab.evaluate((y) => { window.__scroller.scrollTop = y }, (i * height) / steps)
        await tab.waitForTimeout(1200)
      }
      visited.push(`scrolled ${steps} steps (${height}px)`)
      await tab.evaluate(() => { window.__scroller.scrollTop = 0 })
      await tab.waitForTimeout(1500)
    }

    for (const label of page.clickThrough ?? []) {
      const target = tab.getByText(label, { exact: true }).first()
      if (await target.count() === 0) { visited.push(`${label} (not found)`); continue }
      try {
        await target.click({ timeout: 5000 })
        await tab.waitForTimeout(4000)
        visited.push(label)
      } catch (err) {
        visited.push(`${label} (click failed)`)
      }
    }
  } catch (err) {
    errors.push(`NAVIGATION: ${err.message.split('\n')[0]}`)
  }

  // Images that resolved but decoded to nothing.
  const brokenImages = await tab.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter(i => i.getAttribute('src') && !i.getAttribute('src').startsWith('data:') && i.naturalWidth === 0)
      .map(i => i.getAttribute('src'))
  ).catch(() => [])

  // Videos that never got far enough to have any decoded data.
  const deadVideos = await tab.evaluate(() =>
    [...document.querySelectorAll('video')]
      .filter(v => v.readyState < 2 || !isFinite(v.duration) || v.duration === 0)
      .map(v => v.currentSrc || v.getAttribute('src') || '(no src)')
  ).catch(() => [])

  const problems = errors.length + external.length + failed.length + brokenImages.length + deadVideos.length
  totalProblems += problems
  console.log(problems === 0 ? 'clean' : `${problems} problem(s)`)
  if (visited.length) console.log(`   visited: ${visited.join(' · ')}`)

  const show = (label, list) => {
    if (!list.length) return
    console.log(`   ${label} (${list.length}):`)
    for (const item of [...new Set(list)].slice(0, 8)) console.log(`     - ${item.slice(0, 160)}`)
    if (new Set(list).size > 8) console.log(`     … and ${new Set(list).size - 8} more`)
  }
  show('BLOCKED EXTERNAL REQUESTS', external)
  show('failed local requests', failed)
  show('console errors', errors)
  show('broken images', brokenImages)
  show('videos with no data', deadVideos)

  await ctx.close()
}

await browser.close()
server.close()

console.log(`\n${totalProblems === 0 ? 'PASS — nothing reaches the network, nothing 404s.' : `${totalProblems} problem(s) to fix.`}`)
process.exit(totalProblems === 0 ? 0 : 1)
