/* ─────────────────────────────────────────────────────────────
   deck.js — <stadt.hub> exhibition deck engine.

   Vertical fullpage deck (one slide / 100vh; one wheel/key/swipe =
   one page, eased + snapped). Auto-plays on load and loops; the
   Present button toggles the auto-run and RESUMES FROM THE CURRENT
   slide. Any input hands control to the visitor (Discover); 15 s
   idle resumes Presenting from the same slide, 30 s restarts from the
   top on the hub slide.

   All prose is typed live. Interactive embeds (the maps + the hub
   viewer) are CLICK-TO-ACTIVATE: until clicked they ignore scroll so
   the wheel drives the page; the hub's render loop is paused unless
   its slide is on screen (smooth video + transitions).
─────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var IDLE_RESUME_MS = 15000;
  var HUB_RESTART_MS = 30000;
  var PAGE_MS = 900;
  var WHEEL_COOLDOWN = 950;
  var SWIPE_MIN = 45;
  var BODY_SPEED = 0.42;

  var MODE = "present";
  var idx = 0, gen = 0;
  var lastInput = performance.now();
  var ambients = [];
  var hubCycleResolve = null;
  var brainCycleResolve = null;
  var wheelLock = false;

  function now() { return performance.now(); }
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function pad(n) { return ("0" + n).slice(-2); }

  var track = document.getElementById("track");
  var mapFrame = document.getElementById("map-embed");
  var hubFrame = document.getElementById("hub-frame");
  var hubHolder = document.getElementById("hub-holder");
  var hubVeil = document.getElementById("hub-veil");
  var hubTitle = document.getElementById("hub-title");
  var brainFrame = document.getElementById("brain-frame");
  var brainHolder = document.getElementById("brain-holder");
  var brainVeil = document.getElementById("brain-veil");
  var brainTitle = document.getElementById("brain-title");
  var gallery = document.getElementById("gallery");
  var gActivate = document.getElementById("g-activate");
  var presentBtn = document.getElementById("present-btn");
  var pbLabel = document.getElementById("pb-label");
  var counter = document.getElementById("counter");

  function makeCtx(g) { return { get cancelled() { return g !== gen || MODE !== "present"; } }; }
  function sleep(ms, ctx) {
    return new Promise(function (res) {
      var t0 = now();
      (function tick() {
        if (ctx && ctx.cancelled) return res();
        if (now() - t0 >= ms) return res();
        setTimeout(tick, 60);
      })();
    });
  }
  function ambient(fn, ms) { var id = setInterval(fn, ms); ambients.push(id); return id; }
  function clearAmbients() { ambients.forEach(clearInterval); ambients = []; }
  function reveals(sel, on) { $all(sel + " .reveal").forEach(function (el) { el.classList.toggle("on", on); }); }
  async function revealSeq(sel, ctx, step) {
    var els = $all(sel + " .reveal").sort(function (a, b) { return (+a.dataset.r || 0) - (+b.dataset.r || 0); });
    for (var i = 0; i < els.length; i++) { if (ctx.cancelled) { els[i].classList.add("on"); continue; } els[i].classList.add("on"); await sleep(step || 650, ctx); }
  }
  function bodySpec(text, emph) { return { ops: [{ t: text }], emphasize: emph || [], speed: BODY_SPEED }; }

  /* ── headlines + body copy ─────────────────────────────── */
  var HL = {
    s1: { ops: [{ t: "A city that " }, { pause: 260 }, { typo: { wrong: "stoped", fix: "stopped" } }, { t: " parking." }],
          emphasize: [{ phrase: "stopped parking", kind: "bold" }] },
    s1sub: bodySpec("Built around the car, reimagined around mobility hubs — and the public life that parking took away.",
          [{ phrase: "mobility hubs", kind: "bold" }]),
    s2: { ops: [{ t: "Built to " }, { typo: { wrong: "buidl", fix: "build" } }, { t: " cars." }],
          emphasize: [{ phrase: "build", kind: "underline" }] },
    s4: { ops: [{ t: "Step " }, { typo: { wrong: "insdie", fix: "inside" } }, { t: " one hub." }],
          emphasize: [{ phrase: "inside", kind: "underline" }] },
    s5: { ops: [{ t: "Every idea, " }, { typo: { wrong: "conected", fix: "connected" } }, { t: "." }],
          emphasize: [{ phrase: "connected", kind: "underline" }] }
  };

  /* ── template-3 analyses (deployment-exact wording) ────── */
  var A = [
    { index: "01", chip: "01 · Transport", kicker: "01 — Transport Analysis · OpenStreetMap",
      title: "Mobility Infrastructure",
      desc: "Every road, bus line and cycle path in Wolfsburg, straight from OpenStreetMap. Switch tabs to read the network by mode — activity, car, public transport, cycling.",
      source: "OpenStreetMap", method: "Infrastructure extract" },
    { index: "02", chip: "02 · Livability", kicker: "02 — Livability Analysis · OSM + Open Data",
      title: "Livability & Facilities",
      desc: "Schools, shops, culture and care scored against land use and daily activity. Everyday life clusters in a few districts; the rest depend on a car to reach it.",
      source: "OSM + Open Data", method: "Facility density" },
    { index: "03", chip: "03 · Centrality", kicker: "03 — Accessibility · Network Analysis",
      title: "Centralities",
      desc: "A 15-minute reach score for every point in the city — walking, cycling, transit or all modes. Green is well-connected, red is isolated; access collapses outside the core.",
      source: "Network analysis", method: "Isochrone / centrality" }
  ];
  function t3Spec(a) { return { ops: [{ t: a.title }], emphasize: [] }; }

  /* ══════════════════════════════════════════════════════
     SLIDE 1 — hero video
  ══════════════════════════════════════════════════════ */
  (function heroVideos() {
    var a = document.getElementById("hero-a"), b = document.getElementById("hero-b");
    if (!a || !b) return;
    function swap(from, to) { to.currentTime = 0; var p = to.play(); if (p && p.catch) p.catch(function () {}); to.classList.add("active"); from.classList.remove("active"); }
    a.addEventListener("ended", function () { swap(a, b); });
    b.addEventListener("ended", function () { swap(b, a); });
    var p = a.play(); if (p && p.catch) p.catch(function () {});
  })();

  /* ══════════════════════════════════════════════════════
     SLIDE 2 — per-image history frames (each image its own text)
  ══════════════════════════════════════════════════════ */
  var FRAME_CONTENT = [
    [ { year: "1938", label: "Fallersleben", desc: "Founded beside Fallersleben castle to house the new people's-car factory." },
      { year: "1938", label: "From the fields", desc: "Laid out from scratch on open farmland — a city planned around a plant." } ],
    [ { year: "1950s", label: "The line", desc: "The Beetle leaves the line by the million; the town grows with the works." },
      { year: "1950s", label: "Shift change", desc: "Daily life times itself to the factory gate and the drive home." } ],
    [ { year: "Today", label: "Parking fields", desc: "Surface lots and multi-storey garages hold the city's stationary cars." },
      { year: "Today", label: "Wide roads", desc: "Oversized junctions and carriageways cut the neighbourhoods apart." },
      { year: "Today", label: "The commute", desc: "Rush hour still means one person, one car, one queue." } ]
  ];
  var frameCtrls = [];
  (function buildFrames() {
    $all("#s2 [data-frame]").forEach(function (frame, fi) {
      var imgs = Array.prototype.slice.call(frame.querySelectorAll(".frame-imgs img"));
      var content = FRAME_CONTENT[fi] || [];
      var dotsHost = frame.querySelector(".fr-dots");
      var yrEl = frame.querySelector(".yr"), lblEl = frame.querySelector(".lbl");
      var descEl = frame.querySelector(".cap-desc .tw");
      imgs.forEach(function (_, k) { var d = document.createElement("b"); if (k === 0) d.classList.add("on"); dotsHost.appendChild(d); });
      var dots = Array.prototype.slice.call(dotsHost.querySelectorAll("b"));
      var cur = 0;
      function show(k, typeIt) {
        k = ((k % imgs.length) + imgs.length) % imgs.length;
        imgs[cur].classList.remove("active"); dots[cur] && dots[cur].classList.remove("on");
        cur = k;
        imgs[cur].classList.add("active"); dots[cur] && dots[cur].classList.add("on");
        var c = content[cur] || {};
        if (yrEl) yrEl.textContent = c.year || "";
        if (lblEl) lblEl.textContent = c.label || "";
        if (descEl) { if (typeIt === false) TW.finalize(descEl, bodySpec(c.desc || "")); else TW.run(descEl, bodySpec(c.desc || ""), null); }
      }
      frame.querySelector(".fr-arrow.prev").addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(cur - 1, true); });
      frame.querySelector(".fr-arrow.next").addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(cur + 1, true); });
      dots.forEach(function (b, k) { b.addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(k, true); }); });
      frameCtrls.push({
        auto: function (ms) { ambient(function () { show(cur + 1, true); }, ms); },
        reset: function () { cur = 0; show(0, false); },
        finalizeFirst: function () { show(0, false); }
      });
    });
  })();
  function framesAuto() { frameCtrls.forEach(function (c, i) { c.auto(4200 + i * 600); }); }
  function framesReset() { frameCtrls.forEach(function (c) { c.reset(); }); }

  /* ══════════════════════════════════════════════════════
     SLIDE 3 — analysis gallery over the embedded real maps
  ══════════════════════════════════════════════════════ */
  var gPos = 0;
  var gChip = document.getElementById("g-chip");
  var gDots = document.getElementById("g-dots");
  var t3kicker = document.getElementById("t3-kicker");
  var t3index = document.getElementById("t3-index");
  var t3src = document.getElementById("t3-src");
  var t3method = document.getElementById("t3-method");

  (function buildGDots() {
    A.forEach(function (_, i) { var b = document.createElement("b"); if (i === 0) b.classList.add("on"); gDots.appendChild(b); });
    $all("#g-dots b").forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); onInput(); mapGo(i); }); });
  })();

  function mapPost(i) { try { mapFrame.contentWindow.postMessage({ type: "deck-set-section", index: i }, "*"); } catch (e) {} }
  mapFrame && mapFrame.addEventListener("load", function () { mapPost(gPos); });

  function galleryHeader(i) {
    var a = A[i];
    t3kicker.textContent = a.kicker; t3index.textContent = a.index;
    gChip.textContent = a.chip; t3src.textContent = a.source; t3method.textContent = a.method;
    $all("#g-dots b").forEach(function (b, k) { b.classList.toggle("on", k === i); });
  }
  async function galleryText(i, typeIt, ctx) {
    var a = A[i]; galleryHeader(i);
    if (typeIt && ctx) {
      await TW.run($("#tw-3"), t3Spec(a), ctx);
      await TW.run($("#tw-3desc"), bodySpec(a.desc), ctx);
    } else {
      TW.finalize($("#tw-3"), t3Spec(a)); TW.finalize($("#tw-3desc"), bodySpec(a.desc));
    }
  }
  function mapGo(i) { i = ((i % A.length) + A.length) % A.length; gPos = i; mapPost(i); galleryText(i, false); }

  /* map click-to-activate */
  function armMap() { gallery.classList.remove("activated"); }
  function activateMap() { gallery.classList.add("activated"); onInput(); }
  gActivate.addEventListener("click", activateMap);

  /* ══════════════════════════════════════════════════════
     SLIDE 4 — hub viewer bridge + click-to-activate
  ══════════════════════════════════════════════════════ */
  function hubSend(type) { try { hubFrame.contentWindow.postMessage({ type: type }, "*"); } catch (e) {} }
  function armHub() { hubHolder.classList.remove("activated"); hubVeil.classList.remove("blur"); hubVeil.classList.add("show"); }
  function hubCTA() { hubHolder.classList.remove("activated"); hubVeil.classList.add("show", "blur"); }
  function hubClear() { hubHolder.classList.remove("activated"); hubVeil.classList.remove("show", "blur"); }
  function activateHub() { hubHolder.classList.add("activated"); hubVeil.classList.remove("show", "blur"); hubSend("hub-kiosk-stop"); onInput(); }
  hubVeil.addEventListener("click", activateHub);

  /* ══════════════════════════════════════════════════════
     SLIDE 5 — project brain bridge + click-to-activate
     (mirrors the hub helpers with brain-* message types)
  ══════════════════════════════════════════════════════ */
  function brainSend(type) { try { brainFrame.contentWindow.postMessage({ type: type }, "*"); } catch (e) {} }
  function armBrain() { brainHolder.classList.remove("activated"); brainVeil.classList.remove("blur"); brainVeil.classList.add("show"); }
  function brainCTA() { brainHolder.classList.remove("activated"); brainVeil.classList.add("show", "blur"); }
  function brainClear() { brainHolder.classList.remove("activated"); brainVeil.classList.remove("show", "blur"); }
  function activateBrain() { brainHolder.classList.add("activated"); brainVeil.classList.remove("show", "blur"); brainSend("brain-kiosk-stop"); onInput(); }
  brainVeil.addEventListener("click", activateBrain);

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "embed-interaction" || d.type === "hub-interaction") onInput();
    else if (d.type === "hub-cycle-complete") { if (hubCycleResolve) { hubCycleResolve(); hubCycleResolve = null; } }
    else if (d.type === "brain-cycle-complete") { if (brainCycleResolve) { brainCycleResolve(); brainCycleResolve = null; } }
  });

  /* ══════════════════════════════════════════════════════
     THE SLIDES
  ══════════════════════════════════════════════════════ */
  var SLIDES = [
    { el: $("#s1"), dark: true,
      play: async function (ctx) {
        $("#s1-kicker").classList.add("on");
        await sleep(700, ctx);
        await TW.run($("#tw-1"), HL.s1, ctx);
        await sleep(280, ctx);
        await TW.run($("#tw-1sub"), HL.s1sub, ctx);
        await sleep(3600, ctx);
      },
      complete: function () { $("#s1-kicker").classList.add("on"); TW.finalize($("#tw-1"), HL.s1); TW.finalize($("#tw-1sub"), HL.s1sub); },
      reset: function () { $("#s1-kicker").classList.remove("on"); TW.reset($("#tw-1")); TW.reset($("#tw-1sub")); }
    },
    { el: $("#s2"), dark: false,
      play: async function (ctx) {
        await TW.run($("#tw-2"), HL.s2, ctx);
        await revealSeq("#s2", ctx, 460);
        for (var i = 0; i < frameCtrls.length; i++) { if (ctx.cancelled) break; frameCtrls[i].finalizeFirst(); await sleep(120, ctx); }
        framesAuto();
        await sleep(5200, ctx);
      },
      complete: function () { TW.finalize($("#tw-2"), HL.s2); reveals("#s2", true); framesReset(); framesAuto(); },
      reset: function () { TW.reset($("#tw-2")); reveals("#s2", false); framesReset(); }
    },
    { el: $("#s3"), dark: false,
      play: async function (ctx) {
        armMap();
        for (var i = 0; i < A.length; i++) {
          if (ctx.cancelled) break;
          gPos = i; mapPost(i);
          await galleryText(i, true, ctx);
          await sleep(6400, ctx);
        }
      },
      complete: function () { mapPost(gPos); galleryText(gPos, false); armMap(); },
      reset: function () { }
    },
    { el: $("#s4"), dark: true,
      play: async function (ctx) {
        hubClear(); hubTitle.classList.remove("faded");
        await sleep(400, ctx);
        await TW.run($("#tw-4"), HL.s4, ctx);
        await sleep(1100, ctx);
        hubTitle.classList.add("faded");
        hubSend("hub-kiosk-start");
        await new Promise(function (res) {
          hubCycleResolve = res;
          var t0 = now();
          (function guard() {
            if (!hubCycleResolve) return;
            if (ctx.cancelled || now() - t0 > 120000) { hubCycleResolve = null; res(); return; }
            setTimeout(guard, 400);
          })();
        });
        if (ctx.cancelled) return;
        hubCTA();
        await sleep(HUB_RESTART_MS, ctx);
      },
      complete: function () { TW.finalize($("#tw-4"), HL.s4); hubTitle.classList.add("faded"); armHub(); },
      reset: function () { TW.reset($("#tw-4")); hubTitle.classList.remove("faded"); hubClear(); }
    },
    { el: $("#s5"), dark: true,
      play: async function (ctx) {
        brainClear(); brainTitle.classList.remove("faded");
        await sleep(400, ctx);
        await TW.run($("#tw-5"), HL.s5, ctx);
        await sleep(1100, ctx);
        brainTitle.classList.add("faded");
        brainSend("brain-kiosk-start");
        await new Promise(function (res) {
          brainCycleResolve = res;
          var t0 = now();
          (function guard() {
            if (!brainCycleResolve) return;
            if (ctx.cancelled || now() - t0 > 120000) { brainCycleResolve = null; res(); return; }
            setTimeout(guard, 400);
          })();
        });
        if (ctx.cancelled) return;
        brainCTA();
        await sleep(HUB_RESTART_MS, ctx);
      },
      complete: function () { TW.finalize($("#tw-5"), HL.s5); brainTitle.classList.add("faded"); armBrain(); },
      reset: function () { TW.reset($("#tw-5")); brainTitle.classList.remove("faded"); brainClear(); }
    }
  ];
  var N = SLIDES.length;

  /* ══════════════════════════════════════════════════════
     CHROME + TRACK
  ══════════════════════════════════════════════════════ */
  var dotsHost = document.getElementById("dots");
  SLIDES.forEach(function (_, i) {
    var b = document.createElement("b"); if (i === 0) b.classList.add("on");
    b.addEventListener("click", function () { onInput(); goManual(i); });
    dotsHost.appendChild(b);
  });

  function setModeUI(present) {
    MODE = present ? "present" : "discover";
    presentBtn.classList.toggle("is-present", present);
    presentBtn.classList.toggle("is-discover", !present);
    pbLabel.textContent = present ? "Presenting" : "Present";
    document.body.classList.toggle("discover", !present);
  }
  function setTrack(i) { track.style.setProperty("--i", i); }
  function updateChrome(i) {
    counter.textContent = pad(i + 1) + " / " + pad(N);
    $all("#dots b").forEach(function (b, k) { b.classList.toggle("on", k === i); });
    document.body.classList.toggle("on-dark", !!SLIDES[i].dark);
  }
  function place(i) {
    idx = i; setTrack(i); updateChrome(i);
    if (i === 3) { hubSend("hub-resume"); }
    else { hubSend("hub-pause"); hubClear(); }        // pause off-screen GPU loop
    if (i === 4) { brainSend("brain-resume"); }
    else { brainSend("brain-pause"); brainClear(); }  // pause off-screen brain rAF
    if (i === 2) armMap(); else gallery.classList.remove("activated");
  }

  /* ══════════════════════════════════════════════════════
     PRESENT LOOP
  ══════════════════════════════════════════════════════ */
  async function present(startIdx) {
    var g = ++gen; var ctx = makeCtx(g);
    for (var i = startIdx; i < N; i++) {
      if (ctx.cancelled) return;
      clearAmbients();
      place(i);
      SLIDES[i].reset();
      await sleep(i === startIdx ? 350 : PAGE_MS, ctx);
      if (ctx.cancelled) return;
      await SLIDES[i].play(ctx);
      if (ctx.cancelled) return;
    }
    if (ctx.cancelled) return;
    loopRestart();
  }
  function loopRestart() {
    gen++;
    hubSend("hub-kiosk-stop"); hubClear();
    brainSend("brain-kiosk-stop"); brainClear();
    clearAmbients();
    SLIDES.forEach(function (s) { s.reset(); });
    framesReset();
    setModeUI(true);
    place(0);
    present(0);
  }

  /* ══════════════════════════════════════════════════════
     DISCOVER + NAV
  ══════════════════════════════════════════════════════ */
  function completeCurrent() { clearAmbients(); SLIDES[idx].reset(); SLIDES[idx].complete(); }
  function onInput() {
    lastInput = now();
    if (MODE === "present") { MODE = "discover"; gen++; setModeUI(false); completeCurrent(); }
  }
  function goManual(n) {
    if (n < 0 || n >= N || n === idx || wheelLock) return;
    wheelLock = true; setTimeout(function () { wheelLock = false; }, WHEEL_COOLDOWN);
    place(n);
    clearAmbients(); SLIDES[n].reset(); SLIDES[n].complete();
  }
  function navGesture(dir) {
    var target = idx + dir;
    if (target < 0 || target >= N) return;
    onInput();
    goManual(target);
  }

  window.addEventListener("wheel", function (e) {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 8) return;
    navGesture(e.deltaY > 0 ? 1 : -1);
  }, { passive: true });
  window.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); navGesture(1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); navGesture(-1); }
    else { onInput(); }
  });
  window.addEventListener("pointerdown", function () { onInput(); }, { passive: true });
  var touchY = null;
  window.addEventListener("touchstart", function (e) { touchY = e.touches[0].clientY; onInput(); }, { passive: true });
  window.addEventListener("touchend", function (e) {
    if (touchY === null) return;
    var dy = touchY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
    if (Math.abs(dy) > SWIPE_MIN) goManual(idx + (dy > 0 ? 1 : -1));
    touchY = null;
  }, { passive: true });

  document.getElementById("deck-next").addEventListener("click", function () { onInput(); goManual(idx + 1); });
  document.getElementById("deck-prev").addEventListener("click", function () { onInput(); goManual(idx - 1); });
  document.getElementById("g-next").addEventListener("click", function (e) { e.stopPropagation(); onInput(); mapGo(gPos + 1); });
  document.getElementById("g-prev").addEventListener("click", function (e) { e.stopPropagation(); onInput(); mapGo(gPos - 1); });

  presentBtn.addEventListener("click", function () {
    if (MODE === "present") { MODE = "discover"; gen++; setModeUI(false); completeCurrent(); }
    else { setModeUI(true); present(idx); }          // resume from CURRENT slide
  });

  setInterval(function () {
    if (MODE !== "discover") return;
    var limit = (idx === 3) ? HUB_RESTART_MS : IDLE_RESUME_MS;
    if (now() - lastInput < limit) return;
    if (idx === 3) loopRestart();
    else { setModeUI(true); present(idx); }
  }, 1000);

  /* ══════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════ */
  function boot() {
    place(0); setModeUI(true);
    var b = document.getElementById("boot");
    setTimeout(function () { b.classList.add("gone"); }, 650);
    setTimeout(function () { present(0); }, 950);
  }
  boot();
})();
