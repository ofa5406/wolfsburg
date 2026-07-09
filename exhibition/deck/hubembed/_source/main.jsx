/* ─────────────────────────────────────────────────────────────
   embed-hub/main.jsx — standalone, offline bundle of the
   interactive hub-typology diagram (plan + axonometric + element
   legend) from the Urban Design tool, for the <stadt.hub> deck
   (exhibition/deck/hubembed). Reuses the REAL deployment views
   (PlanView / AxonView from HubScene) so the diagrams behave
   exactly like the live tool: hover to highlight, click to lock,
   drag the axon to rotate.

   URL params:
     ?tier=s|m|l   which hub tier   (default s)
     ?view=plan    just the top-down plan (page 14 galleries)
     ?view=scene   plan + axon + element legend (default; hub pages)

   embed → deck : { type:'embed-interaction' }  (visitor touched it)
─────────────────────────────────────────────────────────────── */
import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { PlanView, AxonView } from '../src/components/hub/HubScene.jsx'
import { HUB_LAYOUTS } from '../src/data/hubLayouts.js'
import { ELEMENT_BY_ID, CAT_COLOR, FONT, C, catText, HubIcon } from '../src/data/hubElements.jsx'

function post(m) { try { window.parent.postMessage(m, '*') } catch (e) {} }

const cap = { fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.text3, margin: '0 0 6px' }
const box = { border: `1px solid ${C.border}`, borderRadius: 8, padding: 8, marginBottom: 14 }

function DetailLine({ ref_ }) {
  const el = ref_ ? ELEMENT_BY_ID[ref_] : null
  return (
    <div style={{ fontFamily: FONT, fontSize: 12, color: C.text2, lineHeight: 1.45, minHeight: 36 }}>
      {el
        ? <><b style={{ color: catText(CAT_COLOR[el.cat]) }}>{el.name}.</b> {el.def}</>
        : <span style={{ color: C.text3 }}>Hover or tap an element to read it.</span>}
    </div>
  )
}

// ── Plan only (page 14 galleries) ────────────────────────────────────────────
function PlanOnly({ tier }) {
  const layout = HUB_LAYOUTS[tier] || HUB_LAYOUTS.s
  const [hover, setHover] = useState(null)
  const [sel, setSel] = useState(null)
  const planRef = useRef(null)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 10, boxSizing: 'border-box' }}>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <PlanView layout={layout} hoveredRef={hover} selectedRef={sel} onHover={setHover}
          onSelect={r => setSel(p => (p === r ? null : r))} svgRef={planRef} />
      </div>
      <div style={{ paddingTop: 6 }}><DetailLine ref_={sel || hover} /></div>
    </div>
  )
}

// per-tier plain-language explanation (TR quad)
const EXPLAIN = {
  s: 'Arrive, grab a bike or wait briefly for a pod, and leave. Compact, but unmistakably a hub: the reddish stone field, canopy and directional lines mark it as part of the family.',
  m: 'Where you have options: see live availability, then decide. A real place, not a pause. Cargo-bike dock, real-time terminal, shared-EV bay, group seating, water and repair.',
  l: 'A different category: the building is the identity. L-Anchor (central reuse) and L-Gateway (edge park-and-switch). Full-fleet operations, charging, maintenance and a ground-floor public programme.',
}

