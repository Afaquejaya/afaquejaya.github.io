// @ts-check
/**
 * Project case-study page: project.html?id=<project id>.
 * One template for every project; sections without data are skipped.
 */
import { PROJECTS } from './projects-data.js';
import { SITE, STATUS, VISIBILITY } from './config.js';
import {
  esc, attr, asset, byId, category, sortProjects, projectUrl, isPhone, statusBadge, catLabel, visibilityNote,
  techChips, linkTile, stage, archDiagram, projectCard, initChrome, observeReveals, setMeta, ICON
} from './ui.js';

/** @typedef {import('./projects-data.js').Project} Project */

initChrome();

const root = /** @type {HTMLElement} */ (document.getElementById('project-root'));
const id = new URLSearchParams(location.search).get('id') || '';
const p = byId(id);

if (!p) renderNotFound();
else renderProject(p);

function renderNotFound() {
  setMeta({ title: 'Project not found — Afaque Jaya', description: 'This project could not be found in the catalog.' });
  const meta = document.createElement('meta');
  meta.name = 'robots'; meta.content = 'noindex';
  document.head.appendChild(meta);
  root.innerHTML = `<div class="wrap"><div class="not-found">
    <p class="eyebrow">404 · Not in the catalog</p>
    <h1>That project isn’t here.</h1>
    <p>The link may be out of date, or the project was renamed. Every project I’ve published is in the catalog.</p>
    <a class="btn" href="index.html#explore">Browse all projects <span class="arrow" aria-hidden="true">→</span></a>
  </div></div>`;
}

/** Paragraphs from a text block (blank line = new paragraph). */
function paras(/** @type {string} */ s) {
  return s.split(/\n\s*\n/).map((x) => `<p>${esc(x.trim())}</p>`).join('');
}

function related(/** @type {Project} */ p) {
  const picked = (p.related || []).map(byId).filter(Boolean);
  if (picked.length >= 3) return /** @type {Project[]} */ (picked.slice(0, 3));
  const score = (/** @type {Project} */ q) =>
    q.categories.filter((c) => p.categories.includes(c)).length * 2 +
    q.technologies.filter((t) => p.technologies.includes(t)).length;
  const rest = PROJECTS.filter((q) => q.id !== p.id && !picked.includes(q)).sort((a, b) => score(b) - score(a));
  return /** @type {Project[]} */ ([...picked, ...rest].slice(0, 3));
}

