// @ts-check
/**
 * Site-wide settings for the project showcase.
 *
 * assetBase — where image paths in projects-data.js resolve from.
 *   '../'                         served from afaquejaya.github.io/projects/ (default)
 *   'https://afaquejaya.github.io/'  if the showcase is deployed on its own domain
 * portfolioUrl — links back to the main portfolio (CV, contact) use this.
 */
export const SITE = {
  name: 'Afaque Jaya',
  role: 'Senior Software Engineer',
  positioning: 'Senior Software Engineer · Mobile Application Specialist · AI & Agentic AI Developer',
  url: 'https://afaquejaya.github.io/projects/',
  assetBase: '../',
  portfolioUrl: '../',
  featuredLimit: 4,

  email: 'afaquejaya123@gmail.com',
  // Verified profile links (same as the main portfolio)
  links: {
    portfolio: '../',
    cv: '../cv/cv.html',
    cvPdf: '../files/Afaque-Jaya-Senior-Mobile-Full-Stack-Engineer-CV.pdf',
    linkedin: 'https://www.linkedin.com/in/afaque-jaya',
    github: 'https://github.com/Afaquejaya',
    license: 'https://github.com/Afaquejaya/afaquejaya.github.io/blob/master/LICENSE',
    whatsapp: 'https://wa.me/918797801820?text=Hi%20Afaque%2C%20I%20saw%20your%20project%20showcase%20and%20I%E2%80%99d%20like%20to%20talk.'
  },

  // Hero highlights — each one is stated in the CV PDF.
  facts: [
    { value: '7', suffix: '+', label: 'years building mobile, web and backend products' },
    { value: '15', suffix: '+', label: 'apps published on Google Play and the App Store' },
    { value: '1M', suffix: '+', label: 'collective downloads across published apps' }
  ]
};

/** @typedef {{ id: import('./projects-data.js').CategoryId, label: string, short: string, description: string }} Category */

/** @type {Category[]} Order = order of the filter chips. */
export const CATEGORIES = [
  { id: 'mobile', label: 'Mobile Applications', short: 'Mobile', description: 'Native and cross-platform apps shipped to Google Play and the App Store — FinTech, logistics, e-commerce and government ed-tech.' },
  { id: 'web', label: 'Websites & Web Apps', short: 'Web', description: 'Web products and sites, from AI demos to this portfolio.' },
  { id: 'saas', label: 'SaaS Products', short: 'SaaS', description: 'Multi-tenant products with roles, billing and owner-scoped data.' },
  { id: 'ai', label: 'AI Applications', short: 'AI', description: 'Products where a model does real work — analysis, extraction, try-on — with the guard-rails around it.' },
  { id: 'agents', label: 'AI Agents & Automation', short: 'Agents', description: 'Tool-using agents, MCP integrations and automation, each with explicit limits on what it may do.' },
  { id: 'backend', label: 'Backend, APIs & Integrations', short: 'Backend', description: 'APIs, data layers, payments and protocol integrations behind the apps.' },
  { id: 'experiments', label: 'Experiments & Learning', short: 'Labs', description: 'Learning projects and prototypes — labelled as such.' }
];

/** @type {Record<string, string[]>} Nav shortcuts that filter by several categories at once. */
export const NAV_GROUPS = {
  mobile: ['mobile'],
  'saas-web': ['saas', 'web'],
  'ai-agents': ['ai', 'agents']
};

/** @type {Record<string, { label: string, short?: string, rank: number }>} */
export const STATUS = {
  live: { label: 'Live', rank: 0 },
  'in-development': { label: 'In development', rank: 1 },
  shipped: { label: 'Shipped · listing retired', short: 'Shipped', rank: 2 },
  prototype: { label: 'Prototype', rank: 3 },
  learning: { label: 'Learning project', rank: 4 }
};

/** @type {Record<string, string>} */
export const VISIBILITY = {
  public: 'Public',
  private: 'Private source',
  internal: 'Employer product',
  client: 'Client project'
};
