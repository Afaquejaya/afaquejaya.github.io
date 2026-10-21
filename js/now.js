/*
 * The "Now" section — what I'm building and learning this month.
 * Edit this file (not index.html) to update it; js/main.js renders it into
 * #now-root and shows `updated` next to the section lead.
 *
 * Ground rules: only projects that are genuinely in progress, statuses as
 * they stand today, and links that exist. Planned work is called planned.
 * The learning list mirrors the projects marked `status: 'learning'` in
 * projects/js/projects-data.js — keep the two in step.
 *
 * Checked 22 Oct 2026 against each project's latest commit and README.
 */
window.NOW = {
  updated: '22 Oct 2026',

  /* A. In progress this month.
     `shots` are real screenshots (paths from the site root, the same files the
     project showcase uses). `frame` picks the device: 'web' gets a browser bar
     showing `address` and a slideshow, 'phone' gets a row of phone frames.
     `spotlight: true` gives one project the wide card at the top. */
  building: [
    {
      name: 'Boring Doc',
      status: 'Live · private source',
      spotlight: true,
      what: 'We read the boring docs so you don’t have to: the official Flutter docs, release notes and API turned into 30-second explanations, real version-to-version comparisons and a cited “what changed”.',
      progress: 'Live on Vercel (22 Oct 2026) with 13 Flutter topics, 180 stable releases and 3,679 indexed changes, synced daily from the official sources.',
      next: 'A second ecosystem through the generic adapters — React Native, Android or Jetpack Compose.',
      stats: [
        { value: '3,679', label: 'indexed changes' },
        { value: '180', label: 'stable releases' },
        { value: '4,624', label: 'API symbols' }
      ],
      tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'PGlite', 'Anthropic API'],
      frame: 'web',
      address: 'fresh-doc-1qhf.vercel.app',
      shots: [
        { src: 'img/projects/boring-doc/home.webp', w: 1280, h: 800, caption: 'Home — every number comes from the live index', alt: 'Boring Doc home page with search, suggested questions, an interactive widget-tree preview and counters for releases, changes, migration guides, API symbols and doc pages' },
        { src: 'img/projects/boring-doc/compare.webp', w: 1280, h: 800, caption: 'Compare two real Flutter versions — 3.41.0 → 3.47.7', alt: 'Version Comparison Studio: 1,629 changes between Flutter 3.41.0 and 3.47.7, 10 breaking or removed, 10 deprecations, with a category bar' },
        { src: 'img/projects/boring-doc/topic.webp', w: 1280, h: 800, caption: 'Topics — an interactive widget tree and an honest analogy', alt: 'Topic page with an expandable widget tree, a real-world analogy and a note on where the analogy breaks' },
        { src: 'img/projects/boring-doc/whats-new.webp', w: 1280, h: 800, caption: 'What’s new — grouped by impact, evidence on every card', alt: 'What’s new in Flutter 3.47: release timeline, category bar and breaking-change cards with migration-guide badges' }
      ],
      links: [
        { label: 'Open the live site', url: 'https://fresh-doc-1qhf.vercel.app/', external: true },
        { label: 'Case study', url: 'projects/project.html?id=boring-doc' }
      ]
    },
    {
      name: 'ProspectPilot AI',
      status: 'In development',
      what: 'An evidence-first sales agent that finds UAE/GCC companies who need what you sell, proves it from their public websites, and drafts cited outreach in English and Arabic. A human approves everything; nothing is sent.',
      progress: 'The full pipeline — ICP, discovery, research, scoring, EN/AR drafts, approvals — runs end to end on demo data and on real domains (21 Oct 2026).',
      next: 'Verify the Google Places and Brave adapters and a full Claude run with real keys, then a native Arabic review of the drafts.',
      tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'Anthropic API'],
      frame: 'web',
      address: 'ProspectPilot · demo workspace',
      shotsNote: 'Demo data · fictional companies',
      shots: [
        { src: 'img/projects/prospectpilot/leads.webp', w: 1280, h: 800, caption: 'Ranked leads, each with the problem it found', alt: 'Leads page ranking synthetic companies by score with detected needs such as slow mobile homepage and no Arabic version' },
        { src: 'img/projects/prospectpilot/run.webp', w: 1280, h: 800, caption: 'A live run — steps, tool budget and AI cost cap', alt: 'Discovery run with Plan, Find, Research, Score, Draft and Review steps, companies found and researched, and budget meters' },
        { src: 'img/projects/prospectpilot/dossier.webp', w: 1280, h: 800, caption: '“Why this lead?” — the score, explained', alt: 'Lead dossier for a synthetic dental clinic: score 94, need signals with sources and a score breakdown' },
        { src: 'img/projects/prospectpilot/drafts.webp', w: 1280, h: 800, caption: 'English + Arabic drafts that cite their evidence', alt: 'WhatsApp-style English draft and Arabic email draft with numbered citations and Approve, Edit, Reject buttons' }
      ],
      links: [{ label: 'Case study', url: 'projects/project.html?id=prospectpilot' }]
    },
    {
      name: 'AI Job Agent',
      status: 'In development',
      what: 'A local-first agent that searches allowlisted job boards, scores each listing against your CV in code and backs every claim with a verbatim quote. It never applies or messages anyone.',
      progress: 'Phases 1–3 of a 12-phase roadmap are built — foundation, data layer with per-user isolation, and a durable background-task engine (live-checked 19 Oct 2026, awaiting sign-off).',
      next: 'Phase 4 — the AI provider layer and the chat shell.',
      tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'Ollama', 'Anthropic API'],
      frame: 'web',
      address: 'localhost:3000 · self-hosted',
      shotsNote: 'Sample account',
      shots: [
        { src: 'img/projects/job-agent/jobs.webp', w: 800, h: 620, caption: 'Find jobs → ranked by skills match', alt: 'Jobs page with a completed search that saved 13 jobs and a list of matched roles with skills percentages' },
        { src: 'img/projects/job-agent/agent.webp', w: 800, h: 460, caption: 'Agent chat — states its limits and the model in use', alt: 'Agent page explaining what the agent can and cannot do, showing the local Ollama model in use' },
        { src: 'img/projects/job-agent/activity.webp', w: 800, h: 380, caption: 'Durable background tasks with a step log', alt: 'Activity page listing a running match analysis and completed search and CV tasks' }
      ],
      links: [
        { label: 'Source on GitHub', url: 'https://github.com/Afaquejaya/ai-job-agent', external: true },
        { label: 'Case study', url: 'projects/project.html?id=ai-job-agent' }
      ]
    },
    {
      name: 'Rental Property Management SaaS + MCP',
      status: 'Live · private source',
      what: 'The whole rent cycle for landlords — leases, bills, payments, expenses and a tenant portal — plus ten read-only MCP tools so an authorised AI client can ask about an owner’s own data.',
      progress: 'Latest work (18 Oct 2026): redesigned maintenance requests, vendors, the lease form and every create/edit form.',
      next: 'Release validation — two-account isolation (IDOR) testing, and verifying the MCP tools end to end with a real MCP client. Online payments stay off until a provider is configured.',
      tags: ['JavaScript', 'PostgreSQL', 'MCP', 'Hatchable'],
      frame: 'web',
      address: 'rental-property.hatchable.site',
      shotsNote: 'Sample data',
      shots: [
        { src: 'img/projects/rental/dashboard.webp', w: 1280, h: 632, caption: 'Dashboard — the month at a glance', alt: 'Landlord dashboard with expected, collected and overdue rent, occupancy and a pending-rent list' },
        { src: 'img/projects/rental/invoices.webp', w: 1280, h: 720, caption: 'Invoices and balances', alt: 'Invoices screen with totals and a filterable list of rent invoices' },
        { src: 'img/projects/rental/property-ai.webp', w: 398, h: 462, caption: 'Property AI — read-only, cites its source', alt: 'Property AI panel answering which tenants have overdue rent, with amounts, days overdue and a source line' }
      ],
      links: [
        { label: 'Live app (sign-in required)', url: 'https://rental-property.hatchable.site/', external: true },
        { label: 'Case study', url: 'projects/project.html?id=rental-saas' }
      ]
    },
    {
      name: 'Pregnancy Tracker',
      status: 'Prototype',
      what: 'A fully offline, week-by-week Android companion with two home-screen widgets. No account; nothing leaves the device.',
      progress: 'Latest work (17 Oct 2026): the widget redesigned as a “Pregnancy Timeline”, with documentation.',
      next: 'A Google Play release. Release signing is wired up but not done; until then it ships as a test APK.',
      tags: ['Kotlin', 'Jetpack Compose', 'Room', 'AppWidget'],
      frame: 'phone',
      shots: [
        { src: 'img/projects/pregnancy/dark-timeline.webp', w: 540, h: 1202, caption: '40-week timeline', alt: 'Pregnancy Tracker 40-week timeline in dark mode' },
        { src: 'img/projects/pregnancy/dark-home.webp', w: 540, h: 1202, caption: 'Home', alt: 'Pregnancy Tracker home in dark mode: week 25, 108 days to go and baby size this week' },
        { src: 'img/projects/pregnancy/home.webp', w: 560, h: 1245, caption: 'Light theme', alt: 'Pregnancy Tracker home in the light theme' }
      ],
      links: [{ label: 'Case study', url: 'projects/project.html?id=pregnancy-tracker' }]
    }
  ],

  /* B. Learning by building — the five projects catalogued as "learning".
     `thumb.concept` marks concept art, which is labelled as such on the page. */
  learning: [
    {
      name: 'Local AI Agent Lab', when: 'Oct 2026 —', current: true,
      thumb: { src: 'img/projects/local-agent-lab/concept.webp', concept: true, alt: 'Concept art of the planned agent loop' },
      tech: ['TypeScript', 'Node.js', 'Ollama', 'Zod', 'Vitest'],
      learning: 'How an agent loop actually works — context, model decision, argument validation, policy and approvals — by writing each part by hand instead of using a framework.',
      status: 'Phase 2 of 9: chat with a local model from the terminal and a local API. Tools arrive in phase 3, the agent loop in phase 4.',
      links: [
        { label: 'GitHub', url: 'https://github.com/Afaquejaya/learn-basic-ai-agent', external: true },
        { label: 'Case study', url: 'projects/project.html?id=local-agent-lab' }
      ]
    },
    {
      name: 'AI Smart Expense Tracker', when: 'Jun 2026', current: true,
      thumb: { src: 'img/projects/expense/screen.webp', alt: 'App screen: a sentence turned into two expense cards' },
      tech: ['Flutter', 'Python', 'FastAPI', 'Pydantic'],
      learning: 'How an app should behave around an LLM call: an “AI hook” modelled on LangChain’s callback lifecycle drives the loading, strict-JSON and error states.',
      status: 'The backend returns a simulated model response; wiring in a real LLM is the next step.',
      links: [
        { label: 'GitHub', url: 'https://github.com/Afaquejaya/ai-expense-tracker', external: true },
        { label: 'Case study', url: 'projects/project.html?id=expense-tracker' }
      ]
    },
    {
      name: 'Video Calling App', when: 'Feb 2022',
      thumb: { src: 'img/projects/video-calling/concept.webp', concept: true, alt: 'Concept art of a video call and a live stream' },
      tech: ['Java', 'Android', 'Agora', 'Truecaller SDK'],
      learning: 'Real-time communication on Android: one-to-one video and voice calls, and single-channel live streaming.',
      status: 'Finished as a learning build; the source is private.',
      links: [{ label: 'Case study', url: 'projects/project.html?id=video-calling' }]
    },
    {
      name: 'Face Detection', when: 'Jan 2020',
      thumb: { src: 'img/projects/face/screen-1.webp', alt: 'Face detection results drawn on a photo' },
      tech: ['Java', 'Kotlin', 'Android', 'Microsoft Face API'],
      learning: 'Calling a cloud vision API from a native app and drawing its results — faces, landmarks and attributes — on the photo.',
      status: 'Finished as a learning build.',
      links: [{ label: 'Case study', url: 'projects/project.html?id=face-detection' }]
    },
    {
      name: 'Social Media App', when: 'Feb 2019',
      thumb: { src: 'img/projects/social/feed.webp', alt: 'Social Media App feed screen' },
      tech: ['Java', 'Kotlin', 'PHP', 'Firebase', 'Firestore', 'Agora'],
      learning: 'Auth, real-time data, chat and calls in one Android app: Google Sign-In, posts, friends and notifications.',
      status: 'Finished as a learning build.',
      links: [
        { label: 'GitHub', url: 'https://github.com/Afaquejaya/SocialMediaApp', external: true },
        { label: 'Case study', url: 'projects/project.html?id=social-app' }
      ]
    }
  ],

  /* C. Current focus and the next milestone */
  focus: {
    statement: 'Agent systems with explicit safety boundaries — hand-written tool loops, side-effect-aware policies and MCP — on top of the mobile and SaaS products they serve.',
    milestone: {
      project: 'AI Job Agent',
      text: 'Phase 4, the AI provider layer and chat shell, once phase 3 is signed off.',
      url: 'https://github.com/Afaquejaya/ai-job-agent'
    }
  }
};