// ── 2×2 quad panel (hub pages 6.2/6.3/6.4): axon · explanation · plan · elements
function Scene({ tier }) {
  const layout = HUB_LAYOUTS[tier] || HUB_LAYOUTS.s
  const [hover, setHover] = useState(null)
  const [sel, setSel] = useState(null)
  const [az, setAz] = useState(28)
  const planRef = useRef(null)
  const axonRef = useRef(null)
  const drag = useRef(null)
  const active = sel || hover
  const activeEl = active ? ELEMENT_BY_ID[active] : null
  const refs = []
  layout.elements.forEach(e => { if (!refs.includes(e.ref)) refs.push(e.ref) })

  const cell = { minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
  const diagWrap = { flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
      gap: 'clamp(8px,1.6vw,20px)', padding: 4, boxSizing: 'border-box' }}>

      {/* TL — axonometric (drag to rotate) */}
      <div style={cell}>
        <div style={cap}>Axonometric · drag</div>
        <div style={{ ...diagWrap, cursor: 'grab' }}
          onPointerDown={e => { drag.current = { x: e.clientX, az } }}
          onPointerMove={e => { if (drag.current) setAz(drag.current.az + (e.clientX - drag.current.x) * 0.5) }}
          onPointerUp={() => { drag.current = null }} onPointerLeave={() => { drag.current = null }}>
          <AxonView layout={layout} azimuth={az} hoveredRef={hover} selectedRef={sel} onHover={setHover}
            onSelect={r => setSel(p => (p === r ? null : r))} svgRef={axonRef} bg="transparent" />
        </div>
      </div>

      {/* TR — explanation */}
      <div style={{ ...cell, overflowY: 'auto', justifyContent: 'center' }}>
        <div style={cap}>Explanation</div>
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 'clamp(12px,0.95vw,15px)', lineHeight: 1.5, color: C.text2 }}>{EXPLAIN[tier] || ''}</p>
      </div>

      {/* BL — plan */}
      <div style={cell}>
        <div style={cap}>Plan · top-down</div>
        <div style={diagWrap}>
          <PlanView layout={layout} hoveredRef={hover} selectedRef={sel} onHover={setHover}
            onSelect={r => setSel(p => (p === r ? null : r))} svgRef={planRef} bg="transparent" />
        </div>
      </div>

      {/* BR — elements in this hub (named rounded buttons; click → description below the row) */}
      <div style={{ ...cell, overflowY: 'auto' }}>
        <div style={cap}>Elements in this hub</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {refs.map(ref => {
            const e = ELEMENT_BY_ID[ref]; if (!e) return null
            const col = CAT_COLOR[e.cat]; const on = active === ref
            return (
              <button key={ref}
                onMouseEnter={() => setHover(ref)} onMouseLeave={() => setHover(null)}
                onClick={() => setSel(p => (p === ref ? null : ref))}
                title={e.name}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px',
                  borderRadius: 20, cursor: 'pointer', border: `1px solid ${on ? col : C.border}`,
                  background: on ? col + '22' : '#fff', fontFamily: FONT, fontSize: 11,
                  color: on ? catText(col) : C.text2, letterSpacing: '-0.01em' }}>
                <HubIcon id={e.id} color={catText(col)} size={14} />{e.name}
              </button>
            )
          })}
        </div>
        {activeEl && (
          <div style={{ fontFamily: FONT, fontSize: 'clamp(11px,0.85vw,13px)', lineHeight: 1.45, color: C.text2, marginTop: 10 }}>
            <b style={{ color: catText(CAT_COLOR[activeEl.cat]) }}>{activeEl.name}.</b> {activeEl.def}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Axon only (page 6.1 — frameless, drag to rotate, hover to read) ──────────
function Axon({ tier }) {
  const layout = HUB_LAYOUTS[tier] || HUB_LAYOUTS.s
  const [hover, setHover] = useState(null)
  const [sel, setSel] = useState(null)
  const [az, setAz] = useState(28)
  const axonRef = useRef(null)
  const drag = useRef(null)
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, boxSizing: 'border-box', cursor: 'grab' }}
      onPointerDown={e => { drag.current = { x: e.clientX, az } }}
      onPointerMove={e => { if (drag.current) setAz(drag.current.az + (e.clientX - drag.current.x) * 0.5) }}
      onPointerUp={() => { drag.current = null }} onPointerLeave={() => { drag.current = null }}>
      <AxonView layout={layout} azimuth={az} hoveredRef={hover} selectedRef={sel} onHover={setHover}
        onSelect={r => setSel(p => (p === r ? null : r))} svgRef={axonRef} bg="transparent" />
    </div>
  )
}

const params = new URLSearchParams(location.search)
const tier = (params.get('tier') || 's').toLowerCase()
const view = (params.get('view') || 'scene').toLowerCase()

function App() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'transparent' }}
      onPointerDownCapture={() => post({ type: 'embed-interaction' })}
      onWheelCapture={() => post({ type: 'embed-interaction' })}
      onTouchStartCapture={() => post({ type: 'embed-interaction' })}>
      {view === 'axon' ? <Axon tier={tier} />
        : view === 'plan' ? <PlanOnly tier={tier} />
        : <Scene tier={tier} />}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
