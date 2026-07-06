/* ─────────────────────────────────────────────────────────────
   kiosk.js — self-running exhibition autopilot.

   The deck plays itself: scrolls beat by beat, types headlines,
   reveals content, ends in the hub-viewer scene tour, then loops.
   Any mouse / keyboard / touch input pauses the autopilot and
   hands control to the visitor; after IDLE_RESUME_MS without
   input the tour resumes from the nearest beat. A full loop
   restart resets everything so the next visitor sees it fresh.

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
      if (ctx && ctx.cancelled) { el.textContent = target; return; }
      var t = Math.min(1, (now() - t0) / ms);
      el.textContent = Math.round(target * easeInOut(t));
      if (t < 1) requestAnimationFrame(step);
    })();
  }
  function countAll(sel, ms, ctx) {
    $all(sel + " [data-count]").forEach(function (el) { countUp(el, ms, ctx); });
  }
  function countsFinal(sel) {
    $all(sel + " [data-count]").forEach(function (el) { el.textContent = el.dataset.count; });
  }
  function countsZero(sel) {
    $all(sel + " [data-count]").forEach(function (el) { el.textContent = "0"; });
  }

  function slideshowStart(id, ms) {
    var slides = $all("#" + id + " .slide");
    if (slides.length < 2) return;
    var i = 0;
    ambient(function () {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, ms);
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
      ops: [{ t: "Where do the cars " }, { pause: 350 }, { t: "sleep?" }],
      emphasize: [{ phrase: "sleep?", kind: "underline" }]
    },
    b3: {
      ops: [{ t: "What if the city " }, { typo: { wrong: "shered", fix: "shared" } }, { t: " its vehicles?" }],
      emphasize: [{ phrase: "shared", kind: "bold" }]
    },
    b4: {
      ops: [{ t: "How far is your nearest hub?" }],
      emphasize: [{ phrase: "nearest hub", kind: "underline" }]
    },
    b5: {
      ops: [{ t: "What does a street become\nwithout parked cars?" }],
      emphasize: [{ phrase: "become", kind: "underline" }]
    },
    b6: {
      ops: [{ t: "Who wins the street back?" }],
      emphasize: [{ phrase: "the street back", kind: "underline" }]
    },
    b7: {
      ops: [{ t: "Not fewer trips." }, { pause: 700 }, { t: "\nLess parking." }, { pause: 700 }, { t: " More city." }],
      emphasize: [{ phrase: "More city.", kind: "underline" }]
    },
    b8: {
      ops: [{ t: "Explore one hub yourself" }],
      emphasize: [{ phrase: "yourself", kind: "underline" }]
    }
  };

  /* ══════════════════════════════════════════════════════
     BEAT 3 — dot-field collapse (canvas)
     A field of hollow dots (the parked private cars) collapses
     into 76 solid accent dots (the 763 shared vehicles, 1:10).
  ══════════════════════════════════════════════════════ */
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

    // 76 target slots: 19 × 4 compact block, centred
    var tCols = 19, tRows = 4, tGap = Math.min(gapX * 1.7, 26);
    var bw = tGap * (tCols - 1), bh = tGap * (tRows - 1);
    var targets = [];
    for (var tr = 0; tr < tRows; tr++)
      for (var tc = 0; tc < tCols; tc++)
        targets.push({ x: w / 2 - bw / 2 + tc * tGap, y: h / 2 - bh / 2 + tr * tGap });

    // choose 76 evenly spread field dots to become the fleet
    var keep = {};
    var stride = field.length / 76;
    for (var k = 0; k < 76; k++) keep[Math.round(k * stride)] = k;

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
        var rad = 2.4 + 2.6 * e;
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
     BEAT 4 — plan crossfade  ·  BEAT 5 — street wipes
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
     BEAT 6 — personas
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
    { // 2 — PROBLEM
      sel: "#b2", hold: 9000,
      play: async function (ctx) {
        slideshowStart("ss-problem", 5200);
        await TW.run($("#tw-b2"), HL.b2, ctx);
        await revealSeq("#b2", ctx, 1500);
      },
      complete: function () {
        TW.finalize($("#tw-b2"), HL.b2); reveals("#b2", true);
        slideshowStart("ss-problem", 5200);
      },
      reset: function () {
        TW.reset($("#tw-b2")); reveals("#b2", false);
        var s = $all("#ss-problem .slide");
        s.forEach(function (el, i) { el.classList.toggle("active", i === 0); });
      }
    },
    { // 3 — IDEA
      sel: "#b3", hold: 8000,
      play: async function (ctx) {
        dotReset();
        await TW.run($("#tw-b3"), HL.b3, ctx);
        await sleep(500, ctx);
        await dotCollapse(3000, ctx);
        await revealSeq("#b3", ctx, 900);
        countAll("#b3", 1400, ctx);
      },
      complete: function () {
        TW.finalize($("#tw-b3"), HL.b3); dotFinal();
        reveals("#b3", true); countsFinal("#b3");
      },
      reset: function () {
        TW.reset($("#tw-b3")); dotReset();
        reveals("#b3", false); countsZero("#b3");
      }
    },
    { // 4 — NETWORK
      sel: "#b4", hold: 11000,
      play: async function (ctx) {
        planCycleStart();
        await TW.run($("#tw-b4"), HL.b4, ctx);
        await revealSeq("#b4", ctx, 1200);
        countAll("#b4", 1600, ctx);
      },
      complete: function () {
        TW.finalize($("#tw-b4"), HL.b4); reveals("#b4", true);
        countsFinal("#b4"); planCycleStart();
      },
      reset: function () {
        TW.reset($("#tw-b4")); reveals("#b4", false); countsZero("#b4");
        var imgs = $all("#plan-frame .plan-img");
        imgs.forEach(function (el, i) { el.classList.toggle("active", i === 0); });
        document.getElementById("plan-chip").textContent = "Hub network";
      }
    },
    { // 5 — STREETS
      sel: "#b5", hold: 1500,
      play: async function (ctx) {
        streetShow(0, false);
        await TW.run($("#tw-b5"), HL.b5, ctx);
        for (var i = 0; i < STREETS.length; i++) {
          if (ctx.cancelled) break;
          if (i > 0) { streetShow(i, false); await sleep(700, ctx); }
          await streetPlayOne(ctx);
        }
        streetCycleStart();
      },
      complete: function () {
        TW.finalize($("#tw-b5"), HL.b5);
        streetShow(streetIdx, true);
        streetCycleStart();
      },
      reset: function () { TW.reset($("#tw-b5")); streetShow(0, false); }
    },
    { // 6 — PEOPLE
      sel: "#b6", hold: 1500,
      play: async function (ctx) {
        personaSet(0);
        await TW.run($("#tw-b6"), HL.b6, ctx);
        await revealSeq("#b6", ctx, 600);
        for (var i = 0; i < PERSONAS.length; i++) {
          if (ctx.cancelled) break;
          if (i > 0) { personaNextFaded(); await sleep(700, ctx); }
          await personaPlayOne(ctx);
        }
        personaCycleStart();
      },
      complete: function () {
        TW.finalize($("#tw-b6"), HL.b6); reveals("#b6", true);
        personaCycleStart();
      },
      reset: function () { TW.reset($("#tw-b6")); reveals("#b6", false); personaSet(0); }
    },
    { // 7 — CLOSE
      sel: "#b7", hold: 7000,
      play: async function (ctx) {
        await TW.run($("#tw-b7"), HL.b7, ctx);
        await revealSeq("#b7", ctx, 1100);
      },
      complete: function () { TW.finalize($("#tw-b7"), HL.b7); reveals("#b7", true); },
      reset: function () { TW.reset($("#tw-b7")); reveals("#b7", false); }
    },
    { // 8 — EXPLORE (hub viewer)
      sel: "#b8", hold: 0, alwaysReplay: true,
      play: async function (ctx) {
        TW.finalize($("#tw-b8"), HL.b8);
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
      complete: function () { TW.finalize($("#tw-b8"), HL.b8); },
      reset: function () { TW.reset($("#tw-b8")); }
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
    var i = nearestBeat();
    if (i === BEATS.length - 1) tour(i);   // parked on the hub → replay its tour
    else tour(i);
  }, 1000);

  /* ── go ───────────────────────────────────────────────── */
  window.scrollTo(0, 0);
  dotReset();
  setPilot(true);
  setTimeout(function () { tour(0); }, 800);
})();
