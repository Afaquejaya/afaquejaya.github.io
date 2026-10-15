/*
 * Mascot — a small illustrated Afaque that looks toward your cursor and
 * reacts when booped.
 *
 * This is a dependency-free port of the behaviour of page-mascot's <Mascot>
 * React component (https://github.com/nilbuild/page-mascot, v0.1.0,
 * src/mascot.tsx), because this site is plain static HTML without React.
 * It uses the same sprite format (two 3×3 sheets: head directions and
 * reactions), the same direction sectors, dead zone and hysteresis, the same
 * boop timings and the same squash keyframes. Additions for this site: a
 * speech bubble, auto-hide while scrolling on touch screens, and hiding near
 * the contact links and the open mobile menu.
 *
 * page-mascot is MIT licensed:
 *   Copyright (c) 2026 Kamran Ahmed <https://kamran.fyi>
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to permit
 *   persons to whom the Software is furnished to do so, subject to the
 *   following conditions: The above copyright notice and this permission
 *   notice shall be included in all copies or substantial portions of the
 *   Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 *
 * Character art: img/mascot/ (see img/mascot/README.md).
 */
(function () {
  'use strict';

  var DIRECTIONS = ['up-left', 'up', 'up-right', 'left', 'center', 'right', 'down-left', 'down', 'down-right'];
  var REACTIONS = ['blink', 'heart', 'sparkle', 'surprised', 'wink', 'bashful', 'sleepy', 'dizzy', 'delighted'];
  // Sector order clockwise from "right" (screen y points down).
  var CLOCKWISE = ['right', 'down-right', 'down', 'down-left', 'left', 'up-left', 'up', 'up-right'];
  var SECTOR = Math.PI / 4;
  var DEAD_ZONE = 70;
  var HYSTERESIS = 0.12;
  var BLINK_MS = 120;
  var REACT_MS = 560;
  var DIZZY_MS = 1100;
  var DIZZY_WINDOW = 1600;
  var DIZZY_AFTER = 4;
  var PAYOFFS = ['heart', 'sparkle', 'delighted'];
  var SQUASH = [
    { transform: 'scale(1, 1)', easing: 'ease-in' },
    { transform: 'scale(1.10, 0.86)', offset: 0.18, easing: 'ease-out' },
    { transform: 'scale(0.95, 1.08)', offset: 0.45, easing: 'ease-in-out' },
    { transform: 'scale(1.03, 0.97)', offset: 0.72, easing: 'ease-in-out' },
    { transform: 'scale(1, 1)' }
  ];

  var LINES = [
    { text: 'Hi, I’m Afaque 👋 I build mobile apps people actually use.' },
    { text: 'Those store links are real — go poke them.', href: '#work', cta: 'See the apps' },
    { text: 'Have an interesting product to build?', href: '#contact', cta: 'Let’s talk' },
    { text: 'Okay, okay — I’m dizzy now.' }
  ];

  // The corner mascot uses the drawn sprite sheets (its head turns to follow the cursor);
  // the nav profile and the scroll flight use the supplied 3D avatar (AVATAR).
  var AVATAR = 'img/mascot/afaque-3d-bust.webp';
  var SHEETS = {
    directions: 'img/mascot/afaque-directions.webp',
    reactions: 'img/mascot/afaque-reactions.webp'
  };

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  function cellPos(index) {
    return (index % 3) * 50 + '% ' + Math.floor(index / 3) * 50 + '%';
  }
  function wrap(a) {
    while (a > Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  }

  // Only mount once both sheets have loaded — the site works the same without it.
  function preload(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(src); };
      img.onerror = reject;
      img.src = src;
    });
  }

  Promise.all([preload(SHEETS.directions), preload(SHEETS.reactions)]).then(mount, function () { /* stay hidden */ });

  function mount() {
    var root = document.createElement('div');
    root.className = 'mascot';
    root.innerHTML =
      '<div class="mascot-bubble" role="status" aria-live="polite"></div>' +
      '<button type="button" class="mascot-btn" aria-label="Boop the Afaque mascot">' +
        '<span class="mascot-disc" aria-hidden="true"></span>' +
        '<span class="mascot-body" aria-hidden="true">' +
          '<span class="mascot-layer mascot-dir"></span>' +
          '<span class="mascot-layer mascot-react"></span>' +
        '</span>' +
      '</button>';

    var btn = root.querySelector('.mascot-btn');
    var bodyEl = root.querySelector('.mascot-body');
    var dirLayer = root.querySelector('.mascot-dir');
    var reactLayer = root.querySelector('.mascot-react');
    var bubble = root.querySelector('.mascot-bubble');

    dirLayer.style.backgroundImage = 'url("' + SHEETS.directions + '")';
    reactLayer.style.backgroundImage = 'url("' + SHEETS.reactions + '")';

    var direction = 'center';
    var sector = -1;
    var reaction = null;
    var timers = [];
    var clicks = 0;
    var lastClick = 0;
    var lineIdx = 0;
    var bubbleTimer;

    function render() {
      dirLayer.style.backgroundPosition = cellPos(DIRECTIONS.indexOf(direction));
      if (reaction) reactLayer.style.backgroundPosition = cellPos(REACTIONS.indexOf(reaction));
      reactLayer.style.opacity = reaction ? '1' : '0';
      dirLayer.style.opacity = reaction ? '0' : '1';
    }
    render();
    requestAnimationFrame(function () { root.classList.add('is-ready'); });

    /* ---- look toward the pointer (fine pointers only) ---- */
    var px = null, py = null, rafId = 0;
    function look() {
      rafId = 0;
      if (px === null) return;
      var r = btn.getBoundingClientRect();
      var dx = px - (r.left + r.width / 2);
      var dy = py - (r.top + r.height / 2);
      var next;
      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        next = 'center';
        sector = -1;
      } else {
        var angle = Math.atan2(dy, dx);
        if (sector < 0 || Math.abs(wrap(angle - sector * SECTOR)) >= SECTOR / 2 + HYSTERESIS) {
          sector = (Math.round(angle / SECTOR) + 8) % 8;
        }
        next = CLOCKWISE[sector];
      }
      if (next !== direction) { direction = next; render(); }
    }
    function onPointer(e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      px = e.clientX; py = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(look);
    }
    function onScrollLook() { if (px !== null && !rafId) rafId = requestAnimationFrame(look); }
    function setTracking(on) {
      if (on) {
        window.addEventListener('pointermove', onPointer, { passive: true });
        window.addEventListener('scroll', onScrollLook, { passive: true });
      } else {
        window.removeEventListener('pointermove', onPointer);
        window.removeEventListener('scroll', onScrollLook);
        direction = 'center'; sector = -1; render();
      }
    }
    setTracking(fineMQ.matches);
    fineMQ.addEventListener && fineMQ.addEventListener('change', function (e) { setTracking(e.matches); });

    /* ---- boop ---- */
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function say(line) {
      clearTimeout(bubbleTimer);
      bubble.innerHTML = '';
      var p = document.createElement('span');
      p.textContent = line.text;
      bubble.appendChild(p);
      if (line.href) {
        var a = document.createElement('a');
        a.href = line.href;
        a.textContent = line.cta + ' →';
        bubble.appendChild(a);
      }
      root.classList.add('is-talking');
      bubbleTimer = setTimeout(function () { root.classList.remove('is-talking'); }, line.href ? 5200 : 3600);
    }

    btn.addEventListener('click', function () {
      clearTimers();
      var now = Date.now();
      clicks = now - lastClick < DIZZY_WINDOW ? clicks + 1 : 1;
      lastClick = now;

      if (!reduceMQ.matches && bodyEl.animate) {
        bodyEl.animate(SQUASH, { duration: 420, easing: 'linear' });
      }

      if (clicks >= DIZZY_AFTER) {
        reaction = 'dizzy'; render();
        say(LINES[3]);
        later(function () { reaction = null; render(); }, DIZZY_MS);
        clicks = 0;
        return;
      }

      reaction = 'blink'; render();
      later(function () {
        reaction = PAYOFFS[(clicks - 1) % PAYOFFS.length];
        render();
      }, BLINK_MS);
      later(function () { reaction = null; render(); }, REACT_MS);

      say(LINES[lineIdx % 3]);
      lineIdx++;
    });

    /* ---- stay out of the way ---- */
    var hideReasons = {};
    function setHidden(reason, on) {
      if (on) hideReasons[reason] = true; else delete hideReasons[reason];
      applyHidden();
    }
    function applyHidden() {
      var hidden = !root.classList.contains('is-docked') && Object.keys(hideReasons).length > 0;
      root.classList.toggle('is-away', hidden);
      if (hidden) root.classList.remove('is-talking');
      btn.tabIndex = hidden ? -1 : 0;
    }

    // Below 760px the mascot sits inline in the About section instead of floating
    // over text; above that it floats bottom-right.
    var dock = document.querySelector('.mascot-dock');
    var smallMQ = window.matchMedia('(max-width: 760px)');
    function place() {
      var docked = !!(dock && smallMQ.matches);
      root.classList.toggle('is-docked', docked);
      (docked ? dock : document.body).appendChild(root);
      applyHidden();
    }
    place();
    smallMQ.addEventListener && smallMQ.addEventListener('change', place);

    /* ---- lives in the nav at the top, flies to the corner on scroll ---- */
    // The avatar sits in the nav's brand mark while the page is at the top.
    // Scrolling down launches it along an arc (with a motion trail) to the
    // bottom-right corner; scrolling back to the top flies it home.
    var brandMark = document.querySelector('.brand-mark');
    var brandAv = null;
    // Same head-and-chest image as the corner mascot.
    function headBg(el, size) {
      el.style.backgroundImage = 'url("' + AVATAR + '")';
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = '50% 20%';
    }
    if (brandMark) {
      brandAv = document.createElement('span');
      brandAv.className = 'brand-avatar';
      brandAv.setAttribute('aria-hidden', 'true');
      brandMark.appendChild(brandAv);
      brandMark.classList.add('has-avatar');
      headBg(brandAv, brandMark.offsetWidth || 36);
    }
    var TOP_LIMIT = 160;
    var atTop = window.scrollY < TOP_LIMIT;
    var flight = null;

    function floating() { return !root.classList.contains('is-docked'); }
    function setBrand(home) { if (brandMark) brandMark.classList.toggle('avatar-away', !home); }
    function instant(fn) {
      root.classList.add('no-trans');
      fn();
      void root.offsetWidth;
      root.classList.remove('no-trans');
    }
    // The corner position, from layout (ignores the hidden state's transform).
    function cornerRect() {
      var b = btn.getBoundingClientRect();
      var t = getComputedStyle(root).transform;
      var dy = 0;
      if (t && t !== 'none') { var m = t.match(/matrix\(([^)]+)\)/); if (m) dy = parseFloat(m[1].split(',')[5]) || 0; }
      return { left: b.left, top: b.top - dy, width: b.width, height: b.height };
    }
    function fly(down) {
      if (flight) flight.finish();
      var from = down ? brandMark.getBoundingClientRect() : cornerRect();
      var to = down ? cornerRect() : brandMark.getBoundingClientRect();
      var size = from.width;
      var endScale = to.width / size;
      // Quadratic Bézier: drop down the left side first, then sweep right.
      var p0 = { x: from.left, y: from.top };
      var p2 = { x: to.left + (to.width - size) / 2, y: to.top + (to.height - size) / 2 };
      var c = down ? { x: p0.x + (p2.x - p0.x) * 0.08, y: p2.y + 40 } : { x: p2.x + (p0.x - p2.x) * 0.08, y: p0.y + 40 };
      var frames = [];
      for (var i = 0; i <= 12; i++) {
        var t = i / 12, u = 1 - t;
        var x = u * u * p0.x + 2 * u * t * c.x + t * t * p2.x;
        var y = u * u * p0.y + 2 * u * t * c.y + t * t * p2.y;
        var sc = (down ? (1 + (endScale - 1) * t) : ((to.width / size) * t + (1 - t))) * (1 + Math.sin(Math.PI * t) * 0.45);
        var rot = (down ? 1 : -1) * 360 * (t * t * (3 - 2 * t));
        frames.push({ transform: 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ') rotate(' + rot.toFixed(1) + 'deg)', offset: t });
      }
      var made = [];
      var anims = [0, 1, 2].map(function (k) {
        var f = document.createElement('div');
        f.className = 'mascot-flyer' + (k ? ' ghost' : '');
        f.style.width = f.style.height = size + 'px';
        headBg(f, size);
        if (k) f.style.opacity = String(0.38 - k * 0.14);
        document.body.appendChild(f);
        made.push(f);
        return f.animate(frames, { duration: 1050, delay: k * 55, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'both' });
      });
      if (down) setBrand(false); else instant(function () { setHidden('top', true); });
      var done = false;
      function land() {
        if (done) return;
        done = true;
        made.forEach(function (f) { f.remove(); });
        flight = null;
        if (down) {
          instant(function () { setHidden('top', false); });
          if (!root.classList.contains('is-away') && btn.animate) {
            btn.animate([{ transform: 'scale(.7)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 420, easing: 'ease-out' });
          }
        } else {
          setBrand(true);
          if (brandAv && brandAv.animate) brandAv.animate([{ transform: 'scale(.6)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 380, easing: 'ease-out' });
        }
      }
      anims[0].onfinish = land;
      flight = { finish: function () { anims.forEach(function (a) { try { a.finish(); } catch (e) {} }); land(); } };
    }
    function syncTop(animate) {
      if (!floating()) { setBrand(true); setHidden('top', false); return; }
      if (animate && !reduceMQ.matches && brandMark && document.body.animate) { fly(!atTop); return; }
      setBrand(atTop);
      instant(function () { setHidden('top', atTop); });
    }
    syncTop(false);
    window.addEventListener('scroll', function () {
      var now = window.scrollY < TOP_LIMIT;
      if (now === atTop) return;
      atTop = now;
      syncTop(true);
    }, { passive: true });
    smallMQ.addEventListener && smallMQ.addEventListener('change', function () { syncTop(false); });

    // Hide near the contact links (bottom-right content) and while the mobile menu is open.
    var avoid = document.querySelector('.contact-links');
    if (avoid && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        setHidden('contact', entries[0].isIntersecting);
      }, { rootMargin: '0px 0px 40px 0px' }).observe(avoid);
    }
    new MutationObserver(function () {
      setHidden('menu', document.documentElement.classList.contains('menu-open'));
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // On larger touch screens (tablets), tuck away while scrolling so it never sits on top of what you're reading.
    var scrollTimer;
    window.addEventListener('scroll', function () {
      if (fineMQ.matches) return;
      setHidden('scrolling', true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () { setHidden('scrolling', false); }, 700);
    }, { passive: true });
  }
})();
