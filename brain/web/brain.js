/* <stadt.hub> brain — 3D knowledge-graph viewer.
   Vanilla IIFE, no build step. Data: window.BRAIN (data/graph.js).
   Modes: default interactive · ?kiosk=1 (auto tour, postMessage bridge) · ?debug=1 (FPS). */
(function () {
  "use strict";

  var DATA = window.BRAIN;
  if (!DATA) { document.body.innerHTML = "graph data missing — run build_graph.py"; return; }

  var params = new URLSearchParams(location.search);
  var KIOSK = params.get("kiosk") === "1";
  var DEBUG = params.get("debug") === "1";

  var ACCENT = "#E8500A";
  var ONDARK = "#F3F2EC";

  /* Monochrome steps by category — paper to deep gray, no rainbow. */
  var CAT_SHADE = {
    hub: "#F3F2EC",
    mobility: "#DDDBD2", fleet: "#DDDBD2",
    urbanism: "#C4C2B8", identity: "#C4C2B8",
    evidence: "#ABA99F",
    precedent: "#92908A", theory: "#92908A", people: "#92908A",
    process: "#7A7871", place: "#7A7871", data: "#7A7871", risk: "#7A7871"
  };
  function shade(node) { return CAT_SHADE[node.category] || "#92908A"; }

  /* ---------- lookups ---------- */
  var byId = {}, byTitle = {};
  DATA.nodes.forEach(function (n) { byId[n.id] = n; byTitle[n.title] = n; });

  var neighbors = {};   // id -> Set of ids
  DATA.nodes.forEach(function (n) { neighbors[n.id] = new Set(); });
  DATA.links.forEach(function (l) {
    neighbors[l.source] && neighbors[l.source].add(l.target);
    neighbors[l.target] && neighbors[l.target].add(l.source);
  });

  var topLabeled = new Set(
    DATA.nodes.slice().sort(function (a, b) { return b.degree - a.degree; })
      .slice(0, 30).map(function (n) { return n.id; }));

  /* ---------- state ---------- */
  var selected = null;          // node object
  var selNeighbors = new Set(); // ids incl. selected
  var hiddenCats = new Set();
  var labelExtra = new Set();   // neighborhood labels of selection

  function lid(l) { // link endpoints as ids (force-graph mutates source/target into objects)
    return [typeof l.source === "object" ? l.source.id : l.source,
            typeof l.target === "object" ? l.target.id : l.target];
  }

  /* ---------- graph ---------- */
  var el = document.getElementById("graph");
  var Graph = ForceGraph3D()(el)
    .graphData({ nodes: DATA.nodes, links: DATA.links })
    .backgroundColor("#0E0E0E")
    .showNavInfo(false)
    .nodeId("id")
    .nodeVal(function (n) { return Math.max(1, n.degree * 0.45); })
    .nodeColor(function (n) {
      if (selected) {
        if (n.id === selected.id) return ACCENT;
        if (selNeighbors.has(n.id)) return shade(n);
        return "rgba(120,119,113,0.18)";
      }
      return shade(n);
    })
    .nodeLabel(function (n) {
      return '<div style="font:12px Helvetica Neue,Helvetica,Arial,sans-serif;color:#0E0E0E;' +
        'background:#F5F4EF;padding:4px 8px;border-left:3px solid ' + ACCENT + ';">' +
        esc(n.title) + ' <span style="opacity:.55;font-size:10px;">' + n.type + "</span></div>";
    })
    .nodeThreeObjectExtend(true)
    .nodeThreeObject(function (n) {
      if (!topLabeled.has(n.id) && !labelExtra.has(n.id)) return false;
      var s = new SpriteText(n.title);
      s.color = (selected && n.id === selected.id) ? ACCENT : ONDARK;
      s.textHeight = topLabeled.has(n.id) ? Math.min(6, 2.6 + n.degree * 0.07) : 2.6;
      s.fontFace = "Helvetica Neue, Helvetica, Arial, sans-serif";
      s.material.depthWrite = false;
      s.center.y = -0.9;
      return s;
    })
    .linkColor(function (l) {
      var ab = lid(l);
      if (selected && (selNeighbors.has(ab[0]) && selNeighbors.has(ab[1])) &&
          (ab[0] === selected.id || ab[1] === selected.id)) return "rgba(232,80,10,0.75)";
      if (selected) return "rgba(243,242,236,0.05)";
      return "rgba(243,242,236,0.14)";
    })
    .linkWidth(function (l) {
      var ab = lid(l);
      if (selected && (ab[0] === selected.id || ab[1] === selected.id)) return 1.1;
      return 0;
    })
    .nodeVisibility(function (n) { return !hiddenCats.has(n.category); })
    .linkVisibility(function (l) {
      var ab = lid(l);
      var a = byId[ab[0]], b = byId[ab[1]];
      return a && b && !hiddenCats.has(a.category) && !hiddenCats.has(b.category);
    })
    .warmupTicks(80)
    .cooldownTicks(220)
    .onNodeClick(function (n) { select(n, true); })
    .onBackgroundClick(function () { deselect(); });

  Graph.d3Force("charge").strength(-42);

  /* ---------- selection ---------- */
  function restyle() {
    Graph.nodeColor(Graph.nodeColor());
    Graph.linkColor(Graph.linkColor());
    Graph.linkWidth(Graph.linkWidth());
    Graph.nodeThreeObject(Graph.nodeThreeObject());
  }

  function select(n, fly) {
    selected = n;
    selNeighbors = new Set(neighbors[n.id]);
    selNeighbors.add(n.id);
    labelExtra = new Set(selNeighbors);
    restyle();
    openPanel(n);
    if (fly !== false) flyTo(n);
    hideHint();
  }

  function deselect() {
    if (!selected) return;
    selected = null;
    selNeighbors = new Set();
    labelExtra = new Set();
    restyle();
    closePanel();
  }

  function flyTo(n) {
    var d = 130;
    var r = 1 + d / Math.max(1, Math.hypot(n.x || 1, n.y || 1, n.z || 1));
    Graph.cameraPosition(
      { x: (n.x || 1) * r, y: (n.y || 1) * r, z: (n.z || 1) * r }, n, 1400);
  }

  /* ---------- panel ---------- */
  var panel = document.getElementById("panel");
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  function wikify(md) {
    return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, target, alias) {
      var t = target.trim();
      var node = byTitle[t];
      var label = esc(alias || t);
      if (!node) return label;
      return '<a class="wl" data-id="' + node.id + '">' + label + "</a>";
    });
  }

  function openPanel(n) {
    document.getElementById("panel-chips").innerHTML =
      '<span class="pchip accent">' + esc(n.type) + "</span>" +
      '<span class="pchip">' + esc(n.category) + "</span>" +
      '<span class="pchip conf-' + esc(n.confidence) + '">confidence: ' + esc(n.confidence) + "</span>";
    document.getElementById("panel-title").textContent = n.title;

    var body = n.body.replace(/^#\s.*$/m, "").trim(); // drop the H1, panel has its own
    document.getElementById("panel-body").innerHTML = marked.parse(wikify(body));

    var conns = [];
    DATA.links.forEach(function (l) {
      var ab = lid(l);
      if (ab[0] === n.id && l.rel !== "mentions") {
        var t = byId[ab[1]];
        if (t) conns.push('<div class="conn"><span class="rel">' + esc(l.rel) +
          ' <span class="dir">&rarr;</span></span> <a class="wl" data-id="' + t.id + '">' +
          esc(t.title) + "</a></div>");
      } else if (ab[1] === n.id && l.rel !== "mentions") {
        var s = byId[ab[0]];
        if (s) conns.push('<div class="conn"><span class="rel">' + esc(l.rel) +
          ' <span class="dir">&larr;</span></span> <a class="wl" data-id="' + s.id + '">' +
          esc(s.title) + "</a></div>");
      }
    });
    document.getElementById("panel-connections").innerHTML =
      conns.length ? "<h2>connections</h2>" + conns.join("") : "";

    var srcs = (n.source || []).map(function (s) {
      return '<div class="src">' + (/^https?:\/\//.test(s)
        ? '<a href="' + esc(s) + '" target="_blank" rel="noopener">' + esc(s) + "</a>"
        : esc(s)) + "</div>";
    });
    document.getElementById("panel-sources").innerHTML =
      srcs.length ? "<h2>sources</h2>" + srcs.join("") : "";

    panel.classList.remove("hidden");
    panel.scrollTop = 0;
  }

  function closePanel() { panel.classList.add("hidden"); }
  document.getElementById("panel-close").addEventListener("click", deselect);
  panel.addEventListener("click", function (e) {
    var a = e.target.closest(".wl");
    if (a && a.dataset.id && byId[a.dataset.id]) select(byId[a.dataset.id], true);
  });

  /* ---------- search ---------- */
  var searchEl = document.getElementById("search");
  var resultsEl = document.getElementById("results");
  var matches = [];

  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) { resultsEl.classList.remove("open"); resultsEl.innerHTML = ""; matches = []; return; }
    var starts = [], contains = [];
    DATA.nodes.forEach(function (n) {
      var t = n.title.toLowerCase();
      if (t.startsWith(q)) starts.push(n);
      else if (t.includes(q) || (n.tags || []).some(function (g) { return g.includes(q); }))
        contains.push(n);
    });
    matches = starts.concat(contains).slice(0, 12);
    resultsEl.innerHTML = matches.map(function (n, i) {
      return '<div class="result' + (i === 0 ? " active" : "") + '" data-id="' + n.id + '">' +
        "<span>" + esc(n.title) + "</span><span class='rtype'>" + n.type + "</span></div>";
    }).join("");
    resultsEl.classList.toggle("open", matches.length > 0);
  }

  searchEl.addEventListener("input", function () { doSearch(searchEl.value); });
  searchEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && matches.length) {
      select(matches[0], true);
      resultsEl.classList.remove("open");
      searchEl.blur();
    } else if (e.key === "Escape") {
      resultsEl.classList.remove("open"); searchEl.blur();
    }
  });
  resultsEl.addEventListener("mousedown", function (e) {
    var r = e.target.closest(".result");
    if (r && byId[r.dataset.id]) {
      select(byId[r.dataset.id], true);
      resultsEl.classList.remove("open");
      searchEl.value = "";
    }
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#searchbox")) resultsEl.classList.remove("open");
  });

  /* ---------- category chips ---------- */
  var chipsEl = document.getElementById("chips");
  var cats = Object.keys(DATA.meta.categories).sort(function (a, b) {
    return DATA.meta.categories[b] - DATA.meta.categories[a];
  });
  chipsEl.innerHTML = cats.map(function (c) {
    return '<span class="chip on" data-cat="' + c + '">' + c + " " + DATA.meta.categories[c] + "</span>";
  }).join("");
  chipsEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    var c = chip.dataset.cat;
    if (hiddenCats.has(c)) { hiddenCats.delete(c); chip.classList.add("on"); }
    else { hiddenCats.delete(c); hiddenCats.add(c); chip.classList.remove("on"); }
    Graph.nodeVisibility(Graph.nodeVisibility());
    Graph.linkVisibility(Graph.linkVisibility());
  });

  /* ---------- stats ---------- */
  document.getElementById("stats").textContent =
    DATA.meta.nodes + " notes · " + DATA.meta.links + " edges · built " +
    String(DATA.meta.built).slice(0, 10);

  /* ---------- hint ---------- */
  var hintGone = false;
  function hideHint() {
    if (hintGone) return;
    hintGone = true;
    document.getElementById("hint").classList.add("gone");
  }
  setTimeout(hideHint, 12000);

  /* ---------- debug FPS ---------- */
  if (DEBUG) {
    var fpsEl = document.getElementById("fps");
    fpsEl.classList.remove("hidden");
    var frames = 0, last = performance.now();
    (function loop() {
      frames++;
      var now = performance.now();
      if (now - last >= 1000) {
        fpsEl.textContent = frames + " fps";
        frames = 0; last = now;
      }
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- kiosk mode ---------- */
  var paused = false;

  function post(type) {
    try { window.parent.postMessage({ type: type }, "*"); } catch (e) { /* standalone */ }
  }

  if (KIOSK) {
    document.getElementById("hint").textContent = "touch to explore the brain";

    var TOUR = [
      "home",
      "from-parking-city-to-hub-city",
      "wolfsburg-highest-car-density",
      "vw-shift-wave",
      "fleet",
      "hub-toolpalette",
      "moia",
      "project-brain"
    ].filter(function (id) { return byId[id]; });

    var tourIdx = -1, tourTimer = null, orbitTimer = null, orbitAngle = 0;
    var touring = false;

    function startOrbit() {
      stopOrbit();
      orbitTimer = setInterval(function () {
        if (paused || selected) return;
        orbitAngle += 0.00035;
        var d = 620;
        Graph.cameraPosition({
          x: d * Math.sin(orbitAngle), y: 90, z: d * Math.cos(orbitAngle)
        });
      }, 40);
    }
    function stopOrbit() { if (orbitTimer) { clearInterval(orbitTimer); orbitTimer = null; } }

    function tourStep() {
      if (paused || !touring) return;
      tourIdx++;
      if (tourIdx >= TOUR.length) {
        post("brain-cycle-complete");
        tourIdx = -1;
        deselect();
        startOrbit();
        tourTimer = setTimeout(tourStep, 9000);
        return;
      }
      stopOrbit();
      select(byId[TOUR[tourIdx]], true);
      tourTimer = setTimeout(tourStep, 9000);
    }

    function startTour() {
      touring = true;
      tourIdx = -1;
      startOrbit();
      tourTimer = setTimeout(tourStep, 4500);
    }
    function stopTour() {
      touring = false;
      if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
      stopOrbit();
    }

    /* any input hands control to the visitor */
    var interacted = false;
    function onInteract() {
      if (interacted) return;
      interacted = true;
      stopTour();
      post("embed-interaction");
    }
    ["pointerdown", "wheel", "keydown", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, onInteract, { passive: true });
    });

    window.addEventListener("message", function (e) {
      var t = e.data && e.data.type;
      if (t === "brain-kiosk-start") { interacted = false; deselect(); startTour(); }
      else if (t === "brain-kiosk-stop") { stopTour(); deselect(); }
      else if (t === "brain-pause") { paused = true; Graph.pauseAnimation(); }
      else if (t === "brain-resume") {
        if (paused) { paused = false; Graph.resumeAnimation(); }
        if (!touring && !interacted) startTour();
      }
    });

    startTour();
  } else {
    /* standalone: honor pause/resume too (harmless without a host) */
    window.addEventListener("message", function (e) {
      var t = e.data && e.data.type;
      if (t === "brain-pause") { paused = true; Graph.pauseAnimation(); }
      else if (t === "brain-resume" && paused) { paused = false; Graph.resumeAnimation(); }
    });
  }
})();
