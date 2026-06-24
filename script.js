// ── Always start at the top on reload ────────────────
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── Hero title typewriter ─────────────────────────────
;(function initTypewriter() {
  const el = document.querySelector('.s01-section .display-title');
  if (!el) return;

  const text = '<stadt.hub>';
  el.textContent = '';

  setTimeout(() => {
    let i = 0;
    const timer = setInterval(() => {
      el.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(timer);
        el.classList.add('tw-done');
      }
    }, 95);
  }, 400);
})()

// ── Hero video crossfade ──────────────────────────────
;(function initHeroVideo() {
  const vidA = document.getElementById('hero-vid-a');
  const vidB = document.getElementById('hero-vid-b');
  if (!vidA || !vidB) return;

  let current = vidA, next = vidB;

  function crossfade() {
    next.currentTime = 0;
    next.play().catch(() => {});
    next.classList.add('active');
    current.classList.remove('active');
    // after transition finishes, pause the outgoing video
    const outgoing = current;
    setTimeout(() => { outgoing.pause(); outgoing.currentTime = 0; }, 1300);
    // swap references
    [current, next] = [next, current];
  }

  vidA.addEventListener('ended', crossfade);
  vidB.addEventListener('ended', crossfade);
})();

// ── Helpers ───────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function easeInOut(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

// ── Scroll progress bar ───────────────────────────────
const progressBar = document.getElementById('progress');

// ── Scroll zoom — section 01 image ───────────────────
const zoomTrack = document.querySelector('.s01-zoom-track');
const zoomImg   = document.getElementById('zoom-img');

function updateZoom() {
  if (!zoomTrack || !zoomImg) return;

  const trackTop    = zoomTrack.getBoundingClientRect().top;
  const trackHeight = zoomTrack.offsetHeight;
  const vh          = window.innerHeight;

  // scrollInTrack: how far we've scrolled into the track
  const scrollInTrack = -trackTop;
  // total scrollable distance inside the track
  const scrollRange   = trackHeight - vh;
  const progress      = clamp(scrollInTrack / scrollRange, 0, 1);

  // Phase 1 — 0 → 0.72: grow to fullscreen
  const growP = easeInOut(clamp(progress / 0.72, 0, 1));
  // Phase 2 — 0.72 → 1.0: fade out
  const fadeP = clamp((progress - 0.72) / 0.28, 0, 1);

  const w = lerp(62, 100, growP);
  const h = lerp(42, 100, growP);

  zoomImg.style.width   = w + 'vw';
  zoomImg.style.height  = h + 'vh';
  zoomImg.style.opacity = 1 - fadeP;
}

// ── Nav colour — invert on dark sections ─────────────
const nav     = document.getElementById('nav');
const navRule = document.getElementById('nav-rule');

const darkObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nav.classList.add('nav--dark');
      navRule.classList.add('nav-rule--dark');
    } else {
      nav.classList.remove('nav--dark');
      navRule.classList.remove('nav-rule--dark');
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.s-dark').forEach(s => darkObserver.observe(s));

// ── Scroll handler ────────────────────────────────────
window.addEventListener('scroll', () => {
  // Progress bar
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((window.scrollY / total) * 100) + '%';

  // Zoom
  updateZoom();
}, { passive: true });

// Initial call
updateZoom();

// ── Fade + slide-up on scroll ─────────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate').forEach(el => animObserver.observe(el));

// ── Crossfade plan + lightbox ─────────────────────────
const CYCLE_MS  = 5000;
const animStart = performance.now();

function currentCrossfadeIndex() {
  const t = (performance.now() - animStart) % CYCLE_MS;
  return (t > CYCLE_MS * 0.42 && t < CYCLE_MS * 0.86) ? 1 : 0;
}

// Per-frame config
const frames = [
  {
    frameId:   'upper-plan-frame',
    labelId:   'plan-state-label',
    images:    [
      { src: 'charts/masterplan_upper.jpg',           label: 'Hub network' },
      { src: 'charts/masterplan_upper_catchment.jpg', label: 'Catchment areas' },
    ],
  },
  {
    frameId:   'lower-plan-frame',
    labelId:   'lower-plan-state-label',
    images:    [
      { src: 'charts/masterplan_lower.jpg',           label: 'City centre plan' },
      { src: 'charts/masterplan_lower_catchment.jpg', label: 'Catchment areas' },
    ],
  },
];

// Sync state labels
frames.forEach(({ labelId, images }) => {
  const el = document.getElementById(labelId);
  if (el) setInterval(() => { el.textContent = images[currentCrossfadeIndex()].label; }, 150);
});

// Lightbox
const lightboxEl    = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lbBtns        = document.querySelectorAll('.lb-btn');
let activeLbImages  = frames[0].images;

function openLightbox(images, idx) {
  activeLbImages = images;
  lightboxImg.src = images[idx].src;
  lbBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
  lightboxEl.classList.add('active');
}
function closeLightbox() {
  lightboxEl.classList.remove('active');
}

frames.forEach(({ frameId, images }) => {
  const el = document.getElementById(frameId);
  if (el) el.addEventListener('click', () => openLightbox(images, currentCrossfadeIndex()));
});

lbBtns.forEach((btn, i) => btn.addEventListener('click', e => {
  e.stopPropagation();
  openLightbox(activeLbImages, i);
}));

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxEl)    lightboxEl.addEventListener('click', e => { if (e.target === lightboxEl) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Hub explorer — L / M / S tab switching ───────────
document.querySelectorAll('.hub-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.hub-tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.hub-panel').forEach(p => p.classList.remove('active'))
    tab.classList.add('active')
    document.getElementById('hub-panel-' + tab.dataset.hub).classList.add('active')
  })
})

