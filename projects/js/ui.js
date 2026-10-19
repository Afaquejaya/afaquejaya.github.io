// @ts-check
/**
 * Reusable UI components. Each returns an HTML string built from catalog
 * data; every interpolated value goes through esc() or attr().
 */
import { SITE, CATEGORIES, STATUS, VISIBILITY } from './config.js';
import { PROJECTS } from './projects-data.js';

/** @typedef {import('./projects-data.js').Project} Project */
/** @typedef {import('./projects-data.js').Image} Image */

/* ---------------------------------------------------------------- helpers */
/** @type {Record<string, string>} */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** @param {unknown} s */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
export const attr = esc;

/** Resolve an image path from the catalog against the asset base. */
export const asset = (/** @type {string} */ p) => (/^(https?:)?\/\//.test(p) ? p : SITE.assetBase + p);

export const projectUrl = (/** @type {string} */ id) => 'project.html?id=' + encodeURIComponent(id);

/** @param {string} id */
export const byId = (id) => PROJECTS.find((p) => p.id === id);
/** @param {string} id */
export const category = (id) => CATEGORIES.find((c) => c.id === id);

/** Catalog order: featured first, then by status, then file order. */
export function sortProjects(/** @type {Project[]} */ list) {
  const idx = new Map(PROJECTS.map((p, i) => [p.id, i]));
  return [...list].sort((a, b) =>
    (a.featured ?? 99) - (b.featured ?? 99) ||
    STATUS[a.status].rank - STATUS[b.status].rank ||
    (idx.get(a.id) ?? 0) - (idx.get(b.id) ?? 0));
}

export const isPhone = (/** @type {Image} */ img) => (img.frame ? img.frame === 'phone' : img.h > img.w * 1.2);

/** First public link worth surfacing on a card. */
export function primaryLink(/** @type {Project} */ p) {
  const order = ['live', 'play', 'ios', 'video', 'github'];
  const links = (p.links || []).filter((l) => l.type !== 'case');
  return links.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type))[0];
}

