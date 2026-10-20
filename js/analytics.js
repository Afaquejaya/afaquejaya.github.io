/*
 * Analytics — Umami Cloud (cookie-free; no personal data, no identifiers).
 *
 * The tracker script in <head> records page views, referrer, country/city,
 * device and the ?ref= / utm_* tags on the URL by itself. This file adds the
 * events that answer "what did visitors actually do":
 *
 *  - Clicks on links that matter (CV, contact, payment, app stores, socials,
 *    Ask-AI, project demos, case-study tabs, jumps to a card, any outbound
 *    link). The event name is derived from the element itself, so nothing
 *    needs tagging by hand; a data-track="name" attribute overrides it.
 *  - Which sections and cards were scrolled into view (once per page load).
 *  - The chat guide reports its own events through window.PortfolioTrack
 *    (see js/concierge.js).
 *
 * Every call is a no-op when the tracker is blocked or hasn't loaded, so the
 * page never depends on it.
 */
(function () {
  'use strict';

  function track(name, data) {
    try {
      if (!window.umami || typeof window.umami.track !== 'function') return;
      if (data) window.umami.track(name, data); else window.umami.track(name);
    } catch (e) { /* analytics must never break the page */ }
  }
  window.PortfolioTrack = track;

  if (!document.addEventListener || !Element.prototype.closest) return;

  /* ------------------------------------------------------------------ */
  /* Clicks                                                              */
  /* ------------------------------------------------------------------ */
  function appFrom(a) {
    var card = a.closest('article[id], [data-app]');
    if (card) return card.getAttribute('data-app') || card.id.replace(/^app-/, '');
    var m = /[?&]id=([\w.]+)/.exec(a.href || '');
    return m ? m[1] : '';
  }

  function placeOf(a) {
    if (a.closest('#concierge')) return 'chat';
    if (a.closest('.nav, header, nav')) return 'nav';
    var sec = a.closest('section[id]');
    return sec ? sec.id : 'page';
  }

  // Returns [eventName, data] or null for links not worth recording.
  function describe(a) {
    var explicit = a.getAttribute('data-track');
    var data = { from: placeOf(a) };
    if (explicit) return [explicit, data];

    var href = a.getAttribute('href') || '';
    var ai = a.getAttribute('data-ai');
    if (ai) { data.provider = ai; return ['ask-ai', data]; }
    // Ask-AI question choice (Should we hire him? / senior? / fit? / own question).
    if (a.hasAttribute('data-q') && a.closest('[data-ask-ai]')) { data.question = a.getAttribute('data-q'); return ['ask-ai-pick', data]; }
    // Case-study tabs.
    var controls = a.getAttribute('aria-controls') || '';
    if (/^case-/.test(controls)) { data['case'] = controls.replace(/^case-/, ''); return ['case-open', data]; }
    // Jumps to a specific app / build / case / role card (app index, chat references, footer links).
    var jump = /^#(app|build|case|role)-([\w-]+)$/.exec(href);
    if (jump && jump[2] !== 'index') { data.card = jump[1] + '-' + jump[2]; return ['card-jump', data]; }
    // Any link inside a SaaS / AI build card: live demo, video, source.
    var build = a.closest('article[id^="build-"]');
    if (build && /^https?:\/\//i.test(href)) {
      data.project = build.id.replace(/^build-/, '');
      try { data.host = new URL(href).hostname.replace(/^www\./, ''); } catch (e) { data.host = ''; }
      return ['project-link', data];
    }
    if (/^mailto:/i.test(href)) return ['contact-email', data];
    if (/wa\.me|whatsapp\.com/i.test(href)) return ['contact-whatsapp', data];
    if (/rzp\.io|razorpay\.com/i.test(href)) return ['pay-razorpay', data];
    if (/\.pdf(\?|$)/i.test(href) || a.hasAttribute('download')) return ['cv-download', data];
    if (/cv\.html/i.test(href)) return ['cv-view', data];
    if (/linkedin\.com/i.test(href)) return ['social-linkedin', data];
    if (/github\.com|gist\.github\.com/i.test(href)) { data.repo = href.replace(/^https?:\/\/(gist\.)?github\.com\//i, '').split(/[?#]/)[0]; return ['social-github', data]; }
    if (/play\.google\.com/i.test(href)) { data.app = appFrom(a); return ['store-play', data]; }
    if (/apps\.apple\.com|itunes\.apple\.com/i.test(href)) { data.app = appFrom(a); return ['store-appstore', data]; }
    if (href === '#work-with-me' || href === '#contact') return ['cta-hire', data];
    if (/^https?:\/\//i.test(href)) {
      var host = '';
      try { host = new URL(href, location.href).hostname.replace(/^www\./, ''); } catch (e) { return null; }
      if (host === location.hostname) return null;
      data.host = host;
      return ['outbound', data];
    }
    return null;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href], [data-track], [data-ask-ai] [data-q], [role="tab"][aria-controls^="case-"]');
    if (!a) return;
    var d = describe(a);
    if (d) track(d[0], d[1]);
  }, true);

  /* ------------------------------------------------------------------ */
  /* Sections and cards scrolled into view (once each per page load)     */
  /* ------------------------------------------------------------------ */
  if (!('IntersectionObserver' in window)) return;
  var seen = {};
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, id = el.id;
      if (seen[id]) return;
      seen[id] = true;
      io.unobserve(el);
      if (el.tagName === 'SECTION') track('section-view', { section: id });
      else track('card-view', { card: id });
    });
  }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

  var targets = document.querySelectorAll('main section[id], article[id^="app-"], article[id^="build-"], [id^="case-"], [id^="role-"]');
  Array.prototype.forEach.call(targets, function (el) { if (el.id !== 'top') io.observe(el); });
})();
