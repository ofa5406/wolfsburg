/* ─────────────────────────────────────────────────────────────
   typewriter.js — the deck's "invisible presenter".
   Types headlines character by character with human pacing:
   variable delays, brief hesitations, scripted typo→fix moments.
   After typing it "draws" emphasis (underline / bold) on key phrases.

   API (window.TW):
     TW.prep(el)               wrap element so it is ready for typing
     TW.run(el, spec, ctx)     animate; resolves when finished.
                               ctx = { cancelled } — checked between steps;
                               when cancelled, the final state is applied instantly.
     TW.finalize(el, spec)     jump straight to the final, emphasised state
     TW.reset(el)              clear back to empty

   spec = {
     ops: [ {t:"text"} | {typo:{wrong:"…", fix:"…"}} | {pause:ms} ],
     emphasize: [ {phrase:"…", kind:"underline"|"bold"} ]   // optional
   }
   Typos are AUTHORED per headline (deterministic) — the presenter
   never improvises a mistake.
─────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var PUNCT_PAUSE = 240;      // extra ms after . , — ? ! :
  var HESITATE_CHANCE = 0.03; // small chance of a thinking pause on a space
  var BACKSPACE_MS = 48;

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function toHtml(s) { return esc(s).replace(/\n/g, "<br>"); }

  function sleep(ms, ctx) {
    return new Promise(function (res) {
      var t0 = performance.now();
      (function tick() {
        if (ctx && ctx.cancelled) return res();
        if (performance.now() - t0 >= ms) return res();
        setTimeout(tick, 40);
      })();
    });
  }

  function charDelay(ch) {
    var d = 34 + Math.random() * 50;
    if (".,—?!:".indexOf(ch) !== -1) d += PUNCT_PAUSE;
    if (ch === " " && Math.random() < HESITATE_CHANCE) d += 260;
    return d;
  }

  function prep(el) {
    if (el._tw) return el._tw;
    el.innerHTML = '<span class="tw-text"></span><span class="tw-caret"></span>';
    el._tw = {
      textEl: el.querySelector(".tw-text"),
      caretEl: el.querySelector(".tw-caret"),
      buf: ""
    };
    return el._tw;
  }

  function render(tw) { tw.textEl.innerHTML = toHtml(tw.buf); }

  function finalText(spec) {
    var s = "";
    (spec.ops || []).forEach(function (op) {
      if (op.t) s += op.t;
      else if (op.typo) s += op.typo.fix;
    });
    return s;
  }

  /* Build the final HTML with emphasis spans wrapped around each phrase
     (first occurrence). Works on the plain final text, then escapes. */
  function emphasizedHtml(spec) {
    var text = finalText(spec);
    var marks = spec.emphasize || [];
    // collect (start, end, kind) ranges, first occurrence each, non-overlapping
    var ranges = [];
    marks.forEach(function (m) {
      var i = text.indexOf(m.phrase);
      if (i === -1) return;
      var clash = ranges.some(function (r) { return i < r.end && i + m.phrase.length > r.start; });
      if (!clash) ranges.push({ start: i, end: i + m.phrase.length, kind: m.kind || "underline" });
    });
    ranges.sort(function (a, b) { return a.start - b.start; });
    var out = "", pos = 0;
    ranges.forEach(function (r) {
      out += toHtml(text.slice(pos, r.start));
      out += '<span class="em em--' + r.kind + '">' + toHtml(text.slice(r.start, r.end)) + "</span>";
      pos = r.end;
    });
    out += toHtml(text.slice(pos));
    return out;
  }

  function applyEmphasisInstant(el, spec) {
    var tw = prep(el);
    tw.buf = finalText(spec);
    tw.textEl.innerHTML = emphasizedHtml(spec);
    Array.prototype.forEach.call(tw.textEl.querySelectorAll(".em"), function (s) {
      s.classList.add("on");
    });
  }

  async function applyEmphasisAnimated(el, spec, ctx) {
    var tw = prep(el);
    tw.textEl.innerHTML = emphasizedHtml(spec);
    var spans = tw.textEl.querySelectorAll(".em");
    for (var i = 0; i < spans.length; i++) {
      if (ctx && ctx.cancelled) { spans[i].classList.add("on"); continue; }
      await sleep(420, ctx);
      spans[i].classList.add("on");
    }
  }

  async function typeStr(tw, str, ctx) {
    for (var i = 0; i < str.length; i++) {
      if (ctx && ctx.cancelled) { tw.buf += str.slice(i); render(tw); return; }
      tw.buf += str[i];
      render(tw);
      await sleep(charDelay(str[i]), ctx);
    }
  }

  async function backspace(tw, n, ctx) {
    for (var i = 0; i < n; i++) {
      if (ctx && ctx.cancelled) return;
      tw.buf = tw.buf.slice(0, -1);
      render(tw);
      await sleep(BACKSPACE_MS, ctx);
    }
  }

  async function run(el, spec, ctx) {
    var tw = prep(el);
    tw.buf = "";
    render(tw);
    el.classList.add("typing");
    tw.caretEl.classList.remove("off");

    for (var k = 0; k < (spec.ops || []).length; k++) {
      if (ctx && ctx.cancelled) break;
      var op = spec.ops[k];
      if (op.t) {
        await typeStr(tw, op.t, ctx);
      } else if (op.typo) {
        await typeStr(tw, op.typo.wrong, ctx);
        await sleep(380, ctx);                     // …notice the mistake
        if (!(ctx && ctx.cancelled)) {
          await backspace(tw, op.typo.wrong.length, ctx);
          await sleep(160, ctx);
          await typeStr(tw, op.typo.fix, ctx);
        }
      } else if (op.pause) {
        await sleep(op.pause, ctx);
      }
    }

    if (ctx && ctx.cancelled) { finalize(el, spec); return; }

    await sleep(320, ctx);
    await applyEmphasisAnimated(el, spec, ctx);    // the caret "draws" the emphasis
    await sleep(500, ctx);
    tw.caretEl.classList.add("off");
    el.classList.remove("typing");
  }

  function finalize(el, spec) {
    var tw = prep(el);
    applyEmphasisInstant(el, spec);
    tw.caretEl.classList.add("off");
    el.classList.remove("typing");
  }

  function reset(el) {
    var tw = prep(el);
    tw.buf = "";
    tw.textEl.innerHTML = "";
    tw.caretEl.classList.remove("off");
  }

  window.TW = { prep: prep, run: run, finalize: finalize, reset: reset };
})();