/* ------------------------------------------------------------------ icons */
const svg = (/** @type {string} */ d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

export const ICON = {
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  arrowUpRight: svg('<path d="M7 17 17 7M8 7h9v9"/>'),
  arrowLeft: svg('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  arrowRight: svg('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  lock: svg('<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  building: svg('<path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  alert: svg('<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>'),
  empty: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M8.5 11h5"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.2 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.1.9.4 1.2l9.2-9.4-9.2-9.4Zm10.4 8.2 2.6-2.7L6.1 1.8c-.4-.2-.8-.3-1.1-.2l9.6 9.2Zm0 2.4L5 22.4c.3.1.7 0 1.1-.2l11.1-6.3-2.6-2.7Zm6-3.6-2.5-1.4-2.9 2.8 2.9 2.8 2.5-1.4c.8-.5.8-2.3 0-2.8Z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 4.9c.7-.8 1.2-2 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"/></svg>',
  video: svg('<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="m16 10 5-3v10l-5-3"/>'),
  code: svg('<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16"/>'),
  doc: svg('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>'),
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3.3 9h3.4v11.5H3.3V9Zm5.6 0h3.3v1.6h.1c.5-.9 1.6-1.9 3.3-1.9 3.5 0 4.2 2.3 4.2 5.3v6.5h-3.4v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.9H8.9V9Z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.6 14.9L2 22l5.3-1.4A9.9 9.9 0 1 0 12 2Zm4.6 14c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.8-.3-1.4-.5-2.5-1.1-4.1-3.6-4.2-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2.1c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .4l-.3.4-.4.4c-.1.1-.2.3-.1.5.1.3.6 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.8-1c.2-.2.3-.2.6-.1l1.7.8c.3.1.4.2.5.3 0 .1 0 .6-.3 1.2Z"/></svg>'
};

/** Category glyphs for generated illustrations. */
const GLYPH = {
  mobile: svg('<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>'),
  web: svg('<rect x="3" y="4" width="18" height="15" rx="2.5"/><path d="M3 8.5h18M6.5 6.3h.01M9 6.3h.01"/>'),
  saas: svg('<rect x="3" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="1.8"/><rect x="3" y="13" width="7.5" height="7.5" rx="1.8"/><path d="M17.2 13.5v7M13.7 17h7"/>'),
  ai: svg('<path d="M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4L12 3zM18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15z"/>'),
  agents: svg('<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 8V4.5M9.5 13h.01M14.5 13h.01M9.5 16.2h5M3 12.5v2M21 12.5v2"/><circle cx="12" cy="3.6" r="1"/>'),
  backend: svg('<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>'),
  experiments: svg('<path d="M9.5 3h5M10.5 3v6L5 18.5A1.7 1.7 0 0 0 6.5 21h11a1.7 1.7 0 0 0 1.5-2.5L13.5 9V3M7.5 15h9"/>')
};

/* ------------------------------------------------------------------ atoms */
export function statusBadge(/** @type {Project} */ p, short = false) {
  const s = STATUS[p.status];
  return `<span class="status" data-status="${attr(p.status)}">${esc(short && s.short ? s.short : s.label)}</span>`;
}

export function catLabel(/** @type {string} */ id) {
  const c = category(id);
  return c ? `<span class="cat-label" data-cat="${attr(id)}"><i aria-hidden="true"></i>${esc(c.label)}</span>` : '';
}

export function techChips(/** @type {string[]} */ list, max = 99) {
  const shown = list.slice(0, max).map((t) => `<li class="chip">${esc(t)}</li>`).join('');
  const more = list.length > max ? `<li class="chip more" aria-label="${list.length - max} more technologies">+${list.length - max}</li>` : '';
  return `<ul class="chips" aria-label="Technologies">${shown}${more}</ul>`;
}

export function visibilityNote(/** @type {Project} */ p) {
  if (!p.visibility || p.visibility === 'public') return '';
  const icon = p.visibility === 'internal' || p.visibility === 'client' ? ICON.building : ICON.lock;
  return `<span class="vis-note">${icon}${esc(VISIBILITY[p.visibility])}</span>`;
}

const LINK_META = {
  live: { icon: ICON.globe, small: 'Open' },
  web: { icon: ICON.globe, small: 'Website' },
  play: { icon: ICON.play, small: 'Get it on' },
  ios: { icon: ICON.apple, small: 'Download on the' },
  github: { icon: ICON.github, small: 'Source' },
  video: { icon: ICON.video, small: 'Watch' },
  code: { icon: ICON.code, small: 'Read' },
  case: { icon: ICON.doc, small: 'Read' }
};

export function linkTile(/** @type {import('./projects-data.js').Link} */ l) {
  const m = LINK_META[l.type] || LINK_META.web;
  const internal = l.type === 'case';
  const ext = internal ? '' : ' target="_blank" rel="noopener"';
  return `<a class="link-tile" href="${attr(l.url)}"${ext}><span class="li">${m.icon}</span><span><small>${esc(l.note ? m.small + ' · ' + l.note : m.small)}</small><b>${esc(l.label || l.url)}</b></span><span class="arrow" aria-hidden="true">${internal ? '→' : '↗'}</span>${internal ? '' : '<span class="sr-only"> (opens in a new tab)</span>'}</a>`;
}

/* ------------------------------------------------------------------ media */
/** Abstract illustration — never mistaken for a product screenshot. */
export function illustration(/** @type {Project} */ p, tag = true) {
  const cat = p.categories[0];
  const mono = p.title.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const glyph = GLYPH[cat];
  return `<div class="illus" data-cat="${attr(cat)}" style="--c:${attr(p.accent || 'var(--c)')}" role="img" aria-label="${attr(p.title)} — illustration (no public screenshots)">
    <svg class="pattern" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 250">
      <defs><pattern id="dots-${attr(p.id)}" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity=".35"/></pattern></defs>
      <rect width="400" height="250" fill="url(#dots-${attr(p.id)})"/>
      <g fill="none" stroke="currentColor" stroke-width="1" opacity=".5"><circle cx="200" cy="125" r="70"/><circle cx="200" cy="125" r="110" stroke-dasharray="2 6"/></g>
    </svg>
    <span class="glyph" aria-hidden="true">${glyph || esc(mono)}</span>
    ${tag ? '<span class="illus-tag" aria-hidden="true">Illustration · no public screenshots</span>' : ''}
  </div>`;
}

function img(/** @type {Image} */ i, eager = false) {
  return `<img src="${attr(asset(i.src))}" width="${i.w}" height="${i.h}" alt="${attr(i.alt)}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} data-fallback>`;
}

function hostOf(/** @type {Project} */ p) {
  const live = (p.links || []).find((l) => l.type === 'live');
  try { return live ? new URL(live.url).host : p.title; } catch { return p.title; }
}

/** Readable label on concept artwork (the baked-in mark is too small on cards). */
export const CONCEPT_PILL = '<span class="concept-pill">Illustrative concept</span>';

/** Card thumbnail. */
export function thumb(/** @type {Project} */ p) {
  const t = p.thumbnail;
  const style = `style="--c:${attr(p.accent || 'var(--accent)')}"`;
  if (!t) return `<div class="thumb" data-media="${attr(p.id)}" ${style}>${illustration(p)}</div>`;
  if (t.frame === 'art') {
    return `<div class="thumb is-art" data-media="${attr(p.id)}" ${style}>${img(t)}${t.illustrative ? CONCEPT_PILL : ''}</div>`;
  }
  if (t.frame === 'logo') {
    const square = Math.abs(t.w - t.h) < 4;
    return `<div class="thumb is-logo" data-media="${attr(p.id)}" ${style}><img src="${attr(asset(t.src))}" width="${t.w}" height="${t.h}" alt="${attr(t.alt)}" loading="lazy" decoding="async" data-fallback${square ? ' class="square"' : ''}></div>`;
  }
  if (isPhone(t)) {
    const second = (p.screenshots || []).find((s) => s.src !== t.src && isPhone(s));
    const devices = [t, second].filter(Boolean).map((s) => `<span class="device">${img(/** @type {Image} */ (s))}</span>`).join('');
    return `<div class="thumb is-phone" data-media="${attr(p.id)}" ${style}>${devices}</div>`;
  }
  return `<div class="thumb is-web" data-media="${attr(p.id)}" ${style}><div class="browser-frame"><div class="bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(hostOf(p))}</span></div>${img(t)}</div></div>`;
}

/** Large media stage for featured blocks and the detail hero. */
export function stage(/** @type {Project} */ p, eager = false) {
  if (p.thumbnail && p.thumbnail.frame === 'art' && !(p.screenshots || []).length) {
    const t = p.thumbnail;
    return `<figure class="art-frame">${img(t, eager)}${t.illustrative ? CONCEPT_PILL : ''}</figure>`;
  }
  const shots = p.screenshots && p.screenshots.length ? p.screenshots : p.thumbnail ? [p.thumbnail] : [];
  const phones = shots.filter(isPhone);
  if (phones.length) {
    return `<div class="devices">${phones.slice(0, 3).map((s, i) => `<span class="device">${img(s, eager && i === 0)}</span>`).join('')}</div>`;
  }
  const web = shots.find((s) => s.frame === 'web' || (!s.frame && s.w > s.h));
  if (web) {
    return `<div class="browser-frame"><div class="bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(hostOf(p))}</span></div>${img(web, eager)}</div>`;
  }
  const logo = shots.find((s) => s.frame === 'logo') || (p.thumbnail && p.thumbnail.frame === 'logo' ? p.thumbnail : null);
  if (logo) {
    const square = Math.abs(logo.w - logo.h) < 4;
    return `<div class="logo-plate"><img src="${attr(asset(logo.src))}" width="${logo.w}" height="${logo.h}" alt="${attr(logo.alt)}" decoding="async" data-fallback${square ? ' class="square"' : ''}></div>`;
  }
  return illustration(p);
}

/* -------------------------------------------------------------- composites */
export function projectCard(/** @type {Project} */ p, i = 0) {
  const isCase = (p.featured ?? 99) <= SITE.featuredLimit;
  const link = primaryLink(p);
  /** @type {Record<string, string>} */
  const LABELS = { live: 'Live', play: 'Google Play', ios: 'App Store', video: 'Video', github: 'GitHub' };
  const linkLabel = link ? (LABELS[link.type] || 'Open') : '';
  return `<article class="card is-entering" style="--c:${attr(p.accent || 'var(--accent)')};--i:${Math.min(i, 8) * 40}ms" data-id="${attr(p.id)}">
    ${thumb(p)}
    <div class="thumb-badges" aria-hidden="true">${isCase ? '<span class="pill star">★ Case study</span>' : '<span></span>'}<span class="pill">${statusBadge(p, true)}</span></div>
    <div class="card-body">
      <div class="card-meta">${catLabel(p.categories[0])}${visibilityNote(p)}</div>
      <h3><a href="${attr(projectUrl(p.id))}">${esc(p.title)}</a></h3>
      <p class="value">${esc(p.tagline)}</p>
      ${p.summary ? `<p class="ps">${esc(p.summary)}</p>` : ''}
      ${techChips(p.technologies, 4)}
      <div class="card-foot">
        <span class="card-go" aria-hidden="true">${isCase ? 'Explore case study' : 'View project'} <span class="arrow">↗</span></span>
        <span class="sr-only">Status: ${esc(STATUS[p.status].label)}.</span>
        ${link ? `<a class="card-ext" href="${attr(link.url)}" target="_blank" rel="noopener" aria-label="${attr(p.title + ' — ' + linkLabel + ' (opens in a new tab)')}">${esc(linkLabel)} <span aria-hidden="true">↗</span></a>` : ''}
      </div>
    </div>
  </article>`;
}

export function archDiagram(/** @type {import('./projects-data.js').Architecture} */ a, accent = '') {
  const nodes = a.flow.map((n) => `<li class="arch-node${n.hot ? ' is-hot' : ''}"><b>${esc(n.title)}</b>${n.detail ? `<span>${esc(n.detail)}</span>` : ''}</li>`).join('');
  const guards = a.guards && a.guards.length ? `<div class="arch-guard" aria-label="Safety boundaries">${a.guards.map((g) => `<span>${esc(g)}</span>`).join('')}</div>` : '';
  return `<figure class="arch" style="margin:0;${accent ? '--c:' + attr(accent) : ''}">
    <ol class="arch-flow" style="--n:${a.flow.length}" aria-label="Architecture flow, in order">${nodes}</ol>
    ${guards}
    ${a.caption ? `<figcaption class="arch-caption">${esc(a.caption)}</figcaption>` : ''}
  </figure>`;
}

/** Featured editorial block. */
export function featureBlock(/** @type {Project} */ p) {
  const feats = (p.features || []).filter((f) => !f.planned).slice(0, 4);
  const impact = (p.impact || []).slice(0, 3);
  const flow = p.architecture ? p.architecture.flow.map((n) => esc(n.title)).join(' <span aria-hidden="true">→</span> ') : '';
  const link = primaryLink(p);
  return `<article class="feature" style="--c:${attr(p.accent || 'var(--accent)')}" data-reveal>
    <div class="feature-media" data-media="${attr(p.id)}">${stage(p)}</div>
    <div class="feature-body">
      <div class="feature-top">${catLabel(p.categories[0])}${statusBadge(p)}${visibilityNote(p)}</div>
      <h3>${esc(p.title)}<small>${esc(p.context || '')}${p.period ? ' · ' + esc(p.period) : ''}</small></h3>
      <div class="feature-cols">
        ${p.problem ? `<div><h4>The challenge</h4><p>${esc(p.problem)}</p></div>` : ''}
        ${p.solution ? `<div><h4>My approach</h4><p>${esc(p.solution)}</p></div>` : ''}
      </div>
      ${feats.length ? `<div><p class="mini-h">Key features</p><ul class="feature-points">${feats.map((f) => `<li><b>${esc(f.title)}</b>${f.detail ? ' — ' + esc(f.detail) : ''}</li>`).join('')}</ul></div>` : ''}
      ${flow ? `<div><p class="mini-h">Architecture</p><p style="font-size:14px;color:var(--text-2)">${flow}</p></div>` : ''}
      ${impact.length ? `<div><p class="mini-h">Verified outcomes</p><ul class="outcomes">${impact.map((m) => `<li class="outcome"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></li>`).join('')}</ul></div>` : ''}
      <div class="feature-actions">
        <a class="btn" href="${attr(projectUrl(p.id))}">Explore case study <span class="arrow" aria-hidden="true">→</span></a>
        ${link ? `<a class="btn ghost" href="${attr(link.url)}" target="_blank" rel="noopener">${esc(link.label || 'Open')} <span class="arrow up" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>` : ''}
      </div>
    </div>
  </article>`;
}

/* ------------------------------------------------------- shared page chrome */
const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', href: 'index.html#top' },
  { key: 'all', label: 'All Projects', href: 'index.html#explore' },
  { key: 'mobile', label: 'Mobile Apps', href: 'index.html?group=mobile#explore' },
  { key: 'saas-web', label: 'SaaS & Web', href: 'index.html?group=saas-web#explore' },
  { key: 'ai-agents', label: 'AI & Agents', href: 'index.html?group=ai-agents#explore' },
  { key: 'about', label: 'About', href: 'index.html#about' },
  { key: 'contact', label: 'Contact', href: 'index.html#contact' }
];

export function navbar() {
  const links = NAV_ITEMS.map((n) => `<a href="${n.href}" data-nav="${n.key}">${esc(n.label)}</a>`).join('');
  return `<div class="wrap">
    <a class="brand" href="index.html#top" aria-label="Afaque Jaya — project showcase home">
      <span class="brand-mark" aria-hidden="true">AJ</span>
      <span class="brand-name">Afaque Jaya<small>Project showcase</small></span>
    </a>
    <nav class="nav-links" aria-label="Main">${links}</nav>
    <a class="btn small nav-cta" href="${attr(SITE.links.portfolio)}">Portfolio <span class="arrow" aria-hidden="true">↗</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span class="bars" aria-hidden="true"></span></button>
  </div>`;
}

export function mobileMenu() {
  return `<ol>${NAV_ITEMS.map((n) => `<li><a href="${n.href}" data-nav="${n.key}">${esc(n.label)}</a></li>`).join('')}</ol>
    <div class="menu-foot">
      <a class="btn small" href="${attr(SITE.links.portfolio)}">Main portfolio <span class="arrow" aria-hidden="true">↗</span></a>
      <a class="btn small ghost" href="${attr(SITE.links.cv)}" target="_blank" rel="noopener">View CV <span class="arrow up" aria-hidden="true">↗</span></a>
    </div>`;
}

export function footer() {
  return `<div class="wrap"><div class="footer">
    <span>© ${new Date().getFullYear()} Afaque Jaya · Built by hand, no templates.</span>
    <nav aria-label="Footer">
      <a href="${attr(SITE.links.portfolio)}">Portfolio</a>
      <a href="${attr(SITE.links.cv)}" target="_blank" rel="noopener">CV</a>
      <a href="${attr(SITE.links.github)}" target="_blank" rel="noopener">GitHub</a>
      <a href="${attr(SITE.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="#top">Back to top ↑</a>
    </nav>
  </div></div>`;
}

export function contactSection() {
  const l = SITE.links;
  return `<div class="contact-card" data-reveal>
    <div>
      <p class="eyebrow"><span class="num">04</span> Contact</p>
      <h2 id="contact-title" style="margin-top:18px">Building something that needs <span class="serif">mobile, SaaS or AI?</span></h2>
      <p>I’m open to senior mobile and full-stack roles, 0→1 product builds, and AI features that have to work in production. Tell me what you’re building.</p>
      <div class="contact-actions">
        <a class="btn" href="mailto:${attr(SITE.email)}?subject=${encodeURIComponent('Project inquiry — via project showcase')}">Email me <span class="arrow" aria-hidden="true">→</span></a>
        <a class="btn ghost" href="${attr(l.whatsapp)}" target="_blank" rel="noopener noreferrer">WhatsApp <span class="arrow up" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
    <nav class="profile-links" aria-label="Profiles">
      <a href="mailto:${attr(SITE.email)}"><div><small>Email</small><span>${esc(SITE.email)}</span></div>${ICON.mail}</a>
      <a href="${attr(l.linkedin)}" target="_blank" rel="noopener"><div><small>LinkedIn</small><span>in/afaque-jaya</span></div>${ICON.arrowUpRight}</a>
      <a href="${attr(l.github)}" target="_blank" rel="noopener"><div><small>GitHub</small><span>@Afaquejaya</span></div>${ICON.arrowUpRight}</a>
      <a href="${attr(l.cv)}" target="_blank" rel="noopener"><div><small>Résumé</small><span>View CV</span></div>${ICON.arrowUpRight}</a>
    </nav>
  </div>`;
}

/* ------------------------------------------------------------ page behaviour */
/** Shared behaviour: chrome, sticky nav, mobile menu, image fallback, reveals. */
export function initChrome() {
  document.documentElement.classList.add('js');
  const nav = document.getElementById('nav');
  const menu = document.getElementById('menu');
  const foot = document.getElementById('site-footer');
  if (nav) nav.innerHTML = navbar();
  if (menu) menu.innerHTML = mobileMenu();
  if (foot) foot.innerHTML = footer();

  const onScroll = () => nav && nav.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const btn = nav && /** @type {HTMLButtonElement|null} */ (nav.querySelector('.menu-btn'));
  const setMenu = (/** @type {boolean} */ open) => {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      /** @type {HTMLElement|null} */ (menu.querySelector('a'))?.focus();
    } else {
      menu.classList.remove('is-open');
      menu.hidden = true;
    }
  };
  btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu?.addEventListener('click', (e) => { if (/** @type {HTMLElement} */ (e.target).closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  // Broken image → swap the media box for the neutral illustration.
  document.addEventListener('error', (e) => {
    const t = /** @type {HTMLElement} */ (e.target);
    if (!(t instanceof HTMLImageElement) || !t.hasAttribute('data-fallback')) return;
    const box = /** @type {HTMLElement|null} */ (t.closest('[data-media]'));
    const p = box && byId(box.dataset.media || '');
    if (box && p) { box.className = box.className.replace(/\bis-(phone|web|logo|art)\b/g, ''); box.innerHTML = illustration(p); }
    else t.replaceWith(Object.assign(document.createElement('span'), { className: 'sr-only', textContent: t.alt }));
  }, true);

  observeReveals();
}

let revealObserver = /** @type {IntersectionObserver|null} */ (null);
export function observeReveals(/** @type {ParentNode} */ root = document) {
  const els = root.querySelectorAll('[data-reveal]:not(.is-in)');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('is-in')); return; }
  revealObserver = revealObserver || new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver?.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => revealObserver?.observe(el));
}

/** Update <title>, description and social tags. */
export function setMeta(/** @type {{title: string, description: string, url?: string, image?: string}} */ m) {
  document.title = m.title;
  const set = (/** @type {string} */ sel, /** @type {string} */ val) => { const el = document.querySelector(sel); if (el) el.setAttribute('content', val); };
  set('meta[name="description"]', m.description);
  set('meta[property="og:title"]', m.title);
  set('meta[property="og:description"]', m.description);
  set('meta[name="twitter:title"]', m.title);
  set('meta[name="twitter:description"]', m.description);
  if (m.url) {
    set('meta[property="og:url"]', m.url);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', m.url);
  }
  if (m.image) { set('meta[property="og:image"]', m.image); set('meta[name="twitter:image"]', m.image); }
}
