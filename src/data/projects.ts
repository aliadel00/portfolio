export type ProjectType = 'career' | 'freelance'

export type Project = {
  id: string
  title: string
  summary: string
  role: string
  type: ProjectType
  tags: string[]
  links: {
    live?: string
    /** Defaults to “Live site” when `live` is set */
    liveLabel?: string
    /** Extra public URLs (e.g. second product surface on the same engagement) */
    more?: { href: string; label: string }[]
    repo?: string
  }
}

const projects: Project[] = [
  // —— Career (selected from CV) ——
  {
    id: 'leading-bank-core',
    title: 'Leading bank',
    summary:
      'Building and deploying responsive financial web apps with Angular 19+ and TypeScript. Leading end-to-end delivery, CI/CD across environments, mentoring juniors, and collaborating on scalable, user-centric solutions with modern AI-assisted workflows.',
    role: 'Software Engineer · Frontend · Jun 2025 – Present · Egypt',
    type: 'career',
    tags: ['Angular 19+', 'TypeScript', 'CI/CD', 'Mentoring'],
    links: {},
  },
  {
    id: 'gosi-ameen',
    title: 'GOSI — Ameen platform',
    summary:
      'Built and maintained features for the Ameen application (Angular 11–13, TypeScript): secure access to social insurance services for public and private sector employees, benefits, and data retrieval — with focus on scalable, maintainable UI.',
    role: 'Software Engineer · Frontend · May 2024 – Jun 2025 · Saudi Arabia',
    type: 'career',
    tags: ['Angular', 'TypeScript', 'Enterprise', 'Accessibility'],
    links: {},
  },
  {
    id: 'gosi-website',
    title: 'GOSI official website revamp',
    summary:
      'Led migration from legacy layouts to modern experiences with new integrations and APIs — improving UX, security, and accessibility for citizens and staff accessing insurance information.',
    role: 'Software Engineer · Frontend / platform · GOSI',
    type: 'career',
    tags: ['Angular', 'API integration', 'UX', 'A11y'],
    links: {},
  },
  {
    id: 'leading-bank-digital',
    title: 'Leading bank — digital products',
    summary:
      'Angular-focused delivery for financial products: admin, supervisor, call center, and relationship-manager modules; co-branded flows; marketplace with partners (Talabat, Maxab, Vodafone, Etisalat); and Egypt’s first fully digital SME loan app with rapid approval flows.',
    role: 'Software Engineer · Frontend · Nov 2022 – May 2024 · Egypt',
    type: 'career',
    tags: ['Angular', 'Financial services', 'Marketplace', 'SME lending'],
    links: {},
  },
  {
    id: 'citc-linguists',
    title: 'Cambridge IT Consultancy — Linguists Collective',
    summary:
      'Full-stack delivery with MERN and Laravel 8: marketplaces, glossary, expense claims, exam systems, and the MCI Combo platform — MongoDB/MySQL, React, Node.js, Blade, and Breeze.',
    role: 'Full-stack Software Engineer · Dec 2019 – 2022 · UK (remote)',
    type: 'career',
    tags: ['React', 'Node.js', 'Laravel', 'MongoDB'],
    links: {
      live: 'https://linguistscollective.com/',
      liveLabel: 'Linguists Collective',
      more: [{ href: 'https://languageshop.uk/', label: 'Language Shop' }],
    },
  },
  // —— Freelance ——
  {
    id: 'federation-public',
    title: 'The Federation TCC — public platform',
    summary:
      'The Heritage Co. event ecosystem: public React (Vite) site for “The Arab Federation of Theatre and Creative Content” — events, booking, payments, tickets, contact, theming, and Arabic/English UX — backed by a Laravel 11 API.',
    role: 'Software Engineer · Full-stack & UI · Contract',
    type: 'freelance',
    tags: ['React', 'Vite', 'Laravel', 'Stripe', 'PDF tickets'],
    links: {
      live: 'https://thefederationtcc.com/',
      liveLabel: 'The Federation TCC',
    },
  },
  {
    id: 'federation-crm',
    title: 'The Federation TCC — admin CRM',
    summary:
      'Admin React (Vite) CRM for event management and analytics. Secure authentication, editors, and operational workflows for the same federation project.',
    role: 'Software Engineer · Frontend · Contract',
    type: 'freelance',
    tags: ['React', 'Vite', 'Admin UI', 'Laravel API'],
    links: {},
  },
  {
    id: 'linguists-collective',
    title: 'Linguists Collective — language marketplace',
    summary:
      'Agency and service marketplace for interpreting, translation, and expert language services — dashboards, bookings, and multi-sided flows. Built as part of the wider MERN/Laravel portfolio with Cambridge IT Consultancy, alongside the Language Shop storefront.',
    role: 'Software Engineer · Full-stack · CITC',
    type: 'freelance',
    tags: ['React', 'Node.js', 'MongoDB', 'Maps API'],
    links: {
      live: 'https://linguistscollective.com/',
      liveLabel: 'Linguists Collective',
      more: [{ href: 'https://languageshop.uk/', label: 'Language Shop' }],
    },
  },
]

export function projectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type)
}
