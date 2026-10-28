// @ts-check
/**
 * The project catalog. Every page of the showcase is rendered from this file.
 *
 * To add a project: append an object to PROJECTS (only the fields marked
 * required are needed), drop its images in /img/projects/<id>/, done.
 *
 * Ground rules for content (keep them when editing):
 *  - Only claims backed by the CV PDF, the store listings or the project's
 *    own code/README. Metrics carry a `source`.
 *  - Mark limits honestly: `planned` features, `notes` callouts, `status`.
 *  - No secrets, customer data, private repo links or employer internals.
 *
 * Sources checked 19 Oct 2026: files/Afaque-Jaya-Senior-Mobile-Full-Stack-Engineer-CV.pdf,
 * js/data.js (store listings, 15 Oct 2026), the public repos on
 * github.com/Afaquejaya, and the local project folders.
 *
 * Image paths are relative to the portfolio root (they resolve through
 * SITE.assetBase in config.js), so the main site and the showcase share one
 * copy of each file.
 */

/**
 * @typedef {'mobile'|'web'|'saas'|'ai'|'agents'|'backend'|'experiments'} CategoryId
 * @typedef {'live'|'shipped'|'in-development'|'prototype'|'learning'} Status
 * @typedef {'public'|'private'|'internal'|'client'} Visibility
 *
 * @typedef {Object} Image
 * @property {string} src            Path from the portfolio root
 * @property {number} w
 * @property {number} h
 * @property {string} alt
 * @property {'phone'|'web'|'logo'|'panel'|'art'} [frame]  How to present it (default: phone if portrait, web if landscape)
 *                                  'art' = a full-bleed 16:10 composition (already includes its own devices)
 * @property {boolean} [illustrative] Concept artwork, not a screenshot — labelled as such wherever it is shown
 * @property {string} [caption]
 *
 * @typedef {Object} Link
 * @property {'live'|'play'|'ios'|'github'|'video'|'code'|'case'|'web'} type
 * @property {string} url
 * @property {string} [label]
 * @property {string} [note]         e.g. "sign-in required"
 *
 * @typedef {Object} Feature
 * @property {string} title
 * @property {string} [detail]
 * @property {boolean} [planned]     Not built yet — rendered with a "Planned" tag
 *
 * @typedef {Object} ArchNode
 * @property {string} title
 * @property {string} [detail]
 * @property {boolean} [hot]         Highlight the node that carries the interesting logic
 *
 * @typedef {Object} Architecture
 * @property {string} [summary]
 * @property {ArchNode[]} flow
 * @property {string[]} [guards]     Safety boundaries / guarantees shown under the flow
 * @property {string} [caption]
 *
 * @typedef {Object} AgentProfile   For AI-agent projects
 * @property {string} objective
 * @property {string} input          How it receives a task
 * @property {string} reasoning      How it chooses an action
 * @property {string[]} tools
 * @property {string} execution      How execution and results are handled
 * @property {string} safety         Human approval and safety boundaries
 * @property {string} models         Local vs cloud model strategy
 *
 * @typedef {Object} Metric
 * @property {string} value
 * @property {string} label
 * @property {string} [source]
 *
 * @typedef {Object} Challenge
 * @property {string} title
 * @property {string} detail
 * @property {string} [resolution]
 *
 * @typedef {Object} Decision        Decision → why → benefit → trade-off
 * @property {string} title          The technology or approach chosen
 * @property {string} detail         What it is, in one line
 * @property {string} [why]          The requirement, problem or constraint that motivated it
 * @property {string} [benefit]      The practical effect (performance, maintainability, security, cost, speed)
 * @property {string} [tradeoff]     What it cost or where its limits are
 *
 * @typedef {Object} Project
 * @property {string} id                       required — also the URL slug
 * @property {string} title                    required
 * @property {string} tagline                  required — one-line value proposition
 * @property {CategoryId[]} categories         required — first one is the primary label
 * @property {Status} status                   required
 * @property {string[]} technologies           required
 * @property {string} [summary]                Short problem/solution line for cards
 * @property {string} [description]            Overview paragraph(s), split on blank lines
 * @property {string} [period]                 e.g. "2024 – 2026"
 * @property {string} [context]                Where it was built (employer, hackathon, personal)
 * @property {string[]} [platforms]
 * @property {Visibility} [visibility]
 * @property {number} [featured]               Order in the Featured section (lower first)
 * @property {string} [accent]                 Hex colour for the project's glow
 * @property {string} [icon]
 * @property {Image} [thumbnail]
 * @property {Image[]} [screenshots]
 * @property {string} [screenshotsNote]
 * @property {string} [problem]
 * @property {string} [solution]
 * @property {Feature[]} [features]
 * @property {string[]} [role]
 * @property {Architecture} [architecture]
 * @property {AgentProfile} [agent]
 * @property {Record<string, string[]>} [stack] Grouped technology stack for the detail page
 * @property {Challenge[]} [challenges]
 * @property {Decision[]} [decisions]
 * @property {Metric[]} [impact]
 * @property {string} [impactNote]
 * @property {Link[]} [links]
 * @property {string[]} [notes]                Honesty callouts shown on the detail page
 * @property {string[]} [related]              Project ids; otherwise computed
 */

