/*
 * AI Portfolio Guide — the chat panel behind the bottom-right avatar.
 *
 * How it answers (in order):
 *  1. Deterministic answers from js/concierge-data.js, matched by intent.
 *  2. Navigation actions that scroll to allowlisted sections of this page
 *     (via window.PortfolioNav from js/main.js) and briefly highlight them.
 *  3. Optional: an AI answer from a server-side endpoint, only if
 *     CONCIERGE_DATA.config.aiEndpoint is set (empty by default — GitHub
 *     Pages can't hold an API key).
 *  4. An honest fallback that suggests related questions.
 *
 * Safety: everything the visitor types is treated as text. It is never
 * turned into a URL, selector or code, messages are rendered with
 * textContent only, and actions can reach only the section ids and links
 * listed in the data file. Nothing typed is sent to an AI unless an endpoint
 * has been configured.
 *
 * Analytics (js/analytics.js, cookie-free): the guide reports which intents
 * were answered, navigation it performed, and — so the knowledge base can be
 * improved — the text of questions it could NOT answer, trimmed and with
 * email addresses and phone numbers removed first. Nothing identifies the
 * visitor.
 *
 * Opened by js/mascot.js (window.Concierge.toggle). Never opens by itself.
 */
(function () {
  'use strict';

  var D = window.CONCIERGE_DATA;
  if (!D) return;

  var CFG = D.config || {};
  var MAX_INPUT = CFG.maxInput || 300;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var smallMQ = window.matchMedia('(max-width: 600px)');
  var fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  var INTENTS = {};
  D.intents.forEach(function (it) { INTENTS[it.id] = it; });

  // Words that point at a section when a visitor says "take me to …".
  var SECTION_WORDS = [
    ['mcp', ['mcp', 'model context']],
    ['rental', ['rental', 'saas', 'property']],
    ['glowfit', ['glowfit', 'glow fit']],
    ['pregnancy', ['pregnancy', 'widget']],
    ['expense', ['expense']],
    ['builds', ['builds', 'ai projects', 'own projects', 'side projects']],
    ['apps', ['apps', 'applications', 'published', 'showcase', 'mobile work']],
    ['impact', ['impact', 'metrics', 'numbers', 'outcomes']],
    ['cases', ['case stud', 'case file']],
    ['experience', ['experience', 'career', 'timeline', 'jobs']],
    ['skills', ['skills', 'stack', 'technologies']],
    ['about', ['about']],
    ['contact', ['contact', 'email']],
    ['askai', ['chatgpt', 'gemini', 'claude', 'ask ai', 'ask an ai']],
    ['home', ['top', 'home', 'start', 'beginning']]
  ];

  var ICON = {
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 6l12 12M18 6 6 18"/></svg>',
    min: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M6 13h12"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>',
    browse: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" d="M5 7h14M5 12h14M5 17h9"/></svg>',
    go: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M6 13l6 6 6-6"/></svg>',
    out: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M8 7h9v9"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>'
  };

  /* ------------------------------------------------------------------ */
  /* State                                                               */
  /* ------------------------------------------------------------------ */
  var built = false, isOpen = false, minimized = false;
  var root, logEl, suggEl, form, input, sendBtn, pill, opener = null;
  var asked = {};
  var lastIntent = null;
  var lastSend = 0, aiCalls = 0, lastAi = 0;
  var pending = 0;      // timer for the typing indicator
  var spotTimer = 0;

  function track(name, data) { if (window.PortfolioTrack) window.PortfolioTrack(name, data); }
  // Unanswered questions are recorded to improve the guide; strip anything
  // that could identify the visitor before they leave the browser.
  function anonymise(text) {
    return String(text)
      .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '[email]')
      .replace(/\+?\d[\d\s().-]{6,}\d/g, '[number]')
      .slice(0, 120);
  }

  /* ------------------------------------------------------------------ */
  /* Small DOM helpers (text only — never innerHTML with visitor input)  */
  /* ------------------------------------------------------------------ */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function iconEl(name) {
    var s = el('span', 'cg-ico');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = ICON[name]; // static markup from this file only
    return s;
  }
  function delay(ms) { return reduceMQ.matches ? Math.min(ms, 220) : ms; }

  /* ------------------------------------------------------------------ */
  /* Build the panel (once, on first open)                               */
  /* ------------------------------------------------------------------ */
  function build() {
    if (built) return;
    built = true;

    root = el('section', 'cg');
    root.id = 'concierge';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'false');
    root.setAttribute('aria-labelledby', 'cg-title');
    root.setAttribute('aria-describedby', 'cg-sub');
    root.tabIndex = -1;
    root.hidden = true;

    var head = el('header', 'cg-head');
    var av = el('span', 'cg-avatar');
    var avImg = el('img');
    avImg.src = 'img/mascot/afaque-3d-bust.webp';
    avImg.alt = '';
    avImg.width = 40; avImg.height = 40;
    av.appendChild(avImg);
    var titles = el('div', 'cg-titles');
    var h = el('h2', 'cg-title', 'AI Portfolio Guide');
    h.setAttribute('aria-label', 'Afaque’s AI Portfolio Guide');
    h.id = 'cg-title';
    var sub = el('p', 'cg-sub');
    sub.id = 'cg-sub';
    sub.appendChild(el('span', 'cg-live'));
    sub.appendChild(document.createTextNode('Afaque Jaya · from his CV & portfolio'));
    titles.appendChild(h); titles.appendChild(sub);
    head.appendChild(av); head.appendChild(titles);
    [['browse', 'Browse all questions'], ['reset', 'Start a new conversation'], ['min', 'Minimise the guide'], ['close', 'Close the guide']].forEach(function (b) {
      var btn = el('button', 'cg-icon-btn');
      btn.type = 'button';
      btn.setAttribute('data-act', b[0]);
      btn.setAttribute('aria-label', b[1]);
      btn.title = b[1];
      btn.appendChild(iconEl(b[0]));
      head.appendChild(btn);
    });

    logEl = el('div', 'cg-log');
    logEl.setAttribute('role', 'log');
    logEl.setAttribute('aria-live', 'polite');
    logEl.setAttribute('aria-relevant', 'additions');
    logEl.setAttribute('aria-label', 'Conversation');
    logEl.tabIndex = 0;

    suggEl = el('div', 'cg-sugg');
    suggEl.setAttribute('role', 'group');
    suggEl.setAttribute('aria-label', 'Suggested questions');

    form = el('form', 'cg-form');
    form.setAttribute('novalidate', '');
    var lab = el('label', 'sr-only', 'Ask about Afaque');
    lab.setAttribute('for', 'cg-input');
    input = el('input', 'cg-input');
    input.id = 'cg-input';
    input.type = 'text';
    input.maxLength = MAX_INPUT;
    input.autocomplete = 'off';
    input.setAttribute('enterkeyhint', 'send');
    input.placeholder = 'Ask me anything about Afaque...';
    sendBtn = el('button', 'cg-send');
    sendBtn.type = 'submit';
    sendBtn.setAttribute('aria-label', 'Send question');
    sendBtn.appendChild(iconEl('send'));
    form.appendChild(lab); form.appendChild(input); form.appendChild(sendBtn);

    var foot = el('p', 'cg-foot', 'Answers come only from Afaque’s CV and this portfolio. Nothing you type is stored.');

    root.appendChild(head);
    root.appendChild(logEl);
    root.appendChild(suggEl);
    root.appendChild(form);
    root.appendChild(foot);
    document.body.appendChild(root);

    pill = el('button', 'cg-pill');
    pill.type = 'button';
    pill.hidden = true;
    var pa = el('img');
    pa.src = 'img/mascot/afaque-3d-bust.webp'; pa.alt = ''; pa.width = 28; pa.height = 28;
    pill.appendChild(pa);
    pill.appendChild(el('span', '', 'Back to the guide'));
    document.body.appendChild(pill);

    // Events
    head.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'close') close();
      else if (act === 'min') minimize();
      else if (act === 'reset') reset();
      else if (act === 'browse') showCategories();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = '';
      ask(v);
    });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
    });
    // Actions, references and chips — one delegated handler, allowlist-checked.
    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-nav],[data-ask],[data-cat],[data-more],[data-home]');
      if (!t || !root.contains(t)) return;
      if (t.hasAttribute('data-nav')) navigate(t.getAttribute('data-nav'));
      else if (t.hasAttribute('data-ask')) askIntent(t.getAttribute('data-ask'));
      else if (t.hasAttribute('data-cat')) showCategory(t.getAttribute('data-cat'));
      else if (t.hasAttribute('data-home')) setSuggestions(nextFor(lastIntent));
      else if (t.hasAttribute('data-more')) explainMore(t);
    });
    pill.addEventListener('click', restore);

    // A tap or click anywhere outside the guide minimises it (to the "Back to
    // the guide" pill). Uses click, not pointerdown, so scrolling the page on
    // a touch screen doesn't count as a tap. Where the press started is
    // recorded first, because some buttons inside the panel replace
    // themselves while handling the click.
    var pressedInside = false;
    document.addEventListener('pointerdown', function (e) {
      pressedInside = isOwn(e.target);
    }, true);
    document.addEventListener('click', function (e) {
      if (!isOpen || minimized || pressedInside || isOwn(e.target)) return;
      minimize(false);
    });
  }

  // The panel itself, the pill and the avatar that opens it.
  function isOwn(node) {
    return !!(node && node.closest && (root.contains(node) || node.closest('.cg-pill, .mascot')));
  }

  /* ------------------------------------------------------------------ */
  /* Open / close / minimise                                             */
  /* ------------------------------------------------------------------ */
  var anim = null;

  function floatingMascot() {
    var m = opener && opener.closest ? opener.closest('.mascot') : null;
    return m && getComputedStyle(m).position === 'fixed' ? m : null;
  }

  function placeFor() {
    var m = floatingMascot();
    root.classList.toggle('above-fab', !!m);
    if (m) root.style.setProperty('--fab', m.offsetWidth + 'px');
  }

  // The pill waits right beside the avatar when it floats in the corner;
  // otherwise (phones, avatar tucked away) in the bottom-right corner.
  function placePill() {
    var m = floatingMascot();
    var beside = !!(m && !m.classList.contains('is-away'));
    pill.classList.toggle('by-fab', beside);
    if (beside) pill.style.setProperty('--fab', m.offsetWidth + 'px');
  }

  // Where the panel goes to (or comes from): the pill, or the avatar.
  function anchorRect(kind) {
    var el = kind === 'pill' ? pill : opener;
    var r = null;
    if (el && document.contains(el)) {
      var wasHidden = el.hidden;
      if (wasHidden) el.hidden = false;
      r = el.getBoundingClientRect();
      if (wasHidden) el.hidden = true;
    }
    var w = window.innerWidth, h = window.innerHeight;
    if (!r || !r.width) r = { left: w - 60, top: h - 60, width: 40, height: 40 };
    // Keep the point on screen (e.g. the avatar is scrolled away on a phone).
    var cx = Math.min(w - 12, Math.max(12, r.left + r.width / 2));
    var cy = Math.min(h - 12, Math.max(12, r.top + r.height / 2));
    return { x: cx, y: cy };
  }

  // Smooth open/close: a gentle fade and scale from the corner nearest the
  // avatar (or the pill). Opening eases out over ~0.3s; closing and
  // minimising are quicker. Reduced motion: no animation.
  function animatePanel(out, kind, done) {
    if (anim) { anim.cancel(); anim = null; }
    if (reduceMQ.matches || !root.animate) { if (done) done(); return; }
    var r = root.getBoundingClientRect();
    var a = anchorRect(kind);
    var ox = Math.max(0, Math.min(r.width, a.x - r.left));
    var oy = Math.max(0, Math.min(r.height, a.y - r.top));
    root.style.transformOrigin = ox.toFixed(1) + 'px ' + oy.toFixed(1) + 'px';
    root.classList.add('is-animating');
    var shown = { opacity: 1, transform: 'translateY(0) scale(1)' };
    var gone = { opacity: 0, transform: 'translateY(10px) scale(0.94)' };
    anim = root.animate(out ? [shown, gone] : [gone, shown], {
      duration: out ? 200 : 300,
      easing: out ? 'cubic-bezier(0.4, 0, 1, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)'
    });
    var mine = anim;
    mine.onfinish = function () {
      if (anim !== mine) return;
      anim = null;
      root.style.transformOrigin = '';
      root.classList.remove('is-animating');
      if (done) done();
    };
  }

  function showPanel(fromKind) {
    pill.hidden = true;
    root.hidden = false;
    root.classList.add('is-open');
    animatePanel(false, fromKind);
  }

  function open(fromEl) {
    build();
    if (fromEl) opener = fromEl;
    placeFor();
    isOpen = true;
    minimized = false;
    showPanel('opener');
    if (!logEl.childNodes.length) { welcome(); track('chat-open'); }
    // Mouse/keyboard: straight to the input. Touch: focus the panel so the
    // on-screen keyboard doesn't cover the welcome message.
    if (fineMQ.matches) input.focus({ preventScroll: true }); else root.focus({ preventScroll: true });
    announceState();
  }

  function close() {
    if (!built || root.hidden) return;
    isOpen = false;
    minimized = false;
    clearTimeout(pending);
    pill.hidden = true;
    announceState();
    var back = opener && document.contains(opener) && opener.offsetParent !== null ? opener : null;
    if (back) back.focus({ preventScroll: true });
    animatePanel(true, 'opener', function () { if (!isOpen) { root.hidden = true; root.classList.remove('is-open'); } });
  }

  // focusPill: true when the visitor chose to minimise (keep keyboard focus
  // with the guide); false for an outside tap (they meant to interact there).
  function minimize(focusPill) {
    if (!isOpen || minimized) return;
    minimized = true;
    placePill();
    announceState();
    animatePanel(true, 'pill', function () {
      if (!minimized) return;
      root.hidden = true;
      root.classList.remove('is-open');
      pill.hidden = false;
      if (focusPill !== false) pill.focus({ preventScroll: true });
    });
  }

  function restore() {
    if (!built) return;
    placeFor();
    placePill();
    minimized = false;
    isOpen = true;
    showPanel('pill');
    if (fineMQ.matches) input.focus({ preventScroll: true }); else root.focus({ preventScroll: true });
    scrollLog();
    announceState();
  }

  function toggle(fromEl) {
    if (isOpen && !minimized) close();
    else if (minimized) restore();
    else open(fromEl);
  }

  function announceState() {
    window.dispatchEvent(new CustomEvent('concierge:state', { detail: { open: isOpen && !minimized } }));
  }

  function reset() {
    clearTimeout(pending);
    logEl.textContent = '';
    asked = {};
    lastIntent = null;
    welcome();
    input.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* Messages                                                            */
  /* ------------------------------------------------------------------ */
  function scrollLog() {
    logEl.scrollTo({ top: logEl.scrollHeight, behavior: reduceMQ.matches ? 'auto' : 'smooth' });
  }

  function addUser(text) {
    var m = el('div', 'cg-msg is-user');
    m.appendChild(el('span', 'sr-only', 'You: '));
    m.appendChild(el('p', '', text));
    logEl.appendChild(m);
    scrollLog();
  }

  function typing(ms, then) {
    clearTimeout(pending);
    var t = el('div', 'cg-msg is-bot cg-typing');
    t.setAttribute('aria-hidden', 'true');
    t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
    logEl.appendChild(t);
    logEl.setAttribute('aria-busy', 'true');
    scrollLog();
    setBusy(true);
    pending = setTimeout(function () {
      t.remove();
      logEl.removeAttribute('aria-busy');
      setBusy(false);
      then();
    }, delay(ms));
  }

  function setBusy(on) {
    sendBtn.disabled = on;
    suggEl.classList.toggle('is-busy', on);
  }

  // Render one assistant message from an intent-like object.
  function addBot(msg) {
    var m = el('div', 'cg-msg is-bot');
    m.appendChild(el('span', 'sr-only', 'Guide: '));
    if (msg.kind === 'approach') m.appendChild(el('span', 'cg-tag', 'How he’d approach it — not documented work'));
    if (msg.ai) m.appendChild(el('span', 'cg-tag is-ai', 'AI-generated from his portfolio — verify against the CV'));
    (msg.answer || []).forEach(function (p) {
      p.split('\n').forEach(function (line) { if (line) m.appendChild(el('p', '', line)); });
    });
    if (msg.points && msg.points.length) {
      var ul = el('ul', 'cg-points');
      msg.points.forEach(function (pt) {
        var li = el('li');
        var key = pt[1];
        if (key && D.sections[key]) {
          var b = el('button', 'cg-ref', pt[0]);
          b.type = 'button';
          b.setAttribute('data-nav', key);
          b.setAttribute('aria-label', pt[0] + ' — show on the page');
          li.appendChild(b);
        } else {
          li.textContent = pt[0];
        }
        ul.appendChild(li);
      });
      m.appendChild(ul);
    }
    if (msg.after) m.appendChild(el('p', 'cg-after', msg.after));
    if (msg.detail && msg.detail.length) {
      var more = el('button', 'cg-more', 'Explain in more detail');
      more.type = 'button';
      more.setAttribute('data-more', msg.id || '');
      m.appendChild(more);
    }
    var acts = renderActions(msg.actions);
    if (acts) m.appendChild(acts);
    logEl.appendChild(m);
    reveal(m);
    return m;
  }

  // Long answers: bring their first line into view so they read top-down;
  // short ones: just keep the newest message at the bottom.
  function reveal(m) {
    if (m.offsetHeight > logEl.clientHeight - 24) {
      logEl.scrollTo({ top: Math.max(0, m.offsetTop - 10), behavior: reduceMQ.matches ? 'auto' : 'smooth' });
    } else {
      scrollLog();
    }
  }

  // Buttons: navigation (scrolls this page) looks different from links (leave the page).
  function renderActions(list) {
    if (!list || !list.length) return null;
    var wrap = el('div', 'cg-actions');
    list.forEach(function (a) {
      if (a.nav && D.sections[a.nav]) {
        var s = D.sections[a.nav];
        var b = el('button', 'cg-act is-nav');
        b.type = 'button';
        b.setAttribute('data-nav', a.nav);
        if (s.thumb) {
          var th = el('img', 'cg-thumb');
          th.src = s.thumb; th.alt = ''; th.width = 22; th.height = 22; th.loading = 'lazy';
          b.appendChild(th);
        } else {
          b.appendChild(iconEl('go'));
        }
        b.appendChild(el('span', '', a.label || s.label));
        wrap.appendChild(b);
      } else if (a.link && D.links[a.link]) {
        var l = D.links[a.link];
        var aEl = el('a', 'cg-act is-link');
        aEl.href = l.href;
        if (l.download) aEl.setAttribute('download', l.download);
        if (l.newTab) { aEl.target = '_blank'; aEl.rel = 'noopener noreferrer'; }
        aEl.appendChild(el('span', '', a.label || l.label));
        aEl.appendChild(iconEl(l.download ? 'down' : 'out'));
        if (l.newTab) aEl.appendChild(el('span', 'sr-only', ' (opens in a new tab)'));
        wrap.appendChild(aEl);
      }
    });
    return wrap.childNodes.length ? wrap : null;
  }

  function explainMore(btn) {
    var it = INTENTS[btn.getAttribute('data-more')];
    btn.remove();
    if (!it || !it.detail) return;
    track('chat-more', { intent: it.id });
    typing(500, function () {
      addBot({ answer: [], points: it.detail.map(function (d) { return [d]; }), actions: it.actions && it.actions.slice(0, 1) });
    });
  }

  function welcome() {
    var m = addBot({ answer: [D.welcome] });
    m.classList.add('is-welcome');
    setSuggestions(D.starters);
  }

  /* ------------------------------------------------------------------ */
  /* Suggestions                                                         */
  /* ------------------------------------------------------------------ */
  function chip(id) {
    var it = INTENTS[id];
    if (!it) return null;
    var b = el('button', 'cg-chip', it.q);
    b.type = 'button';
    b.setAttribute('data-ask', id);
    return b;
  }

  function setSuggestions(ids, opts) {
    suggEl.textContent = '';
    ids.forEach(function (id) { var c = chip(id); if (c) suggEl.appendChild(c); });
    if (!opts || !opts.noBrowse) {
      var more = el('button', 'cg-chip is-browse', 'More questions');
      more.type = 'button';
      more.setAttribute('data-cat', '');
      suggEl.appendChild(more);
    }
  }

  // Up to three follow-ups that fit the conversation and haven't been asked yet.
  function nextFor(it) {
    var out = [];
    var pool = (it && it.next ? it.next : []).concat(D.starters, ['cv', 'contact']);
    for (var i = 0; i < pool.length && out.length < 3; i++) {
      var id = pool[i];
      if (!INTENTS[id] || asked[id] || out.indexOf(id) > -1 || (it && id === it.id)) continue;
      out.push(id);
    }
    return out;
  }

  function showCategories() {
    if (!isOpen) return;
    suggEl.textContent = '';
    D.categories.forEach(function (c) {
      var b = el('button', 'cg-chip is-cat', c.label);
      b.type = 'button';
      b.setAttribute('data-cat', c.id);
      suggEl.appendChild(b);
    });
    var first = suggEl.querySelector('button');
    if (first) first.focus({ preventScroll: true });
  }

  function showCategory(id) {
    if (!id) { showCategories(); return; }
    var c = D.categories.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    suggEl.textContent = '';
    var back = el('button', 'cg-chip is-back', '← ' + c.label);
    back.type = 'button';
    back.setAttribute('data-cat', '');
    back.setAttribute('aria-label', 'Back to all question categories');
    suggEl.appendChild(back);
    c.items.forEach(function (q) { var ch = chip(q); if (ch) suggEl.appendChild(ch); });
    var firstQ = suggEl.querySelector('[data-ask]');
    if (firstQ) firstQ.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* Understanding a question                                            */
  /* ------------------------------------------------------------------ */
  function norm(s) {
    return String(s).toLowerCase()
      .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2019\u2018`]/g, "'")
      .replace(/[^a-z0-9+#.'\u2192\- ]+/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }

  var STOP = { the: 1, a: 1, an: 1, is: 1, are: 1, of: 1, his: 1, he: 1, him: 1, me: 1, to: 1, and: 1, in: 1, on: 1, for: 1, with: 1, what: 1, how: 1, does: 1, do: 1, can: 1, about: 1, tell: 1, show: 1, please: 1, afaque: 1, 'afaque\'s': 1, jaya: 1, i: 1, you: 1, your: 1, it: 1, this: 1, that: 1, has: 1, have: 1, was: 1, be: 1 };

  function tokens(n) { return n.split(/[\s.,]+/).filter(function (t) { return t && !STOP[t]; }); }

  function scoreIntent(it, n, toks) {
    if (norm(it.q) === n) return 100;
    var s = 0;
    it.keys.forEach(function (k) {
      var strong = k.charAt(0) === '^';
      var key = strong ? k.slice(1) : k;
      if (key.indexOf(' ') > -1 || key.indexOf('-') > -1) {
        if (n.indexOf(key) > -1) s += strong ? 3.5 : 2.6;
        return;
      }
      for (var i = 0; i < toks.length; i++) {
        var t = toks[i];
        var hit = t === key || (key.length >= 4 && t.indexOf(key) === 0) || (t.length >= 5 && key.indexOf(t) === 0 && key.length - t.length <= 2);
        if (hit) { s += strong ? 3 : 1.25; return; }
      }
    });
    if (it.small && toks.length > 5) s *= 0.3; // "hi, can you show me…" is not small talk
    return s;
  }

  function rank(text) {
    var n = norm(text);
    var toks = tokens(n);
    return D.intents.map(function (it) { return { it: it, s: scoreIntent(it, n, toks) }; })
      .sort(function (a, b) { return b.s - a.s; });
  }

  function isUnsafe(raw) {
    return /(https?:|www\.|javascript:|data:|<\s*\/?\s*[a-z]|\beval\b|document\.|window\.|\.(com|net|org|io|ru|xyz)\b|@import)/i.test(raw);
  }

  var NAV_VERB = /^(please\s+)?(go to|goto|take me|navigate|scroll|jump|open|bring me|show me the|show the|head to|move to)\b/;

  function sectionFromText(n) {
    for (var i = 0; i < SECTION_WORDS.length; i++) {
      var words = SECTION_WORDS[i][1];
      for (var j = 0; j < words.length; j++) if (n.indexOf(words[j]) > -1) return SECTION_WORDS[i][0];
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Asking                                                              */
  /* ------------------------------------------------------------------ */
  function clean(raw) {
    return String(raw == null ? '' : raw)
      .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028-\u202e]/g, ' ')
      .replace(/\s+/g, ' ').trim().slice(0, MAX_INPUT);
  }

  function throttled() {
    var now = Date.now();
    if (now - lastSend < 450) return true;
    lastSend = now;
    return false;
  }

  function askIntent(id) {
    var it = INTENTS[id];
    if (!it || throttled()) return;
    addUser(it.q);
    respond(it, 'chip');
  }

  function ask(raw) {
    var text = clean(raw);
    if (!text) { input.focus(); return; }
    if (throttled()) return;
    addUser(text);

    if (isUnsafe(raw)) {
      track('chat-blocked');
      typing(420, function () {
        addBot({ answer: ['I can only show sections of this portfolio and Afaque’s verified profiles — I can’t open other links or run commands.'] });
        setSuggestions(nextFor(lastIntent));
      });
      return;
    }

    var n = norm(text);
    if (NAV_VERB.test(n)) {
      var key = sectionFromText(n);
      if (key === null && /\b(cv|resume|pdf)\b/.test(n)) { respond(INTENTS.cv, 'typed'); return; }
      if (key) {
        typing(380, function () {
          var s = D.sections[key];
          addBot({ answer: ['Sure — taking you there.'] });
          navigate(key);
        });
        return;
      }
      typing(420, function () {
        addBot({ answer: ['I can take you to these parts of the portfolio: published apps, SaaS & AI builds, impact, case studies, experience, skills, about and contact.'], actions: [{ nav: 'apps' }, { nav: 'builds' }, { nav: 'experience' }] });
        setSuggestions(nextFor(lastIntent));
      });
      return;
    }

    var ranked = rank(text);
    var best = ranked[0], second = ranked[1];
    var confident = best.s >= 2.4 || (best.s >= 1.25 && second.s < best.s * 0.6);
    if (confident) { respond(best.it, 'typed'); return; }
    fallback(text, ranked);
  }

  function respond(it, via) {
    asked[it.id] = true;
    lastIntent = it;
    track('chat-question', { intent: it.id, via: via || 'chip' });
    var words = (it.answer || []).join(' ').length;
    typing(Math.min(1100, 420 + words * 1.6), function () {
      addBot(it);
      setSuggestions(nextFor(it));
    });
  }

  function fallback(text, ranked) {
    var useAi = CFG.aiEndpoint && aiCalls < 20 && Date.now() - lastAi > 2500;
    if (useAi) {
      aiCalls++; lastAi = Date.now();
      typing(250, function () {
        var t = el('div', 'cg-msg is-bot cg-typing');
        t.setAttribute('aria-hidden', 'true');
        t.appendChild(el('i')); t.appendChild(el('i')); t.appendChild(el('i'));
        logEl.appendChild(t);
        setBusy(true);
        askAi(text).then(function (answer) {
          t.remove(); setBusy(false);
          addBot({ ai: true, answer: [answer], actions: [{ link: 'cv' }] });
          setSuggestions(nextFor(lastIntent));
        }, function () {
          t.remove(); setBusy(false);
          honestFallback(ranked, text);
        });
      });
      return;
    }
    typing(520, function () { honestFallback(ranked, text); });
  }

  function honestFallback(ranked, text) {
    var near = ranked.filter(function (r) { return r.s > 0 && !r.it.small; }).slice(0, 3).map(function (r) { return r.it.id; });
    track('chat-unanswered', { question: anonymise(text), nearest: near[0] || 'none' });
    addBot({
      answer: ['The portfolio doesn’t establish an answer to that, so I won’t guess. You could try one of the questions below, ask an external AI with his résumé, or ask Afaque directly.'],
      actions: [{ nav: 'askai' }, { link: 'email', label: 'Ask Afaque directly' }]
    });
    setSuggestions(near.length ? near : nextFor(lastIntent));
  }

  // Optional server-side AI (see config.aiEndpoint). Any failure — network,
  // timeout, bad JSON, empty or oversized answer — falls back to the honest
  // answer above, so the portfolio keeps working.
  function askAi(question) {
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, CFG.aiTimeoutMs || 9000);
    return fetch(CFG.aiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      body: JSON.stringify({ question: question }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('status ' + r.status);
      return r.json();
    }).then(function (j) {
      clearTimeout(timer);
      var a = j && typeof j.answer === 'string' ? clean(j.answer.replace(/\s+/g, ' ')) : '';
      if (!a) throw new Error('empty');
      return a.slice(0, 1200);
    }, function (e) { clearTimeout(timer); throw e; });
  }

  /* ------------------------------------------------------------------ */
  /* Navigation (allowlisted) + highlight                                */
  /* ------------------------------------------------------------------ */
  function navigate(key) {
    var s = D.sections[key];
    if (!s) return; // not in the allowlist: do nothing
    var target = window.PortfolioNav ? window.PortfolioNav.go(s.id) : null;
    if (!target) {
      var fallbackEl = document.getElementById(s.id);
      if (fallbackEl) { fallbackEl.scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth', block: 'start' }); target = fallbackEl; }
    }
    if (!target) {
      addBot({ answer: ['That part of the page isn’t available right now.'] });
      return;
    }
    spotlight(target);
    noteFor(s, key);
    track('chat-nav', { section: key });
    // On phones the panel would cover the content: tuck it away behind a pill.
    if (smallMQ.matches) minimize();
  }

  function spotTargetFor(target) {
    if (target.id === 'ask-ai') return target.querySelector('.ask-ai') || target;
    if (target.id === 'top') return target.querySelector('.hero-copy') || target;
    // Card strips (apps, builds) light up the strip itself; other sections their heading.
    if (target.tagName === 'SECTION') return target.querySelector('.hs-viewport, .section-head') || target;
    return target;
  }

  function spotlight(target) {
    var spot = spotTargetFor(target);
    clearTimeout(spotTimer);
    document.querySelectorAll('.cg-spot').forEach(function (n) { n.classList.remove('cg-spot'); });
    // Wait for the smooth scroll to land, then emphasise once.
    spotTimer = setTimeout(function () {
      spot.classList.add('cg-spot');
      spotTimer = setTimeout(function () { spot.classList.remove('cg-spot'); }, 2600);
    }, reduceMQ.matches ? 0 : 650);
  }

  function noteFor(s, key) {
    var m = el('div', 'cg-msg is-bot is-note');
    m.appendChild(iconEl('pin'));
    var body = el('div');
    body.appendChild(el('span', 'sr-only', 'Guide: '));
    body.appendChild(el('b', '', 'Now showing'));
    body.appendChild(el('p', '', s.note));
    m.appendChild(body);
    logEl.appendChild(m);
    scrollLog();
    var follow = s.next && INTENTS[s.next] && !asked[s.next] ? [s.next] : [];
    setSuggestions(follow.concat(nextFor(lastIntent)).filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 3));
  }

  /* ------------------------------------------------------------------ */
  /* Public API (used by js/mascot.js)                                   */
  /* ------------------------------------------------------------------ */
  window.Concierge = {
    open: open,
    close: close,
    toggle: toggle,
    isOpen: function () { return isOpen && !minimized; }
  };
})();