function renderProject(/** @type {Project} */ p) {
  const url = SITE.url + projectUrl(p.id);
  setMeta({
    title: `${p.title} — Afaque Jaya`,
    description: `${p.tagline} ${p.summary || ''}`.trim().slice(0, 300),
    url,
    image: p.thumbnail && p.thumbnail.frame !== 'logo' ? new URL(asset(p.thumbnail.src), location.href).href : undefined
  });
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': (p.links || []).some((l) => l.type === 'play' || l.type === 'ios') ? 'SoftwareApplication' : 'CreativeWork',
    name: p.title,
    description: p.tagline,
    url,
    keywords: p.technologies.join(', '),
    author: { '@type': 'Person', name: 'Afaque Jaya', url: 'https://afaquejaya.github.io/' }
  });
  document.head.appendChild(ld);

  /* ------------------------------------------------------------ sections */
  /** @type {{ id: string, title: string, html: string }[]} */
  const secs = [];
  const add = (/** @type {string} */ sid, /** @type {string} */ title, /** @type {string} */ html) => { if (html) secs.push({ id: sid, title, html }); };

  const facts = [
    ['Context', p.context], ['Period', p.period], ['Platforms', (p.platforms || []).join(' · ')],
    ['Status', STATUS[p.status].label], ['Source', p.visibility ? VISIBILITY[p.visibility] : '']
  ].filter(([, v]) => v);
  add('overview', 'Overview',
    `${p.description ? `<div class="prose">${paras(p.description)}</div>` : p.summary ? `<div class="prose"><p>${esc(p.summary)}</p></div>` : ''}
     <dl class="facts-dl">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`);

  if (p.problem || p.solution) {
    add('problem', 'Problem & solution', `<div class="ps-grid">
      ${p.problem ? `<div class="ps-card"><p class="mini-h">The problem</p><p>${esc(p.problem)}</p></div>` : ''}
      ${p.solution ? `<div class="ps-card is-solution" style="--c:${attr(p.accent || '')}"><p class="mini-h">The solution</p><p>${esc(p.solution)}</p></div>` : ''}
    </div>`);
  }

  if (p.features && p.features.length) {
    const built = p.features.filter((f) => !f.planned);
    const planned = p.features.filter((f) => f.planned);
    const item = (/** @type {import('./projects-data.js').Feature} */ f) =>
      `<li class="feat"><b>${esc(f.title)}</b>${f.detail ? `<span>${esc(f.detail)}</span>` : ''}${f.planned ? '<span class="tagline">Planned · not built yet</span>' : ''}</li>`;
    add('features', 'Key features',
      `<ul class="feat-grid">${built.map(item).join('')}</ul>
       ${planned.length ? `<p class="mini-h" style="margin-top:8px">Planned</p><ul class="feat-grid">${planned.map(item).join('')}</ul>` : ''}`);
  }

  if (p.agent) {
    const a = p.agent;
    const rows = [
      ['Objective', a.objective], ['How it receives a task', a.input], ['How it decides', a.reasoning],
      ['Execution & results', a.execution], ['Human approval & safety', a.safety], ['Model strategy', a.models]
    ];
    add('agent', 'How the agent works',
      `<ul class="feat-grid agent-grid">${rows.map(([k, v]) => `<li class="feat"><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}
        <li class="feat agent-tools"><b>Tools it can use</b>${techChips(a.tools)}</li></ul>`);
  }

  if (p.role && p.role.length) add('role', 'My role & contributions', `<ul class="role-list">${p.role.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`);

  if (p.architecture) {
    add('architecture', 'Architecture',
      `${p.architecture.summary ? `<div class="prose"><p>${esc(p.architecture.summary)}</p></div>` : ''}${archDiagram(p.architecture, p.accent)}`);
  }

  const stackGroups = p.stack ? Object.entries(p.stack) : [];
  add('stack', 'Technology stack', stackGroups.length
    ? `<div class="stack-groups">${stackGroups.map(([g, list]) => `<div class="stack-group"><p class="mini-h">${esc(g)}</p>${techChips(list)}</div>`).join('')}</div>`
    : techChips(p.technologies));

  if (p.challenges && p.challenges.length) {
    add('challenges', 'Engineering challenges', `<div style="display:grid;gap:12px">${p.challenges.map((c) =>
      `<div class="challenge"><b>${esc(c.title)}</b><p>${esc(c.detail)}</p>${c.resolution ? `<p class="how"><strong>How I handled it:</strong> ${esc(c.resolution)}</p>` : ''}</div>`).join('')}</div>`);
  }

  if (p.decisions && p.decisions.length) {
    const line = (/** @type {string} */ cls, /** @type {string} */ label, /** @type {string | undefined} */ text) =>
      text ? `<p class="${cls}"><strong>${label}:</strong> ${esc(text)}</p>` : '';
    add('decisions', 'Decisions — what, why and the trade-off',
      `<p class="impact-src" style="margin-bottom:14px">Each decision names the requirement that drove it and what it bought in practice. None of them guarantees security or unlimited scale; the trade-offs say where the limits are.</p>
       <div class="feat-grid">${p.decisions.map((d) =>
      `<div class="tradeoff"><b>${esc(d.title)}</b><p>${esc(d.detail)}</p>${line('why', 'Why', d.why)}${line('benefit', 'Benefit', d.benefit)}${d.tradeoff ? `<p class="cost">${esc(d.tradeoff)}</p>` : ''}</div>`).join('')}</div>`);
  }

  if (p.impact && p.impact.length) {
    // "CV" figures are my own project reporting, not an audit — say so.
    const sources = [...new Set(p.impact.map((m) => m.source).filter(Boolean))]
      .map((s) => (s === 'CV' ? 'my CV — self-reported from project work at the time, not independently audited' : s));
    add('impact', 'Results & impact',
      `<ul class="impact-list">${p.impact.map((m) => `<li class="outcome"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></li>`).join('')}</ul>
       ${sources.length ? `<p class="impact-src">Source: ${esc(sources.join('; '))}.</p>` : ''}${p.impactNote ? `<p class="impact-src">${esc(p.impactNote)}</p>` : ''}`);
  }

  if (p.screenshots && p.screenshots.length > 1) {
    add('screens', 'Screens', `<div class="gallery-wrap">
      <div class="gallery" tabindex="0" aria-label="${attr(p.title)} screenshots — scroll horizontally">${p.screenshots.map((s) =>
        `<figure class="${isPhone(s) ? 'g-phone' : 'g-web'}" data-media="${attr(p.id)}"><img src="${attr(asset(s.src))}" width="${s.w}" height="${s.h}" alt="${attr(s.alt)}" loading="lazy" decoding="async" data-fallback>${s.caption ? `<figcaption>${esc(s.caption)}</figcaption>` : ''}</figure>`).join('')}</div>
      ${p.screenshotsNote ? `<p class="impact-src" style="margin-top:6px">${esc(p.screenshotsNote)}</p>` : ''}
    </div>`);
  }

  const links = p.links || [];
  add('links', 'Links', links.length
    ? `<div class="link-list">${links.map(linkTile).join('')}</div>`
    : `<div class="callout">${ICON.lock}<p>${p.visibility === 'internal' ? 'This is an employer product. There is no public link or source to share — the overview above is the case study.' : 'There is no public demo or repository for this project yet — the overview above is the full write-up.'}</p></div>`);

  add('related', 'Related projects', `<div class="grid">${related(p).map((q, i) => projectCard(q, i)).join('')}</div>`);

  /* --------------------------------------------------------------- hero */
  const ordered = sortProjects(PROJECTS);
  const pos = ordered.findIndex((q) => q.id === p.id);
  const prev = ordered[(pos - 1 + ordered.length) % ordered.length];
  const next = ordered[(pos + 1) % ordered.length];
  const heroLinks = links.filter((l) => l.type !== 'case').slice(0, 3);
  const art = p.thumbnail && p.thumbnail.illustrative && !(p.screenshots || []).length;
  const mediaNote = art
    ? 'Illustrative concept artwork, made for this portfolio — not a screenshot of the shipped product.' + (p.screenshotsNote ? ' ' + p.screenshotsNote : '')
    : p.screenshotsNote || (p.thumbnail && p.thumbnail.caption) || (p.thumbnail || (p.screenshots || []).length ? '' : 'No public screenshots — the visual is a neutral illustration, not the product.');

  root.innerHTML = `
  <section class="d-hero" aria-labelledby="p-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Projects</a><span aria-hidden="true">/</span><a href="index.html?category=${attr(p.categories[0])}#explore">${esc(category(p.categories[0])?.label || p.categories[0])}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.title)}</span></nav>
      <div class="d-head">
        <div style="display:grid;gap:16px">
          <div class="d-tags">${p.categories.map(catLabel).join('')}</div>
          <div class="d-title-row">
            ${p.icon ? `<img class="d-icon" src="${attr(asset(p.icon))}" width="72" height="72" alt="" decoding="async">` : ''}
            <h1 id="p-title">${esc(p.title)}</h1>
          </div>
          <p class="d-tagline">${esc(p.tagline)}</p>
        </div>
        <div class="d-links-col">
          <div class="d-tags">${statusBadge(p)}${visibilityNote(p)}</div>
          ${heroLinks.length ? `<div class="d-links">${heroLinks.map((l, i) =>
            `<a class="btn${i ? ' ghost' : ''}" href="${attr(l.url)}" target="_blank" rel="noopener">${esc(l.label || 'Open')} <span class="arrow up" aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>`).join('')}</div>` : ''}
        </div>
      </div>
      <div class="d-media" style="--c:${attr(p.accent || 'var(--accent)')}" data-media="${attr(p.id)}">${stage(p, true)}</div>
      ${mediaNote ? `<p class="d-media-caption">${esc(mediaNote)}</p>` : ''}
      ${p.notes && p.notes.length ? `<div class="callout is-warn" style="margin-top:20px">${ICON.info}<div><p class="mini-h" style="margin-bottom:6px">Good to know</p><ul class="role-list">${p.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div></div>` : ''}
    </div>
  </section>

  <div class="wrap">
    <div class="d-layout">
      <aside class="toc" aria-label="On this page">
        <p class="mini-h">On this page</p>
        <ol>${secs.map((s) => `<li><a href="#${s.id}">${esc(s.title)}</a></li>`).join('')}</ol>
      </aside>
      <div class="d-sections">
        ${secs.map((s, i) => `<section class="d-sec" id="${s.id}" aria-labelledby="${s.id}-h" data-reveal>
          <h2 id="${s.id}-h"><span class="n">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</h2>
          ${s.html}
        </section>`).join('')}

        <nav class="d-nav" aria-label="More projects">
          <a class="prev" href="${attr(projectUrl(prev.id))}"><small>← Previous</small><b>${esc(prev.title)}</b></a>
          <a class="next" href="${attr(projectUrl(next.id))}"><small>Next →</small><b>${esc(next.title)}</b></a>
        </nav>
        <div style="display:flex;flex-wrap:wrap;gap:10px">
          <a class="btn ghost" href="index.html#explore">← All projects</a>
          <a class="btn" href="index.html#contact">Talk about a project like this <span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </div>
  </div>`;

  root.querySelectorAll('.card').forEach((c) => c.classList.remove('is-entering'));
  observeReveals(root);
  tocSpy(secs.map((s) => s.id));
  // Restore a deep link to a section after rendering.
  if (location.hash.length > 1) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}

function tocSpy(/** @type {string[]} */ ids) {
  if (!('IntersectionObserver' in window)) return;
  const links = new Map(ids.map((i) => [i, document.querySelector(`.toc a[href="#${i}"]`)]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a?.removeAttribute('aria-current'));
      links.get(en.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  ids.forEach((i) => { const el = document.getElementById(i); if (el) io.observe(el); });
}
