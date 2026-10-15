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
| `js/mascot.js` | The cursor-following avatar (vanilla port of [page-mascot](https://github.com/nilbuild/page-mascot), MIT) |
| `img/apps/` | App icons and store screenshots (from the public store listings, re-encoded to WebP) |
| `img/profile/` | Profile photo in WebP/JPEG sizes |
| `img/projects/` | Screenshots and icons for the SaaS / AI / Android projects (GlowFit screenshots are real; see index.html captions) |
| `files/` | Downloadable CV (PDF) used by the Download CV buttons |
| `img/tech/` | Tech logos shown next to skills (Devicon / Simple Icons) — see `img/tech/README.md` |
| `img/mascot/` | Avatar sprite sheets + vector masters — see `img/mascot/README.md` |
| `tools/mascot/build.cjs` | Regenerates the avatar sprite sheets |
| `cv/` | The online CV (separate page, untouched by the portfolio) |

## Preview locally

```bash
python -m http.server 5173
```

Then open <http://localhost:5173/>.

## Updating apps

Add or edit an entry in `js/data.js`. Screenshots marked `kind: 'ui'` are
raw app captures and get a phone frame; `kind: 'store'` are store marketing
panels that already include device art and are shown as cards.
