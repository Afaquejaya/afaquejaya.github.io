// @ts-check
/**
 * Showcase home: hero orbit + facts, the discovery dashboard (search,
 * category chips, technology and status filters, URL state), featured case
 * studies and contact. All content comes from projects-data.js.
 */
import { PROJECTS } from './projects-data.js';
import { SITE, CATEGORIES, NAV_GROUPS, STATUS } from './config.js';
import { esc, attr, sortProjects, projectCard, featureBlock, contactSection, initChrome, observeReveals } from './ui.js';

/** @typedef {import('./projects-data.js').Project} Project */

const $ = (/** @type {string} */ s) => /** @type {HTMLElement} */ (document.querySelector(s));

initChrome();

/* ------------------------------------------------------------- hero orbit */
(function renderOrbit() {
  const box = $('#orbit');
  if (!box) return;
  const C = 240, R = 188;
  const nodes = CATEGORIES.map((c, i) => {
    const a = (-90 + (360 / CATEGORIES.length) * i) * (Math.PI / 180);
    return { c, x: C + R * Math.cos(a), y: C + R * Math.sin(a), n: PROJECTS.filter((p) => p.categories.includes(c.id)).length };
  });
  const lines = nodes.map((n) => `<path class="link" d="M${C} ${C} L${n.x.toFixed(1)} ${n.y.toFixed(1)}"/>`).join('');
  const pulses = nodes.map((n, i) => `<path class="pulse" style="animation-delay:${(i * 0.8).toFixed(1)}s" d="M${C} ${C} L${n.x.toFixed(1)} ${n.y.toFixed(1)}"/>`).join('');
  box.innerHTML = `<svg viewBox="0 0 480 480" aria-hidden="true">
      <circle class="ring" cx="${C}" cy="${C}" r="${R}"/>
      <g class="spin"><circle class="ring dash" cx="${C}" cy="${C}" r="120"/><circle class="ring dash" cx="${C}" cy="${C}" r="228"/></g>
      ${lines}${pulses}
      <circle class="core-ring" cx="${C}" cy="${C}" r="76"/>
    </svg>
    <span class="orbit-core" aria-hidden="true">AJ</span>
    ${nodes.map((n) => `<a class="orbit-node" data-cat="${attr(n.c.id)}" href="?category=${attr(n.c.id)}#explore" data-filter="${attr(n.c.id)}" style="left:${(n.x / 4.8).toFixed(2)}%;top:${(n.y / 4.8).toFixed(2)}%"><i aria-hidden="true"></i>${esc(n.c.short)} <b>${n.n}</b><span class="sr-only"> projects in ${esc(n.c.label)}</span></a>`).join('')}`;
})();

/* ------------------------------------------------------------- hero facts */
(function renderFacts() {
  const ul = $('#hero-facts');
  if (!ul) return;
  const facts = SITE.facts.map((f) => `<li><b>${esc(f.value)}<em>${esc(f.suffix)}</em></b><span>${esc(f.label)}</span></li>`);
  facts.push(`<li><b>${PROJECTS.length}</b><span>projects in this catalog, across ${CATEGORIES.length} categories</span></li>`);
  ul.innerHTML = facts.join('');
})();

/* ------------------------------------------------------ discovery dashboard */
/** @type {{ cats: Set<string>, q: string, tech: string, status: string }} */
const state = { cats: new Set(), q: '', tech: '', status: '' };

const grid = $('#grid');
const qInput = /** @type {HTMLInputElement} */ ($('#q'));
const techSel = /** @type {HTMLSelectElement} */ ($('#tech'));
const statusSel = /** @type {HTMLSelectElement} */ ($('#status'));
const count = $('#results-count');
const resetBtn = $('#reset');
const empty = $('#empty');
const catDesc = $('#cat-desc');
const chipsBox = $('#cats');

