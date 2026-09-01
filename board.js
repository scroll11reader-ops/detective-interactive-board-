/* ==================================================================
   DE TECH TIVE — EVIDENCE BOARD  ·  ENGINE
   Builds the board, the string, the case pages and the scaling.
   You do not need to edit this file to add or remove papers —
   that all happens in content.js. See GUIDE.md.
   ================================================================== */

(function () {
  'use strict';

  /* The board is drawn at this size, then scaled to fit the screen.
     If you change these, change --board-w / --board-h in style.css
     to match. */
  var BOARD_W = 1440;
  var BOARD_H = 980;

  /* Below this width (or height) the pinned board becomes a
     scrolling column of cards instead. */
  var STACK_BELOW_W = 1024;
  var STACK_BELOW_H = 620;

  /* How large the board is allowed to get. The board is drawn as real
     text and vector shapes, so it stays sharp at any size — 8 is high
     enough for an 8K wall and simply never gets reached on a laptop. */
  var MAX_SCALE = 8;

  /* Televisions crop a few percent off every edge (overscan). This
     keeps the board inside the part of the picture that always shows.
     Set it to 1 if you are only ever on monitors. */
  var SAFE_AREA = 0.96;

  var DEFAULT_W = 256;
  var DEFAULT_H = 206;
  var TILTS = [-3.2, 2.4, -1.8, 3.4, 2.6, -3, 1.9, -5, -2.2, 3.1, -4, 1.4];

  /* ---------- placement ------------------------------------------
     Any paper without x / y gets the emptiest spot on the board.
     If the board is crowded it shrinks the paper until it fits.
     ---------------------------------------------------------------- */
  function place(list) {
    var PAD_X = 34, PAD_Y = 46;
    /* the masthead and the handwritten legend are obstacles too */
    var set = [
      { x: 62, y: 44, w: 430, h: 124 },
      { x: 1180, y: 50, w: 208, h: 72 }
    ];

    list.forEach(function (p, i) {
      p.w = p.w || DEFAULT_W;
      p.h = p.h || DEFAULT_H;
      if (typeof p.rot !== 'number') p.rot = TILTS[i % TILTS.length];
      if (typeof p.x === 'number' && typeof p.y === 'number') { set.push(p); return; }

      function search(w, h) {
        var best = null;
        for (var y = 108; y <= BOARD_H - h - 28; y += 20) {
          for (var x = 70; x <= BOARD_W - w - 50; x += 20) {
            var overlap = 0;
            for (var k = 0; k < set.length; k++) {
              var q = set[k];
              var ox = Math.min(x + w + PAD_X, q.x + q.w + PAD_X) - Math.max(x - PAD_X, q.x - PAD_X);
              var oy = Math.min(y + h + PAD_Y, q.y + q.h + PAD_Y) - Math.max(y - PAD_Y, q.y - PAD_Y);
              if (ox > 0 && oy > 0) overlap += ox * oy;
            }
            var pull = Math.abs(x + w / 2 - BOARD_W / 2) + Math.abs(y + h / 2 - BOARD_H / 2);
            var cost = overlap * 200 + pull;
            if (!best || cost < best.cost) best = { x: x, y: y, w: w, h: h, cost: cost, overlap: overlap };
          }
        }
        return best;
      }

      var scales = [1, 0.86, 0.74, 0.62, 0.52], fit = null;
      for (var s = 0; s < scales.length; s++) {
        var got = search(Math.max(158, Math.round(p.w * scales[s])),
                         Math.max(126, Math.round(p.h * scales[s])));
        if (!got) continue;
        if (!fit || got.overlap < fit.overlap) fit = got;
        if (got.overlap === 0) break;
      }
      p.x = fit.x; p.y = fit.y; p.w = fit.w; p.h = fit.h;
      if (fit.overlap > 0 && window.console) {
        console.warn('Evidence board: "' + p.id + '" had no clear space left — give it its own x / y in content.js.');
      }
      set.push(p);
    });
    return list;
  }

  /* ---------- red string ------------------------------------------ */
  function pinOf(p) { return { x: p.x + p.w / 2, y: p.y + 12 }; }

  function stringPairs(list) {
    var known = {}, seen = {}, out = [];
    list.forEach(function (p) { known[p.id] = true; });
    list.forEach(function (p) {
      (p.links || []).forEach(function (to) {
        if (!known[to] || to === p.id) return;
        var key = [p.id, to].sort().join('|');
        if (seen[key]) return;
        seen[key] = true;
        out.push([p.id, to]);
      });
    });
    return out;
  }

  /* a hanging curve, so the string sags instead of running straight */
  function curve(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var steep = Math.abs(dy) > Math.abs(dx);
    var cx = (a.x + b.x) / 2 + (steep ? len * 0.09 : 0);
    var cy = (a.y + b.y) / 2 + (steep ? len * 0.04 : 12 + len * 0.1);
    return 'M' + a.x + ',' + a.y + ' Q' + Math.round(cx) + ',' + Math.round(cy) + ' ' + b.x + ',' + b.y;
  }

  function stringsSVG(list) {
    var by = {};
    list.forEach(function (p) { by[p.id] = p; });
    var paths = stringPairs(list).map(function (pair) {
      return { d: curve(pinOf(by[pair[0]]), pinOf(by[pair[1]])), a: pair[0], b: pair[1] };
    });
    var shade = paths.map(function (p) { return '<path class="str-sh" d="' + p.d + '"></path>'; }).join('');
    var line = paths.map(function (p) {
      return '<path class="str s-' + p.a + ' s-' + p.b + '" d="' + p.d + '"></path>';
    }).join('');
    return '<svg class="strings" viewBox="0 0 ' + BOARD_W + ' ' + BOARD_H + '" preserveAspectRatio="none" aria-hidden="true">' +
           '<g>' + shade + '</g><g>' + line + '</g></svg>';
  }

  /* ---------- markup ---------------------------------------------- */
  function paperHTML(p) {
    var face = p.face || (
      (p.n ? '<span class="caseno">Case ' + p.n + '</span>' : '') +
      '<h2 class="ptitle">' + p.title + '</h2>' +
      (p.dek ? '<p class="pdek">' + p.dek + '</p>' : '') +
      (p.extra || '') +
      (p.meta ? '<div class="pmeta">' + p.meta + '</div>' : ''));
    return '<a href="#' + p.id + '" class="paper ' + (p.look || '') + '" data-id="' + p.id + '"' +
      ' role="link" tabindex="0" style="left:' + p.x + 'px;top:' + p.y + 'px;width:' + p.w +
      'px;height:' + p.h + 'px;transform:rotate(' + p.rot + 'deg);">' +
      '<span class="tack"></span>' +
      '<span class="tag">Open file ' + (p.n || '') + ' · ' + p.title + '</span>' +
      '<div class="sheet">' + face + '</div></a>';
  }

  /* a paper with no tabs is treated as one unnamed tab, so the two
     cases share exactly the same markup below */
  function tabsOf(p) {
    if (p.tabs && p.tabs.length) return p.tabs;
    return [{ label: p.title, title: p.title, lede: p.lede, body: p.body,
              aside: p.aside, note: p.note }];
  }

  function panelHTML(p, t, i) {
    var aside = t.aside
      ? '<div class="aside"><h4>' + t.aside.title + '</h4><ul class="facts">' +
        t.aside.facts.map(function (f) {
          return '<li><span>' + f[0] + '</span><b>' + f[1] + '</b></li>';
        }).join('') + '</ul></div>'
      : '';
    var note = t.note ? '<p class="margin-note">' + t.note + '</p>' : '';
    return '<div class="fpanel fp-' + p.id + '-' + i + '">' +
      '<span class="fno">Case File ' + (p.n || '') + '</span>' +
      '<h1>' + (t.title || t.label) + '</h1>' +
      (t.lede ? '<p class="flede">' + t.lede + '</p>' : '') +
      '<div class="rule"></div>' +
      '<div class="fbody"><div>' + t.body + '</div><div>' + aside + note + '</div></div>' +
      '</div>';
  }

  function caseHTML(p) {
    var tabs = tabsOf(p);
    var multi = tabs.length > 1;
    var radios = '', strip = '';
    if (multi) {
      /* deliberately no "checked" attribute: the first tab is opened by
         a plain CSS rule instead, so the file still shows its contents
         anywhere the radio state does not survive */
      radios = tabs.map(function (t, i) {
        return '<input class="ftab-radio" type="radio" name="tabs-' + p.id +
          '" id="tab-' + p.id + '-' + i + '">';
      }).join('');
      strip = '<div class="ftabs">' + tabs.map(function (t, i) {
        return '<label class="ftab" for="tab-' + p.id + '-' + i + '">' + t.label + '</label>';
      }).join('') + '</div>';
    }
    return '<section class="view case" id="' + p.id + '">' +
      '<div class="filewrap' + (multi ? ' has-tabs' : '') + '">' +
      '<a href="#board" class="tape-back">← back to the board</a>' +
      radios + strip +
      '<div class="folder">' +
      '<article class="file">' +
      '<span class="tack tack-l"></span><span class="tack tack-r"></span>' +
      '<span class="stamp">File ' + (p.n || '') + ' · Open</span>' +
      '<div class="fpanels' + (multi ? ' multi' : '') + '">' +
      tabs.map(function (t, i) { return panelHTML(p, t, i); }).join('') +
      '</div></article></div></div></section>';
  }

  /* one rule per paper: which page it shows, which strings light up */
  function genCSS(list) {
    var views = list.map(function (p) { return '.app[data-view="' + p.id + '"] #' + p.id; }).join(',');
    var hot = list.map(function (p) { return '.board:has([data-id="' + p.id + '"]:hover) .s-' + p.id; }).join(',');
    var css = views + '{display:block}\n' +
      hot + '{opacity:1;stroke:var(--red-hot);stroke-width:3.6;filter:drop-shadow(0 0 7px rgba(255,92,56,.75))}\n';

    /* One set of rules per folder tab. The first tab is opened by a
       plain class rule, not by a checked radio, so a case file always
       shows its contents even where the radio state is not kept.
       Checking any later tab then shows that one and closes the first. */
    var OPEN = 'background:linear-gradient(168deg,var(--manila-1),var(--manila-2));' +
      'color:var(--red-deep);transform:translateY(0);z-index:2;' +
      'box-shadow:inset 0 1px 0 rgba(255,250,232,.75),0 -8px 18px -10px rgba(0,0,0,.45);' +
      'cursor:default';
    var SHUT = 'background:linear-gradient(178deg,#dcc79a,#c9b183);color:#6d5c3e;' +
      'transform:translateY(6px);z-index:0;' +
      'box-shadow:inset 0 1px 0 rgba(255,250,232,.55),0 -4px 12px -6px rgba(0,0,0,.55);' +
      'cursor:pointer';
    var SLIDE = 'display:block;animation:panel-in .34s cubic-bezier(.22,.72,.26,1) both';

    list.forEach(function (p) {
      var tabs = tabsOf(p);
      if (tabs.length < 2) return;
      var id = p.id;

      css += '.fpanels.multi .fp-' + id + '-0{display:block}\n';
      css += '.ftabs label[for="tab-' + id + '-0"]{' + OPEN + '}\n';

      tabs.forEach(function (t, i) {
        var sel = '#tab-' + id + '-' + i;
        css += sel + ':checked ~ .folder .fp-' + id + '-' + i + '{' + SLIDE + '}\n';
        css += sel + ':checked ~ .ftabs label[for="tab-' + id + '-' + i + '"]{' + OPEN + '}\n';
        css += sel + ':focus-visible ~ .ftabs label[for="tab-' + id + '-' + i + '"]' +
          '{outline:2px solid var(--red-hot);outline-offset:2px}\n';
        if (i > 0) {
          css += sel + ':checked ~ .folder .fp-' + id + '-0{display:none}\n';
          css += sel + ':checked ~ .ftabs label[for="tab-' + id + '-0"]:not(:hover){' + SHUT + '}\n';
        }
      });
    });
    return css;
  }

  function render(list) {
    return '<style id="gen">' + genCSS(list) + '</style>' +
      '<div class="grain"></div>' +
      '<div class="stage">' +
      '<section class="view board-view" id="board"><div class="board">' +
      '<div class="masthead"><h1>' + TEAM.name + '</h1><p>' + TEAM.sub + '</p></div>' +
      '<div class="legend">' + TEAM.legend + '</div>' +
      stringsSVG(list) +
      '<div class="papers">' + list.map(paperHTML).join('') + '</div>' +
      '</div></section>' +
      list.map(caseHTML).join('') +
      '</div>';
  }

  /* ---------- boot ------------------------------------------------- */
  var papers = place(PAPERS);
  var app = document.querySelector('.app');
  app.innerHTML = render(papers);

  var ids = ['board'].concat(papers.map(function (p) { return p.id; }));

  function route() {
    var id = (location.hash || '#board').slice(1);
    if (ids.indexOf(id) === -1) id = 'board';
    app.setAttribute('data-view', id);
    var v = document.getElementById(id);
    if (v && v.classList.contains('case')) v.scrollTop = 0;
    if (document.documentElement.getAttribute('data-mode') === 'stack') window.scrollTo(0, 0);
  }

  /* ---------- scaling ----------------------------------------------
     The cork fills the screen edge to edge, whatever shape the screen
     is. The board sits on top of it at a fixed 1440 x 980 and is
     scaled to the largest size that still shows all of it, then
     centred. Nothing is cropped, nothing is letterboxed against a
     black bar, and it re-measures on every resize, rotate, fullscreen
     and display change — so it is correct at any size, at any moment.

     Narrow or short screens switch to stacked mode instead, which is
     an ordinary scrolling page.
     ------------------------------------------------------------------ */
  var stage = app.querySelector('.stage');

  function fit() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var stack = vw < STACK_BELOW_W || vh < STACK_BELOW_H;
    document.documentElement.setAttribute('data-mode', stack ? 'stack' : 'canvas');
    if (stack) {
      stage.style.transform = '';
      return;
    }
    var s = Math.min(vw / BOARD_W, vh / BOARD_H) * SAFE_AREA;
    if (s > MAX_SCALE) s = MAX_SCALE;
    stage.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
  }

  var pending = null;
  function onResize() {
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(fit);
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  window.addEventListener('fullscreenchange', onResize);
  window.addEventListener('pageshow', onResize);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', onResize);
  /* catches display changes a resize event can miss — a TV waking up,
     a browser moved to a second screen, a set-top box changing mode */
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(document.documentElement);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);

  route();
  fit();
})();