// ── Persona switcher ──────────────────────────────────
;(function initPersonas() {
  const tabs   = document.querySelectorAll('.persona-tab')
  const panels = document.querySelectorAll('.persona-panel')

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.persona
      tabs.forEach(t => t.classList.remove('active'))
      panels.forEach(p => p.classList.remove('active'))
      tab.classList.add('active')
      document.querySelector(`.persona-panel[data-persona="${idx}"]`).classList.add('active')
    })
  })

  // Before / After portrait + content toggle (per panel)
  document.querySelectorAll('.persona-panel').forEach(panel => {
    const btns          = panel.querySelectorAll('.pp-state-btn')
    const before        = panel.querySelector('.pp-img--before')
    const after         = panel.querySelector('.pp-img--after')
    const contentBefore = panel.querySelector('.pp-content--before')
    const contentAfter  = panel.querySelector('.pp-content--after')

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        const state = btn.dataset.state
        if (before) before.classList.toggle('active', state === 'before')
        if (after)  after.classList.toggle('active', state === 'after')
        if (contentBefore) contentBefore.classList.toggle('active', state === 'before')
        if (contentAfter)  contentAfter.classList.toggle('active', state === 'after')
      })
    })

  })
})()

// ── Dot matrix — fleet scale comparison ──────────────
;(function initDotMatrix() {
  const UNIT = 10
  const CARS_TOTAL = 49_648
  const FLEET_MODES = [
    { label: 'E-Bike',       count: 641, color: '#27AE60' },
    { label: 'Auto Shuttle', count:  55, color: '#8E44AD' },
    { label: 'Auto Bus',     count:  33, color: '#2C3E50' },
    { label: 'Auto Pod',     count: 369, color: '#2980B9' },
    { label: 'Car-Share EV', count: 175, color: '#E67E22' },
  ]
  const FLEET_TOTAL = FLEET_MODES.reduce((s, m) => s + m.count, 0)

  let acc = 0
  const thresholds = FLEET_MODES.map(m => (acc += Math.ceil(m.count / UNIT), acc))

  // Legend is always visible — build it immediately
  const legend = document.getElementById('dm-legend')
  if (legend) {
    FLEET_MODES.forEach(({ label, color }) => {
      const el = document.createElement('div')
      el.className = 'dm-legend-item'
      el.innerHTML = `<div class="dm-legend-dot" style="background:${color}"></div>${label}`
      legend.appendChild(el)
    })
  }

  // Dots are NOT in the DOM yet — inserted only when section arrives
  let animated = false

  function insertAndAnimate() {
    if (animated) return
    animated = true

    const carsWrap  = document.getElementById('dm-cars')
    const fleetWrap = document.getElementById('dm-fleet')
    if (!carsWrap || !fleetWrap) return

    // Build car dots
    const carDots = []
    const carFrag = document.createDocumentFragment()
    for (let i = 0, n = Math.ceil(CARS_TOTAL / UNIT); i < n; i++) {
      const d = document.createElement('div')
      d.className = 'dm-dot'
      d.style.background = '#E63946'
      carFrag.appendChild(d)
      carDots.push(d)
    }
    carsWrap.appendChild(carFrag)

    // Build fleet dots
    const fleetDots = []
    const fleetFrag = document.createDocumentFragment()
    for (let i = 0, n = Math.ceil(FLEET_TOTAL / UNIT); i < n; i++) {
      const d = document.createElement('div')
      d.className = 'dm-dot'
      let color = '#ccc'
      for (let mi = 0; mi < thresholds.length; mi++)
        if (i < thresholds[mi]) { color = FLEET_MODES[mi].color; break }
      d.style.background = color
      fleetFrag.appendChild(d)
      fleetDots.push(d)
    }
    fleetWrap.appendChild(fleetFrag)

    // Force reflow so CSS transitions fire from opacity:0
    carsWrap.getBoundingClientRect()

    // Phase 1 — car dots sweep in left-to-right
    const BATCH = 80
    let i = 0
    function revealCars() {
      const end = Math.min(i + BATCH, carDots.length)
      for (; i < end; i++) carDots[i].classList.add('dm-dot--on')
      if (i < carDots.length) setTimeout(revealCars, 16)
      else setTimeout(revealFleet, 300)
    }

    // Phase 2 — fleet dots pop in one by one
    let j = 0
    function revealFleet() {
      if (j < fleetDots.length) {
        fleetDots[j++].classList.add('dm-dot--on')
        setTimeout(revealFleet, 12)
      }
    }

    revealCars()
  }

  // Trigger only when the section header is well into view
  const trigger = document.querySelector('.dot-matrix')
  if (trigger) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { insertAndAnimate(); obs.disconnect() }
    }, { threshold: 0, rootMargin: '0px 0px -40% 0px' })
    obs.observe(trigger)
  }
})()

