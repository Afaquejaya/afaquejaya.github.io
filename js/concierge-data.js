/*
 * AI Portfolio Guide — knowledge base.
 *
 * Every fact here comes from this site (index.html, js/data.js) or the CV
 * (cv/cv.html, files/…CV.pdf), checked Oct 2026. Answers are deterministic:
 * js/concierge.js matches a visitor's question to an intent below and shows
 * its answer. Nothing is generated, so nothing can be invented.
 *
 * Rules for editing:
 *  - Only state what the CV or portfolio shows. If a question asks about
 *    something the portfolio does not demonstrate, mark the intent
 *    `kind: 'approach'` (shown as "How he'd approach it — not documented
 *    work") or say the evidence does not establish it.
 *  - Navigation is limited to the `sections` and `links` tables. The chat can
 *    never open anything else.
 *
 * Intent fields:
 *   q        question text shown on chips
 *   keys     matching terms; '^term' = strong signal, 'two words' = phrase
 *   answer   paragraphs (2–5 sentences in total)
 *   points   optional short bullets; [text, sectionKey] makes a clickable reference
 *   actions  buttons: { nav: sectionKey } scrolls the page, { link: linkKey } opens an allowlisted URL
 *   detail   optional "Explain in more detail" paragraphs/bullets
 *   next     related intent ids offered afterwards (2–3 are shown)
 *   kind     'verified' (default) or 'approach'
 */
