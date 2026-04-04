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
    repo?: string
  }
  /** Path under `public/` (e.g. `/screenshots/foo.png`) */
  imageSrc?: string
  imageAlt?: string
  /** Shown as a small preview strip in the main hero (only for verified assets) */
  featuredInHero?: boolean
}

export const projects: Project[] = [
  // —— Career (selected from CV) ——
  {
    id: 'suez-canal-bank',
    title: 'Suez Canal Bank',
    summary:
      'Building and deploying responsive banking web apps with Angular 19+ and TypeScript. Leading end-to-end delivery, CI/CD across environments, mentoring juniors, and collaborating on scalable, user-centric solutions with modern AI-assisted workflows.',
    role: 'Frontend Developer · Jun 2025 – Present · Egypt',
    type: 'career',
    tags: ['Angular 19+', 'TypeScript', 'CI/CD', 'Mentoring'],
    links: {},
  },
  {
    id: 'gosi-ameen',
    title: 'GOSI — Ameen platform',
    summary:
      'Built and maintained features for the Ameen application (Angular 11–13, TypeScript): secure access to social insurance services for public and private sector employees, benefits, and data retrieval — with focus on scalable, maintainable UI.',
    role: 'Frontend Developer · May 2024 – Jun 2025 · Saudi Arabia',
    type: 'career',
    tags: ['Angular', 'TypeScript', 'Enterprise', 'Accessibility'],
    links: {},
  },
  {
    id: 'gosi-website',
    title: 'GOSI official website revamp',
    summary:
      'Led migration from legacy layouts to modern experiences with new integrations and APIs — improving UX, security, and accessibility for citizens and staff accessing insurance information.',
    role: 'Frontend lead (revamp) · GOSI',
    type: 'career',
    tags: ['Angular', 'API integration', 'UX', 'A11y'],
    links: {},
  },
  {
    id: 'banque-misr',
    title: 'Banque Misr — digital banking products',
    summary:
      'Angular-focused delivery for banking: admin, supervisor, call center, and relationship-manager modules; co-branded flows; marketplace with partners (Talabat, Maxab, Vodafone, Etisalat); and Egypt’s first fully digital SME loan app with rapid approval flows.',
    role: 'Frontend Developer · Nov 2022 – May 2024 · Egypt',
    type: 'career',
    tags: ['Angular', 'Banking', 'Marketplace', 'SME lending'],
    links: {},
  },
  {
    id: 'citc-linguists',
    title: 'Cambridge IT Consultancy — Linguists Collective',
    summary:
      'Full-stack delivery with MERN and Laravel 8: marketplaces, glossary, expense claims, exam systems, and the MCI Combo platform — MongoDB/MySQL, React, Node.js, Blade, and Breeze.',
    role: 'Full-stack Developer · Dec 2019 – 2022 · UK (remote)',
    type: 'career',
    tags: ['React', 'Node.js', 'Laravel', 'MongoDB'],
    links: {
      live: 'https://languageshop.uk/',
    },
  },
  // —— Freelance ——
  {
    id: 'federation-public',
    title: 'The Federation TCC — public platform',
    summary:
      'The Heritage Co. event ecosystem: public React (Vite) site for “The Arab Federation of Theatre and Creative Content” — events, booking, payments, tickets, contact, theming, and Arabic/English UX — backed by a Laravel 11 API.',
    role: 'Freelance / contract · Full-stack & frontend',
    type: 'freelance',
    tags: ['React', 'Vite', 'Laravel', 'Stripe', 'PDF tickets'],
    links: {
      live: 'https://thefederationtcc.com/',
      repo: 'https://github.com/aliadel00',
    },
    imageSrc: '/screenshots/federation-public.png',
    imageAlt: 'The Federation TCC marketing site hero — federation branding and headline',
    featuredInHero: true,
  },
  {
    id: 'federation-crm',
    title: 'The Federation TCC — admin CRM',
    summary:
      'Admin React (Vite) CRM for event management and analytics against the shared Laravel API (`/api/admin`). Secure authentication, editors, and operational workflows for the same federation project.',
    role: 'Freelance / contract · Frontend',
    type: 'freelance',
    tags: ['React', 'Vite', 'Admin UI', 'Laravel API'],
    links: {
      live: 'https://crm.thefederationtcc.com/login',
      repo: 'https://github.com/aliadel00',
    },
    imageSrc: '/screenshots/federation-crm.svg',
    imageAlt: 'Placeholder preview for The Federation TCC CRM login and admin experience',
  },
  {
    id: 'linguists-language-shop',
    title: 'Linguists Collective — Language Shop',
    summary:
      'MERN marketplace for language services: storefront flows, interpreter booking, translations, and quotes — part of the wider Linguists Collective portfolio delivered with Cambridge IT Consultancy.',
    role: 'Freelance / CITC · Full-stack',
    type: 'freelance',
    tags: ['React', 'Node.js', 'MongoDB', 'Maps API'],
    links: {
      live: 'https://languageshop.uk/',
    },
    imageSrc: '/screenshots/languageshop.png',
    imageAlt: 'Language Shop UK — latest news and product highlights',
    featuredInHero: true,
  },
]

export function projectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type)
}

export function heroFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featuredInHero && p.imageSrc)
}
