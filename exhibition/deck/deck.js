/* ─────────────────────────────────────────────────────────────
   deck.js — <stadt.hub> exhibition engine.

   Vertical fullpage deck (one slide / 100vh; one wheel/key/swipe =
   one page, eased + snapped). Auto-plays on load and loops; the
   Present button toggles the auto-run and RESUMES FROM THE CURRENT
   slide. Any input hands control to the visitor (Discover); idle
   resumes Presenting from the same slide; on the live tool slides a
   longer idle restarts the whole loop fresh.

   All prose is typed live. Interactive embeds (the maps, the hub
   viewer, the brain graph) are CLICK-TO-ACTIVATE: until clicked they
   ignore scroll so the wheel drives the page; their render loops are
   paused unless their slide is on screen (smooth video + transitions).

   Slides carry a `kind` ('map' | 'hub' | 'brain') so the engine finds
   the interactive ones by role, not by a hardcoded index.
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
  function shuffle(arr) {
    arr = arr.slice();
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
  async function revealShuffled(sel, ctx, step) {
    var els = shuffle($all(sel + " .reveal"));
    for (var i = 0; i < els.length; i++) { if (ctx.cancelled) { els[i].classList.add("on"); continue; } els[i].classList.add("on"); await sleep(step || 100, ctx); }
  }
  function bodySpec(text, emph) { return { ops: [{ t: text }], emphasize: emph || [], speed: BODY_SPEED }; }

  /* ── counter animation (outcome numbers) ───────────────── */
  function fmtNum(n) { return n.toLocaleString("en-US"); }
  function animateCount(el, ctx) {
    var target = +el.dataset.count, dur = 1150, t0 = now();
    (function tick() {
      if (ctx && ctx.cancelled) { el.textContent = fmtNum(target); return; }
      var p = Math.min(1, (now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtNum(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmtNum(target);
    })();
  }
  function countAll(sel, ctx) { $all(sel + " [data-count]").forEach(function (el) { animateCount(el, ctx); }); }
  function countInstant(sel) { $all(sel + " [data-count]").forEach(function (el) { el.textContent = fmtNum(+el.dataset.count); }); }
  function countReset(sel) { $all(sel + " [data-count]").forEach(function (el) { el.textContent = "0"; }); }

  /* ── headlines + body copy ─────────────────────────────── */
  var HL = {
    s1: { ops: [{ t: "A city that " }, { pause: 260 }, { typo: { wrong: "stoped", fix: "stopped" } }, { t: " parking." }],
          emphasize: [{ phrase: "stopped parking", kind: "bold" }] },
    s1sub: bodySpec("Built around the car, reimagined around mobility hubs, and the public life that parking took away.",
          [{ phrase: "mobility hubs", kind: "bold" }]),
    s4: { ops: [{ t: "Step " }, { typo: { wrong: "insdie", fix: "inside" } }, { t: " one hub." }],
          emphasize: [{ phrase: "inside", kind: "underline" }] },
    s5: { ops: [{ t: "Every idea, " }, { typo: { wrong: "conected", fix: "connected" } }, { t: "." }],
          emphasize: [{ phrase: "connected", kind: "underline" }] },
    s6title: { ops: [{ t: "Built for Yesterday, Ready for Tomorrow" }], emphasize: [] }
  };
  var HL9 = { ops: [{ t: "Fewer cars is the mechanism. " }, { pause: 380 }, { t: "Space is the goal." }],
              emphasize: [{ phrase: "Space", kind: "underline" }] };

  /* typed body lines for the new pages */
  var TXT = {
    tw7:  bodySpec("Future of mobility as a service."),
    tw10: { ops: [{ t: "<stadt.hub> replaces what the car was hiding, " }, { pause: 320 }, { t: "space, access, a city for people first." }],
            emphasize: [{ phrase: "space, access", kind: "bold" }], speed: BODY_SPEED },
    tw11: bodySpec("Replace the private car without breaking the city."),
    tw14: { ops: [{ t: "A hub is " }, { typo: { wrong: "nto", fix: "not" } }, { t: " a bus shelter." }],
            emphasize: [{ phrase: "not", kind: "underline" }] },
    tw18: bodySpec("68 hubs (6 large, 19 medium, 43 small), so every door sits a short walk from one."),
    tw19: bodySpec("Five zones, filtered permeability. Cars pulled to the edge; Porschestraße handed back to people."),
    tw20: bodySpec("The centre goes largely car-free, not by banning mobility, but by replacing the private car."),
    tw21: bodySpec("The L → M → S hierarchy drawn onto the city: bus between anchors, pod into districts, e-bike to the door.")
  };

  /* ── template-3 analyses (deployment-exact wording) ────── */
  var A = [
    { index: "01", chip: "01 · Transport",
      title: "Mobility Infrastructure",
      desc: "Every road, bus line and cycle path in Wolfsburg, straight from OpenStreetMap. Switch tabs to read the network by mode: activity, car, public transport, cycling.",
      source: "OpenStreetMap", method: "Infrastructure extract" },
    { index: "02", chip: "02 · Livability",
      title: "Livability & Facilities",
      desc: "Schools, shops, culture and care scored against land use and daily activity. Everyday life clusters in a few districts; the rest depend on a car to reach it.",
      source: "OSM + Open Data", method: "Facility density" },
    { index: "03", chip: "03 · Centrality",
      title: "Centralities",
      desc: "A 15-minute reach score for every point in the city, by walking, cycling, transit or all modes. Green is well-connected, red is isolated; access collapses outside the core.",
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
  var frameCtrls = [];
  (function buildFrames() {
    $all("#s2 [data-frame]").forEach(function (frame) {
      var imgs = Array.prototype.slice.call(frame.querySelectorAll(".frame-imgs img"));
      var dotsHost = frame.querySelector(".fr-dots");
      imgs.forEach(function (_, k) { var d = document.createElement("b"); if (k === 0) d.classList.add("on"); dotsHost.appendChild(d); });
      var dots = Array.prototype.slice.call(dotsHost.querySelectorAll("b"));
      var cur = 0;
      function show(k) {
        if (!imgs.length) return;
        k = ((k % imgs.length) + imgs.length) % imgs.length;
        imgs[cur].classList.remove("active"); dots[cur] && dots[cur].classList.remove("on");
        cur = k;
        imgs[cur].classList.add("active"); dots[cur] && dots[cur].classList.add("on");
      }
      frame.querySelector(".fr-arrow.prev").addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(cur - 1); });
      frame.querySelector(".fr-arrow.next").addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(cur + 1); });
      dots.forEach(function (b, k) { b.addEventListener("click", function (e) { e.stopPropagation(); onInput(); show(k); }); });
      frameCtrls.push({
        auto: function (ms) { ambient(function () { show(cur + 1); }, ms); },
        reset: function () { cur = 0; show(0); },
        finalizeFirst: function () { show(0); }
      });
    });
  })();
  /* history galleries auto-loop, ~1.5 s per image (slight offset so they don't flip in sync) */
  function framesAuto() { frameCtrls.forEach(function (c, i) { c.auto(1500 + i * 180); }); }
  function framesReset() { frameCtrls.forEach(function (c) { c.reset(); }); }

  /* ══════════════════════════════════════════════════════
     URBAN STRUCTURE — analysis gallery over the embedded maps
  ══════════════════════════════════════════════════════ */
  var gPos = 0;
  var gChip = document.getElementById("g-chip");
  var gDots = document.getElementById("g-dots");
  var t3index = document.getElementById("t3-index");

  (function buildGDots() {
    A.forEach(function (_, i) { var b = document.createElement("b"); if (i === 0) b.classList.add("on"); gDots.appendChild(b); });
    $all("#g-dots b").forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); onInput(); mapGo(i); }); });
  })();

  function mapPost(i) { try { mapFrame.contentWindow.postMessage({ type: "deck-set-section", index: i }, "*"); } catch (e) {} }
  mapFrame && mapFrame.addEventListener("load", function () { mapPost(gPos); });

  function galleryHeader(i) {
    var a = A[i];
    t3index.textContent = a.index;
    gChip.textContent = a.chip;
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
     PROBLEMS — switching word column (3.1)
  ══════════════════════════════════════════════════════ */
  var PROBLEM_COUNT = $all("#s5 .tprob-word").length;
  var problemCur = 0;
  function problemsSet(i) {
    problemCur = i;
    $all("#s5 .tprob-word").forEach(function (el) { el.classList.toggle("active", +el.dataset.i === i); });
    $all("#s5 .tprob-list").forEach(function (el) { el.classList.toggle("active", +el.dataset.i === i); });
  }
  function problemsAuto() {
    ambient(function () { problemsSet((problemCur + 1) % PROBLEM_COUNT); }, 2000);
  }
  $all("#s5 .tprob-word").forEach(function (el) {
    el.addEventListener("click", function () { onInput(); problemsSet(+el.dataset.i); });
  });

  /* ══════════════════════════════════════════════════════
     HUB PLACEMENT — live map, real tool component (5.4)
  ══════════════════════════════════════════════════════ */
  var HUBPLACE = [
    { chip: "01 · Hub Network", title: "Hub network",
      desc: "A three-tier shared mobility network enabling seamless mode-chaining across the city: e-bike, autonomous shuttle, and shared pod, all without a private vehicle." },
    { chip: "02 · Network Hubs", title: "Network hubs",
      desc: "By introducing the hub network, the city gains the opportunity to become progressively more connected, beginning with districts closest to the centre and gradually extending mobility coverage to more remote settlements as the network expands." },
    { chip: "03 · Facility Network", title: "Facility network",
      desc: "The facility network analysis shows that proposed hub locations substantially improve non-motorised access to urban amenities across all districts. Areas where current walking and cycling accessibility scores are lowest, chiefly the peripheral residential districts, benefit most from hub-mediated connectivity. Hub placement transforms mobility gaps into connected catchments, enabling residents to reach everyday destinations without a private vehicle." },
    { chip: "04 · External Flows", title: "External flows",
      desc: "Integrating external commuter flows into the hub network is critical for reducing the volume of private vehicles entering the city. By positioning Hub L nodes at the main entry points, the system creates a seamless transition from regional transport to the internal shared mobility network, making it practical for Einpendler to leave their cars outside the city boundary and complete their journey by shared mobility means." }
  ];
  var HP_INDEX = ["01", "02", "03", "04"];
  var hpPos = 0;
  var hpFrame = document.getElementById("hp-map-embed");
  var hpGallery = document.getElementById("hp-gallery");
  var hpActivate = document.getElementById("hp-activate");
  var hp3Index = document.getElementById("hp3-index");
  var hpChip = document.getElementById("hp-chip");
  var hpDots = document.getElementById("hp-dots");
  var hpLegend = document.getElementById("hp-legend");
  (function buildHpDots() {
    if (!hpDots) return;
    HUBPLACE.forEach(function (_, i) { var b = document.createElement("b"); if (i === 0) b.classList.add("on"); hpDots.appendChild(b); });
    $all("#hp-dots b").forEach(function (b, i) { b.addEventListener("click", function (e) { e.stopPropagation(); onInput(); hpText(i, false); }); });
  })();
  var hpPrev = document.getElementById("hp-prev");
  var hpNext = document.getElementById("hp-next");
  hpPrev && hpPrev.addEventListener("click", function (e) { e.stopPropagation(); onInput(); hpText(((hpPos - 1) % HUBPLACE.length + HUBPLACE.length) % HUBPLACE.length, false); });
  hpNext && hpNext.addEventListener("click", function (e) { e.stopPropagation(); onInput(); hpText((hpPos + 1) % HUBPLACE.length, false); });
  function hpPost(i) { try { hpFrame.contentWindow.postMessage({ type: "deck-set-section", index: i }, "*"); } catch (e) {} }
  hpFrame && hpFrame.addEventListener("load", function () { hpPost(hpPos); });
  function hpSpec(h) { return { ops: [{ t: h.title }], emphasize: [] }; }
  function hpShow(i) {
    hpPos = i; hpPost(i);
    if (hp3Index) hp3Index.textContent = HP_INDEX[i];
    if (hpChip) hpChip.textContent = HUBPLACE[i].chip;
    $all("#hp-dots b").forEach(function (b, k) { b.classList.toggle("on", k === i); });
    if (hpLegend) hpLegend.classList.toggle("show", i === 0);
  }
  async function hpText(i, typeIt, ctx) {
    hpShow(i);
    if (typeIt && ctx) {
      await TW.run($("#tw-13h"), hpSpec(HUBPLACE[i]), ctx);
      await TW.run($("#tw-13hdesc"), bodySpec(HUBPLACE[i].desc), ctx);
    } else {
      TW.finalize($("#tw-13h"), hpSpec(HUBPLACE[i])); TW.finalize($("#tw-13hdesc"), bodySpec(HUBPLACE[i].desc));
    }
  }
  /* click-to-activate — until clicked, scroll drives the page, not the map */
  function armHpMap() { hpGallery && hpGallery.classList.remove("activated"); }
  function activateHpMap() { hpGallery && hpGallery.classList.add("activated"); onInput(); }
  hpActivate && hpActivate.addEventListener("click", activateHpMap);

  /* ══════════════════════════════════════════════════════
     FLEET DISTRIBUTION — T3 (5.4): left text cycles Hub L/M/S
     every 3s, right is the real Fleet · Axonometry map (static)
  ══════════════════════════════════════════════════════ */
  var FLEET_TIERS = [
    { index: "01", tier: "Hub L", desc: "Large interchange · multi-level parking garage", total: 347,
      mix: [ { label: "Car-Share EV", color: "#E67E22", total: 175 }, { label: "Auto Bus", color: "#2C3E50", total: 33 },
             { label: "Auto Shuttle", color: "#8E44AD", total: 28 }, { label: "Auto Pod", color: "#2980B9", total: 111 } ] },
    { index: "02", tier: "Hub M", desc: "District hub · underground parking", total: 406,
      mix: [ { label: "Auto Shuttle", color: "#8E44AD", total: 28 }, { label: "Auto Pod", color: "#2980B9", total: 185 },
             { label: "E-Bike", color: "#27AE60", total: 193 } ] },
    { index: "03", tier: "Hub S", desc: "Micro-hub · on-street docking point", total: 523,
      mix: [ { label: "E-Bike", color: "#27AE60", total: 449 }, { label: "Auto Pod", color: "#2980B9", total: 74 } ] }
  ];
  var fleetIndexEl = document.getElementById("fleet-index");
  var fleetMixList = document.getElementById("fleet-mix-list");
  var fleetTotalVal = document.getElementById("fleet-total-val");
  var fleetGallery = document.getElementById("fleet-gallery");
  var fleetActivate = document.getElementById("fleet-activate");
  function armFleetMap() { fleetGallery && fleetGallery.classList.remove("activated"); }
  function activateFleetMap() { fleetGallery && fleetGallery.classList.add("activated"); onInput(); }
  fleetActivate && fleetActivate.addEventListener("click", activateFleetMap);
  function fleetSpec(t) { return { ops: [{ t: t.tier }], emphasize: [] }; }
  function fleetShow(i) {
    var t = FLEET_TIERS[i];
    if (fleetIndexEl) fleetIndexEl.textContent = t.index;
    if (fleetMixList) fleetMixList.innerHTML = t.mix.map(function (m) {
      return '<li><i style="background:' + m.color + '"></i><span>' + m.label + '</span><b>' + m.total + '</b></li>';
    }).join("");
    if (fleetTotalVal) fleetTotalVal.textContent = "≈ " + t.total;
  }
  var fleetCur = 0;
  function fleetAuto() {
    ambient(function () {
      fleetCur = (fleetCur + 1) % FLEET_TIERS.length;
      fleetShow(fleetCur);
      TW.finalize($("#tw-17f"), fleetSpec(FLEET_TIERS[fleetCur]));
      TW.finalize($("#tw-17fdesc"), bodySpec(FLEET_TIERS[fleetCur].desc));
    }, 2000);
  }
  async function fleetText(i, typeIt, ctx) {
    var t = FLEET_TIERS[i]; fleetCur = i; fleetShow(i);
    if (typeIt && ctx) {
      await TW.run($("#tw-17f"), fleetSpec(t), ctx);
      await TW.run($("#tw-17fdesc"), bodySpec(t.desc), ctx);
    } else {
      TW.finalize($("#tw-17f"), fleetSpec(t)); TW.finalize($("#tw-17fdesc"), bodySpec(t.desc));
    }
  }

  /* ══════════════════════════════════════════════════════
     HUB viewer bridge + click-to-activate
  ══════════════════════════════════════════════════════ */
  function hubSend(type) { try { hubFrame.contentWindow.postMessage({ type: type }, "*"); } catch (e) {} }
  function armHub() { hubHolder.classList.remove("activated"); hubVeil.classList.remove("blur"); hubVeil.classList.add("show"); }
  function hubCTA() { hubHolder.classList.remove("activated"); hubVeil.classList.add("show", "blur"); }
  function hubClear() { hubHolder.classList.remove("activated"); hubVeil.classList.remove("show", "blur"); }
  function activateHub() { hubHolder.classList.add("activated"); hubVeil.classList.remove("show", "blur"); hubSend("hub-kiosk-stop"); onInput(); }
  hubVeil.addEventListener("click", activateHub);

  /* ══════════════════════════════════════════════════════
     BRAIN bridge + click-to-activate (mirrors hub, brain-* types)
  ══════════════════════════════════════════════════════ */
  function brainSend(type) { try { brainFrame.contentWindow.postMessage({ type: type }, "*"); } catch (e) {} }
  function armBrain() { brainHolder.classList.remove("activated"); brainVeil.classList.remove("blur"); brainVeil.classList.add("show"); }
  function brainCTA() { brainHolder.classList.remove("activated"); brainVeil.classList.add("show", "blur"); }
  function brainClear() { brainHolder.classList.remove("activated"); brainVeil.classList.remove("show", "blur"); }
  function activateBrain() { brainHolder.classList.add("activated"); brainVeil.classList.remove("show", "blur"); brainSend("brain-kiosk-stop"); onInput(); }
  brainVeil.addEventListener("click", activateBrain);

  /* ══════════════════════════════════════════════════════
     Interactive hub-scene embeds (pages 14–17): click to activate
     (lightweight SVG — no pause needed, just gate scroll capture)
  ══════════════════════════════════════════════════════ */
  var hubScenes = $all(".hubscene-holder");
  hubScenes.forEach(function (h) {
    var ov = h.querySelector(".hs-activate");
    if (ov) ov.addEventListener("click", function () { h.classList.add("activated"); onInput(); });
  });
  function hubScenesReset() { hubScenes.forEach(function (h) { h.classList.remove("activated"); }); }

  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "embed-interaction" || d.type === "hub-interaction") onInput();
    else if (d.type === "hub-cycle-complete") { if (hubCycleResolve) { hubCycleResolve(); hubCycleResolve = null; } }
    else if (d.type === "brain-cycle-complete") { if (brainCycleResolve) { brainCycleResolve(); brainCycleResolve = null; } }
  });

  /* ══════════════════════════════════════════════════════
     generic text slide (type + reveal, optional counters)
  ══════════════════════════════════════════════════════ */
  function txtSlide(id, opts) {
    opts = opts || {};
    var sel = "#" + id;
    return {
      el: $(sel), dark: !!opts.dark, kind: opts.kind || null,
      play: async function (ctx) {
        if (opts.revealFirst) {
          await revealSeq(sel, ctx, opts.step || 380);
          if (opts.tw) { await sleep(140, ctx); await TW.run($("#" + opts.tw.id), opts.tw.spec, ctx); }
        } else {
          if (opts.tw) { await TW.run($("#" + opts.tw.id), opts.tw.spec, ctx); await sleep(180, ctx); }
          await revealSeq(sel, ctx, opts.step || 380);
        }
        if (opts.count) countAll(sel, ctx);
        await sleep(opts.hold || 3200, ctx);
      },
      complete: function () {
        if (opts.tw) TW.finalize($("#" + opts.tw.id), opts.tw.spec);
        reveals(sel, true);
        if (opts.count) countInstant(sel);
      },
      reset: function () {
        if (opts.tw) TW.reset($("#" + opts.tw.id));
        reveals(sel, false);
        if (opts.count) countReset(sel);
      }
    };
  }

  /* wait for an embed's saved-view tour (or takeover / safety cap) */
  function waitCycle(ctx, getResolve, setResolve) {
    return new Promise(function (res) {
      setResolve(res);
      var t0 = now();
      (function guard() {
        if (!getResolve()) return;
        if (ctx.cancelled || now() - t0 > 120000) { setResolve(null); res(); return; }
        setTimeout(guard, 400);
      })();
    });
  }

  /* ══════════════════════════════════════════════════════
     Page 8 — full-bleed dot-matrix (private cars vs shared fleet)
     Values from the deployment (#dot-matrix): 49,648 cars vs 1,300
     fleet, each dot = 10 vehicles. Dots sweep in left → right.
  ══════════════════════════════════════════════════════ */
  var dm = (function () {
    var canvas = document.getElementById("dm-canvas");
    var band = document.getElementById("dotband");
    if (!canvas || !band) return { play: function () {}, complete: function () {}, reset: function () {} };
    var g = canvas.getContext("2d");
    var CARS = 49648, UNIT = 30, INK = "#0E0E0E", CAR_COLOR = "#E63946";
    /* shared fleet coloured by mode (W.A.M MODE_META), biggest first */
    var FLEET_MODES = [
      { n: 640, c: "#27AE60" }, { n: 370, c: "#2980B9" }, { n: 180, c: "#E67E22" },
      { n: 55, c: "#8E44AD" }, { n: 33, c: "#2C3E50" }
    ];
    var carN = Math.ceil(CARS / UNIT);
    var fleetColors = [];
    FLEET_MODES.forEach(function (m) { var d = Math.ceil(m.n / UNIT); for (var i = 0; i < d; i++) fleetColors.push(m.c); });
    var L = null, raf = 0;

    function layout() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = canvas.clientWidth, H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var padX = 2, labelH = 16, rowGap = 22;
      var innerW = W - padX * 2;
      var carsZoneH = (H - labelH * 2 - rowGap) * 0.66;
      var cell = Math.max(6, Math.floor(Math.sqrt(carsZoneH * innerW / carN)));
      var cols = Math.max(1, Math.floor(innerW / cell));
      var carRows = Math.ceil(carN / cols);
      while (carRows * cell > carsZoneH && cell > 6) { cell--; cols = Math.max(1, Math.floor(innerW / cell)); carRows = Math.ceil(carN / cols); }
      var carsTop = labelH;
      var fleetTop = carsTop + carRows * cell + rowGap + labelH;
      L = { W: W, H: H, padX: padX, cell: cell, cols: cols, r: Math.max(2, cell * 0.40),
            carsTop: carsTop, fleetTop: fleetTop };
    }
    function xy(top, i) {
      var col = i % L.cols, row = Math.floor(i / L.cols);
      return { x: L.padX + col * L.cell + L.cell / 2, y: top + row * L.cell + L.cell / 2 };
    }
    function draw(frac) {
      if (!L) return;
      g.clearRect(0, 0, L.W, L.H);
      g.font = "700 11px 'Helvetica Neue', Helvetica, Arial, sans-serif";
      g.fillStyle = INK;
      g.fillText("49,648 PRIVATE CARS", L.padX, L.carsTop - 5);
      g.fillText("1,300 SHARED FLEET  ·  BY TYPE", L.padX, L.fleetTop - 5);
      var frontX = L.padX + frac * (L.W - L.padX * 2);
      var i, p;
      g.fillStyle = CAR_COLOR;
      for (i = 0; i < carN; i++) { p = xy(L.carsTop, i); if (p.x > frontX) continue; g.beginPath(); g.arc(p.x, p.y, L.r, 0, 6.2832); g.fill(); }
      for (i = 0; i < fleetColors.length; i++) { p = xy(L.fleetTop, i); if (p.x > frontX) continue; g.fillStyle = fleetColors[i]; g.beginPath(); g.arc(p.x, p.y, L.r, 0, 6.2832); g.fill(); }
    }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    window.addEventListener("resize", function () { if (band.classList.contains("on")) { layout(); draw(1); } });
    return {
      play: function (ctx) {
        stop(); band.classList.add("on"); layout();
        var t0 = now(), dur = 1700;
        (function tick() {
          if (ctx && ctx.cancelled) { draw(1); return; }
          var p = Math.min(1, (now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          draw(e);
          if (p < 1) raf = requestAnimationFrame(tick); else raf = 0;
        })();
      },
      complete: function () { stop(); band.classList.add("on"); layout(); draw(1); },
      reset: function () { stop(); band.classList.remove("on"); if (L) g.clearRect(0, 0, L.W, L.H); }
    };
  })();

  /* ══════════════════════════════════════════════════════
     THE SLIDES  (DOM order s1 … s24)
  ══════════════════════════════════════════════════════ */
  var SLIDES = [
    /* 1.1 landing */
    { el: $("#s1"), dark: true,
      play: async function (ctx) {
        $("#s1-kicker").classList.add("on");
        await sleep(700, ctx);
        await TW.run($("#tw-1"), HL.s1, ctx);
        await sleep(280, ctx);
        await TW.run($("#tw-1sub"), HL.s1sub, ctx);
        await sleep(3400, ctx);
      },
      complete: function () { $("#s1-kicker").classList.add("on"); TW.finalize($("#tw-1"), HL.s1); TW.finalize($("#tw-1sub"), HL.s1sub); },
      reset: function () { $("#s1-kicker").classList.remove("on"); TW.reset($("#tw-1")); TW.reset($("#tw-1sub")); }
    },
    /* 1.2 history */
    { el: $("#s2"), dark: false,
      play: async function (ctx) {
        await revealSeq("#s2", ctx, 460);
        framesAuto();
        await sleep(5000, ctx);
      },
      complete: function () { reveals("#s2", true); framesReset(); framesAuto(); },
      reset: function () { reveals("#s2", false); framesReset(); }
    },
    /* 1.3 today */
    txtSlide("s3", { step: 300, hold: 3400 }),
    /* 2.1 urban structure — live maps */
    { el: $("#s4"), dark: false, kind: "map",
      play: async function (ctx) {
        armMap();
        for (var i = 0; i < A.length; i++) {
          if (ctx.cancelled) break;
          gPos = i; mapPost(i);
          await galleryText(i, true, ctx);
          await sleep(6200, ctx);
        }
      },
      complete: function () { mapPost(gPos); galleryText(gPos, false); armMap(); },
      reset: function () { }
    },
    /* 3.1 problems — switching word column, loops continuously while on-slide */
    { el: $("#s5"), dark: false,
      play: async function (ctx) {
        problemsSet(0);
        problemsAuto();
        await sleep(PROBLEM_COUNT * 2000 + 200, ctx);
      },
      complete: function () { problemsSet(0); problemsAuto(); },
      reset: function () { problemsSet(0); }
    },
    /* 3.2 potential — typed title, then words in shuffled 0.1s cascade */
    { el: $("#s6"), dark: false,
      play: async function (ctx) {
        await TW.run($("#tw-6title"), HL.s6title, ctx);
        await sleep(220, ctx);
        await revealShuffled("#s6 .twords-cloud", ctx, 100);
        await sleep(3400, ctx);
      },
      complete: function () { TW.finalize($("#tw-6title"), HL.s6title); reveals("#s6 .twords-cloud", true); },
      reset: function () { TW.reset($("#tw-6title")); reveals("#s6 .twords-cloud", false); }
    },
    /* 4.1 vision — integrated · accessible · social (T2 gallery) */
    txtSlide("s7", { step: 420, hold: 3600 }),
    /* 4.2 accessible — numbers + full-bleed dot-matrix */
    { el: $("#s8"), dark: false,
      play: async function (ctx) {
        await revealSeq("#s8", ctx, 360);
        countAll("#s8", ctx);
        dm.play(ctx);
        await sleep(4400, ctx);
      },
      complete: function () { reveals("#s8", true); countInstant("#s8"); dm.complete(); },
      reset: function () { reveals("#s8", false); countReset("#s8"); dm.reset(); }
    },
    /* 4.3 outcomes — the space returned (before/after wipe) */
    { el: $("#s9"), dark: true,
      play: async function (ctx) {
        var st = $("#ba9"); st.classList.remove("wiped");
        await sleep(500, ctx);
        await TW.run($("#tw-9"), HL9, ctx);
        await sleep(700, ctx);
        st.classList.add("wiped");
        await sleep(3400, ctx);
      },
      complete: function () { TW.finalize($("#tw-9"), HL9); $("#ba9").classList.add("wiped"); },
      reset: function () { TW.reset($("#tw-9")); $("#ba9").classList.remove("wiped"); }
    },
    /* 4.4 manifesto */
    txtSlide("s10", { tw: { id: "tw-10", spec: TXT.tw10 }, step: 300, hold: 4200 }),
    /* 5.1 strategy */
    txtSlide("s11", { tw: { id: "tw-11", spec: TXT.tw11 }, step: 440, hold: 3600 }),
    /* 5.2 hub system — S/M/L */
    txtSlide("s12", { step: 520, hold: 3800 }),
    /* 5.3 connections */
    txtSlide("s13", { step: 360, hold: 3800 }),
    /* 5.4 hub placement — live map, real tool component */
    { el: $("#s13h"), dark: false, kind: "hp",
      play: async function (ctx) {
        armHpMap();
        for (var i = 0; i < HUBPLACE.length; i++) {
          if (ctx.cancelled) break;
          await hpText(i, true, ctx);
          await sleep(5000, ctx);
        }
      },
      complete: function () { hpText(0, false); },
      reset: function () { hpShow(0); }
    },
    /* 6.1 typology — axon diagrams + category palette */
    txtSlide("s14", { step: 200, hold: 3800 }),
    /* 6.2 S-hub */
    txtSlide("s15", { step: 420, hold: 3400 }),
    /* 6.3 M-hub */
    txtSlide("s16", { step: 420, hold: 3400 }),
    /* 6.4 L-hub */
    txtSlide("s17", { step: 420, hold: 3600 }),
    /* 6.5 fleet distribution — text loops Hub L/M/S every 2s, static Axonometry map */
    { el: $("#s17f"), dark: false, kind: "fleet",
      play: async function (ctx) {
        armFleetMap();
        await fleetText(0, true, ctx);
        fleetAuto();
        await sleep(FLEET_TIERS.length * 2000 + 200, ctx);
      },
      complete: function () { fleetText(0, false); fleetAuto(); armFleetMap(); },
      reset: function () { fleetShow(0); }
    },
    /* 7.1 locations */
    txtSlide("s18", { revealFirst: true, tw: { id: "tw-18", spec: TXT.tw18 }, hold: 3800 }),
    /* 7.2 network sequence — gif loop */
    txtSlide("s-xf", { revealFirst: true, hold: 10000 }),
    /* 7.3 masterplan */
    txtSlide("s20", { revealFirst: true, tw: { id: "tw-20", spec: TXT.tw20 }, hold: 3800 }),
    /* 8.1 hub viewer */
    { el: $("#s22"), dark: true, kind: "hub",
      play: async function (ctx) {
        hubClear(); hubTitle.classList.remove("faded");
        await sleep(400, ctx);
        await TW.run($("#tw-4"), HL.s4, ctx);
        await sleep(1100, ctx);
        hubTitle.classList.add("faded");
        hubSend("hub-kiosk-start");
        await waitCycle(ctx, function () { return hubCycleResolve; }, function (v) { hubCycleResolve = v; });
        if (ctx.cancelled) return;
        hubCTA();
        await sleep(1600, ctx);
      },
      complete: function () { TW.finalize($("#tw-4"), HL.s4); hubTitle.classList.add("faded"); armHub(); },
      reset: function () { TW.reset($("#tw-4")); hubTitle.classList.remove("faded"); hubClear(); }
    },
    /* 8.2 brain */
    { el: $("#s23"), dark: true, kind: "brain",
      play: async function (ctx) {
        brainClear(); brainTitle.classList.remove("faded");
        await sleep(400, ctx);
        await TW.run($("#tw-5"), HL.s5, ctx);
        await sleep(1100, ctx);
        brainTitle.classList.add("faded");
        brainSend("brain-kiosk-start");
        await waitCycle(ctx, function () { return brainCycleResolve; }, function (v) { brainCycleResolve = v; });
        if (ctx.cancelled) return;
        brainCTA();
        await sleep(1600, ctx);
      },
      complete: function () { TW.finalize($("#tw-5"), HL.s5); brainTitle.classList.add("faded"); armBrain(); },
      reset: function () { TW.reset($("#tw-5")); brainTitle.classList.remove("faded"); brainClear(); }
    },
    /* 8.3 close */
    { el: $("#s24"), dark: true,
      play: async function (ctx) { await sleep(5200, ctx); },
      complete: function () { }, reset: function () { }
    }
  ];
  var N = SLIDES.length;
  var MAP_I = SLIDES.findIndex(function (s) { return s.kind === "map"; });
  var HP_I = SLIDES.findIndex(function (s) { return s.kind === "hp"; });
  var FLEET_I = SLIDES.findIndex(function (s) { return s.kind === "fleet"; });
  var HUB_I = SLIDES.findIndex(function (s) { return s.kind === "hub"; });
  var BRAIN_I = SLIDES.findIndex(function (s) { return s.kind === "brain"; });

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
  /* section index shown top-right (X.Y scheme, DOM order s1 … s24) */
  var SLIDE_INDEX = ["1.1", "1.2", "1.3", "2.1", "3.1", "3.2", "4.1", "4.2", "4.3", "4.4",
    "5.1", "5.2", "5.3", "5.4", "6.1", "6.2", "6.3", "6.4", "6.5", "7.1", "7.2", "7.3", "8.1", "8.2", "8.3"];
  /* section titles — shown as chrome nested in the top-left L (1.1 has none) */
  var SLIDE_NAMES = ["", "HISTORY", "TODAY", "URBAN STRUCTURE", "PROBLEMS", "POTENTIALS",
    "VISION", "OUTCOMES", "GOAL", "IDEA", "STRATEGY", "HUB SYSTEM", "HUB CONNECTIONS",
    "HUB NETWORK", "HUB TYPOLOGIES", "S-HUB", "M-HUB", "L-HUB", "HUB FLEET",
    "PLACEMENT", "CONNECTION", "MASTERPLAN", "DISCOVER", "DATA", "PRESENTING"];
  function titleHTML(name) { return name ? '<span class="bk">&lt;</span>' + name + '<span class="bk">&gt;</span>' : ""; }
  var slideIndexEl = document.getElementById("slide-index");
  var slideTitleEl = document.getElementById("slide-title");
  function updateChrome(i) {
    counter.textContent = pad(i + 1) + " / " + pad(N);
    if (slideIndexEl) slideIndexEl.textContent = SLIDE_INDEX[i] || "";
    if (slideTitleEl) slideTitleEl.innerHTML = titleHTML(SLIDE_NAMES[i] || "");
    $all("#dots b").forEach(function (b, k) { b.classList.toggle("on", k === i); });
    document.body.classList.toggle("on-dark", !!SLIDES[i].dark);
  }

  /* ── hook (h2) typewriter — types a slide's .s-hook question in ── */
  function hookTw(i) { var el = SLIDES[i] && SLIDES[i].el; return el ? el.querySelector(".s-hook .tw") : null; }
  function hookSpec(el) { return { ops: [{ t: el.getAttribute("data-hook") || "" }], speed: 0.85 }; }
  function resetHook(i) { var el = hookTw(i); if (el) TW.reset(el); }
  function typeHook(i, ctx) { var el = hookTw(i); if (el) TW.run(el, hookSpec(el), ctx); }
  function finalizeHook(i) { var el = hookTw(i); if (el) TW.finalize(el, hookSpec(el)); }

  /* ── before/after sliders (hub pages): wipe before→after on enter, drag to compare ── */
  var baSliders = $all(".hp-ba");
  function baSplit(el, pct) { el.style.setProperty("--split", Math.max(0, Math.min(100, pct)) + "%"); }
  function baReset(el) { if (el) baSplit(el, 0); }
  function baFinalize(el) { if (el) baSplit(el, 100); }
  function baPlay(el, ctx) {
    if (!el) return;
    var t0 = now(), dur = 1600;
    (function tick() {
      if (ctx && ctx.cancelled) { baSplit(el, 100); return; }
      var p = Math.min(1, (now() - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      baSplit(el, e * 100);
      if (p < 1) requestAnimationFrame(tick);
    })();
  }
  function slideBA(i) { return SLIDES[i] && SLIDES[i].el ? SLIDES[i].el.querySelector(".hp-ba") : null; }
  baSliders.forEach(function (el) {
    var dragging = false;
    function setFromX(x) { var r = el.getBoundingClientRect(); baSplit(el, ((x - r.left) / r.width) * 100); }
    el.addEventListener("pointerdown", function (e) { dragging = true; el.classList.add("activated"); setFromX(e.clientX); try { el.setPointerCapture(e.pointerId); } catch (_) {} });
    el.addEventListener("pointermove", function (e) { if (dragging) setFromX(e.clientX); });
    el.addEventListener("pointerup", function () { dragging = false; });
    el.addEventListener("pointercancel", function () { dragging = false; });
  });

  function place(i) {
    idx = i; setTrack(i); updateChrome(i);
    if (i === HUB_I) { hubSend("hub-resume"); } else { hubSend("hub-pause"); hubClear(); }
    if (i === BRAIN_I) { brainSend("brain-resume"); } else { brainSend("brain-pause"); brainClear(); }
    if (i === MAP_I) armMap(); else if (gallery) gallery.classList.remove("activated");
    if (i === HP_I) armHpMap(); else if (hpGallery) hpGallery.classList.remove("activated");
    if (i === FLEET_I) armFleetMap(); else if (fleetGallery) fleetGallery.classList.remove("activated");
    hubScenesReset();
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
      resetHook(i); baReset(slideBA(i));
      await sleep(i === startIdx ? 350 : PAGE_MS, ctx);
      if (ctx.cancelled) return;
      typeHook(i, ctx); baPlay(slideBA(i), ctx);
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
    SLIDES.forEach(function (s, i) { s.reset(); resetHook(i); });
    baSliders.forEach(baReset);
    framesReset();
    setModeUI(true);
    place(0);
    present(0);
  }

  /* ══════════════════════════════════════════════════════
     DISCOVER + NAV
  ══════════════════════════════════════════════════════ */
  function completeCurrent() { clearAmbients(); SLIDES[idx].reset(); SLIDES[idx].complete(); finalizeHook(idx); baFinalize(slideBA(idx)); }
  function onInput() {
    lastInput = now();
    if (MODE === "present") { MODE = "discover"; gen++; setModeUI(false); completeCurrent(); }
  }
  function goManual(n) {
    if (n < 0 || n >= N || n === idx || wheelLock) return;
    wheelLock = true; setTimeout(function () { wheelLock = false; }, WHEEL_COOLDOWN);
    place(n);
    clearAmbients(); SLIDES[n].reset(); SLIDES[n].complete(); finalizeHook(n); baFinalize(slideBA(n));
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
    var onLiveTool = (idx === HUB_I || idx === BRAIN_I);
    var limit = onLiveTool ? HUB_RESTART_MS : IDLE_RESUME_MS;
    if (now() - lastInput < limit) return;
    if (onLiveTool) loopRestart();
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