const norm = (/** @type {string} */ s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

/** Searchable text per project, built once. */
const HAY = new Map(PROJECTS.map((p) => [p.id, norm([
  p.title, p.tagline, p.summary, p.description, p.context, p.problem, p.solution,
  ...(p.technologies || []), ...(p.platforms || []),
  ...p.categories.map((c) => { const k = CATEGORIES.find((x) => x.id === c); return k ? k.label + ' ' + k.short : c; }),
  STATUS[p.status].label,
  ...(p.features || []).map((f) => f.title)
].filter(Boolean).join(' '))]));

function matches(/** @type {Project} */ p, ignore = '') {
  if (ignore !== 'cats' && state.cats.size && !p.categories.some((c) => state.cats.has(c))) return false;
  if (ignore !== 'tech' && state.tech && !p.technologies.includes(state.tech)) return false;
  if (ignore !== 'status' && state.status && p.status !== state.status) return false;
  if (state.q) {
    const hay = HAY.get(p.id) || '';
    if (!norm(state.q).split(/\s+/).filter(Boolean).every((tok) => hay.includes(tok))) return false;
  }
  return true;
}

// Technology options: anything used by 2+ projects (search covers the rest).
(function fillSelects() {
  /** @type {Map<string, number>} */
  const tally = new Map();
  PROJECTS.forEach((p) => p.technologies.forEach((t) => tally.set(t, (tally.get(t) || 0) + 1)));
  [...tally].filter(([, n]) => n > 1).sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([t, n]) => techSel.add(new Option(`${t} (${n})`, t)));
  Object.entries(STATUS).sort((a, b) => a[1].rank - b[1].rank).forEach(([k, s]) => {
    const n = PROJECTS.filter((p) => p.status === k).length;
    if (n) statusSel.add(new Option(`${s.label} (${n})`, k));
  });
})();

function renderChips() {
  const base = PROJECTS.filter((p) => matches(p, 'cats'));
  const all = `<button type="button" class="cat-chip" data-cat="all" aria-pressed="${!state.cats.size}">All projects <span class="n">${base.length}</span></button>`;
  chipsBox.innerHTML = all + CATEGORIES.map((c) => {
    const n = base.filter((p) => p.categories.includes(c.id)).length;
    return `<button type="button" class="cat-chip" data-cat="${attr(c.id)}" aria-pressed="${state.cats.has(c.id)}"><i aria-hidden="true"></i>${esc(c.label)} <span class="n">${n}</span></button>`;
  }).join('');
}

let lastIds = '';
function render(animate = true) {
  const list = sortProjects(PROJECTS.filter((p) => matches(p)));
  const ids = list.map((p) => p.id).join();
  if (ids !== lastIds) {
    grid.innerHTML = list.map((p, i) => projectCard(p, i)).join('');
    if (!animate) grid.querySelectorAll('.card').forEach((c) => c.classList.remove('is-entering'));
    lastIds = ids;
  }
  empty.hidden = list.length > 0;
  grid.hidden = list.length === 0;

  const active = state.cats.size + (state.q ? 1 : 0) + (state.tech ? 1 : 0) + (state.status ? 1 : 0);
  resetBtn.hidden = active === 0;
  const parts = [];
  if (state.cats.size) parts.push([...state.cats].map((c) => CATEGORIES.find((x) => x.id === c)?.label).join(' + '));
  if (state.tech) parts.push(state.tech);
  if (state.status) parts.push(STATUS[state.status].label);
  if (state.q) parts.push(`“${state.q}”`);
  count.innerHTML = `Showing <b>${list.length}</b> of ${PROJECTS.length} projects${parts.length ? ' · ' + esc(parts.join(' · ')) : ''}`;
  catDesc.textContent = state.cats.size === 1 ? (CATEGORIES.find((c) => state.cats.has(c.id))?.description || '') : '';
  renderChips();
  syncNav();
  syncUrl();
}

function syncUrl() {
  const u = new URL(location.href);
  ['category', 'group', 'q', 'tech', 'status'].forEach((k) => u.searchParams.delete(k));
  if (state.cats.size) u.searchParams.set('category', [...state.cats].join(','));
  if (state.q) u.searchParams.set('q', state.q);
  if (state.tech) u.searchParams.set('tech', state.tech);
  if (state.status) u.searchParams.set('status', state.status);
  if (u.href !== location.href) history.replaceState(null, '', u);
}

function readUrl() {
  const u = new URL(location.href);
  const group = u.searchParams.get('group');
  const cats = group && NAV_GROUPS[group] ? NAV_GROUPS[group] : (u.searchParams.get('category') || '').split(',');
  state.cats = new Set(cats.filter((c) => CATEGORIES.some((x) => x.id === c)));
  state.q = (u.searchParams.get('q') || '').slice(0, 80);
  const tech = u.searchParams.get('tech') || '';
  state.tech = [...techSel.options].some((o) => o.value === tech) ? tech : '';
  const st = u.searchParams.get('status') || '';
  state.status = st in STATUS ? st : '';
  qInput.value = state.q;
  techSel.value = state.tech;
  statusSel.value = state.status;
  $('#q-clear').hidden = !state.q;
}

