# afaquejaya.github.io

Personal portfolio of **Afaque Jaya**, Senior Mobile & Full-Stack Engineer —
live at <https://afaquejaya.github.io/>. The online CV lives separately at
[`cv/cv.html`](https://afaquejaya.github.io/cv/cv.html).

Plain static HTML, CSS and JavaScript served by GitHub Pages. No framework,
no build step and no runtime dependencies.

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | The page: hero + logo strip, published apps, SaaS & AI builds (Rental SaaS + MCP, GlowFit AI, Pregnancy Tracker), impact, case studies, career journey, skills, about, contact |
| `css/main.css` | Design system and all styles (tokens at the top) |
| `js/data.js` | **Published apps** and the **logo strip** — names, copy, metrics, store links, screenshots. Edit them here |
| `js/main.js` | Renders the apps, adds tech logos to skill chips (`TECH` map), sliding section tabs, pinned horizontal-scroll sections (`data-hscroll`), scroll reveals, parallax, mobile menu, counters |
| `js/mascot.js` | The bottom-right 3D avatar: head and eyes follow the cursor; clicking it opens the AI Portfolio Guide (behaviour adapted from [page-mascot](https://github.com/nilbuild/page-mascot), MIT) |
| `js/concierge.js` + `css/concierge.css` | **AI Portfolio Guide** — the chat panel behind the avatar: answers, allowlisted navigation, highlights, follow-ups |
| `js/concierge-data.js` | The guide's **knowledge base**: verified answers, question library, navigation allowlist (section ids + links) |
| `img/apps/` | App icons and store screenshots (from the public store listings, re-encoded to WebP) |
| `img/profile/` | Profile photo in WebP/JPEG sizes |
| `img/projects/` | Screenshots and icons for the SaaS / AI / Android projects (GlowFit screenshots are real; see index.html captions) |
| `files/` | Downloadable CV (PDF) used by the Download CV buttons |
| `img/tech/` | Tech logos shown next to skills (Devicon / Simple Icons) — see `img/tech/README.md` |
| `img/mascot/` | Avatar sprite sheets + vector masters — see `img/mascot/README.md` |
| `tools/mascot/build.cjs` | Regenerates the avatar sprite sheets |
| `cv/` | The online CV (separate page) |

## Preview locally

```bash
python -m http.server 5173
```

Then open <http://localhost:5173/>.

## Updating apps

Add or edit an entry in `js/data.js`. Screenshots marked `kind: 'ui'` are
raw app captures and get a phone frame; `kind: 'store'` are store marketing
panels that already include device art and are shown as cards.

## AI Portfolio Guide

Clicking the bottom-right avatar opens a chat panel for recruiters. It never
opens on its own.

- **Answers are deterministic.** Every answer lives in `js/concierge-data.js`
  and comes from the CV or this site. A visitor's question is matched to an
  intent there. Anything the portfolio doesn't cover gets an honest "no
  evidence" reply, never a guess. Answers about things not shown in the
  portfolio are marked `kind: 'approach'` and labelled as such in the chat.
- **Navigation is allowlisted.** Actions can only scroll to the ids in
  `sections` (via `window.PortfolioNav` in `js/main.js`) or open the URLs in
  `links`. Visitor text is never turned into a URL, selector or code.
- **To edit:** change an intent's `answer`, `actions` or `next` follow-ups,
  or add an intent with `keys` for matching. Keep every claim backed by the
  CV.
- **Optional AI fallback:** GitHub Pages can't keep an API key secret, so
  `config.aiEndpoint` is empty. To enable AI answers for unmatched
  questions, deploy a serverless function that holds the provider key. It
  should rate-limit, ground the model in the CV, and accept
  `POST { "question": string }` → `{ "answer": string }`. Then set its URL
  in `config.aiEndpoint`. Failures fall back to the local answer.
