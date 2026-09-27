export type ProjectType = 'career' | 'freelance'

export type Project = {
  id: string
  title: string
  summary: string
  role: string
  type: ProjectType
  tags: string[]
  /** Shown when the card has no public URL. Career roles keep the default NDA line. */
  unlistedNote?: string
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
  // —— Career (selected from CV; bank names stay generic on the public site) ——
  {
    id: 'leading-bank-core',
    title: 'Leading bank',
    summary:
      'Responsive financial web apps in Angular 19+ and TypeScript, including an operations maker-checker flow with NgRx and RxJS for dual-control approvals. End-to-end delivery, CI/CD across environments, and mentoring on maintainable component design.',
    role: 'Software Engineer · Frontend · Jun 2025 – Present · Egypt',
    type: 'career',
    tags: ['Angular 19+', 'NgRx', 'TypeScript', 'CI/CD'],
    links: {},
  },
  {
    id: 'gosi-ameen',
    title: 'GOSI — Ameen platform',
    summary:
      'Features for the Ameen application (Angular 11–13, TypeScript): secure access to social insurance services for public and private sector employees, benefits, and data retrieval — with focus on scalable, maintainable UI.',
    role: 'Software Engineer · Frontend · May 2024 – Jun 2025 · Saudi Arabia',
    type: 'career',
    tags: ['Angular', 'TypeScript', 'Enterprise', 'Accessibility'],
    links: {},
  },
  {
    id: 'gosi-website',
    title: 'GOSI official website revamp',
    summary:
      'Migration from legacy layouts to modern experiences with new integrations and APIs — improving UX, security, and accessibility for citizens and staff accessing insurance information.',
    role: 'Software Engineer · Frontend / platform · GOSI',
    type: 'career',
    tags: ['Angular', 'API integration', 'UX', 'A11y'],
    links: {},
  },
  {
    id: 'leading-bank-digital',
    title: 'Leading bank — digital products',
    summary:
      'Angular delivery for financial products: admin, supervisor, call center, and relationship-manager modules; co-branded flows; marketplace with partners (Talabat, Maxab, Vodafone, Etisalat); and Egypt’s first fully digital SME loan app with rapid approval flows.',
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
    role: 'Full-stack Software Engineer · Dec 2019 – Nov 2022 · UK (remote)',
    type: 'career',
    tags: ['React', 'Node.js', 'Laravel', 'MongoDB'],
    links: {
      live: 'https://linguistscollective.com/',
      liveLabel: 'Linguists Collective',
      more: [
        { href: 'https://languageshop.uk/', label: 'Language Shop' },
        { href: 'https://linguistglossary.net/', label: 'Linguist Glossary' },
      ],
    },
  },
  // —— Independent products ——
  {
    id: 'caustica-design',
    title: 'Caustica Design',
    summary:
      'Glass design system: OKLCH tokens, translucent surfaces, and typed React, Vue, and Angular components. This portfolio runs on version 1.0.0.',
    role: 'Design and engineering · 2026',
    type: 'freelance',
    tags: ['Design system', 'React', 'CSS', 'OKLCH'],
    links: {
      live: 'https://caustica-design.com',
      liveLabel: 'caustica-design.com',
    },
  },
  {
    id: 'venu-ops',
    title: 'Venu-ops',
    summary:
      'Multi-tenant venue operations for lounges that mix consoles, PCs, café, tables, and retail. React UI, Hono API, PostgreSQL, and Arabic and English.',
    role: 'Product engineering · 2026',
    type: 'freelance',
    tags: ['React', 'Hono', 'PostgreSQL', 'Arabic & English'],
    unlistedNote: 'Private product — no public link yet',
    links: {},
  },
  {
    id: 'care-circle',
    title: 'Care Circle',
    summary:
      'Family care coordination: shared circles, medications, logs, and a weekly summary. React PWA, Laravel API, PostgreSQL, and English and Arabic.',
    role: 'Product engineering · 2026',
    type: 'freelance',
    tags: ['React', 'Laravel', 'PostgreSQL', 'PWA'],
    unlistedNote: 'Private product — no public link yet',
    links: {},
  },
  {
    id: 'federation-public',
    title: 'The Federation TCC — public platform',
    summary:
      'Public React (Vite) site for The Arab Federation of Theatre and Creative Content — events, booking, payments, tickets, and Arabic/English UX — backed by a Laravel 11 API.',
    role: 'Software Engineer · Full-stack & UI · Contract',
    type: 'freelance',
    tags: ['React', 'Vite', 'Laravel', 'Stripe'],
    links: {
      live: 'https://thefederationtcc.com/',
      liveLabel: 'The Federation TCC',
    },
  },
  {
    id: 'federation-crm',
    title: 'The Federation TCC — admin CRM',
    summary:
      'Admin React (Vite) CRM for the same federation: event management, secure authentication, editors, and operational workflows on the Laravel API.',
    role: 'Software Engineer · Frontend · Contract',
    type: 'freelance',
    tags: ['React', 'Vite', 'Admin UI', 'Laravel API'],
    links: {},
  },
  {
    id: 'saas-starter',
    title: 'SaaS starter',
    summary:
      'Full-stack foundation for multi-tenant products: Next.js App Router, NestJS, GraphQL, PostgreSQL with Prisma, Redis, and JWT auth with refresh rotation and role-based access.',
    role: 'Personal showcase',
    type: 'freelance',
    tags: ['Next.js', 'NestJS', 'GraphQL', 'PostgreSQL'],
    links: {
      repo: 'https://github.com/aliadel00/saas-starter',
    },
  },
]

export function projectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type)
}
