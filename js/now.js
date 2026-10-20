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
 * Checked 21 Oct 2026 against each project's latest commit and README.
 */
window.NOW = {
  updated: '21 Oct 2026',

  /* A. In progress this month */
  building: [
    {
      name: 'AI Job Agent',
      status: 'In development',
      what: 'A local-first agent that searches allowlisted job boards, scores each listing against your CV in code and backs every claim with a verbatim quote. It never applies or messages anyone.',
      progress: 'Phases 1–3 of a 12-phase roadmap are built — foundation, data layer with per-user isolation, and a durable background-task engine (live-checked 19 Oct 2026, awaiting sign-off).',
      next: 'Phase 4 — the AI provider layer and the chat shell.',
      tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'Redis', 'Ollama', 'Anthropic API'],
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
      links: [{ label: 'Case study', url: 'projects/project.html?id=pregnancy-tracker' }]
    }
  ],

  /* B. Learning by building — the five projects catalogued as "learning" */
  learning: [
    {
      name: 'Local AI Agent Lab', when: 'Oct 2026 —', current: true,
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
      tech: ['Java', 'Android', 'Agora', 'Truecaller SDK'],
      learning: 'Real-time communication on Android: one-to-one video and voice calls, and single-channel live streaming.',
      status: 'Finished as a learning build; the source is private.',
      links: [{ label: 'Case study', url: 'projects/project.html?id=video-calling' }]
    },
    {
      name: 'Face Detection', when: 'Jan 2020',
      tech: ['Java', 'Kotlin', 'Android', 'Microsoft Face API'],
      learning: 'Calling a cloud vision API from a native app and drawing its results — faces, landmarks and attributes — on the photo.',
      status: 'Finished as a learning build.',
      links: [{ label: 'Case study', url: 'projects/project.html?id=face-detection' }]
    },
    {
      name: 'Social Media App', when: 'Feb 2019',
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