/** @type {Project[]} */
export const PROJECTS = [
  /* ===================================================================== SaaS */
  {
    id: 'rental-saas',
    title: 'Rental Property Management SaaS',
    tagline: 'The whole rent cycle for landlords — leases, bills, payments and expenses — in one workspace.',
    categories: ['saas', 'web', 'backend', 'ai'],
    status: 'live',
    visibility: 'private',
    featured: 1,
    accent: '#e2a54a',
    period: 'Sep – Oct 2026',
    context: 'Personal product',
    platforms: ['Web', 'Mobile web'],
    technologies: ['JavaScript', 'PostgreSQL', 'REST API', 'MCP', 'Hatchable', 'Razorpay', 'Stripe'],
    summary: 'Landlords juggle spreadsheets, chats and receipts. One owner-scoped workspace covers properties, tenants, leases, billing, payments and reports — with a tenant portal and AI access over MCP.',
    description:
      'A multi-role SaaS for landlords in the UAE and the Gulf, with three portals: landlord, tenant and admin. It models the full rent cycle — property and unit, lease, bill (including meter readings), payment, receipt — and the costs around it.\n\n' +
      'An owner can ask an AI assistant about their own portfolio, either inside the app or from an MCP-compatible AI client. Both paths are read-only and scoped to that owner’s data.',
    thumbnail: { src: 'img/projects/rental/dashboard.webp', w: 1280, h: 632, frame: 'web', alt: 'Landlord dashboard of the Rental SaaS: expected, collected, outstanding and overdue rent for October 2026, occupancy, vacant units, open maintenance and leases ending soon, above a pending-rent list of tenants with overdue invoices', caption: 'Dashboard — sample data, 18 Oct 2026' },
    screenshots: [
      { src: 'img/projects/rental/dashboard.webp', w: 1280, h: 632, frame: 'web', alt: 'Landlord dashboard with rent, occupancy and maintenance figures and a pending-rent list', caption: 'Dashboard — the month at a glance' },
      { src: 'img/projects/rental/invoices.webp', w: 1280, h: 720, frame: 'web', alt: 'Invoices screen with totals and a filterable list of rent invoices', caption: 'Invoices and balances' },
      { src: 'img/projects/rental/property-ai.webp', w: 398, h: 462, frame: 'panel', alt: 'Property AI panel answering “Which tenants have overdue rent?” with two tenants, amounts and days overdue, and a source line', caption: 'Property AI — read-only, cites its source' }
    ],
    screenshotsNote: 'Screens from the running app with sample data (18 Oct 2026); the dashboard greeting line is cropped. The live app is behind sign-in.',
    problem: 'Small landlords track rent in spreadsheets and chat threads. Overdue rent, expiring leases and utility readings slip, and there is no single view of what each property actually earns.',
    solution: 'A workspace per owner that ties every invoice to a lease and every payment to an invoice, so the dashboard, reminders and reports all come from the same records — and an assistant can answer questions from them.',
    features: [
      { title: 'Properties, units, tenants & leases', detail: 'Lease lifecycle with renewals, terminations and rent history.' },
      { title: 'Rent billing', detail: 'Batch invoice generation with proration; utility bills refuse to run without current and previous meter readings.' },
      { title: 'Payments & reconciliation', detail: 'Manual payments, receipts, reconciliation and financial periods; invoice and receipt PDFs.' },
      { title: 'Expenses', detail: 'One-off and recurring expenses with pause, resume and end.' },
      { title: 'Financial reports', detail: 'Summary, monthly trend, outstanding ageing, occupancy and more, with CSV export.' },
      { title: 'Configurable reminders', detail: 'Per-owner rules (rent due soon, overdue, lease expiring, meter reading due) with day offsets, processed hourly.' },
      { title: 'Tenant portal', detail: 'Invoices, lease, maintenance requests with photos, documents and notifications.' },
      { title: 'Maintenance & documents', detail: 'Requests, vendors, staff, appointments and costs; versioned documents; audit log.' },
      { title: 'Property AI assistant', detail: 'Read-only, owner-scoped answers that name their data source.' },
      { title: 'MCP tools for AI clients', detail: '10 read-only tools — see the MCP integration project.' },
      { title: 'Online rent payments', detail: 'Razorpay and Stripe adapters are written; no provider is configured or tested live yet.', planned: true },
      { title: 'WhatsApp Business messaging', detail: 'Today reminders open a wa.me link; there is no WhatsApp API integration.', planned: true }
    ],
    role: [
      'Defined the product, domain model and an 18-step build plan, from data model to release checklist.',
      'Built it on the Hatchable platform, largely through its AI builder, reviewing and correcting each step.',
      'Specified the owner-isolation rules, the billing rules and the MCP integration, and documented known limitations honestly in the README.'
    ],
    architecture: {
      summary: 'Serverless API functions on Hatchable over managed PostgreSQL. Every query is scoped to the signed-in owner at the application layer.',
      flow: [
        { title: 'Portals', detail: 'Landlord, tenant & admin — HTML/JS' },
        { title: 'Auth', detail: 'Email OTP / passkeys; role resolved per request' },
        { title: 'API functions', detail: '/api/v1 — owner-scoped helpers', hot: true },
        { title: 'Billing & reports', detail: 'NUMERIC maths, proration, ageing' },
        { title: 'PostgreSQL', detail: '156 migrations; cron for reminders' }
      ],
      guards: ['Owner resolved from the session, never from the request body', 'Tenants and suspended owners blocked from owner APIs', 'Payment webhooks HMAC-verified'],
      caption: 'Simplified. Isolation is enforced in application code (owner_id filters), not database row-level security.'
    },
    stack: {
      'Platform': ['Hatchable', 'Serverless functions', 'Cron jobs', 'Hatchable Storage'],
      'Data': ['PostgreSQL', 'SQL migrations'],
      'Frontend': ['HTML', 'CSS', 'JavaScript'],
      'Integrations': ['MCP', 'Razorpay (adapter)', 'Stripe (adapter)', 'Email']
    },
    challenges: [
      { title: 'Money maths that never drifts', detail: 'Rent, proration and partial payments must reconcile to the cent across invoices, receipts and reports.', resolution: 'Amounts are NUMERIC in the database and handled as integers in code; reports read the same ledger the invoices write.' },
      { title: 'One owner must never see another’s data', detail: 'Every endpoint touches properties, tenants or money.', resolution: 'All queries go through ownership helpers (ownedProperty, ownedLease, ownedInvoice) keyed on the authenticated owner.' }
    ],
    decisions: [
      { title: 'Serverless API functions over managed PostgreSQL', detail: 'Every portal calls /api/v1 functions on the Hatchable platform; the data lives in one PostgreSQL database with 156 SQL migrations.',
        why: 'One person building a product with many related entities — properties, units, leases, invoices, receipts, expenses — and money that has to reconcile. A relational database with constraints and a migration history was the safe choice, and the platform removes server operations entirely.',
        benefit: 'The full rent cycle shipped in about two months; the schema history is reviewable; nothing to patch, back up or scale by hand.',
        tradeoff: 'Tied to one platform, and cold starts on rarely used functions.' },
      { title: 'Application-level owner isolation instead of database RLS', detail: 'Ownership checks live in shared helpers (ownedProperty, ownedLease, ownedInvoice) used by every function; the owner comes from the session, never from the request body.',
        why: 'Every endpoint touches money or tenants, so isolation had to be enforced the same way everywhere. On the platform’s function model, one audited helper per entity was easier to reason about than per-table policies.',
        benefit: 'One place to check access, and simpler queries.',
        tradeoff: 'A missed helper is a leak — so cross-account (IDOR) tests are next on the release checklist.' },
      { title: 'Email OTP and passkeys, no passwords', detail: 'Sign-in is a one-time code or a passkey; the user’s role is resolved on every request.',
        why: 'Landlords and tenants share one app with very different rights, and passwords add reset flows and reuse risk.',
        benefit: 'No password storage, and a role check that a client cannot skip.' },
      { title: 'Money as NUMERIC and integers, never floats', detail: 'Amounts are NUMERIC in PostgreSQL and handled as integers in code; reports read the same ledger the invoices write.',
        why: 'Rent, proration and partial payments must reconcile to the cent across invoices, receipts and reports.',
        benefit: 'Totals match everywhere; no rounding drift between the dashboard and the invoice PDF.' },
      { title: 'AI access through MCP, read-only', detail: 'Ten tools expose the same business rules as the dashboard to an authorised AI client; no write tools yet.',
        why: 'Owners want to ask “who hasn’t paid?” in the assistant they already use, without handing an AI a database login.',
        benefit: 'Nothing an AI client does can change financial records, and the tools work with any MCP-compatible client.',
        tradeoff: 'Less useful than an assistant that can act; write tools are planned behind approvals.' },
      { title: 'One payment interface, two providers', detail: 'A single provider module with Razorpay and Stripe adapters, picked by a setting.',
        why: 'Which provider is available depends on the market; that choice should not ripple through the billing code.',
        tradeoff: 'Ships disabled (NOT_CONFIGURED) until a provider account is connected and tested end to end.' }
    ],
    links: [
      // { type: 'live', url: 'https://rental-property.hatchable.site/', label: 'Open the live app', note: 'sign-in required' }
    ],
    notes: [
      'Most of the code was generated through Hatchable’s AI builder from my step-by-step specifications, then reviewed and corrected.',
      'Not yet done: two-account isolation (IDOR) testing, a configured payment provider, and verification of the MCP tools with a real AI client.',
      'The source repository is private.'
    ],
    related: ['rental-mcp', 'ai-job-agent', 'careersync-ai']
  },

  /* ==================================================================== Agents */
  {
    id: 'prospectpilot',
    title: 'ProspectPilot AI',
    tagline: 'An evidence-first sales agent that finds companies who need what you sell — and shows you the proof.',
    categories: ['agents', 'ai', 'web', 'backend'],
    status: 'in-development',
    visibility: 'private',
    accent: '#14806b',
    period: 'Oct 2026 —',
    context: 'Entry for the Dubai Chamber of Digital Economy AI Agents Championship (Best Business AI Agent)',
    platforms: ['Web'],
    technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Drizzle ORM', 'Anthropic API', 'Auth.js', 'Cheerio', 'Vitest'],
    summary: 'Small agencies waste days hunting for clients. Describe your business; the agent finds matching UAE/GCC companies, reads their websites, detects problems your services fix and drafts cited outreach in English and Arabic — a human approves everything, nothing is sent.',
    description:
      'An AI go-to-market agent for small B2B service businesses — agencies, consultants, software studios — selling to UAE and GCC SMEs. You describe what you sell; the agent proposes an ideal customer profile (ICP) for you to approve, then plans its own searches, discovers matching companies, researches each public website and keeps only the companies where it found a real, evidenced problem one of your services can fix.\n\n' +
      'Every score is explained component by component, every fact carries its source URL and observation date, and every sentence in a draft cites its evidence. A human approves every external action; this version has no sending integration at all.',
    thumbnail: { src: 'img/projects/prospectpilot/leads.webp', w: 1280, h: 800, frame: 'web', alt: 'ProspectPilot Leads page in demo mode: a ranked list of synthetic companies with scores out of 100, location and industry, detected needs such as slow mobile homepage, no HTTPS and no Arabic version, evidence score, source and recommended pitch', caption: 'Leads — synthetic demo data' },
    screenshots: [
      { src: 'img/projects/prospectpilot/leads.webp', w: 1280, h: 800, frame: 'web', alt: 'Leads page ranking synthetic companies by score with detected needs, evidence and recommended pitch', caption: 'Ranked leads — each with the need it found and where' },
      { src: 'img/projects/prospectpilot/run.webp', w: 1280, h: 800, frame: 'web', alt: 'Discovery run page: Plan, Find, Research, Score, Draft and Your review steps, with companies found, researched, qualified, tool steps used and AI budget used', caption: 'Live run — steps, tool budget and AI cost cap' },
      { src: 'img/projects/prospectpilot/dossier.webp', w: 1280, h: 800, frame: 'web', alt: 'Lead dossier for a synthetic dental clinic: score 94, why-this-lead summary, need signals with observed facts and sources, and a score breakdown by ICP fit, need evidence and evidence quality', caption: 'Lead dossier — “Why this lead?” and the score, explained' },
      { src: 'img/projects/prospectpilot/drafts.webp', w: 1280, h: 800, frame: 'web', alt: 'Outreach drafts: a WhatsApp-style English message and an Arabic email, each with numbered citations to dated evidence and Approve, Edit and Reject buttons', caption: 'English + Arabic drafts with citations — approve, edit or reject' }
    ],
    screenshotsNote: 'Captured in the built-in Demo data mode (21 Oct 2026): a fictional agency, synthetic companies on .example domains and the mock model. Live research works the same way against real public sources.',
    problem: 'Most AI sales tools buy a firmographic list and blast templated “personalised” emails. There is no proof the company needs anything, no sources behind the claims, black-box scores, English-only copy and automatic sending.',
    solution: 'Flip it to evidence first: only a company with a concrete, checkable problem your service fixes becomes a lead, every claim links to where and when it was observed, and a person approves every message before anything leaves the app.',
    features: [
      { title: 'AI-assisted ICP builder', detail: 'Proposes an ideal customer profile from your website and services; you edit and approve it.' },
      { title: 'Step-by-step search planner', detail: 'Chooses one source + query at a time, validated in code (enabled tools only, no repeats, budget limits).' },
      { title: 'Five discovery sources', detail: 'Google Places, Brave Search, public exhibitor lists, CSV upload and domain lists; non-company sites filtered out.' },
      { title: 'Safe website research', detail: 'robots.txt respected, private networks blocked, size and time limits; page text treated as data, never instructions.' },
      { title: 'Rule-based need detection', detail: 'Slow mobile site (PageSpeed), no HTTPS, no Arabic version, not mobile-friendly, broken contact form, outdated tech and more.' },
      { title: 'Explainable scoring', detail: 'ICP fit 40 · need evidence 25 · evidence quality 20 · reachability 10 · freshness 5 — qualified only at 55+ with an evidenced need.' },
      { title: 'Cited EN/AR drafts', detail: 'English email, Arabic email (RTL) and a WhatsApp-style message; every claim sentence cites its source.' },
      { title: 'Approvals, pipeline, analytics, learning journal', detail: 'Reject reasons feed reversible scoring adjustments; analytics show their denominators.' },
      { title: 'Sending integration', detail: 'Deliberately not built — nothing leaves the app.', planned: true }
    ],
    role: ['Sole developer: product design, agent runtime, research and scoring pipeline, UI, tests, CI and the competition documentation.'],
    agent: {
      objective: 'Find companies that match your ideal customer profile and have an evidenced problem your services fix, then draft outreach that cites that evidence.',
      input: 'A business setup (website, services, geography) turned into an ICP you approve; a run is then queued as a background job.',
      reasoning: 'A planner proposes one step at a time (a source plus a query), sees how many new companies it produced and proposes the next — stopping at the company limit, when every industry/city pair is tried, or after 10 planning steps. The code validates every proposal.',
      tools: ['places_search', 'search_companies', 'exhibitor list fetcher', 'CSV / domain import', 'safe page fetcher', 'PageSpeed Insights', 'tech detection', 'fact extraction', 'need detection', 'scoring', 'drafting'],
      execution: 'A Postgres-backed job queue and a separate worker run a persistent state machine (plan → find → research → score → draft). Every planning decision and tool call is logged and streamed to the run page; runs can be cancelled and retried.',
      safety: 'Human approval for every external action and no sending integration. SSRF guard (private ranges, encoded IPs, redirects, DNS rebinding), prompt-injection handling, public business data only — no LinkedIn scraping, no guessed or personal emails, suppression lists and data deletion. Per-run and per-workspace-month cost caps enforced in code.',
      models: 'Provider chosen server-side. With Anthropic: claude-opus-5-5 for planning, synthesis and drafting (EN/AR), claude-haiku-5-5 for extraction and classification. A deterministic mock provider powers tests and the offline demo; Ollama is available for local development.'
    },
    architecture: {
      flow: [
        { title: 'Next.js app', detail: 'Setup, ICP, runs, leads, approvals' },
        { title: 'Postgres job queue', detail: 'Heartbeat, stale-lock recovery' },
        { title: 'Worker: agent runtime', detail: 'State machine, planner, tool registry', hot: true },
        { title: 'Research & scoring', detail: 'Safe fetcher, need rules, weights' },
        { title: 'Drafting', detail: 'EN / AR / WhatsApp with citations' }
      ],
      guards: ['Human approval for every external action', 'SSRF-safe fetcher', 'Step and cost budgets', 'Tenant isolation on every query'],
      caption: 'Simplified. The learning journal feeds approved/rejected outcomes back into scoring.'
    },
    stack: {
      'App': ['Next.js (App Router)', 'React', 'TypeScript', 'Tailwind CSS', 'Auth.js'],
      'Data & jobs': ['PostgreSQL', 'Drizzle ORM', 'Postgres-backed queue + worker'],
      'AI': ['Anthropic API (Claude)', 'Mock provider', 'Ollama (dev)'],
      'Research': ['Cheerio', 'robots-parser', 'ipaddr.js', 'PageSpeed Insights', 'Google Places', 'Brave Search'],
      'Quality': ['Vitest + PGlite', 'ESLint', 'Prettier', 'GitHub Actions CI']
    },
    challenges: [
      { title: 'Models invent plausible sales claims', detail: 'A drafting model will happily say a site is “slow” or “outdated” without checking.', resolution: 'Needs are detected by deterministic rules, facts are separated from inferences, and drafts are validated so every claim sentence cites stored evidence.' },
      { title: 'Fetching arbitrary websites from a server', detail: 'Company URLs come from search results and user uploads — an open door to SSRF and prompt injection.', resolution: 'A safe fetcher blocks private ranges, encoded IPs, redirects and DNS rebinding, enforces size and time limits, and page text is framed as untrusted data.' }
    ],
    decisions: [
      { title: 'Evidence before fit', detail: 'A company qualifies only with a score of 55+ and at least one evidenced need.',
        why: 'A perfect-fit company with nothing to fix is not a sales opportunity, and outreach without proof is spam.',
        benefit: 'Every lead arrives with a reason to talk and a source to show.',
        tradeoff: 'Fewer leads per run, and weights are starting defaults not yet validated on real outcomes.' },
      { title: 'Postgres queue and a separate worker', detail: 'Runs are background jobs with a persistent state machine, not a long HTTP request.',
        why: 'Researching ten companies takes minutes and must survive a closed tab or a restart.',
        benefit: 'Runs are cancellable, retryable and fully logged, with no extra queue infrastructure.',
        tradeoff: 'The worker must run continuously, which rules out sleeping free-tier hosts.' },
      { title: 'Mock provider as the default', detail: 'A deterministic model adapter behind the same interface as Claude.',
        why: 'Tests and a live competition demo cannot depend on network, keys or model variance.',
        benefit: 'The whole pipeline is tested end to end offline, and the demo is repeatable.',
        tradeoff: 'Real prompt and Arabic quality must still be verified with a real key.' }
    ],
    impact: [
      { value: '10 / 9', label: 'companies researched / qualified in the demo run', source: 'README — synthetic demo' },
      { value: '97%', label: 'need signals with a source (35 / 36)', source: 'README — synthetic demo' },
      { value: '100%', label: 'draft claim sentences cited (15 / 15)', source: 'README — synthetic demo' },
      { value: '0', label: 'messages sent — by design', source: 'README' }
    ],
    impactNote: 'From synthetic data: these prove the pipeline is wired correctly, not its accuracy on real websites.',
    notes: [
      'In development. The live pipeline has been run on real domains via a domain list; the Google Places and Brave adapters and a full Claude run with a real key are not yet verified.',
      'Arabic drafts have not yet had a native Gulf-Arabic review.',
      '“ProspectPilot” is a working product name. Source is private while the competition is running.'
    ],
    related: ['ai-job-agent', 'rental-mcp', 'local-agent-lab']
  },

  {
    id: 'rental-mcp',
    title: 'Rental SaaS MCP Server',
    tagline: 'Lets an authorised AI client ask a landlord’s own rental data questions — read-only.',
    categories: ['agents', 'backend', 'ai'],
    status: 'live',
    visibility: 'private',
    accent: '#ff7a4a',
    period: 'Oct 2026',
    context: 'Part of the Rental SaaS',
    technologies: ['MCP', 'OAuth', 'JavaScript', 'PostgreSQL'],
    thumbnail: { src: 'img/projects/rental-mcp/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: an AI assistant calls the get_outstanding_rent MCP tool, the MCP server lists its ten read-only tools, and results come only from the owner’s data' },
    summary: 'Ten read-only Model Context Protocol tools expose rent, leases and expenses to MCP-compatible assistants, each answer scoped to the authenticated owner.',
    description:
      'An MCP endpoint on the Rental SaaS. A compatible AI client connects, authenticates, and can then call a small set of tools — the same business rules the dashboard uses, never raw SQL.\n\n' +
      'Write tools (record a payment, create an invoice) are deliberately not exposed yet.',
    problem: 'Owners want to ask “who hasn’t paid?” in the assistant they already use, without exporting data or handing an AI a database login.',
    solution: 'A narrow, read-only tool surface behind authentication, resolved to one owner per call.',
    features: [
      { title: 'Portfolio tools', detail: 'get_properties, get_units, get_tenants, get_active_leases' },
      { title: 'Money tools', detail: 'get_monthly_billing_summary, get_outstanding_rent, get_payment_history, get_outstanding_aging' },
      { title: 'Cost & summary tools', detail: 'get_expenses, get_financial_summary' },
      { title: 'Write tools', detail: 'Payments, invoices and reminders from an AI client.', planned: true }
    ],
    agent: {
      objective: 'Answer an owner’s questions about their portfolio from inside an MCP-compatible AI client.',
      input: 'The AI client decides to call a tool while answering the owner; the call arrives at the /mcp endpoint.',
      reasoning: 'The client’s model chooses which tool to call. The server holds no model — it only executes tools.',
      tools: ['get_properties', 'get_units', 'get_tenants', 'get_active_leases', 'get_monthly_billing_summary', 'get_outstanding_rent', 'get_payment_history', 'get_expenses', 'get_financial_summary', 'get_outstanding_aging'],
      execution: 'Each tool resolves the owner from the authenticated identity, runs the same owner-scoped queries as the app, and returns structured results.',
      safety: 'Every tool is read-only and requires project-member access. If the owner can’t be resolved unambiguously, the call fails rather than guessing.',
      models: 'Model-agnostic — whichever MCP-compatible client the owner authorises.'
    },
    architecture: {
      flow: [
        { title: 'AI client', detail: 'MCP-compatible assistant' },
        { title: 'MCP auth', detail: 'Platform OAuth, member access' },
        { title: 'Owner resolution', detail: 'Identity → one owner, or fail', hot: true },
        { title: 'Read-only tools', detail: '10 tools, same business rules' },
        { title: 'PostgreSQL', detail: 'That owner’s rows only' }
      ],
      guards: ['Read-only tools', 'One owner per call', 'Fails closed on ambiguity'],
      caption: 'Simplified flow of a single tool call.'
    },
    stack: { 'Protocol': ['Model Context Protocol', 'OAuth (platform-provided)'], 'Server': ['JavaScript', 'Hatchable functions'], 'Data': ['PostgreSQL'] },
    decisions: [
      { title: 'MCP instead of a bespoke chat backend', detail: 'The SaaS exposes an MCP endpoint rather than hosting its own chatbot.',
        why: 'Owners already use an AI assistant. A standard protocol lets any compatible client connect, without the SaaS hosting a model or holding model keys.',
        benefit: 'Model-agnostic, no model keys in the SaaS, and the tool list is the entire surface an AI can reach.' },
      { title: 'Read-only first', detail: 'The first version only answers questions.',
        why: 'The tools touch rent, leases and expenses; an AI client calling a write tool by mistake would change financial records.',
        benefit: 'Nothing an AI client does can alter data, so the integration could ship before approval flows exist.',
        tradeoff: 'Less useful than an assistant that can act; write tools are planned behind approvals.' },
      { title: 'Resolve one owner per call, or fail', detail: 'The authenticated identity must map to exactly one owner; ambiguity is an error, not a guess.',
        why: 'A tool that guessed the owner could return another landlord’s data.',
        benefit: 'Fails closed, and every answer is scoped the same way the dashboard is.' }
    ],
    links: [{ type: 'case', url: 'project.html?id=rental-saas', label: 'Rental SaaS case study' }],
    notes: ['The tools have not yet been fully verified end to end with a real MCP client — treat this as working but unproven.'],
    related: ['rental-saas', 'ai-job-agent', 'careeros']
  },

  {
    id: 'ai-job-agent',
    title: 'AI Job Agent',
    tagline: 'A local-first agent that finds jobs, ranks them against your CV and explains every match with quotes.',
    categories: ['agents', 'ai', 'web', 'backend'],
    status: 'in-development',
    visibility: 'public',
    featured: 3,
    accent: '#ff7a4a',
    period: 'Oct 2026 —',
    context: 'Personal project',
    platforms: ['Web (self-hosted)'],
    technologies: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'Ollama', 'Anthropic API', 'Docker', 'Playwright'],
    summary: 'Job hunting means reading hundreds of listings against your own CV. The agent searches allowlisted job boards, scores each listing in code and backs every claim with a verbatim quote — it never applies or messages anyone.',
    description:
      'A self-hosted web app with a background worker. Upload a CV, mark which profile answers are verified, and ask the agent to find roles in India and the Middle East. It searches allowlisted public job sources, saves matches, and runs a match analysis that quotes your CV for every point.\n\n' +
      'Phases 1–3 of a 12-phase roadmap are complete. Applying, tailored CVs and outreach are later phases and are not built.',
    thumbnail: { src: 'img/projects/job-agent/jobs.webp', w: 800, h: 620, frame: 'web', alt: 'AI Job Agent Jobs page: “Find jobs for me” form with roles and countries, a completed search that saved 13 jobs, and a list of matched roles with skills percentages', caption: 'Jobs — sample account' },
    screenshots: [
      { src: 'img/projects/job-agent/jobs.webp', w: 800, h: 620, frame: 'web', alt: 'Jobs page with a completed search and matched roles', caption: 'Find jobs → ranked by skills match' },
      { src: 'img/projects/job-agent/agent.webp', w: 800, h: 460, frame: 'web', alt: 'Agent page explaining what the agent can and cannot do, showing the local Ollama model in use', caption: 'Agent chat — states its limits and the model in use' },
      { src: 'img/projects/job-agent/activity.webp', w: 800, h: 380, frame: 'web', alt: 'Activity page listing a running match analysis and completed job search and CV extraction tasks', caption: 'Durable background tasks' }
    ],
    screenshotsNote: 'Captured from a sample account.',
    problem: 'Matching a CV to job listings is slow, and AI tools that “auto-apply” are a liability: they invent experience and act on your behalf without asking.',
    solution: 'Keep the agent’s power deliberately small — read, search allowlisted sources, save, analyse — and make every output checkable: quotes are verified word for word, scores are computed by code, and every step is logged.',
    features: [
      { title: 'Encrypted CV upload', detail: 'PDF/DOCX with text extraction and suggested contact details.' },
      { title: 'Verified answers', detail: 'Only answers you marked verified are ever reused.' },
      { title: '“Find jobs for me”', detail: 'Greenhouse, Lever, Ashby, Remotive and optional JSearch; deny-by-default source registry.' },
      { title: 'Match analysis with quotes', detail: 'Every claim cites your CV; quotes are checked verbatim, the score is calculated in code.' },
      { title: 'Agent chat', detail: 'Paste a job; the agent saves it and explains the fit, showing each step.' },
      { title: 'Activity timeline', detail: 'Durable tasks with leases, retries, cancellation and a per-step log.' },
      { title: 'Per-user isolation & health checks', detail: 'Better Auth sessions; Docker, database and model health page.' },
      { title: 'Apply & fill forms', detail: 'Browser-agent interfaces only.', planned: true },
      { title: 'Tailored CV, cover letters & outreach', detail: 'Roadmap phases 7–12.', planned: true }
    ],
    role: ['Sole developer: architecture, agent loop, tool policy, worker, UI, tests and CI.'],
    agent: {
      objective: 'Find relevant roles and explain, with evidence, how well your CV fits each one.',
      input: 'A chat message on the Agent page, or a background job (search, analysis, CV processing) picked up by the worker from a queue.',
      reasoning: 'A hand-written loop over native tool calling (Anthropic tool_use / Ollama tool_calls). It stops on a step limit, a deadline, an exhausted budget, a refusal or cancellation.',
      tools: ['get_my_profile', 'get_my_verified_answers', 'get_primary_cv_text', 'save_job_posting', 'list_saved_jobs', 'analyze_job_match'],
      execution: 'Tasks are durable: leased, reconciled, retried and cancellable, with every step recorded and shown on the Activity page. Analysis output is validated — quotes must match the source text exactly.',
      safety: 'Each tool declares its side effect (none, internal write, external read, external write, irreversible); the executor uses that to decide when a policy check or approval is required. No AI call runs without consent, a key and budget. It never logs in, scrapes behind sign-in, or submits anything.',
      models: 'Local first: Ollama with qwen3:4b-instruct on your own machine, so the CV never leaves it. Anthropic is an opt-in paid alternative with a monthly budget cap.'
    },
    architecture: {
      flow: [
        { title: 'Next.js web app', detail: 'Chat, jobs, CVs, activity' },
        { title: 'Task queue', detail: 'PostgreSQL + Redis' },
        { title: 'Agent loop', detail: 'Tool calling, limits, budget', hot: true },
        { title: 'Tool executor', detail: 'Side-effect policy per tool' },
        { title: 'Model adapter', detail: 'Ollama (local) or Anthropic' }
      ],
      guards: ['Side-effect-aware tool policy', 'Deny-by-default job sources', 'Verbatim quote verification', 'Budget & step limits'],
      caption: 'Simplified. The worker runs the same loop for background tasks.'
    },
    stack: {
      'App': ['Next.js', 'TypeScript', 'Better Auth', 'Zod'],
      'Worker & data': ['Node.js', 'Prisma', 'PostgreSQL 17', 'Redis 7'],
      'AI': ['Ollama (qwen3:4b-instruct)', 'Anthropic API', 'Native tool calling'],
      'Quality': ['Playwright e2e', 'GitHub Actions CI', 'pnpm + Turbo monorepo', 'Docker Compose']
    },
    challenges: [
      { title: 'Small local models hallucinate evidence', detail: 'A 4B model will happily “quote” lines that aren’t in your CV.', resolution: 'Quotes are verified verbatim against the source; anything that doesn’t match is rejected, and the score comes from code, not the model.' },
      { title: 'Long-running work on a laptop', detail: 'A local analysis takes minutes and the tab may close.', resolution: 'Analyses run as durable background tasks with leases, recovery and a visible timeline.' }
    ],
    decisions: [
      { title: 'No agent framework', detail: 'The loop, tool registry and side-effect policy are hand-written TypeScript over native tool calling.',
        why: 'The product’s value is its limits — what the agent may read, write or send. Those limits had to be explicit and testable, not buried in a framework’s abstractions.',
        benefit: 'Every step limit, budget cap and approval point is visible in code and covered by tests.',
        tradeoff: 'More code to own, and no ecosystem of ready-made integrations.' },
      { title: 'Local model by default, cloud opt-in', detail: 'Ollama with qwen3:4b-instruct on the user’s machine; Anthropic behind a key and a monthly budget cap.',
        why: 'The agent reads a CV and personal answers — data that should not leave the machine without consent — and it should cost nothing to try.',
        benefit: 'Private and free by default; the paid provider is one setting away when quality matters more.',
        tradeoff: 'Slower and less capable, which is why quotes are verified and scores are computed in code.' },
      { title: 'PostgreSQL and Redis for durable tasks', detail: 'Background work is leased, reconciled, retried and cancellable, with every step recorded.',
        why: 'A local analysis takes minutes and the browser tab may close; work has to survive that and be inspectable afterwards.',
        benefit: 'The Activity page shows exactly what ran, and nothing is lost when a tab or the worker restarts.' },
      { title: 'Docker Compose, Playwright and GitHub Actions', detail: 'One compose file brings up the services; end-to-end tests run in CI on every push.',
        why: 'Self-hosted software fails on setup more often than on features, and agent behaviour is the easiest thing to break silently.',
        benefit: 'A reproducible install, and a CI run that exercises real flows rather than only unit tests.' }
    ],
    links: [{ type: 'github', url: 'https://github.com/Afaquejaya/ai-job-agent', label: 'Source on GitHub' }],
    related: ['local-agent-lab', 'careersync-ai', 'careeros']
  },

  {
    id: 'careersync-ai',
    title: 'CareerSync AI',
    tagline: 'Upload a CV once, review every extracted change, then sync it to job portals and your portfolio.',
    categories: ['ai', 'web', 'agents'],
    status: 'prototype',
    visibility: 'private',
    accent: '#b493f0',
    period: 'Oct 2026',
    context: 'Personal project',
    technologies: ['Next.js', 'React', 'TypeScript', 'Anthropic API', 'Drizzle ORM', 'PostgreSQL', 'Chrome extension', 'Vitest'],
    thumbnail: { src: 'img/projects/careersync-ai/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a review screen with a source CV on the left and three proposed profile changes, one blocked because it is not in the CV, above the sync destinations' },
    summary: 'Keeping LinkedIn, Naukri, Indeed and a portfolio in sync with your CV is tedious and error-prone. An LLM extraction pipeline proposes the changes; a human approves each one.',
    description:
      'A dashboard that parses a CV with Claude (or an offline heuristic parser), shows every extracted field as a reviewable change, and pushes approved changes to LinkedIn, Indeed, Naukri, Naukri Gulf, a portfolio repository (as a GitHub pull request) or a custom webhook.\n\n' +
      'It is an extraction pipeline with a review step, not an autonomous agent: nothing is published without an explicit approval.',
    problem: 'Profiles drift out of date, and an AI that rewrites them unsupervised can invent experience.',
    solution: 'Every value the model extracts is checked against the source CV before it is shown, and every change set needs approval — portfolio publishing has its own separate approval.',
    features: [
      { title: 'CV parsing with Claude', detail: 'Offline heuristic parser as a fallback when no key is set.' },
      { title: 'Anti-fabrication checks', detail: 'Extracted values must be traceable to the CV text.' },
      { title: 'Prompt-injection defence', detail: 'CV text is treated as untrusted input.' },
      { title: 'Review & approve', detail: 'Change sets per destination, approved one by one.' },
      { title: 'Portfolio sync via GitHub PR', detail: 'Proposes changes as a pull request rather than pushing.' },
      { title: 'Browser extension', detail: 'Fills portal forms only when you click, and never presses Save.' },
      { title: 'GitHub App install flow, S3 storage, multi-instance Redis', planned: true }
    ],
    role: ['Sole developer: pipeline design, safety checks, dashboard, extension and tests.'],
    architecture: {
      flow: [
        { title: 'CV upload', detail: 'PDF / DOCX text extraction' },
        { title: 'LLM extraction', detail: 'Claude, or offline parser', hot: true },
        { title: 'Verification', detail: 'Values checked against source' },
        { title: 'Human review', detail: 'Approve per change set' },
        { title: 'Destinations', detail: 'Portals, GitHub PR, webhook' }
      ],
      guards: ['Untrusted-input handling', 'Approval before any publish', 'Extension never submits'],
      caption: 'Simplified pipeline.'
    },
    stack: { 'App': ['Next.js 16', 'React 19', 'TypeScript', 'Zod'], 'Data': ['Drizzle ORM', 'PostgreSQL / PGlite'], 'AI': ['Anthropic API'], 'Other': ['Chrome extension', 'unpdf', 'mammoth', 'Vitest'] },
    decisions: [
      { title: 'A review step instead of an autonomous agent', detail: 'Every extracted value is shown as a change to approve; nothing publishes on its own.',
        why: 'An AI that rewrites career profiles unsupervised can invent experience — the one failure this tool must never have.',
        benefit: 'The model does the tedious part (extraction); the person keeps authority over what is claimed.' },
      { title: 'Portfolio sync as a GitHub pull request', detail: 'Changes to the portfolio repository are proposed as a PR, not pushed.',
        why: 'The portfolio is public; a bad extraction pushed directly would be live immediately.',
        benefit: 'A diff to read, and the usual review before anything goes live.' },
      { title: 'Treat the CV as untrusted input', detail: 'CV text goes through prompt-injection checks before it reaches the model, and extracted values must trace back to the source text.',
        why: 'A CV is a document from anywhere; text inside it could try to steer the model.',
        benefit: 'Extraction stays bounded to the fields the pipeline asks for.' }
    ],
    links: [],
    notes: ['Runs locally; there is no public demo or repository.'],
    related: ['ai-job-agent', 'careeros', 'rental-saas']
  },

  {
    id: 'careeros',
    title: 'CareerOS',
    tagline: 'A local command centre that runs an open-source job-search agent’s workflows safely from the browser.',
    categories: ['agents', 'web', 'experiments'],
    status: 'prototype',
    visibility: 'private',
    accent: '#ff7a4a',
    period: 'Oct 2026',
    context: 'Personal project built on the open-source career-ops engine (MIT)',
    technologies: ['React', 'Vite', 'Node.js', 'TypeScript', 'Zod', 'Server-Sent Events', 'Claude Code CLI'],
    thumbnail: { src: 'img/projects/careeros/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a local command centre with allowlisted actions, a streaming run log showing AI write tools denied, and a safety checklist' },
    summary: 'The career-ops engine is driven from a terminal. CareerOS puts a web UI on top, so its modes run from buttons — with an allowlist, no shell, and no AI write access.',
    description:
      'A local web UI and Node server for career-ops, an open-source AI job-search engine by another author. CareerOS is my addition: it lists the engine’s actions, runs them as child processes, and streams progress to the browser.\n\n' +
      'The interesting part is the safety model around running an AI coding CLI on your machine.',
    problem: 'Running agent workflows through a CLI is powerful but easy to misuse — one wrong flag and the AI can edit or delete files.',
    solution: 'The browser can only trigger allowlisted actions by id; the server never uses a shell; and when an AI mode runs, its write and shell tools are denied.',
    agent: {
      objective: 'Run job-search workflows (evaluations, tracking, drafts) without touching a terminal.',
      input: 'A button in the UI sends an action id to the local server.',
      reasoning: 'The underlying engine’s modes run through the Claude Code CLI (other CLIs are detected); CareerOS orchestrates rather than reasons.',
      tools: ['Allowlisted engine scripts', 'Claude Code CLI with Write, Edit and Bash denied'],
      execution: 'Child processes run with shell disabled; output streams to the browser over Server-Sent Events and is persisted by the engine’s own scripts.',
      safety: 'Server bound to 127.0.0.1. Allowlisted actions only. Destructive operations need confirmation, tracker tools offer a dry-run preview, and nothing is ever submitted or sent — drafts are for you to copy.',
      models: 'Whatever the installed CLI uses (Claude by default); the engine also ships Gemini, OpenAI and Ollama evaluators.'
    },
    architecture: {
      flow: [
        { title: 'Browser UI', detail: 'React + Vite' },
        { title: 'Local server', detail: '127.0.0.1 only', hot: true },
        { title: 'Action allowlist', detail: 'By id, validated with Zod' },
        { title: 'Child process', detail: 'shell: false' },
        { title: 'career-ops engine', detail: 'Scripts & AI modes' }
      ],
      guards: ['Loopback only', 'Allowlisted actions', 'AI write/shell tools denied', 'Dry-run before changes'],
      caption: 'Simplified.'
    },
    stack: { 'UI': ['React', 'Vite', 'TypeScript'], 'Server': ['Node.js', 'Zod', 'Server-Sent Events'], 'AI': ['Claude Code CLI'] },
    decisions: [
      { title: 'Allowlisted actions by id, never a shell', detail: 'The browser sends an action id; the server runs a known script as a child process with the shell disabled.',
        why: 'The engine runs an AI coding CLI on the user’s machine — one wrong flag and it can edit or delete files.',
        benefit: 'No command string ever comes from the browser, so there is nothing to inject.' },
      { title: 'Loopback only', detail: 'The server binds to 127.0.0.1.',
        why: 'A tool that launches local processes must not be reachable from the network.',
        benefit: 'Only the person at the machine can trigger anything.' },
      { title: 'AI write and shell tools denied', detail: 'When an AI mode runs, its Write, Edit and Bash tools are turned off.',
        why: 'The job-search workflows only need to read and draft.',
        benefit: 'The worst case is a bad draft, not a changed file.' }
    ],
    links: [{ type: 'github', url: 'https://github.com/career-ops-hq/career-ops', label: 'career-ops engine (not mine)' }],
    notes: ['The career-ops engine is third-party open source (MIT). Only the CareerOS UI and server described here are my work, and they are not published.'],
    related: ['ai-job-agent', 'local-agent-lab', 'careersync-ai']
  },

  {
    id: 'local-agent-lab',
    title: 'Local AI Agent Lab',
    tagline: 'Learning how agents work by building one by hand — no framework, local model only.',
    categories: ['agents', 'experiments'],
    status: 'learning',
    visibility: 'public',
    accent: '#c9a7a0',
    period: 'Oct 2026 —',
    context: 'Learning project',
    technologies: ['TypeScript', 'Node.js', 'SQLite', 'Zod', 'React', 'Vite', 'Vitest', 'Ollama'],
    thumbnail: { src: 'img/projects/local-agent-lab/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: the planned agent loop — context, model decision, argument validation, policy check, execution — next to a human approval prompt' },
    summary: 'A from-scratch agent in TypeScript, planned in nine phases. Phases 1–2 are done — configuration, environment doctor, tests, an Ollama adapter and a local chat API; tools and the agent loop come next.',
    description:
      'A deliberately framework-free project for understanding agents: context building, decisions, tool validation, policy and approvals, written out explicitly.\n\n' +
      'Status: phase 2 of 9 (19 Oct 2026). You can chat with the local model from the terminal or the local API. There is no tool use or agent loop yet — the architecture below is the plan, and the interfaces exist in code.',
    features: [
      { title: 'Config validation & `npm run doctor`', detail: 'Checks Node, Ollama and the model before anything runs.' },
      { title: 'Local-only guard', detail: 'Rejects cloud models and non-loopback addresses.' },
      { title: 'Ollama adapter, health check & chat API', detail: 'Raw HTTP adapter with per-call timeouts; /api/health and /api/chat; a terminal chat.' },
      { title: 'Request limits', detail: 'Body size, message count and length limits; only user and assistant roles accepted.' },
      { title: 'Tests', detail: 'Vitest, run with npm test.' },
      { title: 'Tools', detail: 'Calculator, workspace read/search, notes — sandboxed to workspace/.', planned: true },
      { title: 'Agent loop, approvals, SQLite memory, dashboard', planned: true }
    ],
    agent: {
      objective: 'Understand each part of an agent by implementing it explicitly.',
      input: 'Planned: a task from a local dashboard.',
      reasoning: 'Planned loop: build context → call the model → parse its decision → validate tool arguments with Zod → policy check (allow / require approval / deny).',
      tools: ['Planned: calculator', 'Planned: workspace read & search', 'Planned: notes'],
      execution: 'Planned: execute, observe, verify, persist to SQLite.',
      safety: 'Designed in from the start: an approval manager that waits for a human decision, and file tools confined to a workspace folder.',
      models: 'Local only — Ollama with qwen3:4b; cloud models are rejected by configuration.'
    },
    architecture: {
      flow: [
        { title: 'Context', detail: 'Task + history' },
        { title: 'Model decision', detail: 'Ollama, local' },
        { title: 'Validate', detail: 'Zod tool schemas' },
        { title: 'Policy', detail: 'Allow / approve / deny', hot: true },
        { title: 'Execute & verify', detail: 'Sandboxed tools' }
      ],
      guards: ['Human approval step', 'Workspace sandbox', 'Local models only'],
      caption: 'Planned architecture — phases 1–2 of 9 are implemented.'
    },
    stack: { 'Runtime': ['Node.js 24', 'node:sqlite', 'TypeScript'], 'Validation & tests': ['Zod 4', 'Vitest'], 'UI (planned)': ['React 19', 'Vite'], 'Model': ['Ollama'] },
    decisions: [
      { title: 'No framework, on purpose', detail: 'Every part of the loop is written out: context, decision parsing, validation, policy, execution.',
        why: 'The goal is understanding, and frameworks hide exactly the parts worth understanding.',
        benefit: 'Each phase adds one concept with its own tests and notes in the learning guide.',
        tradeoff: 'Slower to reach a working agent than installing one.' },
      { title: 'Local models only', detail: 'Configuration rejects cloud models and non-loopback Ollama addresses.',
        why: 'A learning project should be free to run and impossible to leak data from.',
        benefit: 'No keys, no cost, and an experiment cannot accidentally send a workspace to a cloud API.' }
    ],
    links: [{ type: 'github', url: 'https://github.com/Afaquejaya/learn-basic-ai-agent', label: 'Source on GitHub' }],
    related: ['ai-job-agent', 'careeros', 'expense-tracker']
  },

  /* ======================================================================== AI */
  {
    id: 'boring-doc',
    title: 'Boring Doc',
    tagline: 'We read the boring docs so you don’t have to — Flutter docs turned into short, evidence-backed explanations.',
    categories: ['ai', 'web', 'backend'],
    status: 'live',
    visibility: 'private',
    accent: '#6d5cff',
    period: 'Oct 2026 —',
    context: 'Personal product',
    platforms: ['Web', 'Mobile web'],
    technologies: ['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'PGlite', 'Drizzle ORM', 'Tailwind CSS', 'Anthropic API', 'Vercel'],
    summary: 'Official docs are the source of truth but slow to use. Boring Doc keeps a synced index of the Flutter docs, release notes and API, and turns it into 30-second explanations, real version-to-version comparisons and a cited “what changed”.',
    description:
      'An interactive documentation platform that sits on top of the official Flutter documentation instead of copying it. Every topic opens with a one-sentence answer, then key points, an interactive visual, an analogy (with where it breaks), working code, common mistakes and the exact official sources it was checked against.\n\n' +
      'An idempotent ingestion pipeline watches the official repositories and feeds, so you can compare any two real stable releases and see every indexed change — categorised, sorted by impact, with migration guides and evidence. AI explanations are optional, provider-independent and grounded in retrieved sources; everything works with AI switched off.',
    thumbnail: { src: 'img/projects/boring-doc/home.webp', w: 1280, h: 800, frame: 'web', alt: 'Boring Doc home page: “Understand faster. Compare anything. See what’s changed.” with a search box, suggested questions, a live preview of an interactive widget tree, and counters for stable releases, indexed changes, migration guides, API symbols and tracked doc pages', caption: 'Home — live site, 22 Oct 2026' },
    screenshots: [
      { src: 'img/projects/boring-doc/home.webp', w: 1280, h: 800, frame: 'web', alt: 'Boring Doc home page with search, suggested questions, a rotating preview and indexed-content counters', caption: 'Home — every number comes from the index' },
      { src: 'img/projects/boring-doc/compare.webp', w: 1280, h: 800, frame: 'web', alt: 'Version Comparison Studio comparing Flutter 3.41.0 to 3.47.7: 1,629 changes in range, 10 breaking or removed, 10 deprecations, all with official evidence, and a category distribution bar', caption: 'Compare two real versions — 3.41.0 → 3.47.7' },
      { src: 'img/projects/boring-doc/topic.webp', w: 1280, h: 800, frame: 'web', alt: 'Topic page section “Understand visually” with an expandable widget tree, followed by a real-world analogy and a box explaining where the analogy breaks', caption: 'Topic page — interactive widget tree and an honest analogy' },
      { src: 'img/projects/boring-doc/whats-new.webp', w: 1280, h: 800, frame: 'web', alt: 'What’s new in Flutter 3.47: release timeline, at-a-glance category bar and breaking-change cards with impact, version and migration-guide badges', caption: 'What’s new — grouped, with evidence on every card' }
    ],
    screenshotsNote: 'Captured from the live site on 22 Oct 2026.',
    problem: 'Official docs are long and change every few weeks. Finding one answer means scrolling a 5,000-word page; “what changed between my version and the latest?” means reading dozens of release notes by hand; and chatbots answer with confident, made-up APIs.',
    solution: 'An intelligent layer over the docs: authored explanations verified against a specific version, a change index built automatically from the official sources, and AI that cites those sources or says “insufficient evidence”.',
    features: [
      { title: 'Learn in 30 seconds', detail: 'Thirteen Flutter topics with the same nine sections: quick answer, key points, visual, analogy, code, when to use, mistakes, related, sources.' },
      { title: 'Version Comparison Studio', detail: 'Any two real stable releases; changes by category and impact, migration guides, before/after diffs and an optional verified GitHub source diff.' },
      { title: 'What’s new & Explore changes', detail: 'The latest stable series grouped by category; URL-driven filters by impact, evidence, platform and release.' },
      { title: 'Search and command palette', detail: 'Concepts, guides, API symbols and changes in one search (Ctrl/Cmd+K), with typo tolerance.' },
      { title: 'Automatic sync with provenance', detail: 'Webhook + daily cron ingestion; every record keeps its source commit and “last synchronized” time.' },
      { title: 'Grounded AI (optional)', detail: 'Explain, generate an example, migration assistant — cites sources inline; works with local or hosted models.' },
      { title: 'Review queue', detail: 'Low-confidence, high-impact items wait for a human before publishing.' },
      { title: 'More ecosystems', detail: 'React Native, Android, Jetpack Compose, Swift, React and Next.js via adapters.', planned: true }
    ],
    role: ['Sole developer: product, ingestion pipeline, data model, UI and visual design, tests and deployment.'],
    architecture: {
      flow: [
        { title: 'Source adapters', detail: 'GitHub, release feeds, API index' },
        { title: 'Ingestion pipeline', detail: 'Idempotent, incremental, validated', hot: true },
        { title: 'PostgreSQL', detail: 'PGlite or managed; search index' },
        { title: 'Read models', detail: 'Comparison engine, queries' },
        { title: 'Next.js UI + grounded AI', detail: 'Topics, compare, what’s new' }
      ],
      guards: ['HTTPS host allowlist for outbound requests', 'HMAC-verified webhooks', 'Sanitised Markdown', 'Conservative publishing policy'],
      caption: 'Simplified. Jobs are keyed by source + revision, so overlapping triggers never duplicate records.'
    },
    stack: {
      'Frontend': ['Next.js 16 (App Router)', 'React 19', 'Tailwind CSS 4', 'Radix UI', 'shiki', 'Mermaid', 'cmdk'],
      'Backend & data': ['Route handlers', 'Drizzle ORM', 'PostgreSQL / PGlite', 'tsvector + pg_trgm search', 'zod', 'pino'],
      'AI': ['Provider-agnostic service', 'Anthropic', 'OpenAI-compatible (Ollama, LM Studio)'],
      'Ops & quality': ['Vercel + Cron', 'Docker', 'Vitest', 'Playwright']
    },
    challenges: [
      { title: 'Re-syncing large docs without re-downloading them', detail: 'The Flutter website repo has hundreds of pages and changes daily.', resolution: 'Change detection by HEAD commit and per-file git blob SHA, so only changed files are fetched; feeds are compared by SHA-256.' },
      { title: 'Not overstating what changed', detail: 'Calling something “breaking” wrongly is worse than not saying it.', resolution: 'Breaking, deprecated and removed are asserted only from the official breaking-change index or explicit statements; heuristic classifications show their confidence and low-confidence high-impact items go to review.' }
    ],
    decisions: [
      { title: 'PGlite until DATABASE_URL is set', detail: 'PostgreSQL compiled to WASM runs embedded; the same schema works on managed Postgres.',
        why: 'Anyone should be able to clone, seed and run it in seconds without a database server.',
        benefit: 'Zero-setup development and tests against real Postgres features (tsvector, GIN, pg_trgm).',
        tradeoff: 'On Vercel without DATABASE_URL the database is ephemeral and re-seeded.' },
      { title: 'Ecosystem as a key, not a fork', detail: 'Every row carries an ecosystem; adapters and typed content add new ones.',
        why: 'Flutter is the first of many ecosystems; rewriting the core for each would not scale.',
        benefit: 'A scaffold command plus two generic adapters (Markdown docs repo, GitHub Releases) cover most new ecosystems.' },
      { title: 'AI is optional', detail: 'Everything works with AI off; when on, answers are retrieved, cited and labelled.',
        why: 'Hallucinated APIs are exactly the problem the product exists to fix.',
        benefit: 'No hard dependency on a paid model, and no uncited answers.',
        tradeoff: 'The best explanations are authored, which takes time per topic.' }
    ],
    impact: [
      { value: '3,679', label: 'indexed Flutter changes', source: 'Live site, 22 Oct 2026' },
      { value: '180', label: 'stable releases tracked', source: 'Live site, 22 Oct 2026' },
      { value: '4,624', label: 'API symbols searchable', source: 'Live site, 22 Oct 2026' },
      { value: '67', label: 'unit tests, plus Playwright journeys', source: 'README' }
    ],
    links: [{ type: 'live', url: 'https://fresh-doc-1qhf.vercel.app/', label: 'Open Boring Doc' }],
    notes: [
      'Flutter is the only ecosystem built so far; the others are listed as planned.',
      'Boring Doc is independent and not affiliated with Google. Upstream docs stay under their own licences (flutter/website text CC BY 3.0).'
    ],
    related: ['portfolio-guide', 'ai-job-agent', 'expense-tracker']
  },

  {
    id: 'glowfit-ai',
    title: 'GlowFit AI',
    tagline: 'One selfie in, a confident look out — skin analysis, virtual try-on and a score for which look suits you.',
    categories: ['ai', 'web'],
    status: 'live',
    visibility: 'public',
    featured: 5,
    accent: '#d58f86',
    period: 'Oct 2026',
    context: 'YouCam API Skin AI & eCommerce VTO Hackathon (Perfect Corp)',
    platforms: ['Web'],
    technologies: ['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Zustand', 'YouCam API', 'MediaPipe'],
    summary: 'Beauty shoppers guess which products and looks will suit them. GlowFit scans the skin, renders three looks on your own face and scores them — then lets you change one thing at a time.',
    description:
      'A hackathon build on Perfect Corp’s YouCam APIs. It turns skin analysis and virtual try-on into a decision flow: understand your skin, compare looks on your own face, adjust one variable, and leave with a look and a product list.',
    thumbnail: { src: 'img/projects/glowfit/screen-1.webp', w: 1200, h: 675, frame: 'web', alt: 'GlowFit Skin Intelligence screen: skin score, eight skin metrics and an AI GlowMap on the face' },
    screenshots: [
      { src: 'img/projects/glowfit/screen-1.webp', w: 1200, h: 675, frame: 'web', alt: 'Skin Intelligence: skin score, eight metrics and a GlowMap', caption: 'Skin scan' },
      { src: 'img/projects/glowfit/screen-2.webp', w: 1200, h: 675, frame: 'web', alt: 'Decision Lab: three makeup looks rendered on the same face with match scores', caption: 'Three looks, scored' },
      { src: 'img/projects/glowfit/screen-3.webp', w: 1200, h: 675, frame: 'web', alt: 'Change One Thing: lip shade options with a before and after slider', caption: 'Change one thing' },
      { src: 'img/projects/glowfit/screen-4.webp', w: 1200, h: 675, frame: 'web', alt: 'Final decision screen with the chosen look and product list', caption: 'The decision' }
    ],
    screenshotsNote: 'Real screenshots from the live app.',
    problem: 'Try-on tools show you a look, but don’t help you decide between looks — or explain why one suits your skin better.',
    solution: 'A five-step Decision Lab that combines skin metrics, face analysis and try-on renders into a comparable score, plus budget mode and single-variable previews.',
    features: [
      { title: 'Skin Intelligence', detail: 'YouCam Skin AI score, eight metrics and a GlowMap.' },
      { title: 'Decision Lab', detail: 'Three looks rendered on your face, each with a match score.' },
      { title: 'Change one thing', detail: 'Swap a single product with a before/after slider.' },
      { title: 'Hairstyles & budget mode', detail: 'AI hairstyle try-on and budget-aware product picks.' },
      { title: 'Assistant', detail: 'Rule-based answers; an optional OpenAI-compatible model only rewrites the wording.' }
    ],
    role: ['Solo build: product flow, UI, API integration and deployment.'],
    architecture: {
      flow: [
        { title: 'Selfie', detail: 'Browser capture' },
        { title: 'Next.js API routes', detail: 'Keys stay server-side', hot: true },
        { title: 'YouCam APIs', detail: 'Skin, face, makeup, hair' },
        { title: 'Scoring', detail: 'Looks compared on metrics' },
        { title: 'Decision UI', detail: 'Zustand + IndexedDB cache' }
      ],
      caption: 'Simplified. No database or accounts — results are cached in the browser.'
    },
    stack: { 'App': ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Zustand'], 'AI services': ['YouCam Skin Analysis', 'AI Face Analyzer', 'Makeup VTO', 'AI Hairstyle', 'MediaPipe'], 'Hosting': ['Vercel'] },
    decisions: [
      { title: 'Proxy every AI call through Next.js API routes', detail: 'The browser never sees provider keys.',
        why: 'YouCam’s APIs are paid and keyed; a public demo cannot ship the key to the client.',
        benefit: 'Keys stay server-side and usage can be limited in one place.',
        tradeoff: 'Adds a hop, but it’s the only safe option on a public demo.' },
      { title: 'No database, no accounts', detail: 'Results are cached in the browser (Zustand + IndexedDB).',
        why: 'The app processes selfies. Storing them server-side would add privacy obligations for no product gain in a hackathon build.',
        benefit: 'Nothing personal is stored on a server; the app is a static deploy plus API routes.' },
      { title: 'Next.js on Vercel', detail: 'One repository deploys the UI and the API routes together.',
        why: 'A one-person hackathon build needs zero deployment work and a preview URL for every change.',
        benefit: 'A live demo from day one; the same code runs locally and in production.' }
    ],
    links: [
      // { type: 'live', url: 'https://glowfit-ai.vercel.app', label: 'Live demo' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=EdBg7vJooeQ', label: 'Demo video' },
      // { type: 'github', url: 'https://github.com/Afaquejaya/glowfit-ai', label: 'Source on GitHub' }
    ],
    related: ['expense-tracker', 'face-detection', 'portfolio-guide']
  },

  {
    id: 'expense-tracker',
    title: 'AI Smart Expense Tracker',
    tagline: 'Type how you spent money — even in Hinglish — and get structured expense cards back.',
    categories: ['ai', 'mobile', 'experiments'],
    status: 'learning',
    visibility: 'public',
    accent: '#8f7ae0',
    period: 'Jun 2026',
    context: 'Learning project',
    platforms: ['Flutter'],
    technologies: ['Flutter', 'Dart', 'Python', 'FastAPI'],
    summary: 'A Flutter client and FastAPI backend built around an “AI hook” — start, end and error callbacks modelled on LangChain’s callback lifecycle — that drives loading, structured JSON and error states.',
    description:
      'A small project for practising how an app should behave around an LLM call: show progress, accept only structured JSON, and fail gracefully.\n\n' +
      'The backend currently simulates the model’s response; connecting a real LLM is the next step.',
    thumbnail: { src: 'img/projects/expense/screen.webp', w: 640, h: 831, frame: 'phone', alt: 'App screen: a Hinglish sentence about dinner at Dubai Mall and a taxi turned into two expense cards — 120 AED food and 15 AED transport' },
    screenshots: [
      { src: 'img/projects/expense/screen.webp', w: 640, h: 831, frame: 'phone', alt: 'Natural-language sentence turned into two expense cards', caption: 'Sentence in, expense cards out' }
    ],
    features: [
      { title: 'Natural-language entry', detail: 'One sentence can produce several expenses.' },
      { title: 'AI hook lifecycle', detail: 'Start / end / error callbacks drive the UI states.' },
      { title: 'Strict JSON contract', detail: 'Item, category, amount, currency.' },
      { title: 'Graceful failure', detail: 'An error state with an offline fallback view.' },
      { title: 'Real LLM parsing', detail: 'The backend returns a simulated response today.', planned: true }
    ],
    stack: { 'App': ['Flutter', 'Dart'], 'Backend': ['Python', 'FastAPI', 'Pydantic', 'Uvicorn'] },
    decisions: [
      { title: 'A callback “hook” modelled on LangChain’s lifecycle', detail: 'Start, end and error callbacks around the model call drive the UI. The app does not use LangChain itself; it borrows the shape of its callback lifecycle.',
        why: 'The point of the exercise was the behaviour around an LLM call — progress, structured output, failure — not a particular library.',
        benefit: 'The Flutter UI states hang off one contract, so a real model can be dropped in later without touching the screens.' },
      { title: 'Strict JSON contract, validated in the backend', detail: 'FastAPI with Pydantic models: item, category, amount, currency.',
        why: 'An expense card needs typed fields; free text from a model cannot be trusted straight into a ledger.',
        benefit: 'Malformed output is rejected before it reaches the app.' },
      { title: 'Simulate the model first', detail: 'The backend returns a canned structured response today.',
        why: 'It let the hook lifecycle and every UI state be built and tested without API keys or cost.',
        tradeoff: 'The project demonstrates the pattern, not LLM accuracy — connecting a real model is the next step.' }
    ],
    links: [
      { type: 'github', url: 'https://github.com/Afaquejaya/ai-expense-tracker', label: 'Source on GitHub' },
      { type: 'code', url: 'https://gist.github.com/Afaquejaya/a4d157d4255799bd6e3521320f6d9537', label: 'Notes (gist)' }
    ],
    notes: ['The AI response is simulated in this version — the project demonstrates the hook pattern and UI states, not LLM accuracy.'],
    related: ['glowfit-ai', 'local-agent-lab', 'pregnancy-tracker']
  },

  {
    id: 'portfolio-guide',
    title: 'AI Portfolio Guide',
    tagline: 'A recruiter-facing chat on my portfolio that answers only from verified facts — and says so when it can’t.',
    categories: ['ai', 'web'],
    status: 'live',
    visibility: 'public',
    accent: '#b493f0',
    period: 'Oct 2026',
    context: 'Part of afaquejaya.github.io',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    thumbnail: { src: 'img/projects/portfolio-guide/screen.webp', w: 1280, h: 800, frame: 'web', alt: 'The AI Portfolio Guide panel answering “How is MCP access authenticated?” and declining to guess details the portfolio doesn’t publish', caption: 'Real capture of the live site' },
    summary: 'Chatbots on portfolios tend to invent things. This one matches questions to a knowledge base built from the CV, can only navigate to allowlisted sections, and never turns visitor text into a URL or code.',
    description:
      'Click the avatar on my portfolio and a chat panel opens. Questions are cleaned, safety-checked and scored against intents written from the CV. A confident match returns a stored answer with action buttons; anything else gets an honest “the portfolio doesn’t say” and the closest questions.\n\n' +
      'An optional LLM fallback is designed (a serverless endpoint holding the key) but deliberately not enabled on GitHub Pages.',
    features: [
      { title: 'Deterministic answers', detail: 'Weighted intent scoring over phrase and word keys.' },
      { title: 'Allowlisted actions', detail: 'Buttons can only scroll to listed sections or open listed links.' },
      { title: 'Input safety', detail: 'URLs, HTML, code and javascript: get a fixed reply; rendering uses textContent only.' },
      { title: '3D avatar', detail: 'Head and eyes follow the cursor; reduced-motion aware.' },
      { title: 'LLM fallback', detail: 'Endpoint contract defined; off by default.', planned: true }
    ],
    architecture: {
      flow: [
        { title: 'Visitor question', detail: 'Max 300 chars, rate-limited' },
        { title: 'Safety check', detail: 'Links, HTML, code rejected' },
        { title: 'Intent scoring', detail: 'Verified knowledge base', hot: true },
        { title: 'Allowlisted action', detail: 'Scroll or open known link' },
        { title: 'Honest fallback', detail: 'No match → no guess' }
      ],
      guards: ['No free-form generation', 'No visitor text in URLs or selectors', 'Nothing stored or sent'],
      caption: 'How a message is handled.'
    },
    stack: { 'Frontend': ['Vanilla JavaScript', 'HTML', 'CSS'], 'Hosting': ['GitHub Pages'] },
    decisions: [
      { title: 'Deterministic answers, no live LLM', detail: 'Questions are scored against a knowledge base written from the CV; nothing is generated.',
        why: 'A chatbot on a portfolio must never invent experience, and a static GitHub Pages site cannot hold a model key.',
        benefit: 'Every answer is one I wrote and can stand behind; no cost, no latency, nothing to leak.',
        tradeoff: 'It cannot answer what is not in the knowledge base — so it says so and offers the closest questions.' },
      { title: 'Allowlisted actions only', detail: 'Buttons can scroll to listed section ids or open listed links; visitor text never becomes a URL, a selector or HTML.',
        why: 'Anything built from visitor input is an injection surface.',
        benefit: 'The worst a visitor can get is an honest “the portfolio doesn’t say”.' }
    ],
    links: [
      { type: 'live', url: 'https://afaquejaya.github.io/', label: 'Try it on the portfolio' },
      { type: 'github', url: 'https://github.com/Afaquejaya/afaquejaya.github.io', label: 'Source on GitHub' }
    ],
    related: ['portfolio-site', 'glowfit-ai', 'rental-mcp']
  },

  {
    id: 'face-detection',
    title: 'Face Detection',
    tagline: 'Pick a photo; the app finds every face and reads age, emotion, hair, glasses and head pose.',
    categories: ['ai', 'mobile', 'experiments'],
    status: 'learning',
    visibility: 'public',
    accent: '#8fa0c9',
    period: 'Jan 2020',
    context: 'Personal project',
    platforms: ['Android'],
    technologies: ['Java', 'Kotlin', 'Android', 'Microsoft Face API'],
    summary: 'An early computer-vision project: detect faces in a photo and show per-face attributes from Microsoft’s Face API.',
    thumbnail: { src: 'img/projects/face/screen-1.webp', w: 480, h: 976, frame: 'phone', alt: 'Face detection result: landmarks drawn on a face with age, gender, emotion and accessories listed' },
    screenshots: [
      { src: 'img/projects/face/screen-1.webp', w: 480, h: 976, frame: 'phone', alt: 'Single face with landmarks and attributes', caption: 'Single face' },
      { src: 'img/projects/face/screen-2.webp', w: 480, h: 974, frame: 'phone', alt: 'Two faces detected with attributes for each', caption: 'Multiple faces' }
    ],
    features: [
      { title: 'Multi-face detection', detail: 'Landmarks drawn on each face.' },
      { title: 'Attributes', detail: 'Age, gender, emotion, hair, glasses, make-up, head pose and image quality.' }
    ],
    stack: { 'App': ['Android', 'Java', 'Kotlin'], 'AI service': ['Microsoft Face API'] },
    related: ['glowfit-ai', 'social-app', 'video-calling']
  },

  /* ==================================================================== Mobile */
  {
    id: 'jeeb',
    title: 'Jeeb — Grocery & Logistics Platform',
    tagline: 'A 0→1 grocery e-commerce and delivery platform for Qatar, fully in Arabic.',
    categories: ['mobile', 'backend'],
    status: 'shipped',
    visibility: 'internal',
    featured: 4,
    accent: '#3f86ef',
    period: 'Sep 2022 – Sep 2024',
    context: 'Software Engineer · Jeeb E-Commerce & Logistics (start-up), Doha',
    platforms: ['Android', 'iOS', 'Web'],
    technologies: ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Java', 'Python', 'Algolia', 'IoT'],
    thumbnail: { src: 'img/projects/jeeb/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: an Arabic-first grocery home screen with categories and offers, and a delivery tracking map' },
    summary: 'A fast-growing Qatari start-up needed a customer app, operations apps and the delivery chain behind them. A server-driven homepage and instant search made it 95% faster and lifted engagement 50%.',
    description:
      'Built with the founders from zero: the customer grocery app with Arabic localisation, a server-driven personalised homepage, Algolia instant search, real-time GPS tracking, route optimisation and secure payments.\n\n' +
      'I also led a remote team building the Driver, Collector and Storekeeper apps that run the delivery side.',
    icon: 'img/logos/jeeb-icon.webp',
    screenshotsNote: 'The store listings have been retired, so there are no published screenshots to show.',
    problem: 'An omnichannel grocery business needed to launch fast in an Arabic-first market, with a homepage merchandisers could change without app releases.',
    solution: 'A server-driven homepage rendered natively by the app, Algolia instead of in-house search, and a set of operations apps for the delivery chain.',
    features: [
      { title: 'Server-driven personalised homepage', detail: 'Merchandising changes without an app release.' },
      { title: 'Algolia instant search', detail: 'Typo-tolerant search replacing in-house search.' },
      { title: 'Real-time GPS tracking & route optimisation' },
      { title: 'Secure payments' },
      { title: 'Driver, Collector & Storekeeper apps', detail: 'Built with a remote team I led.' },
      { title: 'Arabic localisation', detail: 'Arabic-first UI.' }
    ],
    role: [
      'Built and launched the 0→1 platform working directly with the founders.',
      'Architected the server-driven personalised homepage with Algolia search.',
      'Engineered GPS tracking, route optimisation and payment integration.',
      'Led the remote team building the Driver, Collector and Storekeeper apps.'
    ],
    architecture: {
      flow: [
        { title: 'Server', detail: 'Layout + personalised content' },
        { title: 'App renderer', detail: 'Layout blocks → native widgets', hot: true },
        { title: 'Algolia', detail: 'Instant search' },
        { title: 'Customer', detail: 'Personalised home, in Arabic' }
      ],
      caption: 'Server-driven UI, simplified — an illustration of the idea, not a production diagram.'
    },
    stack: { 'Mobile': ['Flutter', 'React Native', 'Swift', 'Kotlin', 'Java'], 'Backend & services': ['Python', 'Algolia', 'Payments', 'GPS / IoT'] },
    impact: [
      { value: '95%', label: 'faster homepage load', source: 'CV' },
      { value: '+50%', label: 'user engagement', source: 'CV' },
      { value: '+60%', label: 'delivery speed (operations apps)', source: 'CV' },
      { value: '+20%', label: 'delivery & checkout efficiency', source: 'CV' }
    ],
    decisions: [
      { title: 'Server-driven homepage', detail: 'Layout and personalised content come from the server and map to native components in the app.',
        why: 'Merchandisers needed to change the homepage often, and an app release for every change was far too slow for a start-up launching fast.',
        benefit: 'Merchandising changes shipped without app releases; the homepage loaded 95% faster and engagement rose 50% (self-reported, see Results).',
        tradeoff: 'More upfront contract design between server and app.' },
      { title: 'Buy search, don’t build it', detail: 'Algolia for instant, typo-tolerant search.',
        why: 'Good grocery search — typo-tolerant, fast, in Arabic — is a product in itself, and the team was small.',
        benefit: 'Instant search from launch, with relevance tuned in a dashboard instead of code.',
        tradeoff: 'A paid dependency.' },
      { title: 'Cross-platform for customers, one app per operations role', detail: 'Flutter and React Native for the customer app; Driver, Collector and Storekeeper got their own apps.',
        why: 'Customers needed Android and iOS at once; each operations role has a different workflow, device and permission set.',
        benefit: 'One customer codebase for two stores, and operations apps that stayed simple enough for a remote team to build in parallel — delivery speed rose 60% (self-reported).' }
    ],
    links: [],
    notes: ['Employer product. The store listings are no longer public, so there are no app links or screenshots here.'],
    related: ['pass-delivery', 'tbay', 'evv']
  },

  {
    id: 'pass-delivery',
    title: 'Pass Delivery & Operations Apps',
    tagline: 'On-demand delivery in Qatar — customer, Driver, Collector and Storekeeper apps.',
    categories: ['mobile'],
    status: 'shipped',
    visibility: 'internal',
    accent: '#1cc4cc',
    period: '2022 – 2024',
    context: 'Jeeb E-Commerce & Logistics, Doha',
    platforms: ['Android', 'iOS'],
    technologies: ['Flutter', 'Kotlin', 'Java', 'Python', 'IoT'],
    summary: 'Couriers, collectors and storekeepers needed purpose-built tools. Real-time tracking and dedicated operations apps lifted delivery speed by 60%.',
    icon: 'img/logos/pass-icon.webp',
    thumbnail: { src: 'img/apps/pass/screen-1.webp', w: 560, h: 957, frame: 'phone', alt: 'Pass store screenshot: live tracking with a courier’s car on the map and “Pickup in 2 min”' },
    screenshots: [
      { src: 'img/apps/pass/screen-1.webp', w: 560, h: 957, frame: 'phone', alt: 'Live tracking with the courier on the map', caption: 'Live tracking' },
      { src: 'img/apps/pass/screen-2.webp', w: 560, h: 957, frame: 'phone', alt: 'Driver orders list with pick-up and drop-off addresses in Doha and fares', caption: 'Driver orders' }
    ],
    screenshotsNote: 'Screens from the former store listing.',
    features: [
      { title: 'Real-time GPS tracking' },
      { title: 'Route optimisation' },
      { title: 'Secure payments' },
      { title: 'Driver, Collector & Storekeeper apps', detail: 'One app per role in the delivery chain.' }
    ],
    role: ['Engineered the logistics features and led the remote team building the operations apps.'],
    impact: [
      { value: '+60%', label: 'delivery speed', source: 'CV' },
      { value: '+20%', label: 'delivery efficiency', source: 'CV' },
      { value: '3', label: 'operations apps' }
    ],
    stack: { 'Mobile': ['Flutter', 'Kotlin', 'Java'], 'Backend': ['Python', 'IoT'] },
    decisions: [
      { title: 'One app per operations role', detail: 'Driver, Collector and Storekeeper each have their own app.',
        why: 'The roles share almost no screens, run on different devices and need different permissions.',
        benefit: 'Simpler apps that a remote team could build and release in parallel.' }
    ],
    notes: ['The Play Store listing is no longer public.'],
    related: ['jeeb', 'tbay', 'evv']
  },

  {
    id: 'tbay',
    title: 'Tbay',
    tagline: 'A gift-card marketplace for Nigeria and Ghana — escrow-protected trades, live rates, fast payouts.',
    categories: ['mobile'],
    status: 'live',
    visibility: 'public',
    featured: 2,
    accent: '#2bb3a3',
    period: '2024 – 2026',
    context: 'Senior Software Engineer · Kobet Technology DMCC, Dubai',
    platforms: ['Android', 'iOS'],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Dart', 'CI/CD'],
    summary: 'Selling an unused gift card for cash is slow and risky when you don’t trust the buyer. Tbay puts escrow and bonded vendors between both sides.',
    description:
      'A peer-to-peer marketplace where people trade gift cards for local currency. Vetted vendors compete on rates, trades are escrow-protected, and payouts go straight to a bank or mobile-money wallet.\n\n' +
      'Part of the Kobet FinTech family — Tbay, VivaKard, TimuCard and BitOwi — that I helped architect and ship with a team across Dubai, China and Sri Lanka.',
    icon: 'img/apps/tbay/icon.webp',
    thumbnail: { src: 'img/apps/tbay/screen-1.webp', w: 560, h: 996, frame: 'phone', alt: 'Tbay app showing live gift-card rates for Razer, Steam, Vanilla, Sephora and more' },
    screenshots: [
      { src: 'img/apps/tbay/screen-1.webp', w: 560, h: 996, frame: 'phone', alt: 'Live gift-card rates', caption: 'Live rates' },
      { src: 'img/apps/tbay/screen-2.webp', w: 560, h: 996, frame: 'phone', alt: 'Store panel: the most trusted gift card trading platform', caption: 'Store panel' },
      { src: 'img/apps/tbay/screen-3.webp', w: 560, h: 996, frame: 'phone', alt: 'Store panel: sell 30+ gift cards instantly at best rates', caption: 'Store panel' }
    ],
    screenshotsNote: 'From the public store listings.',
    problem: 'Gift-card holders want cash without the risk of trading with strangers.',
    solution: 'Escrow-protected trades with vetted vendors competing on live rates, and payouts to bank or mobile money.',
    features: [
      { title: 'Escrow-protected trades' },
      { title: 'Live vendor rates' },
      { title: 'Bank & mobile-money payouts' },
      { title: 'KYC and two-factor authentication', detail: 'Across the Kobet app family.' }
    ],
    role: [
      'Architected and delivered cross-platform FinTech apps (crypto, wallet, KYC, 2FA) with real-time data.',
      'Led a cross-country team across Dubai, China and Sri Lanka: planning, releases, documentation and CI/CD.',
      'Shipped production releases to Google Play and the App Store.'
    ],
    stack: { 'Mobile': ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Dart'], 'Web & tooling': ['Vue.js', 'React', 'Python', 'CI/CD'] },
    impact: [
      { value: '1M+', label: 'downloads on Google Play', source: 'Google Play listing, Oct 2026' },
      { value: '4.6★', label: 'from 42.6K reviews', source: 'Google Play listing, Oct 2026' },
      { value: '3', label: 'countries in the delivery team', source: 'CV' }
    ],
    links: [
      { type: 'play', url: 'https://play.google.com/store/apps/details?id=com.gonglian.tbay', label: 'Google Play' },
      { type: 'ios', url: 'https://apps.apple.com/us/app/gift-card-on-tbay/id6472409948', label: 'App Store' }
    ],
    related: ['vivakard', 'timucard', 'bitowi']
  },

  {
    id: 'vivakard',
    title: 'VivaKard',
    tagline: 'Turns gift cards into naira with transparent rates — plus referrals, check-ins and a leaderboard.',
    categories: ['mobile'],
    status: 'live',
    visibility: 'public',
    accent: '#a6d14a',
    period: '2024 – 2026',
    context: 'Kobet Technology DMCC, Dubai',
    platforms: ['Android', 'iOS'],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Google Sign-In'],
    summary: 'Gift-card holders want a fast, fair cash-out without haggling or hidden fees. VivaKard covers 20+ brands with clear rates and engagement loops that bring users back.',
    icon: 'img/apps/vivakard/icon.webp',
    thumbnail: { src: 'img/apps/vivakard/screen-1.webp', w: 560, h: 1212, frame: 'phone', alt: 'VivaKard store panel: get cash for your gift cards in minutes' },
    screenshots: [
      { src: 'img/apps/vivakard/screen-1.webp', w: 560, h: 1212, frame: 'phone', alt: 'Get cash for your gift cards in minutes', caption: 'Home' },
      { src: 'img/apps/vivakard/screen-2.webp', w: 560, h: 1212, frame: 'phone', alt: 'Trade 50+ gift cards', caption: 'Gift cards' },
      { src: 'img/apps/vivakard/screen-3.webp', w: 560, h: 1212, frame: 'phone', alt: 'One-tap Google login', caption: 'Google sign-in' }
    ],
    screenshotsNote: 'Store marketing panels from the public listings.',
    features: [
      { title: 'Gift cards to cash', detail: 'Amazon, iTunes, Steam, Google Play, Xbox and more.' },
      { title: 'One-tap Google sign-in' },
      { title: 'Referrals, daily check-ins & leaderboard' }
    ],
    role: ['Cross-platform delivery and production releases on both stores with the team I led.'],
    stack: { 'Mobile': ['Flutter', 'React Native', 'Kotlin', 'Swift'] },
    impact: [
      { value: '100K+', label: 'downloads on Google Play', source: 'Google Play listing, Oct 2026' },
      { value: '4.4★', label: 'from 1.1K reviews', source: 'Google Play listing, Oct 2026' }
    ],
    links: [
      { type: 'play', url: 'https://play.google.com/store/apps/details?id=com.gift.vivakard&hl=en', label: 'Google Play' },
      { type: 'ios', url: 'https://apps.apple.com/us/app/vivakard-plus/id6749223091', label: 'App Store' }
    ],
    related: ['tbay', 'timucard', 'bitowi']
  },

  {
    id: 'timucard',
    title: 'TimuCard',
    tagline: 'Gift cards to instant payouts — then pay electricity, cable, airtime and data bills from the balance.',
    categories: ['mobile'],
    status: 'live',
    visibility: 'public',
    accent: '#ff5a3c',
    period: '2024 – 2026',
    context: 'Kobet Technology DMCC, Dubai',
    platforms: ['Android', 'iOS'],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Swift', 'Biometrics'],
    summary: 'Money stuck on unused gift cards becomes a balance people can withdraw or spend on everyday bills, with a live rate ticker and device-level fraud monitoring.',
    icon: 'img/apps/timucard/icon.webp',
    thumbnail: { src: 'img/apps/timucard/screen-1.webp', w: 554, h: 1200, frame: 'phone', alt: 'TimuCard store panel: highest rates, instant cashouts' },
    screenshots: [
      { src: 'img/apps/timucard/screen-1.webp', w: 554, h: 1200, frame: 'phone', alt: 'Highest rates, instant cashouts', caption: 'Rates & cashouts' },
      { src: 'img/apps/timucard/screen-2.webp', w: 554, h: 1200, frame: 'phone', alt: 'Invite friends and earn', caption: 'Referrals' },
      { src: 'img/apps/timucard/screen-3.webp', w: 554, h: 1200, frame: 'phone', alt: 'Bill payments and biometrics', caption: 'Bills & biometrics' }
    ],
    screenshotsNote: 'Store marketing panels from the public listings.',
    features: [
      { title: 'Instant payouts with live rate ticker' },
      { title: 'Bill payments', detail: 'Electricity, cable, airtime and data.' },
      { title: 'Biometric security & fraud monitoring' },
      { title: 'Referral rewards' }
    ],
    role: ['Part of the FinTech app family I helped architect and ship on both stores.'],
    stack: { 'Mobile': ['Flutter', 'React Native', 'Kotlin', 'Swift'] },
    impact: [
      { value: '50K+', label: 'downloads on Google Play', source: 'Google Play listing, Oct 2026' },
      { value: '4.6★', label: 'rating', source: 'Google Play listing, Oct 2026' }
    ],
    links: [
      { type: 'play', url: 'https://play.google.com/store/apps/details?id=com.timucard.gift&hl=en', label: 'Google Play' },
      { type: 'ios', url: 'https://apps.apple.com/us/app/timucard/id6752526295', label: 'App Store' }
    ],
    related: ['tbay', 'vivakard', 'bitowi']
  },

  {
    id: 'bitowi',
    title: 'BitOwi',
    tagline: 'A crypto wallet — store, send and receive crypto with balances and history in one place.',
    categories: ['mobile'],
    status: 'live',
    visibility: 'public',
    accent: '#e2a54a',
    period: '2024 – 2026',
    context: 'Kobet Technology DMCC, Dubai',
    platforms: ['Android'],
    technologies: ['Flutter', 'Kotlin', 'KYC', '2FA'],
    thumbnail: { src: 'img/projects/bitowi/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a crypto wallet with total balance, send and receive, asset list, and a receive screen' },
    summary: 'Part of the Kobet FinTech family: a crypto wallet with KYC and two-factor authentication, shipped on Google Play.',
    icon: 'img/apps/bitowi/icon.webp',
    features: [
      { title: 'Store, send & receive crypto' },
      { title: 'Balances & history' },
      { title: 'KYC & two-factor authentication', detail: 'Shared across the Kobet app family.' }
    ],
    role: ['Architected and delivered with the Kobet team; production release on Google Play.'],
    links: [{ type: 'play', url: 'https://play.google.com/store/apps/details?id=com.bitowi.app&hl=en_US', label: 'Google Play' }],
    related: ['tbay', 'vivakard', 'timucard']
  },

  {
    id: 'evv',
    title: 'eVV 2.0',
    tagline: 'Jharkhand’s school-education platform — enrolment, biometric attendance, teachers and schemes in one app.',
    categories: ['mobile'],
    status: 'live',
    visibility: 'public',
    featured: 6,
    accent: '#4f8df5',
    period: 'Aug 2020 – Sep 2022',
    context: 'Software Engineer · CSM Technologies (CMMI Level 5), Ranchi',
    platforms: ['Android'],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Java', '.NET', 'PHP', 'Biometrics'],
    summary: 'With schools closed by COVID-19, a state government needed to track students, teachers and schemes across thousands of schools. The state’s ed-tech apps passed 500K downloads with state-wide adoption.',
    description:
      'The Department of School Education & Literacy’s platform for running and monitoring schools across Jharkhand, used by officers, schools and teachers. I owned delivery from requirements and biometric configuration through UAT, rollout and support.',
    icon: 'img/apps/evv/icon.webp',
    thumbnail: { src: 'img/apps/evv/screen-1.webp', w: 560, h: 996, frame: 'phone', alt: 'eVV home grid: data download, student enrolment, student attendance, teacher enrolment, monitoring and more' },
    screenshots: [
      { src: 'img/apps/evv/screen-1.webp', w: 560, h: 996, frame: 'phone', alt: 'Home grid of modules', caption: 'Modules' },
      { src: 'img/apps/evv/screen-2.webp', w: 560, h: 996, frame: 'phone', alt: 'Login with Officer, School and Teacher roles', caption: 'Role-based login' },
      { src: 'img/apps/evv/screen-3.webp', w: 560, h: 996, frame: 'phone', alt: 'Student enrolment form', caption: 'Student enrolment' }
    ],
    screenshotsNote: 'Screens show the current store version, maintained by the department.',
    problem: 'Keeping school management, attendance, mid-day meals and learning running state-wide when classrooms closed.',
    solution: 'Role-based mobile apps for officers, schools and teachers, with biometric attendance configured for real schools, plus training and rollout support.',
    features: [
      { title: 'Biometric attendance', detail: 'Configured for real schools.' },
      { title: 'Student & teacher enrolment and tracking' },
      { title: 'Role-based logins', detail: 'Officer, school and teacher.' },
      { title: 'Monitoring, schemes & grievances' }
    ],
    role: [
      'Owned delivery end to end: requirements, biometric configuration, development, UAT, rollout and post-launch support.',
      'Led client demos and user training for state-wide adoption.'
    ],
    stack: { 'Mobile': ['Flutter', 'React Native', 'Kotlin', 'Java'], 'Backend': ['.NET', 'PHP'] },
    decisions: [
      { title: 'Role-based logins in one app', detail: 'Officers, schools and teachers sign in to the same app and see their own modules.',
        why: 'A state-wide rollout to thousands of schools has to be one install to explain, train and support.',
        benefit: 'One release to maintain and one training programme — which is what made state-wide adoption workable.' },
      { title: 'Biometric attendance configured for real schools', detail: 'Attendance capture was set up and tested against the devices schools actually had, not a lab set-up.',
        why: 'Attendance underpins the department’s reporting, so it has to be hard to fake and easy to capture.',
        benefit: 'Attendance records the department could rely on.' }
    ],
    impact: [
      { value: '500K+', label: 'downloads on Google Play', source: 'Google Play listing, Oct 2026' },
      { value: 'State-wide', label: 'rollout and adoption', source: 'CV' },
      { value: '3', label: 'roles: officer, school, teacher' }
    ],
    links: [{ type: 'play', url: 'https://play.google.com/store/apps/details?id=com.evidyavahini.app', label: 'Google Play' }],
    related: ['digischool', 'jmr', 'ecampuslink']
  },

  {
    id: 'digischool',
    title: 'DigiSchool',
    tagline: 'E-learning for state-government schools during COVID-19.',
    categories: ['mobile'],
    status: 'shipped',
    visibility: 'internal',
    accent: '#6b9cf5',
    period: '2020 – 2022',
    context: 'CSM Technologies, Ranchi',
    platforms: ['Android'],
    technologies: ['Flutter', 'React Native', 'Kotlin', 'Java'],
    thumbnail: { src: 'img/projects/digischool/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: two phone screens of an e-learning app — today’s lesson and subjects, and a video lesson with notes and a quiz' },
    summary: 'Part of the state ed-tech suite alongside eVV: e-learning so students could keep studying while schools were closed.',
    role: ['Built and launched as part of the state-government ed-tech apps.'],
    impact: [{ value: '500K+', label: 'downloads across the state’s ed-tech apps', source: 'CV' }],
    notes: ['The store listing is no longer public.'],
    related: ['evv', 'jmr', 'ecampuslink']
  },

  {
    id: 'jmr',
    title: 'JMR — Vendor Register App',
    tagline: 'A native app that replaced paper vendor registers at a Tata Steel company.',
    categories: ['mobile', 'backend'],
    status: 'shipped',
    visibility: 'internal',
    accent: '#2f6fb0',
    period: 'Aug 2019 – Aug 2020',
    context: 'Android App Developer · JUSCO (Tata Steel company), Jamshedpur',
    platforms: ['Android'],
    technologies: ['Kotlin', 'Java', '.NET', 'C#', 'SQL'],
    thumbnail: { src: 'img/projects/jmr/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a vendor register on a tablet with entries and statuses, and a phone form for a new entry' },
    summary: 'Vendor registers were kept by hand. A native app backed by .NET APIs cut data-entry time by 70% and improved accuracy by 50%.',
    features: [
      { title: 'Digital vendor register', detail: 'Replaces manual paper processes.' },
      { title: 'Scalable .NET backend APIs' }
    ],
    role: ['Built the native app and its .NET backend APIs; optimised API and database performance.'],
    stack: { 'Mobile': ['Kotlin', 'Java'], 'Backend': ['.NET', 'C#', 'SQL'] },
    decisions: [
      { title: 'Native Android app with .NET backend APIs', detail: 'A Kotlin/Java app replaced the paper vendor registers, backed by APIs on .NET and SQL.',
        why: 'The job was fast, reliable data entry on site by staff used to paper — a native app gave the most direct input experience on the devices in use.',
        benefit: '70% less data-entry time and 50% better data accuracy (self-reported, see Results).' }
    ],
    impact: [
      { value: '70%', label: 'less data-entry time', source: 'CV' },
      { value: '+50%', label: 'data accuracy', source: 'CV' }
    ],
    notes: ['The store listing is no longer public.'],
    related: ['ecampuslink', 'tgs-dashboard', 'evv']
  },

  {
    id: 'ecampuslink',
    title: 'e-CampusLink',
    tagline: 'Cross-platform web and mobile school apps built on .NET and Xamarin.',
    categories: ['mobile', 'web', 'backend'],
    status: 'shipped',
    visibility: 'internal',
    accent: '#6b9cf5',
    period: '2019 – 2020',
    context: 'JUSCO (Tata Steel company) · LHS + MFK Software',
    platforms: ['Android', 'Web'],
    technologies: ['Xamarin', 'C#', '.NET', 'SQL', 'ERP integration'],
    thumbnail: { src: 'img/projects/ecampuslink/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a school portal dashboard with attendance, fees and the day’s timetable, and a phone showing school notices' },
    summary: 'School apps for web and mobile, connected to an ERP and third-party APIs.',
    role: ['Built the cross-platform apps and their integrations with the ERP and third-party APIs.'],
    stack: { 'Apps': ['Xamarin', 'C#'], 'Backend': ['.NET', 'SQL', 'ERP & third-party APIs'] },
    impact: [{ value: '+40%', label: 'sales after API & database optimisation (role-wide)', source: 'CV' }],
    notes: ['The store listing is no longer public.'],
    related: ['jmr', 'evv', 'digischool']
  },

  {
    id: 'pregnancy-tracker',
    title: 'Pregnancy Tracker',
    tagline: 'A calm, offline week-by-week companion — with today’s week on the home screen.',
    categories: ['mobile', 'experiments'],
    status: 'prototype',
    visibility: 'private',
    accent: '#e58a80',
    period: 'Aug – Oct 2026',
    context: 'Personal project',
    platforms: ['Android'],
    technologies: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Room', 'AppWidget', 'Robolectric'],
    summary: 'Progress, what’s changing, care tips, reminders and a wellness challenge — fully offline, no account, with two home-screen widgets.',
    description:
      'A native Android app: set a due date (or last period), then follow a 40-week timeline, nutrition and care guidance, reminders and a wellness challenge with streaks. Everything stays on the device.\n\n' +
      'It started from a Google AI Studio generation that I extended into the current app.',
    thumbnail: { src: 'img/projects/pregnancy/dark-home.webp', w: 540, h: 1202, frame: 'phone', alt: 'Pregnancy Tracker home in dark mode: week 25, 108 days to go, progress bar, week selector and baby size this week' },
    screenshots: [
      { src: 'img/projects/pregnancy/dark-home.webp', w: 540, h: 1202, frame: 'phone', alt: 'Home: week, days to go and baby size', caption: 'Home' },
      { src: 'img/projects/pregnancy/dark-timeline.webp', w: 540, h: 1202, frame: 'phone', alt: '40-week timeline', caption: '40-week timeline' },
      { src: 'img/projects/pregnancy/dark-widgets.webp', w: 540, h: 462, frame: 'panel', alt: 'Two home-screen widgets: pregnancy timeline and wellness progress', caption: 'Home-screen widgets' }
    ],
    screenshotsNote: 'Rendered from demo data with Roborazzi screenshot tests.',
    features: [
      { title: '40-week timeline', detail: 'Filterable by trimester.' },
      { title: 'Nutrition & care' },
      { title: 'Reminders that survive reboots', detail: 'AlarmManager + boot receiver.' },
      { title: 'Wellness challenge', detail: 'Onboarding, streaks, achievements, progress and learn.' },
      { title: 'Two home-screen widgets' },
      { title: 'Light & dark themes, fully offline' },
      { title: 'Play Store release', planned: true }
    ],
    stack: { 'App': ['Kotlin', 'Jetpack Compose', 'Material 3'], 'Data': ['Room'], 'Testing': ['JUnit', 'Robolectric', 'Roborazzi'] },
    decisions: [
      { title: 'Fully offline, no account', detail: 'Room on the device; nothing is sent anywhere.',
        why: 'Pregnancy data is as personal as it gets, and no feature of the app needs a server.',
        benefit: 'Nothing to secure server-side, and the app works without a connection.' },
      { title: 'Native Android with Jetpack Compose and Material 3', detail: 'The widgets use AppWidget; reminders use AlarmManager with a boot receiver.',
        why: 'Home-screen widgets and reboot-surviving reminders are platform features; a native build reaches them directly.',
        benefit: 'Two widgets and reliable reminders without plugin layers.',
        tradeoff: 'Android only.' },
      { title: 'Screenshot tests over manual checks', detail: 'Robolectric and Roborazzi render the screens from demo data.',
        why: 'A content-heavy app with 40 weeks of screens regresses visually more often than logically.',
        benefit: 'Every screen is checked in both themes on each change.' }
    ],
    notes: ['Not published on Google Play; distributed as a test APK. The source repository is private.'],
    related: ['expense-tracker', 'social-app', 'face-detection']
  },

  /* ===================================================================== Web */
  {
    id: 'portfolio-site',
    title: 'afaquejaya.github.io',
    tagline: 'My hand-built portfolio — no framework, no build step, no templates.',
    categories: ['web'],
    status: 'live',
    visibility: 'public',
    accent: '#ff5b24',
    period: '2026',
    context: 'Personal',
    technologies: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
    thumbnail: { src: 'img/projects/portfolio-site/screen.webp', w: 1280, h: 800, frame: 'web', alt: 'The portfolio’s hero: headline, introduction, call-to-action buttons and the ID-badge portrait', caption: 'Real capture of the live site' },
    summary: 'An editorial portfolio with pinned horizontal-scroll sections, a 3D avatar guide and an Ask-an-AI card — all vanilla, accessible and reduced-motion aware.',
    features: [
      { title: 'Pinned horizontal scrolling', detail: 'Follows native scroll, never hijacks it.' },
      { title: '3D avatar & AI Portfolio Guide' },
      { title: 'Data-driven app and logo sections' },
      { title: 'Accessible by default', detail: 'Skip link, focus states, reduced motion.' },
      { title: 'This showcase', detail: 'A data-driven companion site for the full catalog.' }
    ],
    stack: { 'Frontend': ['HTML', 'CSS', 'Vanilla JavaScript'], 'Hosting': ['GitHub Pages'] },
    decisions: [
      { title: 'No framework, no build step', detail: 'Plain HTML, CSS and JavaScript served by GitHub Pages.',
        why: 'A portfolio should stay editable for years without a toolchain to resurrect, and the page itself is a work sample.',
        benefit: 'Nothing to install, a deploy on every commit, and every byte on the page is intentional.',
        tradeoff: 'No components or bundling — shared pieces are rendered from data files by small scripts instead.' },
      { title: 'Content in data files', detail: 'Apps, logos, feedback and the “Now” section are rendered from js/*.js data files; the showcase from one catalog file.',
        why: 'Monthly updates should not mean editing markup.',
        benefit: 'One file to change per section, with the ground rules for claims written at the top of it.' },
      { title: 'Follow native scroll, never hijack it', detail: 'The pinned horizontal sections ride on normal page scroll and switch off on short screens and with reduced motion.',
        why: 'Scroll-jacking breaks accessibility and trust on a page meant to be read.',
        benefit: 'Keyboard, screen-reader and reduced-motion users get a plain page; everyone else gets the effect.' }
    ],
    links: [
      { type: 'live', url: 'https://afaquejaya.github.io/', label: 'Open the portfolio' },
      { type: 'github', url: 'https://github.com/Afaquejaya/afaquejaya.github.io', label: 'Source on GitHub' }
    ],
    related: ['portfolio-guide', 'glowfit-ai', 'rental-saas']
  },

  /* ================================================================= Backend */
  {
    id: 'tgs-dashboard',
    title: 'IoT Monitoring Dashboard',
    tagline: 'A Windows dashboard monitoring 100+ IoT devices.',
    categories: ['backend', 'experiments'],
    status: 'shipped',
    visibility: 'internal',
    accent: '#8fb36b',
    period: 'Mar – Apr 2018',
    context: 'Data Analyst intern · Tata Growth Shop, Jamshedpur',
    platforms: ['Windows'],
    technologies: ['.NET', 'C#', 'SQL'],
    thumbnail: { src: 'img/projects/tgs-dashboard/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a desktop IoT monitoring dashboard with device counts, a grid of device tiles, a throughput chart and alerts' },
    summary: 'An internship project: one dashboard to watch 100+ IoT devices, improving operational efficiency by 30%.',
    role: ['Built the dashboard and its data layer.'],
    impact: [
      { value: '100+', label: 'IoT devices monitored', source: 'CV' },
      { value: '+30%', label: 'operational efficiency', source: 'CV' }
    ],
    related: ['jmr', 'ecampuslink', 'rental-saas']
  },

  /* ============================================================= Experiments */
  {
    id: 'social-app',
    title: 'Social Media App',
    tagline: 'Posts, likes, comments, friends, chat and calls — a full social app on Android.',
    categories: ['experiments', 'mobile'],
    status: 'learning',
    visibility: 'public',
    accent: '#c9a7a0',
    period: 'Feb 2019',
    context: 'Personal project',
    platforms: ['Android'],
    technologies: ['Java', 'Kotlin', 'PHP', 'Firebase', 'Firestore', 'Agora'],
    summary: 'A full social app with Google Sign-In, posts with photos, friend requests, one-to-one chat, voice and video calls and real-time notifications.',
    thumbnail: { src: 'img/projects/social/feed.webp', w: 480, h: 973, frame: 'phone', alt: 'Social app feed: a post with a photo, likes and comments, and Home, Friends, Notification and Profile tabs' },
    screenshots: [
      { src: 'img/projects/social/feed.webp', w: 480, h: 973, frame: 'phone', alt: 'Feed with a photo post', caption: 'Feed' },
      { src: 'img/projects/social/profile.webp', w: 480, h: 973, frame: 'phone', alt: 'Profile screen', caption: 'Profile' }
    ],
    features: [
      { title: 'Google Sign-In' },
      { title: 'Posts, likes & comments' },
      { title: 'Friend requests & one-to-one chat' },
      { title: 'Voice & video calls' },
      { title: 'Real-time notifications' }
    ],
    stack: { 'App': ['Android', 'Java', 'Kotlin'], 'Backend': ['PHP (XAMPP)', 'Firebase', 'Firestore', 'Postman'], 'Calls': ['Agora'] },
    related: ['video-calling', 'face-detection', 'pregnancy-tracker']
  },

  {
    id: 'video-calling',
    title: 'Video Calling App',
    tagline: 'One-to-one video and voice calls plus single-channel live streaming.',
    categories: ['experiments', 'mobile'],
    status: 'learning',
    visibility: 'private',
    accent: '#c9a7a0',
    period: 'Feb 2022',
    context: 'Personal project',
    platforms: ['Android'],
    technologies: ['Java', 'Agora', 'Truecaller SDK'],
    thumbnail: { src: 'img/projects/video-calling/concept.webp', w: 1280, h: 800, frame: 'art', illustrative: true, alt: 'Illustrative concept: a one-to-one video call screen and a live stream with viewer comments' },
    summary: 'Real-time communication on Android with Agora, and Truecaller for sign-in.',
    features: [
      { title: 'One-to-one video & voice calls' },
      { title: 'Live streaming through one channel' },
      { title: 'Truecaller sign-in' }
    ],
    stack: { 'App': ['Android', 'Java'], 'Real-time': ['Agora'], 'Identity': ['Truecaller SDK'] },
    related: ['social-app', 'face-detection', 'pregnancy-tracker']
  }
];