// ── Before / After — auto crossfade + auto-cycle ─────
const baPairs = [
  { before: 'charts/ba_v1_before.png', after: 'charts/ba_v1_after.png' },
  { before: 'charts/ba_v2_before.png', after: 'charts/ba_v2_after.png' },
  { before: 'charts/ba_v3_before.png', after: 'charts/ba_v3_after.png' },
  { before: 'charts/ba_v4_before.png', after: 'charts/ba_v4_after.png' },
  { before: 'charts/ba_v5_before.png', after: 'charts/ba_v5_after.png' },
];

const baFade      = document.getElementById('ba-fade');
const baImgBefore = document.getElementById('ba-img-before');
const baImgAfter  = document.getElementById('ba-img-after');
const baTabs      = document.querySelectorAll('.ba-tab');

if (baFade && baImgBefore && baImgAfter) {
  let baCurrent  = 0;
  let baTimer    = null;
  const BA_MS       = 10000; // per-street hold (animation is 7s + ~3s hold on "after")
  const BA_FADE_MS  = 750;   // must match CSS transition on .ba-fade

  function baResetAnims() {
    [baImgBefore, ...baFade.querySelectorAll('.ba-tag')].forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight; // force reflow so animation restarts cleanly
      el.style.animation = '';
    });
  }

  function baSwitchTo(idx) {
    // fade the whole container out
    baFade.style.opacity = '0';

    setTimeout(() => {
      baCurrent = idx;
      const pair = baPairs[idx];
      baImgBefore.src = pair.before;
      baImgAfter.src  = pair.after;
      baTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
      baResetAnims();
      // fade back in
      baFade.style.opacity = '1';
    }, BA_FADE_MS);
  }

  function baAdvance() {
    baSwitchTo((baCurrent + 1) % baPairs.length);
  }

  function baStartLoop() {
    clearInterval(baTimer);
    baTimer = setInterval(baAdvance, BA_MS);
  }

  baTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      baSwitchTo(i);
      baStartLoop();
    });
  });

  baStartLoop();
}

// ── City-centre KPI count-up ──────────────────────────
;(function initCCCountUp() {
  const nums = document.querySelectorAll('.cc-kpi-num[data-target]');
  if (!nums.length) return;

  let fired = false;

  function countUp(el, delay) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 900;
    setTimeout(() => {
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target).toLocaleString('de-DE');
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);
  }

  const obs = new IntersectionObserver(entries => {
    if (fired || !entries[0].isIntersecting) return;
    fired = true;
    nums.forEach((el, i) => countUp(el, i * 130 + 60));
    obs.disconnect();
  }, { threshold: 0.3 });

  const container = document.querySelector('.cc-stats');
  if (container) obs.observe(container);
})();

// ── Scene slideshows — auto-cycle between frames ──────
;(function initSlideshows() {
  document.querySelectorAll('.scene-slideshow').forEach(ss => {
    const slides = ss.querySelectorAll('.scene-slide');
    if (slides.length < 2) return;
    let current = 0;

    // Only start cycling when the slideshow enters view
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 2800);
    }, { threshold: 0.3 });

    obs.observe(ss);
  });
})()

