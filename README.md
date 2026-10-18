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
| `js/testimonials.js` | **Feedback cards** for “What it’s like working with me”. Ships with clearly marked *sample* drafts — replace them with verified testimonials (see below) |
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

## Updating testimonials

The “What it’s like working with me” section (`#feedback`) is rendered from
`js/testimonials.js` as one slow, continuously scrolling row (it pauses on
hover and becomes a swipeable row on touch screens). The entries it ships with
are **illustrative drafts**, written from the projects on this site — they are
not quotes from real people, and nothing on the page marks them as drafts.
`verified: false` in the data file is the only record of which ones they are.

To publish real feedback:

1. Ask the person for a short note (20–40 words) and for permission to show it,
   together with what they are happy to display (role and context are enough;
   name or a profile link only if they agree).
2. Replace a sample entry: paste the quote into `quote` (wrap one phrase in
   `*asterisks*` to highlight it), set `rating` (1–5, halves allowed), fill
   `who` (`role`, `context`, optional `name`, `link`) and point `ref` at the
   matching case study or app. For the avatar, add the person's `photo`
   (drop it in `img/feedback/`) or, for company feedback, the company `logo`
   (e.g. one from `img/logos/`); otherwise initials are shown.
3. Set `verified: true` so the file records which entries are real.
4. Delete any sample entry you have not replaced — do not leave drafts
   presented as real reviews.

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

### How the avatar chatbot works

Three files work together: `js/mascot.js` draws the avatar,
`js/concierge.js` runs the chat, and `js/concierge-data.js` holds
everything the chat can say or do.

```text
click avatar ──▶ mascot.js ──▶ Concierge.toggle() ──▶ chat panel opens
                                                          │
visitor types or taps a chip ─────────────────────────────┘
        │
        ▼
  clean + safety check ──(link / code / HTML?)──▶ "I can't open that"
        │
        ├─ "take me to …"? ──▶ allowlisted section ──▶ scroll + highlight
        │
        ├─ score every intent ──▶ confident match ──▶ stored answer + buttons
        │
        └─ no match ──▶ AI endpoint (only if configured) ──▶ honest fallback
```

**1. The avatar (`js/mascot.js`).** The 3D render
`img/mascot/afaque-head.webp` is drawn twice: once clipped to the
shoulders, which never move, and once clipped to the head, which rotates
around the neck. SVG eyes sit over the render's eyes. On mouse and pen
devices the eyes follow the cursor, the head leans after them, and both
ease back to neutral after 3 s of no movement. It blinks at random, and a
glint sweeps across the glasses. Touch screens get a still avatar that only
blinks. Below 760 px wide it docks inside the About section rather than
floating bottom-right. It hides while you scroll on touch screens, near the
contact links and when the mobile menu is open.

The first time it is settled and on screen, a "Hi, I'm Afaque's AI guide"
bubble appears for about 7 s. It shows once per browser session, which is
tracked in `sessionStorage`. Clicking the avatar or the bubble makes the
head nod and blink, then calls `window.Concierge.toggle()`. While the panel
is open the avatar stays calm: the eyes still track, but the head barely
moves.

**2. Understanding a question (`js/concierge.js`).** Each message goes
through these steps in order:

1. **Clean:** control characters are stripped and the text is cut to
   `config.maxInput` (300) characters. Sends closer than 450 ms apart are
   dropped.
2. **Safety check:** text that looks like a URL, a domain, HTML,
   `javascript:` or code gets a fixed "I can only show sections of this
   portfolio" reply.
3. **Navigation:** text that starts with a verb like "go to", "take me" or
   "show me the" is matched against `SECTION_WORDS`. If a section is found,
   the page scrolls there through `window.PortfolioNav`, the section glows
   for a moment, and a "Now showing" note appears. On phones the panel
   shrinks to a pill so it doesn't cover the content.
4. **Intent scoring:** the text is lower-cased and split into words, and
   filler words ("the", "how", "afaque", …) are dropped. Each intent in
   `concierge-data.js` gets a score:

   | Match | Points |
   | --- | --- |
   | Exact question text | 100 |
   | Strong phrase key (`'^two words'`) | 3.5 |
   | Strong word key (`'^word'`) | 3 |
   | Phrase key (`'two words'`) | 2.6 |
   | Word key, including prefixes of 4+ letters like `communicat` → `communication` | 1.25 |

   The best intent wins if it scores 2.4 or more, or 1.25 or more with a
   clear lead over the runner-up. The bot then shows a short typing
   indicator, the stored answer, its action buttons and 2–3 follow-up
   chips from `next`.
5. **Fallback:** if nothing matches and `config.aiEndpoint` is set, the
   question is posted there (at most 20 calls per visit, 2.5 s apart, 9 s
   timeout). Otherwise, or if that call fails, the bot says the portfolio
   doesn't answer that question and offers the closest questions, the
   Ask-AI card and an email link.

**3. Rendering and actions.** Messages are built with `textContent` only and
never with `innerHTML` from visitor input. A button can do just two things:
`{ nav: key }` scrolls to an id listed in `sections`, and `{ link: key }`
opens a URL listed in `links`. Visitors can also browse questions by
category (`categories`) without typing anything. Nothing they type is
stored or sent anywhere unless an AI endpoint is configured.

**Adding a question:** add an object to `intents` in
`js/concierge-data.js` with `id`, `q`, `keys`, `answer` and, optionally,
`actions` and `next`. For a new destination, add it to `sections` (with a
real element id from `index.html`) or `links` first.