window.CONCIERGE_DATA = {
  config: {
    // Optional server-side AI endpoint for questions the library can't answer.
    // GitHub Pages is static, so this stays empty unless a serverless function
    // (holding the provider key server-side) is deployed. Expected contract:
    // POST { question: string } → 200 { answer: string } (plain text).
    aiEndpoint: '',
    aiTimeoutMs: 9000,
    maxInput: 300
  },

  welcome:
    'Hi! I’m Afaque’s AI Portfolio Guide. 👋\nExplore his engineering experience, published apps, and AI projects—or ask me why he could be a great fit for your team.',
  starters: ['hire', 'aimcp', 'built', 'fit'],

  // ---------------------------------------------------------------- navigation allowlist
  // id = a real element id in index.html (or rendered by js/main.js from js/data.js).
  sections: {
    home:       { id: 'top',             label: 'Back to the top',            note: 'The introduction: role, years of experience and headline numbers.' },
    askai:      { id: 'ask-ai',          label: 'Ask ChatGPT, Gemini or Claude', note: 'This card sends a question plus his résumé summary to the AI of your choice.' },
    apps:       { id: 'work',            label: 'Explore Published Apps',     note: 'Published mobile apps, each with store screenshots, his part and the store links.', next: 'topdownloads' },
    tbay:       { id: 'app-tbay',        label: 'Open Tbay',                  note: 'Tbay — a gift-card marketplace with 1M+ Google Play downloads, shipped at Kobet Technology.', thumb: 'img/apps/tbay/icon.webp' },
    evv:        { id: 'app-evv',         label: 'Open eVV 2.0',               note: 'eVV 2.0 — the state-government school platform (500K+ downloads) from his CSM Technologies years.', thumb: 'img/apps/evv/icon.webp' },
    vivakard:   { id: 'app-vivakard',    label: 'Open VivaKard',              note: 'VivaKard — gift cards to cash, 100K+ Google Play downloads.', thumb: 'img/apps/vivakard/icon.webp' },
    timucard:   { id: 'app-timucard',    label: 'Open TimuCard',              note: 'TimuCard — gift-card payouts and bill payments, 50K+ Google Play downloads.', thumb: 'img/apps/timucard/icon.webp' },
    jeeb:       { id: 'app-jeeb',        label: 'Open Jeeb',                  note: 'Jeeb — the 0→1 grocery platform in Doha. The preview is a concept sketch; the store listing is retired.', thumb: 'img/logos/jeeb-icon.webp' },
    pass:       { id: 'app-pass',        label: 'Open Pass Delivery',         note: 'Pass — delivery and driver apps in Qatar: GPS tracking, routing and payments.', thumb: 'img/logos/pass-icon.webp' },
    moreapps:   { id: 'more-shipped',    label: 'More shipped apps',          note: 'The rest of his published apps — operations, education and FinTech.' },
    builds:     { id: 'builds',          label: 'Explore SaaS & AI work',     note: 'His own products: the rental SaaS, its MCP integration, GlowFit AI, the Pregnancy Tracker and an AI expense tracker.' },
    rental:     { id: 'build-rental',    label: 'View the Rental SaaS',       note: 'The Rental Property Management SaaS: leases, billing, payments, owner and tenant portals.', next: 'mcphow' },
    mcp:        { id: 'build-mcp',       label: 'View SaaS & MCP Architecture', note: 'The MCP flow: AI client → owner-scoped auth → MCP tools → the SaaS APIs → the owner’s records only.', next: 'mcpauth' },
    glowfit:    { id: 'build-glowfit',   label: 'Explore GlowFit AI',         note: 'GlowFit AI — real screenshots of skin analysis and virtual try-on, with live demo and GitHub links.' },
    pregnancy:  { id: 'build-pregnancy', label: 'See the Pregnancy Tracker',  note: 'The Pregnancy Tracker’s home screen, next to a representation of its 4×2 home-screen widget.', thumb: 'img/projects/pregnancy/icon.webp' },
    expense:    { id: 'build-expense',   label: 'See the AI Expense Tracker', note: 'Plain-language expenses in, structured JSON out — Flutter app with a FastAPI and LangChain backend.' },
    impact:     { id: 'impact',          label: 'See measured impact',        note: 'Each number here is tied to the product and team where it happened.' },
    cases:      { id: 'cases',           label: 'Read the case studies',      note: 'Three engagements as case files: challenge, what he built, result.' },
    caseJeeb:   { id: 'case-jeeb',       label: 'Jeeb case study',            note: 'Jeeb: a grocery platform built from zero to one in Doha.', thumb: 'img/logos/jeeb-icon.webp' },
    caseKobet:  { id: 'case-kobet',      label: 'Kobet case study',           note: 'Kobet: a FinTech app family built by one team across Dubai, China and Sri Lanka.', thumb: 'img/logos/kobet.webp' },
    caseEvv:    { id: 'case-evv',        label: 'eVV case study',             note: 'eVV: keeping a state’s schools running through COVID-19.', thumb: 'img/apps/evv/icon.webp' },
    experience: { id: 'experience',      label: 'Review Experience',          note: 'His career path from 2018 to 2026, newest role first, with outcomes per role.' },
    roleKobet:  { id: 'role-kobet',      label: 'Kobet role',                 note: 'Senior Software Engineer at Kobet Technology, Dubai (Sep 2024 – Jul 2026).' },
    roleJeeb:   { id: 'role-jeeb',       label: 'Jeeb role',                  note: 'Software Engineer at Jeeb, Doha (Sep 2022 – Sep 2024).' },
    roleCsm:    { id: 'role-csm',        label: 'CSM role',                   note: 'Software Engineer at CSM Technologies, Ranchi (Aug 2020 – Sep 2022).' },
    roleJusco:  { id: 'role-jusco',      label: 'JUSCO role',                 note: 'Android App Developer at JUSCO (Tata Steel company), Jamshedpur (Aug 2019 – Aug 2020).' },
    skills:     { id: 'skills',          label: 'View Technical Skills',      note: 'Skills grouped by job; highlighted = daily driver, dashed = still exploring.' },
    about:      { id: 'about',           label: 'Read About Afaque',          note: 'His background and the principles he works by.' },
    contact:    { id: 'contact',         label: 'Contact Afaque',             note: 'Email, LinkedIn, GitHub and the CV — all in one place.' }
  },

  // ---------------------------------------------------------------- external links allowlist
  links: {
    cv:         { label: 'View CV',           href: 'cv/cv.html', newTab: true },
    pdf:        { label: 'Download CV',       href: 'files/Afaque-Jaya-Senior-Mobile-Full-Stack-Engineer-CV.pdf', download: 'Afaque-Jaya-Senior-Mobile-Full-Stack-Engineer-CV.pdf' },
    email:      { label: 'Email Afaque',      href: 'mailto:afaquejaya123@gmail.com' },
    linkedin:   { label: 'LinkedIn',          href: 'https://www.linkedin.com/in/afaque-jaya', newTab: true },
    github:     { label: 'GitHub',            href: 'https://github.com/Afaquejaya', newTab: true },
    rentalLive: { label: 'Open live SaaS',    href: 'https://rental-property.hatchable.site/', newTab: true },
    glowfitLive:{ label: 'GlowFit live demo', href: 'https://glowfit-ai.vercel.app', newTab: true },
    glowfitGit: { label: 'GlowFit on GitHub', href: 'https://github.com/Afaquejaya/glowfit-ai', newTab: true },
    expenseCode:{ label: 'Expense tracker code & notes', href: 'https://gist.github.com/Afaquejaya/a4d157d4255799bd6e3521320f6d9537', newTab: true },
    tbayPlay:   { label: 'Tbay on Google Play', href: 'https://play.google.com/store/apps/details?id=com.gonglian.tbay', newTab: true },
    evvPlay:    { label: 'eVV 2.0 on Google Play', href: 'https://play.google.com/store/apps/details?id=com.evidyavahini.app', newTab: true }
  },

  // ---------------------------------------------------------------- browsing
  categories: [
    { id: 'hiring',     label: 'Hiring decision', items: ['hire', 'different', 'value', 'strengths', 'role'] },
    { id: 'seniority',  label: 'Seniority',       items: ['senior', 'fullproduct', 'independent', 'architecture', 'ownership'] },
    { id: 'projects',   label: 'Projects',        items: ['impressive', 'apps', 'challenging', 'rental', 'glowfit', 'pregnancy', 'impact'] },
    { id: 'technical',  label: 'Technical',       items: ['mcphow', 'scalable', 'apierrors', 'bookings', 'quality', 'improve'] },
    { id: 'leadership', label: 'Leadership',      items: ['distributed', 'ambiguous', 'qualityspeed', 'communicate'] },
    { id: 'next',       label: 'CV & contact',    items: ['cv', 'download', 'best', 'contact', 'profiles'] }
  ],

  // ---------------------------------------------------------------- answers
  intents: [
    /* ---------- Hiring decision ---------- */
    {
      id: 'hire', q: 'Why should we hire Afaque?',
      keys: ['^hire', 'hiring', 'why him', 'why should', 'recommend', 'worth', 'convince'],
      answer: [
        'Afaque brings 7+ years of software engineering across native and cross-platform mobile apps, APIs and product delivery — 15+ published apps with 1M+ collective downloads.',
        'His roles show measurable outcomes (a 95% faster homepage and 60% faster deliveries at Jeeb, 500K+ downloads for state ed-tech apps) and team leadership across Dubai, China and Sri Lanka. His own builds now extend into an AI-enabled SaaS with an MCP integration.'
      ],
      actions: [{ nav: 'builds', label: 'Explore Projects' }, { link: 'cv' }, { nav: 'contact', label: 'Contact Afaque' }],
      next: ['impressive', 'experience', 'cv']
    },
    {
      id: 'fit', q: 'Is he a good fit for our team?',
      keys: ['^fit', 'good fit', 'right fit', 'our team', 'suit', 'match'],
      answer: [
        'He is strongest where a team ships mobile products end to end: Flutter, React Native or native Kotlin/Swift apps, the APIs behind them, and the release process into both stores.',
        'Fit depends on what you need. His record covers 0→1 start-up work with founders (Jeeb), a distributed FinTech team (Kobet) and government-scale rollouts (CSM). Tell me about your stack or role and I’ll point to the closest evidence.'
      ],
      actions: [{ nav: 'experience' }, { nav: 'skills' }],
      next: ['role', 'senior', 'distributed']
    },
    {
      id: 'different', q: 'What makes him different from other developers?',
      keys: ['different', 'unique', 'apart', 'sets him apart', 'stand out', 'stands out', 'special', 'differentiat', 'edge'],
      answer: [
        'His breadth across native Android, iOS, cross-platform apps, backend integration and AI-enabled products lets him work across several layers of one product.',
        'The portfolio pairs published, high-download apps with his own builds — a rental SaaS with an MCP integration, GlowFit AI and an LLM-backed expense tracker — so you can see both delivered products and current exploration.'
      ],
      actions: [{ nav: 'builds', label: 'Explore His Work' }],
      next: ['impressive', 'strengths']
    },
    {
      id: 'value', q: 'What value could he bring to our company?',
      keys: ['value', 'bring', 'contribute', 'benefit', 'first 90', 'impact on'],
      answer: [
        'Based on his record: shipping cross-platform apps to both stores, speeding up key screens (Jeeb’s homepage loaded 95% faster), connecting apps to real-time and payment systems, and keeping a distributed team releasing reliably.',
        'He also brings hands-on experience putting LLMs and MCP behind real interfaces, which helps if you are adding AI features to a product.'
      ],
      actions: [{ nav: 'impact' }, { nav: 'cases' }],
      next: ['impact', 'aimcp']
    },
    {
      id: 'strengths', q: 'What are his strongest engineering skills?',
      keys: ['strongest', 'strength', 'best at', 'good at', 'skills', 'expertise', 'core skill'],
      answer: [
        'His daily drivers are Flutter, React Native and Android, in Dart, Kotlin and TypeScript, with Clean Architecture and MVVM.',
        'Around that: REST and GraphQL APIs, Firebase, real-time data, store publishing and CI/CD — plus LLM integration with LangChain in recent work.'
      ],
      points: [['Mobile: Flutter, React Native, Android, iOS (Swift), Jetpack Compose', 'skills'], ['Backend & data: REST, GraphQL, OAuth, WebSocket, FastAPI, Firebase', 'skills'], ['AI: LLM integration, LangChain, prompt engineering; MCP (actively exploring)', 'skills']],
      actions: [{ nav: 'skills' }],
      next: ['architecture', 'appstech']
    },
    {
      id: 'role', q: 'What kind of role would suit him best?',
      keys: ['role', 'position', 'title', 'job', 'suit him', 'best role', 'lead role'],
      answer: [
        'His experience points to a senior mobile or full-stack engineer role that owns features from API to store release — especially on cross-platform (Flutter or React Native) products.',
        'He has also led a cross-country team at Kobet, so a senior role with technical-lead responsibilities is consistent with his record. His contact section names senior mobile/full-stack roles and 0→1 product builds as what he is looking for.'
      ],
      actions: [{ nav: 'experience' }, { nav: 'contact' }],
      next: ['senior', 'distributed']
    },

    /* ---------- Seniority & ownership ---------- */
    {
      id: 'senior', q: 'Is he genuinely senior-level?',
      keys: ['^senior', 'seniority', 'level', 'lead level', 'experienced enough', 'junior'],
      answer: [
        'His experience spans more than mobile UI: published products, API integration, e-commerce and logistics workflows, operational apps and SaaS architecture. He held the title Senior Software Engineer at Kobet Technology and led a team across three countries.',
        'Review his project ownership and implementation evidence to judge it against your own definition of senior — years alone don’t prove a level.'
      ],
      actions: [{ nav: 'experience', label: 'Review Experience' }, { nav: 'cases' }],
      next: ['ownership', 'architecture', 'distributed']
    },
    {
      id: 'fullproduct', q: 'Has he built complete products or only UI?',
      keys: ['complete product', 'only ui', 'just ui', 'full stack', 'fullstack', 'end to end product', 'backend'],
      answer: [
        'Complete products. At Jeeb he built a 0→1 e-commerce and logistics platform — customer app, operations apps, GPS tracking, routing and payments. At JUSCO he built a native app together with its scalable .NET backend APIs.',
        'His own Rental Property SaaS covers leases, billing, payments, reconciliation, owner/tenant portals and an MCP server.'
      ],
      points: [['Jeeb: platform from zero to one', 'caseJeeb'], ['Rental SaaS: full rent cycle + MCP', 'rental']],
      actions: [{ nav: 'caseJeeb' }, { nav: 'rental' }],
      next: ['rental', 'architecture']
    },
    {
      id: 'independent', q: 'Can he work independently?',
      keys: ['independent', 'independently', 'alone', 'self starter', 'self-starter', 'autonomous', 'on his own', 'solo'],
      answer: [
        'Yes, on the evidence available: he owned delivery end to end at CSM Technologies (requirements to UAT, rollout and support), worked directly with founders at Jeeb, and built his rental SaaS, GlowFit AI and the Pregnancy Tracker as his own projects.'
      ],
      actions: [{ nav: 'builds', label: 'See his own builds' }, { nav: 'roleCsm' }],
      next: ['ownership', 'ambiguous']
    },
    {
      id: 'architecture', q: 'Has he handled architecture and API integrations?',
      keys: ['^architecture', 'architect', 'api integration', 'integrations', 'system design', 'design decisions', 'apis'],
      answer: [
        'Yes. At Kobet he architected and delivered cross-platform FinTech apps with KYC, 2FA, wallets and real-time data. At Jeeb he designed a server-driven homepage (layout and content come from the server, so merchandising changes ship without an app release) with Algolia search.',
        'At JUSCO he built the app against scalable .NET APIs and optimised API and database performance. His rental SaaS routes AI access through the same APIs and business rules as the app.'
      ],
      detail: [
        'Server-driven UI (Jeeb): the server sends layout blocks plus personalised content; the app maps blocks to native widgets. Trade-off: more upfront design of the block schema, in exchange for releasing merchandising changes without store reviews.',
        'MCP (rental SaaS): AI clients don’t touch the database. They call a small set of tools that go through the same SaaS APIs, scoped to the signed-in owner — so business rules and access control live in one place.'
      ],
      actions: [{ nav: 'caseJeeb', label: 'See the server-driven design' }, { nav: 'mcp' }],
      next: ['mcphow', 'scalable', 'apierrors']
    },
    {
      id: 'ownership', q: 'Can he take ownership from idea to deployment?',
      keys: ['ownership', 'own it', 'idea to', 'deployment', 'end to end', 'end-to-end', 'zero to one', '0 to 1', '0→1'],
      answer: [
        'That is the pattern in his record: Jeeb went from zero to one with the founders; at CSM he owned requirements, biometric configuration, development, UAT, rollout and post-launch support; at Kobet he handled releases and CI/CD for both stores.',
        '“Own it end to end” is also one of the principles he lists on this site.'
      ],
      actions: [{ nav: 'caseEvv' }, { nav: 'about' }],
      next: ['independent', 'impact']
    },

    /* ---------- Projects ---------- */
    {
      id: 'built', q: 'What has he built?',
      keys: ['built', 'build', 'created', 'portfolio', 'his work', 'projects', 'what has he done'],
      answer: [
        'Two kinds of work: published apps from his jobs — FinTech (Tbay, VivaKard, TimuCard, BitOwi), grocery and logistics (Jeeb, Pass) and state-government ed-tech (eVV 2.0, DigiSchool) — and his own builds.',
        'His own builds are a Rental Property Management SaaS with MCP integration, GlowFit AI, a native Android Pregnancy Tracker with a home-screen widget, and an AI expense tracker.'
      ],
      actions: [{ nav: 'apps' }, { nav: 'builds' }],
      next: ['apps', 'rental', 'impressive']
    },
    {
      id: 'impressive', q: 'Show me his most impressive project.',
      keys: ['^impressive', 'best project', 'favourite project', 'favorite project', 'flagship', 'proudest', 'top project', 'strongest project'],
      answer: [
        'For technical depth, his Rental Property Management SaaS: it covers the whole rent cycle for owners and tenants, keeps each owner’s data separate, and lets authorised AI clients query it through MCP tools.',
        'For scale, Tbay — a FinTech app he helped ship at Kobet, with 1M+ Google Play downloads.'
      ],
      actions: [{ nav: 'mcp', label: 'View SaaS & MCP Architecture' }, { nav: 'tbay' }],
      next: ['mcphow', 'apps']
    },
    {
      id: 'apps', q: 'What mobile apps has he published?',
      keys: ['^apps', 'mobile apps', 'published', 'play store', 'app store', 'applications', 'mobile applications', 'store'],
      answer: [
        'He has worked on 15+ published apps. The ones shown here: Tbay (1M+ Google Play downloads), VivaKard (100K+), TimuCard (50K+) and BitOwi at Kobet; eVV 2.0 (500K+) and DigiSchool at CSM; Jeeb and Pass in Qatar; JMR and e-CampusLink at JUSCO.',
        'Some older listings (Jeeb, Pass, DigiSchool, JMR, e-CampusLink) are no longer public, and the site says so.'
      ],
      points: [['Tbay — 1M+ downloads', 'tbay'], ['eVV 2.0 — 500K+ downloads', 'evv'], ['VivaKard — 100K+ downloads', 'vivakard']],
      actions: [{ nav: 'apps', label: 'Explore Published Apps' }],
      next: ['topdownloads', 'appstech', 'screenshots']
    },
    {
      id: 'topdownloads', q: 'Which apps have the highest downloads?',
      keys: ['highest downloads', 'most downloads', 'downloads', 'popular', 'most used', 'users'],
      answer: [
        'From the Google Play listings: Tbay has 1M+ downloads (4.6★ from 42.6K reviews), eVV 2.0 500K+, VivaKard 100K+ and TimuCard 50K+.',
        'These are listing counts for apps he worked on as part of a team, not personal user numbers.'
      ],
      points: [['Tbay — 1M+', 'tbay'], ['eVV 2.0 — 500K+', 'evv'], ['VivaKard — 100K+', 'vivakard'], ['TimuCard — 50K+', 'timucard']],
      actions: [{ nav: 'tbay' }, { link: 'tbayPlay' }],
      next: ['appstech', 'caseKobetQ']
    },
    {
      id: 'appstech', q: 'What technologies were used in his apps?',
      keys: ['technologies', 'tech stack', 'stack', 'technology', 'languages', 'frameworks', 'tools used'],
      answer: [
        'Kobet’s FinTech apps: Flutter and React Native with Kotlin and Swift, plus Vue.js, React and Python. Jeeb: Flutter, React Native, Swift, Kotlin, Java, Python and Algolia. CSM: Flutter, React Native, Kotlin, Java, .NET and PHP. JUSCO: Kotlin, Java, C#/.NET, Xamarin and SQL.'
      ],
      actions: [{ nav: 'experience' }, { nav: 'skills' }],
      next: ['strengths', 'architecture']
    },
    {
      id: 'screenshots', q: 'View the application screenshots.',
      keys: ['screenshots', 'screens', 'screenshot', 'show the app', 'ui of'],
      answer: ['The app showcase has store screenshots in phone frames for each published app. Where a listing is retired, the site labels the preview as a concept sketch.'],
      actions: [{ nav: 'apps', label: 'View app screenshots' }, { nav: 'glowfit', label: 'GlowFit screenshots' }],
      next: ['apps', 'glowfit']
    },
    {
      id: 'challenging', q: 'What is his most technically challenging project?',
      keys: ['^challenging', '^hardest', 'difficult', 'complex', '^toughest', 'technical challenge'],
      answer: [
        'Two stand out in the evidence. Jeeb combined a server-driven homepage, instant search, real-time GPS tracking, route optimisation and payments across customer and operations apps.',
        'His rental SaaS adds a different kind of challenge: exposing business data to AI clients through MCP without bypassing authentication or owner isolation.'
      ],
      actions: [{ nav: 'caseJeeb' }, { nav: 'mcp' }],
      next: ['architecture', 'mcpauth']
    },
    {
      id: 'rental', q: 'Show me his Rental SaaS and MCP integration.',
      keys: ['^rental', 'property', 'saas', 'tenant', 'landlord', 'lease', 'owner portal', 'hatchable'],
      answer: [
        'His Rental Property Management SaaS runs the whole rent cycle: lease → bill → payment, with meter readings, invoice PDFs, expenses, reconciliation and overdue alerts, through separate owner and tenant portals.',
        'It also has an MCP integration, so a compatible AI client authorised by the owner can ask questions such as “Which tenants have overdue rent?”, answered only from that owner’s records.'
      ],
      thumbless: true,
      actions: [{ nav: 'rental', label: 'View the Rental SaaS' }, { nav: 'mcp', label: 'View SaaS & MCP Architecture' }, { link: 'rentalLive' }],
      next: ['mcphow', 'mcpauth', 'mcptools']
    },
    {
      id: 'aimcp', q: 'Explore his AI & MCP work.',
      keys: ['^mcp', 'model context protocol', '^ai', 'artificial intelligence', 'llm', 'langchain', 'genai', 'machine learning', 'ai work', 'ai projects'],
      answer: [
        'His Rental Property Management SaaS combines rental operations with an MCP integration that lets compatible, authenticated AI clients access authorised rental data through defined tools.',
        'Alongside it: GlowFit AI (skin analysis and virtual try-on using YouCam’s AI APIs) and an AI expense tracker that turns plain language into structured JSON with LangChain.'
      ],
      actions: [{ nav: 'mcp', label: 'Explore AI & MCP Project' }, { nav: 'glowfit' }, { nav: 'expense' }],
      next: ['mcpauth', 'mcptools', 'glowfit']
    },
    {
      id: 'glowfit', q: 'What is GlowFit AI?',
      keys: ['^glowfit', 'glow fit', 'beauty', 'makeup', 'skin', 'try on', 'try-on', 'youcam', 'perfect corp', 'hackathon'],
      answer: [
        'GlowFit AI is a web app built for a Perfect Corp hackathon: one selfie in, skin analysis (a score, 8 metrics and a GlowMap) plus virtual try-on of three looks with a score for which suits you, a budget mode and “change one thing” previews.',
        'It’s built with Next.js and TypeScript on YouCam’s APIs and MediaPipe, with a live demo and source on GitHub.'
      ],
      actions: [{ nav: 'glowfit', label: 'Explore GlowFit AI' }, { link: 'glowfitLive' }, { link: 'glowfitGit' }],
      next: ['aimcp', 'pregnancy']
    },
    {
      id: 'pregnancy', q: 'Tell me about the Pregnancy Tracker widget.',
      keys: ['^pregnancy', 'pregnant', 'widget', 'home screen', 'home-screen', 'trimester', 'appwidget'],
      answer: [
        'The Pregnancy Tracker is a native Android app in Kotlin and Jetpack Compose: a week-by-week companion with 40 weeks of content, progress, care tips and reminders that survive reboots, stored with Room.',
        'Its resizable 4×2 home-screen widget shows the current week, trimester and days left without opening the app.'
      ],
      actions: [{ nav: 'pregnancy', label: 'See the Pregnancy Tracker' }],
      next: ['apps', 'glowfit']
    },
    {
      id: 'expense', q: 'What is the AI Smart Expense Tracker?',
      keys: ['expense', 'expenses', 'hinglish', 'fastapi', 'natural language', 'callback', 'ai hook'],
      answer: [
        'A Flutter app with a FastAPI backend: you type how you spent money in plain language — even Hinglish — and get back categorised, structured expenses.',
        'An “AI hook” on the LangChain callback lifecycle drives the loading state, enforces strict JSON output and handles errors, with an offline fallback view.'
      ],
      actions: [{ nav: 'expense' }, { link: 'expenseCode' }],
      next: ['apierrors', 'aimcp']
    },
    {
      id: 'impact', q: 'What measurable impact has his work delivered?',
      keys: ['^impact', 'measurable', 'metrics', 'numbers', '^results', '^outcomes', 'achievements', 'kpi'],
      answer: ['These are the outcomes documented in his CV, each tied to where it happened:'],
      points: [
        ['95% faster homepage load and +50% engagement — Jeeb', 'caseJeeb'],
        ['+60% delivery speed; +20% delivery & checkout efficiency — Jeeb', 'caseJeeb'],
        ['500K+ downloads of state ed-tech apps — CSM Technologies', 'caseEvv'],
        ['70% less data entry, 50% better accuracy — JUSCO', 'roleJusco'],
        ['1M+ Google Play downloads for Tbay — Kobet (team)', 'tbay']
      ],
      after: 'The CV doesn’t give the measurement method for each figure, so treat them as reported outcomes worth discussing in an interview.',
      actions: [{ nav: 'impact', label: 'See measured impact' }],
      next: ['caseJeebQ', 'apps']
    },
    {
      id: 'caseJeebQ', q: 'How did he make Jeeb’s homepage 95% faster?',
      keys: ['jeeb', 'grocery', 'doha', 'qatar', 'homepage', 'server driven', 'server-driven', 'algolia'],
      answer: [
        'At Jeeb he architected a server-driven, personalised homepage — the server sends the layout and content, and the app maps them to native widgets — with Algolia instant search instead of in-house search.',
        'The CV reports a 95% faster homepage load and 50% higher engagement. The site’s diagram is a simplified illustration, not a production diagram.'
      ],
      actions: [{ nav: 'caseJeeb', label: 'Read the Jeeb case study' }],
      next: ['architecture', 'distributed']
    },
    {
      id: 'caseKobetQ', q: 'What did he do at Kobet?',
      keys: ['kobet', 'fintech', 'dubai', 'tbay', 'vivakard', 'timucard', 'bitowi', 'crypto', 'wallet', 'gift card'],
      answer: [
        'As Senior Software Engineer at Kobet Technology (Dubai, 2024–2026) he architected and delivered cross-platform FinTech apps — crypto, wallets, KYC and 2FA with real-time data — and led a team across Dubai, China and Sri Lanka through planning, releases, documentation and CI/CD.',
        'The app family includes Tbay (1M+ Play downloads), VivaKard, TimuCard and BitOwi.'
      ],
      actions: [{ nav: 'caseKobet', label: 'Read the Kobet case study' }, { nav: 'tbay' }],
      next: ['distributed', 'topdownloads']
    },
    {
      id: 'caseEvvQ', q: 'What did he build for the government ed-tech apps?',
      keys: ['^evv', '^government', 'gov', 'school', 'education', 'ed-tech', 'edtech', 'covid', 'biometric', 'csm', 'digischool', 'jharkhand'],
      answer: [
        'At CSM Technologies (2020–2022) he built and launched state-government ed-tech apps — school management, biometric attendance, student and teacher tracking, mid-day meals and e-learning — during COVID-19, passing 500K+ downloads.',
        'He also ran client demos and user training, and handled UAT, rollout and post-launch support for state-wide adoption.'
      ],
      actions: [{ nav: 'caseEvv', label: 'Read the eVV case study' }, { nav: 'evv' }],
      next: ['communicate', 'ownership']
    },

    /* ---------- Technical evaluation ---------- */
    {
      id: 'mcphow', q: 'How does his MCP integration work?',
      keys: ['how does mcp', 'how does the mcp', '^mcp integration', 'mcp server', 'mcp flow', 'protocol works'],
      answer: [
        'An MCP-compatible AI client connects to the rental SaaS, authenticates with owner-scoped access, and calls a small set of MCP tools (rent, leases, expenses). The tools go through the same SaaS APIs and business rules as the app, so every answer comes only from that owner’s records.',
        'It works with AI clients that support MCP and that the owner has authorised — not with every AI model automatically.'
      ],
      detail: [
        'The five hops shown on the site: 01 AI client → 02 MCP auth (owner-scoped) → 03 MCP tools → 04 SaaS APIs (same business rules) → 05 database (the owner’s records only).',
        'The design choice worth noting: the AI layer gets no direct database access. Reusing the existing APIs keeps validation and access control in one place.',
        'What the portfolio doesn’t document: the exact auth mechanism, token lifetimes or load testing — good topics for a technical interview.'
      ],
      actions: [{ nav: 'mcp', label: 'View SaaS & MCP Architecture' }],
      next: ['mcpauth', 'mcptools']
    },
    {
      id: 'mcpauth', q: 'How is MCP access authenticated?',
      keys: ['authenticated', 'authentication', 'auth', 'authorised', 'authorized', 'access control', 'security', 'owner isolation', 'isolation'],
      answer: [
        'Per the architecture on the site, an AI client must be authorised by the owner, and its access is owner-scoped: every answer is scoped to the signed-in owner, so it only reaches that owner’s records.',
        'The portfolio doesn’t publish the specific auth protocol or token details, so I won’t guess them.'
      ],
      actions: [{ nav: 'mcp', label: 'See the auth step' }],
      next: ['mcptools', 'mcphow']
    },
    {
      id: 'mcptools', q: 'What tools can AI clients use?',
      keys: ['what tools', 'mcp tools', 'tools can', 'which tools', 'ai clients use', 'example questions'],
      answer: [
        'The site describes MCP tools covering rent, leases and expenses, with example questions like “Which tenants have overdue rent?”, “Show this month’s collection”, “Which leases are expiring?” and “Summarise property expenses.”',
        'The full tool list and schemas aren’t published on the portfolio.'
      ],
      actions: [{ nav: 'mcp', label: 'See the example questions' }, { link: 'rentalLive' }],
      next: ['mcpauth', 'rental']
    },
    {
      id: 'scalable', kind: 'approach', q: 'How would he design a scalable mobile application?',
      keys: ['scalable', 'scale', 'scalability', 'design a', 'large app', 'grow'],
      answer: [
        'Grounded in what he lists and has shipped: Clean Architecture with MVVM, clear module boundaries so a distributed team can work in parallel, state management such as BLoC or Riverpod, and server-driven UI where content changes often (as at Jeeb).',
        'For scale he would add typed API clients, caching (Room/Hive), CI/CD and store-release discipline — the stack he used across Kobet’s app family.'
      ],
      actions: [{ nav: 'skills' }, { nav: 'caseKobet' }],
      next: ['quality', 'apierrors']
    },
    {
      id: 'apierrors', kind: 'approach', q: 'How does he approach API integration and error handling?',
      keys: ['error handling', 'errors', 'error', 'failure', 'fallback', 'retry', 'api approach', 'resilien'],
      answer: [
        'Documented example: in his AI expense tracker, an “AI hook” on the LangChain callbacks drives loading state, enforces strict JSON output and handles errors gracefully, with an offline fallback view.',
        'More broadly he lists REST, GraphQL, OAuth, WebSocket and Dio/Retrofit, plus OWASP; a typical approach is typed clients, clear loading/error/empty states and safe retries. Ask him how he’d apply it to your system.'
      ],
      actions: [{ nav: 'expense' }, { nav: 'skills' }],
      next: ['quality', 'architecture']
    },
    {
      id: 'bookings', kind: 'approach', q: 'How does he prevent duplicate bookings in a high-demand system?',
      keys: ['duplicate', 'booking', 'bookings', 'double booking', 'race condition', 'concurrency', 'idempotent', 'idempotency', 'high demand'],
      answer: [
        'The portfolio doesn’t include a booking system, so this isn’t documented work. A standard approach would be idempotency keys on the booking request, a unique constraint or transactional lock on the slot in the database, and short-lived holds that expire.',
        'On the client, disable repeat submits and retry safely using the same idempotency key. It’s a good interview question — his payment and checkout work at Jeeb and Kobet is the closest evidence.'
      ],
      actions: [{ nav: 'caseJeeb', label: 'Closest evidence: Jeeb checkout' }],
      next: ['apierrors', 'scalable']
    },
    {
      id: 'quality', q: 'How does he approach performance, testing, and maintainability?',
      keys: ['performance', 'testing', 'tests', 'maintainab', 'quality', 'clean code', 'tdd', 'unit test', 'optimi'],
      answer: [
        'Performance: Jeeb’s homepage load was reported 95% faster, and at JUSCO he optimised API and database performance. Testing: he lists unit and UI testing, Mockito, TDD and UAT, and ran UAT for state rollouts at CSM.',
        'Maintainability: Clean Architecture, MVVM and SOLID, and his principle that “architecture is for people” — clean boundaries so a team across three countries can move safely.'
      ],
      actions: [{ nav: 'skills' }, { nav: 'about' }],
      next: ['qualityspeed', 'scalable']
    },
    {
      id: 'improve', kind: 'approach', q: 'What would he improve in one of his projects today?',
      keys: ['improve', 'improvement', 'do differently', 'next step', 'weakness', 'gaps', 'gap'],
      answer: [
        'The portfolio doesn’t record his own retrospective, so I can’t answer for him. It is open about some limits: older store listings are retired, the rental SaaS shows a design representation because the app is behind sign-in, and MCP is marked as an area he’s still exploring.',
        'Asking him what he’d change in the MCP integration or the rental SaaS would make a strong interview question.'
      ],
      actions: [{ nav: 'mcp' }, { nav: 'contact', label: 'Ask him directly' }],
      next: ['mcphow', 'contact']
    },

    /* ---------- Leadership & collaboration ---------- */
    {
      id: 'distributed', q: 'Has he worked with distributed teams?',
      keys: ['^distributed', '^remote', 'cross-country', 'cross country', 'team across', 'lead a team', 'led a team', '^leadership', 'manage', 'timezone', 'time zone'],
      answer: [
        'Yes. At Kobet he led a team across Dubai, China and Sri Lanka, covering feature planning, releases, documentation and CI/CD deployments. At Jeeb he led a remote team building the Driver, Collector and Storekeeper apps.'
      ],
      actions: [{ nav: 'caseKobet' }, { nav: 'roleJeeb' }],
      next: ['communicate', 'qualityspeed']
    },
    {
      id: 'ambiguous', q: 'How does he approach ambiguous requirements?',
      keys: ['ambiguous', 'ambiguity', 'unclear', 'vague', 'requirements', 'uncertain'],
      answer: [
        'The closest evidence: at Jeeb he built from zero to one directly with the founders, and at CSM he owned requirements gathering for government apps under COVID-19 time pressure.',
        'His stated principle is “ship, then sharpen”: get a real build into real hands early, then iterate with data.'
      ],
      actions: [{ nav: 'about' }, { nav: 'caseJeeb' }],
      next: ['qualityspeed', 'communicate']
    },
    {
      id: 'qualityspeed', q: 'How does he balance engineering quality with delivery speed?',
      keys: ['balance', 'delivery speed', 'trade-off', 'tradeoff', 'trade off', 'deadline', 'quality vs', 'speed vs'],
      answer: [
        'His listed principles cover both sides: “ship, then sharpen” for speed, “measure what matters” (load time, engagement, delivery speed — not lines of code) and clean architecture so teams can move without breaking each other.',
        'In practice that shows up as server-driven UI at Jeeb (change content without a release) and a CI/CD release rhythm at Kobet.'
      ],
      actions: [{ nav: 'about' }, { nav: 'caseKobet' }],
      next: ['quality', 'distributed']
    },
    {
      id: 'communicate', q: 'Can he communicate technical decisions to non-technical stakeholders?',
      keys: ['communicat', 'stakeholder', 'non-technical', 'non technical', 'explain', 'client', 'founder', 'presentation', 'demo'],
      answer: [
        'The evidence points that way: at CSM he led client demos and user training for a state-wide government rollout, and at Jeeb he worked directly with the founders. At Kobet he coordinated feature planning, releases and documentation for a three-country team.'
      ],
      actions: [{ nav: 'caseEvv' }, { nav: 'roleJeeb' }],
      next: ['distributed', 'ambiguous']
    },

    /* ---------- CV & next steps ---------- */
    {
      id: 'cv', q: 'Show me his CV.',
      keys: ['^cv', '^resume', 'résumé', 'curriculum', 'show cv', 'see his cv'],
      answer: ['Here is Afaque’s professional CV — view it online or download the PDF.'],
      actions: [{ link: 'cv' }, { link: 'pdf' }],
      next: ['experience', 'contact']
    },
    {
      id: 'download', q: 'Download his resume.',
      keys: ['^download', 'pdf', 'save cv', 'download cv', 'download resume', 'download his', 'resume pdf', 'cv pdf'],
      answer: ['Here’s the PDF of his CV (about 680 KB).'],
      actions: [{ link: 'pdf' }, { link: 'cv' }],
      next: ['contact', 'hire']
    },
    {
      id: 'best', q: 'Take me to his best projects.',
      keys: ['best projects', 'best work', 'take me to', 'show projects', 'top work', 'highlights'],
      answer: ['His strongest evidence is in two places: the published-apps showcase (Tbay, eVV 2.0, VivaKard, TimuCard and more) and his own SaaS & AI builds, led by the rental SaaS with MCP.'],
      actions: [{ nav: 'builds', label: 'SaaS & AI builds' }, { nav: 'apps', label: 'Published apps' }],
      next: ['impressive', 'rental']
    },
    {
      id: 'contact', q: 'How can I contact him?',
      keys: ['^contact', 'email', 'reach him', 'get in touch', 'message him', 'talk to him', 'interview', 'available', 'availability'],
      answer: ['The quickest way is email: afaquejaya123@gmail.com. He’s also on LinkedIn, and the contact section has everything in one place.'],
      actions: [{ link: 'email' }, { link: 'linkedin' }, { nav: 'contact', label: 'Contact section' }],
      next: ['cv', 'profiles']
    },
    {
      id: 'profiles', q: 'Show me his GitHub and professional profiles.',
      keys: ['github', 'linkedin', 'profiles', 'profile', 'social', 'code samples', 'repositories', 'repo'],
      answer: ['His profiles: GitHub (@Afaquejaya) and LinkedIn (in/afaque-jaya). Public code includes GlowFit AI on GitHub and notes and code for the AI expense tracker.'],
      actions: [{ link: 'github' }, { link: 'linkedin' }, { link: 'glowfitGit' }],
      next: ['glowfit', 'contact']
    },
    {
      id: 'experience', q: 'Review his experience.',
      keys: ['^experience', 'career', 'background', 'history', 'worked', 'companies', 'employers', 'years'],
      answer: [
        '7+ years, newest first: Senior Software Engineer at Kobet Technology, Dubai (2024–26); Software Engineer at Jeeb, Doha (2022–24); Software Engineer at CSM Technologies, Ranchi (2020–22); Android App Developer at JUSCO (Tata Steel company), Jamshedpur (2019–20); and a data-analyst internship at Tata Growth Shop (2018).'
      ],
      actions: [{ nav: 'experience', label: 'Review Experience' }],
      next: ['caseKobetQ', 'senior']
    },
    {
      id: 'education', q: 'What is his education and certifications?',
      keys: ['^education', '^degree', '^university', 'college', 'certification', 'certifications', 'certificate', 'studied', 'study', 'b.tech', 'btech'],
      answer: [
        'B.Tech in Computer Science & Engineering, Jharkhand University of Technology (2015–2019).',
        'Certifications: Introduction to MCP (Anthropic, 2026), building an agentic AI system (2026), Prompt Engineering for Generative AI (2024), and AR/VR/XR & Metaverse (2024); plus 3rd prize at NIT Jamshedpur’s Autonomous Robotics exhibition (2018).'
      ],
      actions: [{ nav: 'experience', label: 'See education' }],
      next: ['experience', 'aimcp']
    },

    /* ---------- conversation ---------- */
    {
      id: 'greet', q: 'Hi', small: true,
      keys: ['^hi', '^hello', '^hey', 'good morning', 'good evening', 'salam', 'namaste'],
      answer: ['Hello! I can walk you through Afaque’s experience, published apps and AI work. What would you like to know?'],
      next: ['hire', 'built', 'aimcp']
    },
    {
      id: 'thanks', q: 'Thanks', small: true,
      keys: ['^thanks', '^thank', 'cheers', 'thank you'],
      answer: ['Glad that helped. Want his CV, or a way to reach him?'],
      next: ['cv', 'contact']
    },
    {
      id: 'who', q: 'Who are you?', small: true,
      keys: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'chatgpt', 'how do you work', 'what can you do', 'help me'],
      answer: ['I’m a guide built into Afaque’s portfolio. My answers come from his CV and this site — I don’t invent facts, and I can take you straight to the relevant section.'],
      next: ['hire', 'built', 'cv']
    }
  ]
};
