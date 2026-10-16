/*
 * Afaque Jaya — portfolio behaviour.
 * Vanilla JS, no dependencies. Motion uses transform/opacity only, scroll work
 * is batched into one requestAnimationFrame, and everything degrades to a
 * fully visible static page without JS or with prefers-reduced-motion.
 */
(function () {
  'use strict';

  var doc = document.documentElement;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceMQ.matches;
  var data = window.PORTFOLIO || { featured: [], more: [] };

  /* ------------------------------------------------------------------ */
  /* Small helpers                                                       */
  /* ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.2 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.2-9.4-9.2-9.4Zm10.4 8.2 2.6-2.7L6.1 1.8c-.4-.2-.8-.3-1.1-.2l9.6 9.2Zm0 2.4L5 22.4c.3.1.7 0 1.1-.2l11.1-6.3-2.6-2.7Zm6-3.6-2.5-1.4-2.9 2.8 2.9 2.8 2.5-1.4c.8-.5.8-2.3 0-2.8Z"/></svg>',
    ios: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.5 2-3.7 2.1-3.7-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.9-1.7 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-3.7ZM14 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>'
  };
  var STORE = {
    play: { small: 'Get it on', label: 'Google Play' },
    ios: { small: 'Download on the', label: 'App Store' }
  };

  /* ------------------------------------------------------------------ */
  /* Render: featured apps                                               */
  /* ------------------------------------------------------------------ */
  function shot(s, eager) {
    var img = '<img class="shot" src="' + esc(s.src) + '" width="' + s.w + '" height="' + s.h +
      '" alt="' + esc(s.alt) + '" decoding="async"' + (eager ? '' : ' loading="lazy"') + '>';
    var ar = 'style="--ar:' + s.w + ' / ' + s.h + '"';
    return s.kind === 'ui'
      ? '<div class="phone"><div class="screen" ' + ar + '>' + img + '</div></div>'
      : '<div class="card" ' + ar + '>' + img + '</div>';
  }

  function renderApps() {
    var track = $('#apps-track');
    var index = $('#app-index');
    if (!track || !data.featured.length) return;
    var total = data.featured.length + $$('.hcard', track).length;
    var slots = [
      { cls: 's-main', d: '0s' },
      { cls: 's-left', d: '.12s' },
      { cls: 's-right', d: '.22s' }
    ];

    var html = data.featured.map(function (a, i) {
      var n = String(i + 1).padStart(2, '0');
      var stage = a.screens.slice(0, 3).map(function (s, j) {
        var sl = slots[j];
        return '<figure class="slot ' + sl.cls + '">' +
          // Every screen sits in a phone frame here, store panels included.
          '<div class="enter" style="--d:' + sl.d + '"><div class="tilt">' + shot({ src: s.src, w: s.w, h: s.h, alt: s.alt, kind: 'ui' }, false) + '</div></div></figure>';
      }).join('');

      var links = a.links.map(function (l) {
        var st = STORE[l.store];
        return '<a class="store" href="' + esc(l.url) + '" target="_blank" rel="noopener" aria-label="' +
          esc(a.name) + ' on ' + st.label + '">' + ICONS[l.store] +
          '<span><small>' + st.small + '</small>' + st.label + '</span></a>';
      }).join('');

      return '' +
        '<article class="hcard app-card" id="app-' + a.id + '" style="--app:' + a.accent + '" aria-labelledby="app-' + a.id + '-name">' +
          '<div class="hcard-media"><div class="hstage" data-stage>' + stage + '</div></div>' +
          '<div class="hcard-copy">' +
            '<div class="app-meta-top"><span class="idx">' + n + ' / ' + String(total).padStart(2, '0') + '</span><span class="bar"></span><span>' + esc(a.kind.split(' · ')[1] || '') + '</span></div>' +
            '<div class="app-title">' +
              '<img class="app-icon" src="' + esc(a.icon) + '" width="64" height="64" alt="" loading="lazy" decoding="async">' +
              '<h3 class="hcard-name" id="app-' + a.id + '-name">' + esc(a.name) + '<span class="kind">' + esc(a.kind) + '</span></h3>' +
            '</div>' +
            '<p class="app-summary">' + esc(a.summary) + '</p>' +
            '<dl class="app-facts">' +
              '<div><dt>The problem</dt><dd>' + esc(a.problem) + '</dd></div>' +
              '<div><dt>My part</dt><dd>' + esc(a.role) + '</dd></div>' +
            '</dl>' +
            '<div class="app-stack">' + a.tags.map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
            '<div class="app-bottom">' +
              '<p class="app-metric"><b>' + esc(a.metric.value) + '</b><span>' + esc(a.metric.label) + '</span></p>' +
              '<div class="store-links">' + links + '</div>' +
            '</div>' +
            (a.note ? '<p class="app-note">' + esc(a.note) + '</p>' : '') +
          '</div>' +
        '</article>';
    }).join('');
    track.insertAdjacentHTML('afterbegin', html);

    if (index) {
      var cards = $$('.hcard', track);
      index.innerHTML = cards.map(function (c) {
        var name = ($('.hcard-name', c) || c).firstChild.textContent.trim();
        var icon = $('.app-icon', c);
        var src = icon ? icon.getAttribute('src') : c.getAttribute('data-icon');
        var pic = src === 'grid'
          ? '<span class="ix-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>'
          : src ? '<img src="' + esc(src) + '" width="28" height="28" alt="" decoding="async">' : '<span class="ix-dot" aria-hidden="true"></span>';
        return '<a href="#' + c.id + '">' + pic + esc(c.getAttribute('data-short') || name) + '</a>';
      }).join('');
    }
  }

  function renderMore() {
    var box = $('#more-apps');
    if (!box) return;
    box.innerHTML = data.more.filter(function (m) { return !m.featuredElsewhere; }).map(function (m) {
      var icon = m.icon
        ? '<img src="' + esc(m.icon) + '" width="52" height="52" alt="" loading="lazy" decoding="async">'
        : '<span class="mono" aria-hidden="true">' + esc(m.monogram || m.name[0]) + '</span>';
      var inner = icon + '<span class="t"><b>' + esc(m.name) + '</b><span>' + esc(m.line) + '</span><span class="where">' + esc(m.where) + '</span></span>';
      return m.url
        ? '<a class="more-item" href="' + esc(m.url) + '" target="_blank" rel="noopener">' + inner + '<span class="go">' + ICONS.arrow + '</span></a>'
        : '<div class="more-item">' + inner + '</div>';
    }).join('');
  }

  /* Logo strip: one list rendered twice for a seamless CSS marquee */
  function renderLogos() {
    var track = $('#logo-track');
    var list = data.logos || [];
    if (!track || !list.length) return;
    function item(l, hidden) {
      var img = l.img
        ? '<img src="' + esc(l.img) + '" alt="" height="40"' + (l.square ? ' class="square" width="40"' : l.wide ? ' class="wide"' : '') + ' loading="lazy" decoding="async">'
        : '';
      var mark = l.img
        ? (l.tile ? '<span class="logo-tile" style="background:' + esc(l.tile) + '">' + img + '</span>' : img)
        : '<span class="wordmark-tile" style="--lc:' + esc(l.color || '#121110') + '">' + esc(l.mono || l.name) + '</span>';
      var inner = mark + '<span class="lt"><b>' + esc(l.name) + '</b><span>' + esc(l.caption) + '</span></span>';
      var attrs = hidden ? ' aria-hidden="true"' : '';
      var tab = hidden ? ' tabindex="-1"' : '';
      return l.url
        ? '<li' + attrs + '><a class="logo-item" href="' + esc(l.url) + '"' + (l.url.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"') + tab + '>' + inner + '</a></li>'
        : '<li' + attrs + '><span class="logo-item">' + inner + '</span></li>';
    }
    track.innerHTML = list.map(function (l) { return item(l, false); }).join('') +
      list.map(function (l) { return item(l, true); }).join('');
    // Pause the loop while it's off screen.
    var marquee = $('#logo-marquee');
    if ('IntersectionObserver' in window && marquee) {
      new IntersectionObserver(function (e) { marquee.classList.toggle('is-offscreen', !e[0].isIntersecting); }).observe(marquee);
    }
  }

  /* App chips on the experience timeline */
  function renderRoleApps() {
    var all = {};
    data.featured.forEach(function (a) { all[a.id] = { name: a.name, icon: a.icon, url: a.links[0] && a.links[0].url, anchor: '#app-' + a.id }; });
    data.more.forEach(function (m) { all[m.id] = { name: m.name, icon: m.icon, url: m.url, monogram: m.monogram }; });
    $$('[data-apps]').forEach(function (el) {
      el.innerHTML = el.getAttribute('data-apps').split(',').map(function (id) {
        var a = all[id.trim()];
        if (!a) return '';
        var pic = a.icon ? '<img src="' + esc(a.icon) + '" alt="" width="20" height="20" loading="lazy">' : '<span class="noimg" aria-hidden="true">' + esc((a.monogram || a.name[0]).slice(0, 2)) + '</span>';
        if (a.anchor) return '<a href="' + a.anchor + '">' + pic + esc(a.name) + '</a>';
        if (a.url) return '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + pic + esc(a.name) + ' ↗</a>';
        return '<span class="app-pill" title="Store listing no longer public">' + pic + esc(a.name) + '</span>';
      }).join('');
    });
  }

  /* ------------------------------------------------------------------ */
  /* Tech logos next to every skill / stack chip                         */
  /* ------------------------------------------------------------------ */
  // Chip text (lower-case) -> logo files in img/tech/. "mono" logos are black
  // marks that get inverted on dark backgrounds. Items without a real logo
  // (e.g. "REST APIs", "MVVM") are left as plain text on purpose.
  var MONO = { apple: 1, github: 1, nextjs: 1, expo: 1, cursor: 1, anthropic: 1, langchain: 1 };
  var TECH = {
    'flutter': ['flutter'], 'react native': ['react'], 'react': ['react'], 'react.js': ['react'],
    'kotlin': ['kotlin'], 'swift': ['swift'], 'dart': ['dart'], 'typescript': ['typescript'],
    'android': ['android'], 'jetpack compose': ['jetpackcompose'], 'ios': ['apple'], 'xamarin': ['xamarin'],
    'expo': ['expo'], 'java': ['java'], 'c#': ['csharp'], '.net': ['dotnet'], 'c# / .net': ['csharp', 'dotnet'],
    'php': ['php'], 'python': ['python'], 'next.js': ['nextjs'], 'vue.js': ['vuejs'], 'html5': ['html5'],
    'css3': ['css3'], 'graphql': ['graphql'], 'rest \u00b7 graphql': ['graphql'], 'firebase': ['firebase'],
    'firebase / firestore': ['firebase'], 'mysql': ['mysql'], 'fastapi': ['fastapi'], 'neo4j': ['neo4j'],
    'algolia': ['algolia'], 'git \u00b7 github \u00b7 gitlab': ['git', 'github', 'gitlab'], 'bitbucket / svn': ['bitbucket', 'svn'],
    'jira': ['jira'], 'android studio': ['androidstudio'], 'xcode': ['xcode'], 'visual studio': ['visualstudio'],
    'postman': ['postman'], 'redux': ['redux'], 'langchain': ['langchain'], 'claude': ['claude'],
    'cursor': ['cursor'], 'mcp': ['anthropic'], 'store publishing': ['android', 'apple']
  };
  function decorateTech(root) {
    $$('.chip, .skill-list li', root).forEach(function (el) {
      if (el.querySelector('.tech-ico')) return;
      var keys = TECH[el.textContent.trim().toLowerCase()];
      if (!keys) return;
      var wrap = document.createElement('span');
      wrap.className = 'tech-icons';
      wrap.setAttribute('aria-hidden', 'true');
      keys.forEach(function (k) {
        var img = document.createElement('img');
        img.className = 'tech-ico' + (MONO[k] ? ' mono' : '');
        img.src = 'img/tech/' + k + '.svg';
        img.alt = '';
        img.width = 14;
        img.height = 14;
        img.decoding = 'async';
        img.onerror = function () { img.remove(); };
        wrap.appendChild(img);
      });
      el.insertBefore(wrap, el.firstChild);
    });
  }

  renderApps();
  renderMore();
  renderRoleApps();
  renderLogos();
  decorateTech(document);

  /* ------------------------------------------------------------------ */
  /* Reveal on scroll                                                    */
  /* ------------------------------------------------------------------ */
  var revealEls = $$('[data-reveal], [data-stage]');
  if (!('IntersectionObserver' in window) || reduced) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealIO.unobserve(e.target);
          var counters = $$('[data-count]', e.target);
          counters.forEach(countUp);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  }

  // Hero headline: start its line-mask reveal on the next frame.
  var hero = $('.hero');
  requestAnimationFrame(function () { requestAnimationFrame(function () { hero && hero.classList.add('is-in'); }); });

  /* ------------------------------------------------------------------ */
  /* Counters (verified metrics only — values come from the markup)      */
  /* ------------------------------------------------------------------ */
  function countUp(el) {
    if (el.__counted) return;
    el.__counted = true;
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduced || !target || target < 10) { el.textContent = target; return; }
    var dur = 1400, t0 = null;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* Scroll-driven: progress bar, nav state, parallax                    */
  /* ------------------------------------------------------------------ */
  var nav = $('#nav');
  var progress = $('.progress');
  var portraitImg = $('[data-parallax-img]');
  var darkSections = $$('.on-night');
  var stages = $$('[data-stage]');
  var activeStages = [];
  var ticking = false;

  if ('IntersectionObserver' in window) {
    var stageIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('is-visible', e.isIntersecting);
        var i = activeStages.indexOf(e.target);
        if (e.isIntersecting && i < 0) activeStages.push(e.target);
        if (!e.isIntersecting && i > -1) activeStages.splice(i, 1);
      });
      requestTick();
    }, { rootMargin: '10% 0px' });
    stages.forEach(function (s) { stageIO.observe(s); });
  }

  function update() {
    ticking = false;
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = doc.scrollHeight - vh;

    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';

    // Nav pills switch to their dark style while they sit over a dark section.
    if (nav) {
      var probe = 35;
      var overDark = darkSections.some(function (s) {
        var r = s.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      nav.classList.toggle('is-dark', overDark);
    }
    setActiveTab(currentTab());
    updateRail(vh);
    hsUpdate();

    if (reduced) return;

    if (portraitImg && y < vh * 1.2) {
      portraitImg.style.setProperty('--py', (y * -0.06).toFixed(1) + 'px');
    }

    for (var i = 0; i < activeStages.length; i++) {
      var st = activeStages[i];
      var r = st.getBoundingClientRect();
      var p = ((r.top + r.height / 2) - vh / 2) / vh; // -1 … 1 across the viewport
      var slots = st.children;
      for (var j = 0; j < slots.length; j++) {
        var sp = parseFloat(slots[j].getAttribute('data-speed')) || 0;
        slots[j].style.transform = 'translate3d(0,' + (p * sp * 260).toFixed(1) + 'px,0)';
      }
    }
  }

  /* Section tabs: a filled pill slides to the section in view, and on
     narrow screens the strip scrolls so the active tab stays centred. */
  var tabs = $('#tabs');
  var tabInd = $('.tab-ind');
  var tabLinks = $$('#tabs a');
  var tabTargets = tabLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var activeTab = null;

  function currentTab() {
    if (!tabs) return null;
    var line = nav.offsetHeight + window.innerHeight * 0.3;
    var cur = null;
    for (var i = 0; i < tabTargets.length; i++) {
      if (tabTargets[i] && tabTargets[i].getBoundingClientRect().top <= line) cur = tabLinks[i];
    }
    return cur && cur.offsetWidth ? cur : null; // e.g. "Contact" is hidden on desktop
  }
  function moveIndicator(link, instant) {
    if (!tabs) return;
    tabs.classList.toggle('has-active', !!link);
    if (!link) return;
    if (instant) tabInd.style.transition = 'opacity .35s';
    tabInd.style.width = link.offsetWidth + 'px';
    tabInd.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    if (instant) { void tabInd.offsetWidth; tabInd.style.transition = ''; }
  }
  function setActiveTab(link) {
    if (link === activeTab) return;
    tabLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
    if (link) link.setAttribute('aria-current', 'true');
    // Coming from "no section" (the hero), appear in place instead of sliding in from the left.
    moveIndicator(link, !activeTab);
    activeTab = link;
    if (tabs.scrollWidth > tabs.clientWidth + 1) {
      // Keep the active tab centred; back at the hero, return to the first tab.
      var left = link ? link.offsetLeft - (tabs.clientWidth - link.offsetWidth) / 2 : 0;
      tabs.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' });
    }
  }
  function refreshIndicator() { moveIndicator(activeTab, true); }
  window.addEventListener('resize', refreshIndicator, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refreshIndicator);

  /* ------------------------------------------------------------------ */
  /* Career journey: map path + timeline rail                            */
  /* ------------------------------------------------------------------ */
  var rail = $('[data-rail]');
  var railFill = rail && $('.rail-fill', rail);
  var railRoles = rail ? $$('.role', rail) : [];

  // The rail fills as the reading line (55% down the viewport) moves through the timeline.
  function updateRail(vh) {
    if (!rail) return;
    var r = rail.getBoundingClientRect();
    var reach = vh * 0.55 - r.top;
    var p = Math.max(0, Math.min(1, reach / r.height));
    railFill.style.setProperty('--p', p.toFixed(4));
    for (var i = 0; i < railRoles.length; i++) {
      var node = railRoles[i].querySelector('.role-node');
      var at = node.getBoundingClientRect().top - r.top + 8;
      railRoles[i].classList.toggle('is-passed', reach >= at);
    }
  }

  (function initJourney() {
    var j = $('[data-journey]');
    if (!j) return;
    var svg = $('.journey-svg', j);
    var base = $('.jp-base', j);
    var line = $('.jp-line', j);
    var next = $('.jp-next', j);
    var dot = $('.jp-dot', j);
    var stops = $$('.stop', j);
    var nodes = stops.map(function (st) { return $('.node', st); });
    var len = 0;
    var progress = 0; // 0 … 1 of the drawn path
    var marks = [];   // path length at each stop

    // Smooth curve through the node centres: horizontal tangents on wide
    // screens, vertical tangents when the stops are stacked (phones).
    function layout() {
      var box = j.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
      var pts = nodes.map(function (n) {
        var r = n.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
      var vertical = Math.abs(pts[1].y - pts[0].y) > Math.abs(pts[1].x - pts[0].x);
      function seg(a, b) {
        if (vertical) {
          var dy = (b.y - a.y) / 2;
          return ' C ' + a.x + ' ' + (a.y + dy) + ' ' + b.x + ' ' + (b.y - dy) + ' ' + b.x + ' ' + b.y;
        }
        var dx = (b.x - a.x) / 2;
        return ' C ' + (a.x + dx) + ' ' + a.y + ' ' + (b.x - dx) + ' ' + b.y + ' ' + b.x + ' ' + b.y;
      }
      var main = pts.slice(0, -1);
      var d = 'M ' + main[0].x + ' ' + main[0].y;
      marks = [0];
      for (var i = 1; i < main.length; i++) {
        d += seg(main[i - 1], main[i]);
        line.setAttribute('d', d);
        marks.push(line.getTotalLength());
      }
      base.setAttribute('d', d);
      line.setAttribute('d', d);
      var last = main[main.length - 1];
      next.setAttribute('d', 'M ' + last.x + ' ' + last.y + seg(last, pts[pts.length - 1]));
      len = line.getTotalLength();
      line.style.strokeDasharray = len + ' ' + len;
      paint(progress);
    }

    function paint(e) {
      line.style.strokeDashoffset = (len * (1 - e)).toFixed(1);
      var pt = line.getPointAtLength(len * e);
      dot.setAttribute('cx', pt.x.toFixed(1));
      dot.setAttribute('cy', pt.y.toFixed(1));
      for (var i = 0; i < marks.length; i++) {
        stops[i].classList.toggle('is-lit', len * e >= marks[i] - 2);
      }
    }

    function play() {
      j.classList.add('is-in');
      if (reduced) { progress = 1; paint(1); j.classList.add('is-done'); return; }
      var dur = 2600, t0 = null;
      function frame(t) {
        if (!t0) t0 = t;
        var x = Math.min(1, (t - t0) / dur);
        progress = x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // easeInOutCubic
        paint(progress);
        if (x < 1) requestAnimationFrame(frame);
        else j.classList.add('is-done');
      }
      requestAnimationFrame(frame);
    }

    layout();
    window.addEventListener('resize', layout, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); play(); }
      }, { threshold: 0.35 });
      io.observe(j);
    } else {
      play();
    }
  })();

  /* ------------------------------------------------------------------ */
  /* Pinned horizontal sections: while the section is pinned, vertical   */
  /* scrolling moves the card track sideways; then the page continues.  */
  /* Native scrolling is never hijacked — the track just follows it.     */
  /* ------------------------------------------------------------------ */
  var hsList = $$('[data-hscroll]').map(function (sec) {
    var o = {
      sec: sec,
      sticky: $('.hs-sticky', sec),
      viewport: $('.hs-viewport', sec),
      track: $('.hs-track', sec),
      bar: $('.hs-progress i', sec),
      count: $('.hs-count', sec),
      index: $$('.app-index a', sec),
      cards: [],
      dist: 0,
      on: false,
      current: -1
    };
    return o;
  });

  function hsMeasure() {
    hsList.forEach(function (o) {
      o.cards = $$('.hcard', o.track);
      // Pin only where a whole card fits: laptops ≥600px tall, phones/tablets ≥780px tall.
      o.on = !reduced && window.innerHeight >= 600 && (window.innerWidth >= 900 || window.innerHeight >= 780);
      o.sec.classList.toggle('hs-on', o.on);
      if (!o.on) {
        o.sec.style.height = '';
        o.track.style.transform = '';
        o.dist = 0;
        return;
      }
      o.dist = Math.max(0, o.track.scrollWidth - o.viewport.clientWidth);
      o.sec.style.height = (o.dist + window.innerHeight) + 'px';
    });
    hsFit();
  }

  var FIT_MAX = 5;
  function hsFit() {
    hsList.forEach(function (o) {
      $$('.hcard', o.track).forEach(function (card) {
        for (var k = 1; k <= FIT_MAX; k++) card.classList.remove('fit-' + k);
        var copy = $('.hcard-copy', card);
        if (!copy) return;
        for (var lvl = 1; lvl <= FIT_MAX && copy.scrollHeight > copy.clientHeight + 2; lvl++) {
          card.classList.add('fit-' + lvl);
        }
      });
    });
  }

  function hsProgress(o) {
    var r = o.sec.getBoundingClientRect();
    return o.dist ? Math.min(1, Math.max(0, -r.top / o.dist)) : 0;
  }

  function hsUpdate() {
    hsList.forEach(function (o) {
      var p;
      if (o.on) {
        // The browser can scroll this clipped strip on its own (URL hash, focus);
        // only the page scroll may move it.
        if (o.viewport.scrollLeft) o.viewport.scrollLeft = 0;
        p = hsProgress(o);
        o.track.style.transform = 'translate3d(' + (-p * o.dist).toFixed(1) + 'px,0,0)';
      } else {
        var max = o.viewport.scrollWidth - o.viewport.clientWidth;
        p = max > 0 ? o.viewport.scrollLeft / max : 0;
      }
      if (o.bar) o.bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var i = Math.round(p * (o.cards.length - 1));
      if (i !== o.current && o.cards.length) {
        o.current = i;
        if (o.count) o.count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(o.cards.length).padStart(2, '0');
        o.index.forEach(function (a, j) { j === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); });
        o.cards.forEach(function (c, j) { c.classList.toggle('is-current', j === i); });
      }
    });
  }

  // Scroll position that brings a given card into view in a pinned section.
  function hsTargetY(el) {
    for (var k = 0; k < hsList.length; k++) {
      var o = hsList[k];
      if (!o.sec.contains(el)) continue;
      var card = el.closest('.hcard');
      if (!card) return null;
      var top = o.sec.getBoundingClientRect().top + window.scrollY;
      if (!o.on) { o.viewport.scrollTo({ left: card.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' }); return top - nav.offsetHeight; }
      var pad = parseFloat(getComputedStyle(o.track).paddingLeft) || 0;
      var x = Math.min(o.dist, Math.max(0, card.offsetLeft - pad));
      return top + x;
    }
    return null;
  }

  hsList.forEach(function (o) {
    o.viewport.addEventListener('scroll', function () {
      if (o.on) { if (o.viewport.scrollLeft) o.viewport.scrollLeft = 0; } else hsUpdate();
    }, { passive: true });
    // Keyboard focus on a link in an off-screen card: bring that card in by scrolling the page.
    o.track.addEventListener('focusin', function (e) {
      if (!o.on) return;
      o.viewport.scrollLeft = 0;
      var card = e.target.closest('.hcard');
      if (card && !card.classList.contains('is-current')) {
        var y = hsTargetY(card);
        if (y !== null) window.scrollTo({ top: y, behavior: 'instant' }); // instant: CSS smooth-scroll would let the browser's own anchor jump interrupt it
      }
    });
  });
  hsMeasure();
  window.addEventListener('resize', function () { hsMeasure(); hsUpdate(); }, { passive: true });
  // Opened with a link to a card (e.g. #app-jeeb): land on that card, not the section start.
  // Runs just after the browser's own jump to the anchor.
  function hsLandOnHash() {
    var t = location.hash.length > 1 ? document.getElementById(location.hash.slice(1)) : null;
    var y = t ? hsTargetY(t) : null;
    if (y !== null) window.scrollTo({ top: y, behavior: 'instant' }); // instant: CSS smooth-scroll would let the browser's own anchor jump interrupt it
  }
  window.addEventListener('load', function () {
    hsMeasure();
    setTimeout(function () { hsLandOnHash(); hsUpdate(); doc.classList.remove('no-smooth'); }, 60);
  });
  // Back / forward between card links.
  window.addEventListener('hashchange', function () { hsLandOnHash(); hsUpdate(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { hsMeasure(); hsUpdate(); });

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  update();

  reduceMQ.addEventListener && reduceMQ.addEventListener('change', function (e) {
    reduced = e.matches;
    if (reduced) {
      $$('[data-reveal], [data-stage]').forEach(function (el) { el.classList.add('is-in'); });
      stages.forEach(function (s) { $$('.slot', s).forEach(function (sl) { sl.style.transform = ''; }); });
      hsMeasure(); hsUpdate();
    }
  });



  /* ------------------------------------------------------------------ */
  /* In-page links: move focus to the target for keyboard users          */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    closeMenu(false);
    var hsY = hsTargetY(target);
    if (hsY !== null) {
      e.preventDefault();
      history.pushState(null, '', '#' + id);
      window.scrollTo({ top: hsY, behavior: reduced ? 'auto' : 'smooth' });
    }
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    // Let the native (CSS smooth) scroll and history update happen, then move focus.
    setTimeout(function () { target.focus({ preventScroll: true }); }, reduced ? 0 : 450);
  });

  // Programmatic navigation for the AI Portfolio Guide (js/concierge.js):
  // the same landing logic as in-page links — pinned horizontal cards, case
  // tabs, sticky-nav offset — without moving keyboard focus out of the chat.
  // Only ids that exist in the page can be reached.
  window.PortfolioNav = {
    go: function (id) {
      var target = typeof id === 'string' ? document.getElementById(id) : null;
      if (!target) return null;
      closeMenu(false);
      if (/^case-/.test(id)) {
        openCase(id);
        window.dispatchEvent(new CustomEvent('portfolio:holdcases'));
      }
      var y = hsTargetY(target);
      if (y === null) y = target.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight : 0) - 20;
      history.replaceState(null, '', '#' + id);
      window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
      return target;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Mobile menu                                                          */
  /* ------------------------------------------------------------------ */
  var menu = $('#menu');
  var menuBtn = $('.menu-btn');
  if (menu) menu.hidden = false; // CSS controls visibility so the open/close can animate
  if (menu) menu.setAttribute('inert', '');

  function openMenu() {
    doc.classList.add('menu-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    menu.removeAttribute('inert');
    setTimeout(function () { var f = $('a', menu); f && f.focus(); }, 80);
  }
  function closeMenu(returnFocus) {
    if (!doc.classList.contains('menu-open')) return;
    doc.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('inert', '');
    if (returnFocus) menuBtn.focus();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      doc.classList.contains('menu-open') ? closeMenu(true) : openMenu();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu(true);
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', function (e) { if (e.matches) closeMenu(false); });

  /* ------------------------------------------------------------------ */
  /* Screenshot galleries (tabs swap the image in a browser mockup)      */
  /* ------------------------------------------------------------------ */
  $$('.gallery-tabs').forEach(function (tabsEl) {
    var card = tabsEl.closest('.build');
    var imgs = $$('[data-gallery-view] img', card);
    var btns = $$('button', tabsEl);
    function select(i, focus) {
      btns.forEach(function (b, j) {
        b.setAttribute('aria-selected', j === i ? 'true' : 'false');
        b.tabIndex = j === i ? 0 : -1;
      });
      imgs.forEach(function (im, j) { im.classList.toggle('is-active', j === i); });
      if (focus) btns[i].focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(i); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          select((i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length, true);
        }
      });
    });
    select(0);
  });

  /* ------------------------------------------------------------------ */
  /* Case files: tabs (click, arrow keys, #case-… links)                  */
  /* ------------------------------------------------------------------ */
  var caseTabs = $$('.cs-tabs [role="tab"]');
  function openCase(id, focus) {
    var found = false, from = -1, to = -1;
    caseTabs.forEach(function (t, i) {
      if (t.getAttribute('aria-selected') === 'true') from = i;
      if (t.getAttribute('aria-controls') === id) { found = true; to = i; }
    });
    if (!found) return false;
    caseTabs.forEach(function (t, i) {
      var on = i === to;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    // Slide direction follows the tab order (wrapping from last to first slides forward).
    var back = from > -1 && to < from && !(from === caseTabs.length - 1 && to === 0);
    $$('.cs-panel').forEach(function (p) {
      var on = p.id === id;
      var was = p.classList.contains('is-active');
      p.classList.toggle('from-left', on && back);
      p.classList.toggle('to-left', !on && was && !back);
      p.classList.toggle('to-right', !on && was && back);
      if (!on && !was) p.classList.remove('to-left', 'to-right');
      p.classList.toggle('is-active', on);
    });
    sizeCases();
    var bar = $('.cs-bar');
    if (bar) {
      bar.style.setProperty('--glow', caseTabs[to].style.getPropertyValue('--c'));
      bar.style.setProperty('--glow-x', (12 + to * 33) + '%');
    }
    return true;
  }
  // Panels share one grid slot; size that slot to the panel on show (eased in CSS),
  // so a shorter case doesn't leave an empty area under it.
  function sizeCases() {
    var cs = $('.cs');
    var act = $('.cs-panel.is-active');
    if (cs && act) cs.style.setProperty('--cs-h', act.offsetHeight + 'px');
  }
  window.addEventListener('resize', sizeCases, { passive: true });
  window.addEventListener('load', sizeCases);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeCases);
  caseTabs.forEach(function (t, i) {
    t.addEventListener('click', function () { openCase(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var n = caseTabs[(i + (e.key === 'ArrowRight' ? 1 : caseTabs.length - 1)) % caseTabs.length];
      openCase(n.getAttribute('aria-controls'), true);
    });
  });
  // Links such as the logo strip's "#case-jeeb" open that case before the page scrolls to it.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#case-"]');
    if (a) openCase(a.getAttribute('href').slice(1));
  }, true);
  function caseFromHash() { if (/^#case-/.test(location.hash)) openCase(location.hash.slice(1)); }

  (function autoCases() {
    var box = $('[data-cases]');
    var btn = box && $('.cs-play', box);
    if (!box || caseTabs.length < 2) return;
    // Keeps rotating while the section is on screen. Paused only by the pause
    // button, keyboard focus inside the tabs, or a hidden browser tab.
    var DUR = 7000, timer = null, inView = false, paused = reduced, kbd = false;
    function current() { for (var i = 0; i < caseTabs.length; i++) if (caseTabs[i].getAttribute('aria-selected') === 'true') return i; return 0; }
    function syncBtn() {
      if (!btn) return;
      btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
      btn.setAttribute('aria-label', paused ? 'Play case studies' : 'Pause case studies');
      box.classList.toggle('is-paused', paused);
    }
    function stop() { clearTimeout(timer); timer = null; box.classList.remove('is-playing'); }
    function start() {
      stop();
      if (paused || kbd || !inView || document.hidden) return;
      box.style.setProperty('--cs-dur', DUR + 'ms');
      void box.offsetWidth; // restart the progress bar
      box.classList.add('is-playing');
      timer = setTimeout(function () {
        var n = caseTabs[(current() + 1) % caseTabs.length];
        openCase(n.getAttribute('aria-controls'));
        start();
      }, DUR);
    }
    if (btn) btn.addEventListener('click', function () { paused = !paused; syncBtn(); start(); });
    // The AI guide opened a specific case: hold it there (the play button resumes).
    window.addEventListener('portfolio:holdcases', function () { paused = true; syncBtn(); start(); });
    var tabsEl = $('.cs-tabs', box);
    tabsEl.addEventListener('focusin', function (e) { if (e.target.matches(':focus-visible')) { kbd = true; stop(); } });
    tabsEl.addEventListener('focusout', function () { kbd = false; start(); });
    caseTabs.forEach(function (t) { t.addEventListener('click', start); });
    document.addEventListener('visibilitychange', start);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { inView = e[0].isIntersecting; start(); }, { rootMargin: '-20% 0px -20% 0px' }).observe(box);
    }
    syncBtn();
  })();
  caseFromHash();
  window.addEventListener('hashchange', caseFromHash);

  /* ------------------------------------------------------------------ */
  /* MCP flow: light each hop in turn while the diagram is on screen     */
  /* ------------------------------------------------------------------ */
  $$('[data-mcp], [data-flow]').forEach(function (box) {
    var nodes = $$('.mcp-node, .fnode', box);
    var i = -1, timer = null;
    function step() {
      i = (i + 1) % (nodes.length + 1); // one beat with nothing lit before looping
      nodes.forEach(function (n, j) { n.classList.toggle('is-on', j === i); });
    }
    function start() { if (!timer && !reduced) timer = setInterval(step, 900); }
    function stop() { clearInterval(timer); timer = null; }
    if (reduced || !('IntersectionObserver' in window)) { box.classList.add('is-paused'); return; }
    new IntersectionObserver(function (e) {
      var on = e[0].isIntersecting;
      box.classList.toggle('is-paused', !on);
      on ? start() : stop();
    }, { threshold: 0.3 }).observe(box);
  });

  /* ------------------------------------------------------------------ */
  /* Hero ID badge: hangs from a lanyard, swings on a spring, follows the */
  /* cursor a little, can be dragged, and flips on click / Enter / Space. */
  /* ------------------------------------------------------------------ */
  (function initBadge() {
    var badge = $('[data-badge]');
    if (!badge) return;
    var swing = $('.badge-swing', badge);
    var tilt = $('.badge-tilt', badge);
    var card = $('.badge-card', badge);
    var front = $('.badge-front', badge);
    var back = $('.badge-back', badge);
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    var angle = 0, vel = 0, target = 0;        // swing, degrees
    var tx = 0, ty = 0, ttx = 0, tty = 0;      // 3D lean, degrees
    var dragging = false, down = null, raf = 0, lastT = 0;
    var K = 60, C = 4.2, MAX = 38;              // spring stiffness, damping, swing limit
    var ext = 0, evel = 0;                      // lanyard stretch, px (rubber band)
    var EK = 120, EC = 6.5, EMAX = 170, EMIN = -40;
    // Rubber-band resistance: easy at first, harder the further you pull.
    function rubber(d) {
      var lim = d >= 0 ? EMAX : -EMIN;
      return (d >= 0 ? 1 : -1) * lim * (1 - 1 / (Math.abs(d) / (lim * 0.9) + 1));
    }

    function pivot() {
      // the outer badge box never moves, so the lanyard's anchor point is stable
      var r = badge.getBoundingClientRect();
      var origin = parseFloat(getComputedStyle(swing).transformOrigin.split(' ')[1]) || -70;
      return { x: r.left + r.width / 2, y: r.top + origin };
    }
    function render() {
      // translate after rotate = along the lanyard, so the strap reads as stretching
      swing.style.transform = 'rotate(' + angle.toFixed(2) + 'deg) translateY(' + ext.toFixed(1) + 'px)';
      var sq = ext / 1000;                       // a touch of squash & stretch on the card
      tilt.style.transform = 'rotateX(' + tx.toFixed(2) + 'deg) rotateY(' + ty.toFixed(2) + 'deg) scale(' + (1 - sq * 0.35).toFixed(4) + ',' + (1 + sq * 0.5).toFixed(4) + ')';
      tilt.style.setProperty('--sheen', (-30 + ty * 6 + angle * 2).toFixed(1) + '%');
    }
    function step(t) {
      var dt = Math.min(0.034, (t - (lastT || t)) / 1000) || 0.016;
      lastT = t;
      if (!dragging) {
        var acc = -K * (angle - target) - C * vel;
        vel += acc * dt;
        angle += vel * dt;
        evel += (-EK * ext - EC * evel) * dt;
        ext += evel * dt;
      }
      tx += (ttx - tx) * Math.min(1, dt * 8);
      ty += (tty - ty) * Math.min(1, dt * 8);
      render();
      var moving = dragging || Math.abs(vel) > 0.02 || Math.abs(angle - target) > 0.02 ||
        Math.abs(ext) > 0.1 || Math.abs(evel) > 0.1 ||
        Math.abs(ttx - tx) > 0.02 || Math.abs(tty - ty) > 0.02;
      raf = moving ? requestAnimationFrame(step) : 0;
      if (!raf) lastT = 0;
    }
    function kick() { if (!raf && !reduced) raf = requestAnimationFrame(step); }

    // Gentle lean toward the cursor while it moves over the hero (desktop only).
    var hero = $('.hero');
    hero.addEventListener('pointermove', function (e) {
      if (reduced || !fine.matches || dragging || e.pointerType !== 'mouse') return;
      var r = card.getBoundingClientRect();
      var nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      var ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      target = nx * 5;
      tty = nx * 10;
      ttx = -ny * 7;
      kick();
    });
    hero.addEventListener('pointerleave', function () { target = 0; ttx = 0; tty = 0; kick(); });

    // Drag to swing; a press without movement is a click (flip).
    card.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 || reduced) return;
      var pv0 = pivot();
      down = { x: e.clientX, y: e.clientY, id: e.pointerId, t: performance.now(), a: angle,
        rest: Math.hypot(e.clientX - pv0.x, e.clientY - pv0.y) - ext, lastExt: ext };
    });
    card.addEventListener('pointermove', function (e) {
      if (!down || e.pointerId !== down.id) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!dragging) {
        // On touch, only a clearly horizontal drag swings; vertical motion keeps scrolling the page.
        if (Math.hypot(dx, dy) < 6 || (e.pointerType !== 'mouse' && Math.abs(dy) > Math.abs(dx))) return;
        dragging = true;
        badge.classList.add('is-dragging');
        badge.parentNode.classList.add('badge-moving');
        try { card.setPointerCapture(e.pointerId); } catch (err) {}
      }
      var pv = pivot();
      var a = -Math.atan2(e.clientX - pv.x, e.clientY - pv.y) * 180 / Math.PI;
      var d = Math.hypot(e.clientX - pv.x, e.clientY - pv.y) - down.rest;
      var nextExt = rubber(d);
      var nowE = performance.now();
      evel = (nextExt - ext) / Math.max(0.016, (nowE - down.t) / 1000);
      ext = nextExt;
      var next = Math.max(-MAX, Math.min(MAX, a));
      var now = performance.now();
      vel = (next - angle) / Math.max(0.016, (now - down.t) / 1000);
      down.t = now;
      angle = next;
      tty = Math.max(-14, Math.min(14, dx / 12));
      kick();
    });
    function release(e) {
      if (!down || (e && e.pointerId !== down.id)) return;
      var wasDrag = dragging;
      dragging = false;
      down = null;
      badge.classList.remove('is-dragging');
      badge.parentNode.classList.remove('badge-moving');
      vel = Math.max(-260, Math.min(260, vel));
      evel = Math.max(-900, Math.min(900, evel)) * 0.4; // snaps back with a little overshoot
      target = 0; tty = 0; ttx = 0;
      kick();
      if (wasDrag) card.dataset.justDragged = '1';
    }
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);

    function setFlipped(on) {
      card.classList.toggle('is-flipped', on);
      badge.parentNode.classList.toggle('badge-flipped', on);
      card.setAttribute('aria-pressed', on ? 'true' : 'false');
      card.setAttribute('aria-label', on
        ? 'ID badge, back: 7+ years, 15+ apps published, 1M+ downloads, a team across 3 countries. Flip to the front.'
        : 'ID badge for Afaque Jaya. Flip to see career stats.');
      front.setAttribute('aria-hidden', on ? 'true' : 'false');
      back.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
    card.addEventListener('click', function () {
      if (card.dataset.justDragged) { delete card.dataset.justDragged; return; }
      setFlipped(!card.classList.contains('is-flipped'));
      if (!reduced) { vel += (Math.random() < 0.5 ? -1 : 1) * 70; kick(); } // a little swing on flip
    });

    // A short settle-in swing once the badge is on screen.
    if (!reduced) setTimeout(function () { vel = 55; kick(); }, 900);
  })();

  /* ------------------------------------------------------------------ */
  /* Copy email                                                           */
  /* ------------------------------------------------------------------ */
  var toast = $('.toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var done = function () { showToast('Email copied — ' + value); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(value).then(done, function () { window.location.href = 'mailto:' + value; });
      } else {
        window.location.href = 'mailto:' + value;
      }
    });
  });


  /* ------------------------------------------------------------------ */
  /* Ask an AI about me: builds a grounded hiring brief and opens it in   */
  /* ChatGPT or Claude (pre-filled via ?q=) or Gemini (copied + opened).  */
  /* ------------------------------------------------------------------ */
  // Every Ask-AI card on the page (hero + contact) gets the same behaviour.
  $$('[data-ask-ai]').forEach(function askAI(box) {
    var links = $$('[data-ai]', box);
    var QUESTION = 'Should we hire Afaque Jaya for a senior mobile / full-stack engineering role? Does his track record show senior or lead-level ability, and where would he add the most value in his first 90 days?';
    var BRIEF = [
      'I am a recruiter / engineering leader evaluating a candidate. Please read his portfolio https://afaquejaya.github.io/ and CV https://afaquejaya.github.io/cv/cv.html. If you cannot open links, use this summary from his CV:',
      '- Afaque Jaya, Senior Mobile & Full-Stack Engineer, 7+ years, 15+ published apps, 1M+ collective downloads.',
      '- Kobet Technology DMCC, Dubai (Senior Software Engineer, 2024-2026): architected cross-platform FinTech apps (crypto, wallet, KYC, 2FA, real-time data) shipped on App Store and Google Play; led a team across Dubai, China and Sri Lanka. Apps include Tbay (1M+ Play downloads), VivaKard (100K+) and TimuCard (50K+).',
      '- Jeeb, Doha (2022-2024): built a 0-to-1 grocery and logistics platform with the founders; server-driven personalised homepage + Algolia search (95% faster load, +50% engagement); GPS tracking, route optimisation and payments (+20% efficiency); led a remote team on driver apps (+60% delivery speed).',
      '- CSM Technologies (2020-2022): state-government education apps with biometric attendance, 500K+ downloads, state-wide rollout.',
      '- JUSCO / Tata Steel (2019-2020): native Android app with .NET APIs, 70% less data entry.',
      '- Recent builds: a rental property management SaaS with an MCP server so authorised AI clients can query it; GlowFit AI (Next.js + YouCam AI APIs).',
      '- Stack: Flutter, React Native, Kotlin, Swift, Dart, TypeScript, React, Next.js, REST/GraphQL, Firebase, LangChain.'
    ].join('\n');
    var ASK = 'Answer honestly and concisely: a one-line verdict, top strengths with evidence, the roles he would excel in, any gaps to probe, and 3 interview questions.';
    var QUESTIONS = {
      hire: QUESTION,
      senior: 'Does his track record show senior or lead-level ability — architecture, end-to-end ownership and leading people?',
      fit: 'Would he fit a fast-moving product team that ships mobile apps with AI features? Where would he add the most value?'
    };
    var qBtns = $$('.ask-ai-qs [role="radio"]', box);
    var own = $('.ask-ai-own', box);
    var input = own && $('input', own);
    var NAMES = { chatgpt: 'ChatGPT', gemini: 'Gemini', claude: 'Claude' };

    function currentQuestion() {
      var sel = qBtns.filter(function (b) { return b.getAttribute('aria-checked') === 'true'; })[0];
      var key = sel ? sel.getAttribute('data-q') : 'hire';
      if (key === 'custom') return (input.value || '').trim() || QUESTIONS.hire;
      return QUESTIONS[key];
    }
    function prompt() { return BRIEF + '\n\nMy question: ' + currentQuestion() + '\n\n' + ASK; }
    function update() {
      var q = encodeURIComponent(prompt());
      links.forEach(function (a) {
        var ai = a.getAttribute('data-ai');
        if (ai === 'chatgpt') a.href = 'https://chatgpt.com/?q=' + q;
        if (ai === 'claude') a.href = 'https://claude.ai/new?q=' + q;
        if (ai === 'gemini') a.href = 'https://gemini.google.com/app';
        a.setAttribute('aria-label', 'Ask ' + NAMES[ai] + ' about Afaque (opens in a new tab)' + (ai === 'gemini' ? '; the question is copied for you to paste' : ''));
      });
    }
    function selectQ(btn, focus) {
      qBtns.forEach(function (b) { var on = b === btn; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
      var custom = btn.getAttribute('data-q') === 'custom';
      if (own) own.hidden = !custom;
      if (custom && input) input.focus(); else if (focus) btn.focus();
      update();
    }
    qBtns.forEach(function (b, i) {
      b.addEventListener('click', function () { selectQ(b); });
      b.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        selectQ(qBtns[(i + (e.key === 'ArrowRight' ? 1 : qBtns.length - 1)) % qBtns.length], true);
      });
    });
    if (input) input.addEventListener('input', update);
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        update();
        if (a.getAttribute('data-ai') === 'gemini' && navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(prompt()).then(function () { showToast('Question copied — paste it into Gemini (Ctrl/⌘ + V)'); }, function () {});
        }
      });
    });
    update();

    // Whichever assistant the cursor (or keyboard focus) settles on expands to
    // the full "Ask with …" button; leaving the group eases back to ChatGPT.
    // A short hover-intent delay stops a passing cursor from flicking them.
    var go = $('.ask-ai-go', box);
    var intent = null;
    function activate(el) { links.forEach(function (a) { a.classList.toggle('is-active', a === el); }); }
    function later(el, ms) { clearTimeout(intent); intent = setTimeout(function () { activate(el); }, ms); }
    links.forEach(function (a) {
      a.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') later(a, 140); });
      a.addEventListener('focus', function () { clearTimeout(intent); activate(a); });
    });
    go.addEventListener('pointerleave', function () { if (!go.contains(document.activeElement)) later(links[0], 260); });
    go.addEventListener('focusout', function (e) { if (!go.contains(e.relatedTarget)) activate(links[0]); });
  });

  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