function reset() {
  state.cats.clear(); state.q = ''; state.tech = ''; state.status = '';
  qInput.value = ''; techSel.value = ''; statusSel.value = '';
  $('#q-clear').hidden = true;
  render();
}

function showExplore() {
  document.getElementById('explore')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* events */
chipsBox.addEventListener('click', (e) => {
  const b = /** @type {HTMLElement|null} */ (/** @type {HTMLElement} */ (e.target).closest('.cat-chip'));
  if (!b) return;
  const id = b.dataset.cat || 'all';
  if (id === 'all') state.cats.clear();
  else if (state.cats.size === 1 && state.cats.has(id)) state.cats.clear();
  else state.cats = new Set([id]);
  render();
  /** @type {HTMLElement|null} */ (chipsBox.querySelector(`[data-cat="${id}"]`))?.focus();
});

let t = 0;
qInput.addEventListener('input', () => {
  $('#q-clear').hidden = !qInput.value;
  clearTimeout(t);
  t = window.setTimeout(() => { state.q = qInput.value.trim().slice(0, 80); render(); }, 140);
});
$('#q-clear').addEventListener('click', () => { qInput.value = ''; state.q = ''; $('#q-clear').hidden = true; render(); qInput.focus(); });
techSel.addEventListener('change', () => { state.tech = techSel.value; render(); });
statusSel.addEventListener('change', () => { state.status = statusSel.value; render(); });
resetBtn.addEventListener('click', reset);
$('#empty-reset').addEventListener('click', () => { reset(); qInput.focus(); });

// "/" focuses search (unless typing somewhere already)
document.addEventListener('keydown', (e) => {
  const tag = /** @type {HTMLElement} */ (e.target).tagName;
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); qInput.focus(); }
  if (e.key === 'Escape' && document.activeElement === qInput && qInput.value) { qInput.value = ''; state.q = ''; $('#q-clear').hidden = true; render(); }
});

// Nav, orbit and in-page links that carry a filter: apply it without reloading.
document.addEventListener('click', (e) => {
  const a = /** @type {HTMLAnchorElement|null} */ (/** @type {HTMLElement} */ (e.target).closest('a[href]'));
  if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
  const url = new URL(a.href, location.href);
  if (url.pathname !== location.pathname && !/\/projects\/(index\.html)?$/.test(url.pathname)) return;
  if (url.hash !== '#explore') return;
  e.preventDefault();
  const group = url.searchParams.get('group');
  const cat = url.searchParams.get('category');
  state.cats = new Set(group && NAV_GROUPS[group] ? NAV_GROUPS[group] : cat ? cat.split(',') : []);
  state.q = ''; state.tech = ''; state.status = '';
  qInput.value = ''; techSel.value = ''; statusSel.value = ''; $('#q-clear').hidden = true;
  render();
  showExplore();
});

/* nav highlight: section in view, or the category group when filtering */
let section = 'overview';
function syncNav() {
  let key = section;
  if (section === 'all') {
    const cats = [...state.cats].sort().join();
    const hit = Object.entries(NAV_GROUPS).find(([, g]) => [...g].sort().join() === cats);
    if (hit) key = hit[0];
  }
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.getAttribute('data-nav') === key) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}
const SECTION_KEYS = { top: 'overview', explore: 'all', featured: 'all', about: 'about', contact: 'contact' };
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { section = SECTION_KEYS[en.target.id] || section; syncNav(); } });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(SECTION_KEYS).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
}

/* ------------------------------------------------------- featured + contact */
$('#featured-list').innerHTML = PROJECTS
  .filter((p) => (p.featured ?? 99) <= SITE.featuredLimit)
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
  .map(featureBlock).join('');
$('#contact-slot').innerHTML = contactSection();

readUrl();
render(false);
observeReveals();

// Arriving with a filter in the URL (e.g. from the nav on a project page): land on the grid.
if (location.hash === '#explore' && (state.cats.size || state.q)) requestAnimationFrame(showExplore);
