/* ─────────────────────────────────────────────────────────────
   kiosk.js — self-running exhibition autopilot.

   The deck plays itself: scrolls beat by beat, types headlines,
   reveals content, ends in the hub-viewer scene tour, then loops.
   Any mouse / keyboard / touch input pauses the autopilot and
   hands control to the visitor; after IDLE_RESUME_MS without
   input the tour resumes from the nearest beat. A full loop
   restart resets everything so the next visitor sees it fresh.

   Numbers: Wolfsburg Activity Map baseline (computeCapacity at
   130k population), rounded to the nearest ten —
   fleet 1,270 (640 e-bikes · 55 shuttles · 33 buses · 370 pods ·
   180 EVs) · 68 hubs (6 L / 19 M / 43 S) · 104,000 trips/day.

   Talks to the hub-viewer iframe via postMessage:
     deck → viewer : {type:'hub-kiosk-start'} | {type:'hub-kiosk-stop'}
     viewer → deck : {type:'hub-interaction'} | {type:'hub-cycle-complete'}
─────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  /* ── tunables ─────────────────────────────────────────── */
  var IDLE_RESUME_MS = 30000;   // manual → auto after this much silence
  var HUB_END_WAIT_MS = 18000;  // pause on the hub beat before looping
  var SCROLL_MS = 1400;         // beat-to-beat scroll duration
  var MOVE_THRESHOLD = 8;       // px of pointer travel that counts as "touch"

  /* ── state ────────────────────────────────────────────── */
  var MODE = "auto";            // 'auto' | 'manual'
  var gen = 0;                  // bump to cancel the running tour
  var lastInput = performance.now();
  var hubCycleResolve = null;   // pending "hub tour finished" promise
  var ambients = [];            // running setInterval ids, cleared on reset

  var pilotLabel = document.getElementById("pilot-label");
  var hubFrame = document.getElementById("hub-frame");

  function now() { return performance.now(); }
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  function makeCtx(g) {
    return { get cancelled() { return g !== gen || MODE !== "auto"; } };
  }
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

  /* ── smooth scrolling (cancellable) ───────────────────── */
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function scrollToY(y, ms, ctx) {
    return new Promise(function (res) {
      var y0 = window.scrollY, dy = y - y0, t0 = now();
      if (Math.abs(dy) < 2) return res();
      (function step() {
        if (ctx && ctx.cancelled) return res();
        var t = Math.min(1, (now() - t0) / ms);
        window.scrollTo(0, y0 + dy * easeInOut(t));
        if (t < 1) requestAnimationFrame(step); else res();
      })();
    });
  }
  function beatTop(sel) { return $(sel).offsetTop; }

  /* ── ambient helpers (keep running after a beat is built) */
  function ambient(fn, ms) { var id = setInterval(fn, ms); ambients.push(id); return id; }
  function clearAmbients() { ambients.forEach(clearInterval); ambients = []; }

  function reveals(sel, on) {
    $all(sel + " .reveal").forEach(function (el) { el.classList.toggle("on", on); });
  }
  async function revealSeq(sel, ctx, stepMs) {
    var els = $all(sel + " .reveal").sort(function (a, b) {
      return (+a.dataset.r || 0) - (+b.dataset.r || 0);
    });
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add("on");
      await sleep(stepMs || 650, ctx);
    }
  }

  function countUp(el, ms, ctx) {
    var target = +el.dataset.count;
    var t0 = now();
    (function step() {
      if (ctx && ctx.cancelled) { el.textContent = target.toLocaleString("en-US"); return; }
      var t = Math.min(1, (now() - t0) / ms);
      el.textContent = Math.round(target * easeInOut(t)).toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(step);
    })();
  }
  function countAll(sel, ms, ctx) {
    $all(sel + " [data-count]").forEach(function (el) { countUp(el, ms, ctx); });
  }
  function countsFinal(sel) {
    $all(sel + " [data-count]").forEach(function (el) {
      el.textContent = (+el.dataset.count).toLocaleString("en-US");
    });
  }
  function countsZero(sel) {
    $all(sel + " [data-count]").forEach(function (el) { el.textContent = "0"; });
  }

  /* ══════════════════════════════════════════════════════
     HEADLINES — authored typing scripts (typos are scripted,
     never random). Emphasis is drawn after typing finishes.
  ══════════════════════════════════════════════════════ */
  var HL = {
    b1: {
      ops: [{ t: "<stadt." }, { typo: { wrong: "hup>", fix: "hub>" } }],
      emphasize: []
    },
    b2: {
      ops: [{ t: "A city built to " }, { pause: 350 }, { t: "build cars." }],
      emphasize: [{ phrase: "build cars", kind: "underline" }]
    },
    b2b: {
      ops: [{ t: "It worked. " }, { pause: 800 }, { t: "Completely." }],
      emphasize: [{ phrase: "Completely.", kind: "bold" }]
    },
    b3: {
      ops: [{ t: "Where does the city\nkeep its life?" }],
      emphasize: [{ phrase: "keep its life?", kind: "underline" }]
    },
    b4: {
      ops: [{ t: "The car takes more than it " }, { typo: { wrong: "gvies", fix: "gives" } }, { t: "." }],
      emphasize: [{ phrase: "takes more", kind: "underline" }]
    },
    b5: {
      ops: [{ t: "What if the city " }, { typo: { wrong: "shered", fix: "shared" } }, { t: " its vehicles?" }],
      emphasize: []
    },
    b5a: { ops: [{ t: "Shared." }], emphasize: [] },
    b5b: { ops: [{ t: "Autonomous." }], emphasize: [] },
    b5c: { ops: [{ t: "Electric." }], emphasize: [] },
    b6: {
      ops: [{ t: "104,000 trips a day." }, { pause: 650 }, { t: "\nOne shared fleet." }],
      emphasize: [{ phrase: "One shared fleet.", kind: "underline" }]
    },
    b7: {
      ops: [{ t: "How far is your nearest hub?" }],
      emphasize: [{ phrase: "nearest hub", kind: "underline" }]
    },
    b8: {
      ops: [{ t: "What does a street become\nwithout parked cars?" }],
      emphasize: [{ phrase: "become", kind: "underline" }]
    },
    b9: {
      ops: [{ t: "Who wins the street back?" }],
      emphasize: [{ phrase: "the street back", kind: "underline" }]
    },
    b10: {
      ops: [{ t: "Not fewer trips." }, { pause: 700 }, { t: "\nLess parking." }, { pause: 700 }, { t: " More city." }],
      emphasize: [{ phrase: "More city.", kind: "underline" }]
    },
    b11: {
      ops: [{ t: "Explore one hub yourself" }],
      emphasize: [{ phrase: "yourself", kind: "underline" }]
    }
  };

  /* ══════════════════════════════════════════════════════
     BEAT 2 — history → today tiles
  ══════════════════════════════════════════════════════ */
  function tilesNow(on) {
    $all("#b2 .flip-tile").forEach(function (t) { t.classList.toggle("now", on); });
  }
  async function tilesFlipSeq(ctx) {
    var tiles = $all("#b2 .flip-tile");
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].classList.add("now");
      await sleep(650, ctx);
    }
  }

  /* ══════════════════════════════════════════════════════
     BEAT 3 — urban structure map cycle
  ══════════════════════════════════════════════════════ */
  var MAPS = [
    {
      chip: "01 · Transport activity",
      cap: "All transport intensity converges on one dominant core — the gravitational pull of the Werk. The periphery orbits it."
    },
    {
      chip: "02 · Facility density",
      cap: "Civic and commercial life concentrates in Stadtmitte, Schillerteich and Laagberg. Outlying districts depend on the car for everyday needs."
    },
    {
      chip: "03 · Centrality without a car",
      cap: "Step outside the core and accessibility collapses. Without a private car, reaching the city within 15 minutes is a privilege of geography."
    }
  ];
  var mapIdx = 0;
  function mapShow(i) {
    mapIdx = i % MAPS.length;
    $all("#map-stage .map-img").forEach(function (el, k) {
      el.classList.toggle("active", k === mapIdx);
    });
    var card = document.getElementById("map-card");
    card.classList.add("swapping");
    setTimeout(function () {
      document.getElementById("map-chip").textContent = MAPS[mapIdx].chip;
      document.getElementById("map-cap").textContent = MAPS[mapIdx].cap;
      card.classList.remove("swapping");
    }, 400);
  }
  function mapCycleStart() {
    ambient(function () { mapShow(mapIdx + 1); }, 8000);
  }

  /* ══════════════════════════════════════════════════════
     BEAT 6 — dot-field collapse (canvas)
     A field of hollow dots (the parked private cars) collapses
     into 127 solid accent dots (the 1,270 shared fleet, 1:10).
  ══════════════════════════════════════════════════════ */
  var FLEET_DOTS = 127;   // 1,270 vehicles, 1 dot = 10
  var dotCanvas = document.getElementById("dotfield");
  function dotLayout() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = dotCanvas.clientWidth, h = dotCanvas.clientHeight;
    dotCanvas.width = w * dpr; dotCanvas.height = h * dpr;
    var g = dotCanvas.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    var cols = 46, rows = 13;
    var gapX = w / (cols + 1), gapY = h / (rows + 1);
    var field = [];
    for (var r = 0; r < rows; r++)
      for (var c = 0; c < cols; c++)
        field.push({ x: gapX * (c + 1), y: gapY * (r + 1) });

    // fleet target slots: 26 × 5 compact block (last row short), centred
    var tCols = 26, tRows = Math.ceil(FLEET_DOTS / 26), tGap = Math.min(gapX * 1.35, 22);
    var bw = tGap * (tCols - 1), bh = tGap * (tRows - 1);
    var targets = [];
    for (var k = 0; k < FLEET_DOTS; k++) {
      var tc = k % tCols, tr = Math.floor(k / tCols);
      targets.push({ x: w / 2 - bw / 2 + tc * tGap, y: h / 2 - bh / 2 + tr * tGap });
    }

    // choose FLEET_DOTS evenly spread field dots to become the fleet
    var keep = {};
    var stride = field.length / FLEET_DOTS;
    for (var m = 0; m < FLEET_DOTS; m++) keep[Math.round(m * stride)] = m;

    return { g: g, w: w, h: h, field: field, targets: targets, keep: keep };
  }

  function dotDraw(L, t) {  // t: 0 = full field · 1 = collapsed fleet
    var g = L.g;
    g.clearRect(0, 0, L.w, L.h);
    var e = easeInOut(Math.max(0, Math.min(1, t)));
    L.field.forEach(function (p, i) {
      var slot = L.keep[i];
      if (slot === undefined) {
        var op = 0.55 * (1 - e);
        if (op <= 0.01) return;
        g.beginPath(); g.arc(p.x, p.y, 2.4, 0, 6.284);
        g.strokeStyle = "rgba(245,244,239," + op.toFixed(3) + ")";
        g.lineWidth = 1; g.stroke();
      } else {
        var q = L.targets[slot];
        var x = p.x + (q.x - p.x) * e, y = p.y + (q.y - p.y) * e;
        var rad = 2.4 + 2.2 * e;
        g.beginPath(); g.arc(x, y, rad, 0, 6.284);
        if (e < 0.35) {
          g.strokeStyle = "rgba(245,244,239,0.85)"; g.lineWidth = 1.1; g.stroke();
        } else {
          g.fillStyle = "#E8500A"; g.fill();
        }
      }
    });
  }

  var dotL = null;
  function dotCollapse(ms, ctx) {
    return new Promise(function (res) {
      dotL = dotLayout();
      var t0 = now();
      (function step() {
        if (ctx && ctx.cancelled) { dotDraw(dotL, 1); return res(); }
        var t = Math.min(1, (now() - t0) / ms);
        dotDraw(dotL, t);
        if (t < 1) requestAnimationFrame(step); else res();
      })();
    });
  }
  function dotFinal() { dotL = dotLayout(); dotDraw(dotL, 1); }
  function dotReset() { dotL = dotLayout(); dotDraw(dotL, 0); }
  window.addEventListener("resize", function () { if (dotL) dotFinal(); });

  /* ══════════════════════════════════════════════════════
     BEAT 7 — plan crossfade  ·  BEAT 8 — street wipes
  ══════════════════════════════════════════════════════ */
  function planCycleStart() {
    var imgs = $all("#plan-frame .plan-img");
    var chip = document.getElementById("plan-chip");
    var labels = ["Hub network", "Walking catchments"];
    var i = 0;
    ambient(function () {
      imgs[i].classList.remove("active");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("active");
      chip.textContent = labels[i];
    }, 6000);
  }

  var STREETS = [
    { b: "../../charts/ba_v3_before.png", a: "../../charts/ba_v3_after.png", label: "Kleiststraße" },
    { b: "../../charts/ba_v4_before.png", a: "../../charts/ba_v4_after.png", label: "Schillerstraße" },
    { b: "../../charts/ba_v2_before.png", a: "../../charts/ba_v2_after.png", label: "The canal edge" }
  ];
  var baStage = document.getElementById("ba-stage");
  var baBefore = document.getElementById("ba-before");
  var baAfter = document.getElementById("ba-after");
  var baStreet = document.getElementById("ba-street");
  var streetIdx = 0;

  function streetShow(i, wiped) {
    streetIdx = i % STREETS.length;
    var s = STREETS[streetIdx];
    baStage.classList.remove("wiped");
    baBefore.src = s.b; baAfter.src = s.a;
    baStreet.textContent = s.label;
    if (wiped) baStage.classList.add("wiped");
  }
  async function streetPlayOne(ctx) {
    await sleep(2400, ctx);                 // read the "before"
    baStage.classList.add("wiped");         // wipe to "after"
    await sleep(3600, ctx);
  }
  function streetCycleStart() {
    var phase = 0;   // alternate: wipe → next street
    ambient(function () {
      if (phase === 0) { baStage.classList.add("wiped"); phase = 1; }
      else { streetShow(streetIdx + 1, false); phase = 0; }
    }, 3200);
  }

  /* ══════════════════════════════════════════════════════
     BEAT 9 — personas
  ══════════════════════════════════════════════════════ */
  var PERSONAS = [
    {
      num: "01", name: "Thomas, 44", role: "Engineer at the VW plant",
      before: "Thirty minutes in traffic every morning. A new car every three years — it just felt like the way things were.",
      after: "An autonomous bus from the L-hub to the factory gate in 18 minutes. He helps build the fleet — and rides it.",
      imgB: "../../charts/thomas_before.png", imgA: "../../charts/thomas_after.png"
    },
    {
      num: "02", name: "Sabine, 38", role: "Office worker · two children",
      before: "Two family cars: €400 a month, parking stress, mornings of traffic and running late.",
      after: "E-bike to the S-hub, shuttle to the office in 12 minutes. The kids ride the same shuttle to school on their own.",
      imgB: "../../charts/sabine_before.png", imgA: "../../charts/sabine_after.png"
    },
    {
      num: "03", name: "Lukas, 13", role: "Secondary school student",
      before: "Everything beyond his neighbourhood depended on whether a parent could drive him.",
      after: "An e-bike from the nearest S-hub — faster than the old bus. For the first time, the whole city feels like his.",
      imgB: "../../charts/lukas_before.png", imgA: "../../charts/lukas_after.png"
    },
    {
      num: "04", name: "Gertrude, 85", role: "Retired",
      before: "After her leg gave out she stopped driving. Every trip meant asking her daughter.",
      after: "An autonomous pod arrives at her door — no transfers, no steps. Market on Tuesdays again.",
      imgB: "../../charts/gertrude_before.png", imgA: "../../charts/gertrude_after.png"
    }
  ];
  var pIdx = 0;
  var personaCard = document.getElementById("persona-card");
  var ptBefore = document.getElementById("pt-before");
  var ptAfter = document.getElementById("pt-after");
  (function buildDots() {
    var host = document.getElementById("persona-dots");
    PERSONAS.forEach(function (_, i) {
      var d = document.createElement("span");
      if (i === 0) d.classList.add("active");
      host.appendChild(d);
    });
  })();

  function personaSet(i) {
    pIdx = i % PERSONAS.length;
    var p = PERSONAS[pIdx];
    document.getElementById("p-num").textContent = p.num;
    document.getElementById("p-name").textContent = p.name;
    document.getElementById("p-role").textContent = p.role;
    document.getElementById("p-before").textContent = p.before;
    document.getElementById("p-after").textContent = p.after;
    ptBefore.src = p.imgB; ptAfter.src = p.imgA;
    ptBefore.classList.add("active"); ptAfter.classList.remove("active");
    $all("#persona-dots span").forEach(function (d, k) {
      d.classList.toggle("active", k === pIdx);
    });
  }
  function personaSwap() {           // portrait crossfades before → after
    ptBefore.classList.remove("active");
    ptAfter.classList.add("active");
  }
  async function personaPlayOne(ctx) {
    await sleep(3200, ctx);          // read the "before"
    personaSwap();
    await sleep(3800, ctx);
  }
  function personaNextFaded() {
    personaCard.classList.add("persona-fading");
    setTimeout(function () {
      personaSet(pIdx + 1);
      personaCard.classList.remove("persona-fading");
    }, 380);
  }
  function personaCycleStart() {
    var phase = 0;
    ambient(function () {
      if (phase === 0) { personaSwap(); phase = 1; }
      else { personaNextFaded(); phase = 0; }
    }, 3600);
  }

  /* ══════════════════════════════════════════════════════
     BEAT 1 — hero video alternation
  ══════════════════════════════════════════════════════ */
  (function heroVideos() {
    var a = document.getElementById("hero-a"), b = document.getElementById("hero-b");
    if (!a || !b) return;
    function swap(from, to) {
      to.currentTime = 0;
      var p = to.play(); if (p && p.catch) p.catch(function () {});
      to.classList.add("active");
      from.classList.remove("active");
    }
    a.addEventListener("ended", function () { swap(a, b); });
    b.addEventListener("ended", function () { swap(b, a); });
  })();

  /* ══════════════════════════════════════════════════════
     HUB VIEWER BRIDGE
  ══════════════════════════════════════════════════════ */
  function hubSend(type) {
    try { hubFrame.contentWindow.postMessage({ type: type }, "*"); } catch (e) {}
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.type === "hub-interaction") onInput(true);
    else if (d.type === "hub-cycle-complete") {
      if (hubCycleResolve) { hubCycleResolve(); hubCycleResolve = null; }
    }
  });

  /* ══════════════════════════════════════════════════════
     THE BEATS
     play(ctx)  — fresh animated entrance (autopilot)
     complete() — jump to final state + start ambient motion
     reset()    — clear back to untouched (for the next loop)
  ══════════════════════════════════════════════════════ */
  var BEATS = [
    { // 1 — VISION
      sel: "#b1", hold: 6500,
      play: async function (ctx) {
        $("#b1 .kicker").classList.add("on");
        await sleep(900, ctx);
        await TW.run($("#tw-b1"), HL.b1, ctx);
        await revealSeq("#b1", ctx, 900);
      },
      complete: function () { TW.finalize($("#tw-b1"), HL.b1); reveals("#b1", true); },
      reset: function () { TW.reset($("#tw-b1")); reveals("#b1", false); }
    },
    { // 2 — HISTORY → TODAY
      sel: "#b2", hold: 5000,
      play: async function (ctx) {
        await TW.run($("#tw-b2"), HL.b2, ctx);
        await revealSeq("#b2", ctx, 900);       // three b/w tiles appear
        await sleep(2600, ctx);                  // let 1938 sink in
        await TW.run($("#tw-b2b"), HL.b2b, ctx); // "It worked. Completely."
        await tilesFlipSeq(ctx);                 // …and the tiles turn into today
      },
      complete: function () {
        TW.finalize($("#tw-b2"), HL.b2); TW.finalize($("#tw-b2b"), HL.b2b);
        reveals("#b2", true); tilesNow(true);
      },
      reset: function () {
        TW.reset($("#tw-b2")); TW.reset($("#tw-b2b"));
        reveals("#b2", false); tilesNow(false);
      }
    },
    { // 3 — URBAN STRUCTURE
      sel: "#b3", hold: 2000,
      play: async function (ctx) {
        mapShow(0);
        await TW.run($("#tw-b3"), HL.b3, ctx);
        for (var i = 0; i < MAPS.length; i++) {
          if (ctx.cancelled) break;
          if (i > 0) mapShow(i);
          await sleep(7500, ctx);
        }
        mapCycleStart();
      },
      complete: function () {
        TW.finalize($("#tw-b3"), HL.b3);
        mapShow(mapIdx); mapCycleStart();
      },
      reset: function () { TW.reset($("#tw-b3")); mapShow(0); }
    },
    { // 4 — PROBLEMS
      sel: "#b4", hold: 8000,
      play: async function (ctx) {
        await TW.run($("#tw-b4"), HL.b4, ctx);
        await revealSeq("#b4", ctx, 1400);       // three domains, then the stat strip
      },
      complete: function () { TW.finalize($("#tw-b4"), HL.b4); reveals("#b4", true); },
      reset: function () { TW.reset($("#tw-b4")); reveals("#b4", false); }
    },
    { // 5 — SHARED · AUTONOMOUS · ELECTRIC
      sel: "#b5", hold: 7000,
      play: async function (ctx) {
        await TW.run($("#tw-b5"), HL.b5, ctx);
        await sleep(600, ctx);
        await TW.run($("#tw-b5a"), HL.b5a, ctx);
        $all("#b5 .reveal")[0].classList.add("on");
        await sleep(1200, ctx);
        await TW.run($("#tw-b5b"), HL.b5b, ctx);
        $all("#b5 .reveal")[1].classList.add("on");
        await sleep(1200, ctx);
        await TW.run($("#tw-b5c"), HL.b5c, ctx);
        $all("#b5 .reveal")[2].classList.add("on");
      },
      complete: function () {
        [["#tw-b5", HL.b5], ["#tw-b5a", HL.b5a], ["#tw-b5b", HL.b5b], ["#tw-b5c", HL.b5c]]
          .forEach(function (p) { TW.finalize($(p[0]), p[1]); });
        reveals("#b5", true);
      },
      reset: function () {
        ["#tw-b5", "#tw-b5a", "#tw-b5b", "#tw-b5c"].forEach(function (s) { TW.reset($(s)); });
        reveals("#b5", false);
      }
    },
    { // 6 — FLEET (dot collapse)
      sel: "#b6", hold: 8000,
      play: async function (ctx) {
        dotReset();
        await TW.run($("#tw-b6"), HL.b6, ctx);
        await sleep(500, ctx);
        await dotCollapse(3000, ctx);
        await revealSeq("#b6", ctx, 900);
        countAll("#b6", 1400, ctx);
      },
      complete: function () {
        TW.finalize($("#tw-b6"), HL.b6); dotFinal();
        reveals("#b6", true); countsFinal("#b6");
      },
      reset: function () {
        TW.reset($("#tw-b6")); dotReset();
        reveals("#b6", false); countsZero("#b6");
      }
    },
    { // 7 — NETWORK
      sel: "#b7", hold: 11000,
      play: async function (ctx) {
        planCycleStart();
        await TW.run($("#tw-b7"), HL.b7, ctx);
        await revealSeq("#b7", ctx, 1200);
        countAll("#b7", 1600, ctx);
      },
      complete: function () {
        TW.finalize($("#tw-b7"), HL.b7); reveals("#b7", true);
        countsFinal("#b7"); planCycleStart();
      },
      reset: function () {
        TW.reset($("#tw-b7")); reveals("#b7", false); countsZero("#b7");
        var imgs = $all("#plan-frame .plan-img");
        imgs.forEach(function (el, i) { el.classList.toggle("active", i === 0); });
        document.getElementById("plan-chip").textContent = "Hub network";
      }
    },
    { // 8 — STREETS
      sel: "#b8", hold: 1500,
      play: async function (ctx) {
        streetShow(0, false);
        await TW.run($("#tw-b8"), HL.b8, ctx);
        for (var i = 0; i < STREETS.length; i++) {
          if (ctx.cancelled) break;
          if (i > 0) { streetShow(i, false); await sleep(700, ctx); }
          await streetPlayOne(ctx);
        }
        streetCycleStart();
      },
      complete: function () {
        TW.finalize($("#tw-b8"), HL.b8);
        streetShow(streetIdx, true);
        streetCycleStart();
      },
      reset: function () { TW.reset($("#tw-b8")); streetShow(0, false); }
    },
    { // 9 — PEOPLE
      sel: "#b9", hold: 1500,
      play: async function (ctx) {
        personaSet(0);
        await TW.run($("#tw-b9"), HL.b9, ctx);
        await revealSeq("#b9", ctx, 600);
        for (var i = 0; i < PERSONAS.length; i++) {
          if (ctx.cancelled) break;
          if (i > 0) { personaNextFaded(); await sleep(700, ctx); }
          await personaPlayOne(ctx);
        }
        personaCycleStart();
      },
      complete: function () {
        TW.finalize($("#tw-b9"), HL.b9); reveals("#b9", true);
        personaCycleStart();
      },
      reset: function () { TW.reset($("#tw-b9")); reveals("#b9", false); personaSet(0); }
    },
    { // 10 — CLOSE
      sel: "#b10", hold: 7000,
      play: async function (ctx) {
        await TW.run($("#tw-b10"), HL.b10, ctx);
        await revealSeq("#b10", ctx, 1100);
      },
      complete: function () { TW.finalize($("#tw-b10"), HL.b10); reveals("#b10", true); },
      reset: function () { TW.reset($("#tw-b10")); reveals("#b10", false); }
    },
    { // 11 — EXPLORE (hub viewer)
      sel: "#b11", hold: 0, alwaysReplay: true,
      play: async function (ctx) {
        TW.finalize($("#tw-b11"), HL.b11);
        hubSend("hub-kiosk-start");
        // wait for the viewer's scene tour to finish (or takeover / safety cap)
        await new Promise(function (res) {
          hubCycleResolve = res;
          var t0 = now();
          (function guard() {
            if (!hubCycleResolve) return;               // resolved by message
            if (ctx.cancelled || now() - t0 > 120000) { hubCycleResolve = null; res(); return; }
            setTimeout(guard, 400);
          })();
        });
        if (ctx.cancelled) return;
        await sleep(HUB_END_WAIT_MS, ctx);              // last chance to grab it
      },
      complete: function () { TW.finalize($("#tw-b11"), HL.b11); },
      reset: function () { TW.reset($("#tw-b11")); }
    }
  ];

  /* ══════════════════════════════════════════════════════
     ENGINE
  ══════════════════════════════════════════════════════ */
  function setPilot(auto) {
    document.body.classList.toggle("autopilot", auto);
    pilotLabel.textContent = auto
      ? "auto tour — touch anything to take control"
      : "you have control — the tour resumes when idle";
  }

  function completeAll() {
    BEATS.forEach(function (b) {
      if (!b.done) { b.complete(); b.done = true; }
    });
  }
  function resetAll() {
    clearAmbients();
    BEATS.forEach(function (b) { b.reset(); b.done = false; });
  }

  async function tour(startIdx) {
    var g = ++gen;
    var ctx = makeCtx(g);
    for (var i = startIdx; i < BEATS.length; i++) {
      var b = BEATS[i];
      await scrollToY(beatTop(b.sel), SCROLL_MS, ctx);
      if (ctx.cancelled) return;
      if (!b.done || b.alwaysReplay) {
        if (b.alwaysReplay) b.reset();
        b.done = true;               // set BEFORE play: a takeover mid-play must not
                                     // double-build this beat via completeAll()
        await b.play(ctx);           // (a cancelled play fast-forwards to final state)
      }
      if (ctx.cancelled) return;
      await sleep(b.hold, ctx);
      if (ctx.cancelled) return;
    }
    if (ctx.cancelled) return;
    restartLoop();
  }

  function restartLoop() {
    var g = ++gen;
    hubSend("hub-kiosk-stop");
    scrollToY(0, 1600, makeCtx(g)).then(function () {
      if (g !== gen || MODE !== "auto") return;
      resetAll();
      tour(0);
    });
  }

  function nearestBeat() {
    var y = window.scrollY + window.innerHeight / 2;
    var best = 0, dist = Infinity;
    BEATS.forEach(function (b, i) {
      var el = $(b.sel);
      var mid = el.offsetTop + el.offsetHeight / 2;
      var d = Math.abs(mid - y);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  }

  /* ── input → manual mode ──────────────────────────────── */
  function onInput(fromHub) {
    lastInput = now();
    if (MODE === "auto") {
      MODE = "manual";
      gen++;                         // cancel the running tour
      completeAll();                 // manual browsing sees a finished deck
      setPilot(false);
    }
  }
  var px = null, py = null, acc = 0;
  window.addEventListener("pointermove", function (e) {
    if (px !== null) acc += Math.abs(e.clientX - px) + Math.abs(e.clientY - py);
    px = e.clientX; py = e.clientY;
    if (acc > MOVE_THRESHOLD) { acc = 0; onInput(); }
  }, { passive: true });
  ["pointerdown", "wheel", "keydown", "touchstart"].forEach(function (ev) {
    window.addEventListener(ev, function () { onInput(); }, { passive: true });
  });

  /* ── idle watchdog: manual → auto ─────────────────────── */
  setInterval(function () {
    if (MODE !== "manual") return;
    if (now() - lastInput < IDLE_RESUME_MS) return;
    MODE = "auto";
    setPilot(true);
    px = py = null; acc = 0;
    tour(nearestBeat());
  }, 1000);

  /* ── go ───────────────────────────────────────────────── */
  window.scrollTo(0, 0);
  dotReset();
  setPilot(true);
  setTimeout(function () { tour(0); }, 800);
})();
