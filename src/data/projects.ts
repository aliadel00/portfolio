import { brandLogoCandidatesForProject } from '../lib/brandLogo'

export type ProjectType = 'career' | 'freelance'

/** One tile in the hero “Live previews” strip (can repeat per project, e.g. two public URLs). */
export type HeroStripTile = {
  id: string
  href: string
  label: string
  imageAlt: string
  /** Overrides default favicon-from-`href` when there is no screenshot */
  brandLogoUrl?: string
}

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
  imageAlt?: string
  /** Optional override when falling back to logo (default: favicon of `links.live` or first `more` URL) */
  brandLogoUrl?: string
  /** Employer / corporate site — used for career cards to show the right brand favicon when there is no product URL or to prefer org over product domain */
  brandSiteForLogo?: string
  /** Shorter line under the hero thumb (defaults to `title`) */
  previewLabel?: string
  /** Optional explicit tiles for the hero strip; otherwise derived from `links.live` / `links.more`. */
  heroStrip?: HeroStripTile[]
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
    imageAlt: 'Leading bank — logo',
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
    brandSiteForLogo: 'https://www.gosi.gov.sa/',
    imageAlt: 'GOSI — General Organization for Social Insurance logo',
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
    brandSiteForLogo: 'https://www.gosi.gov.sa/',
    imageAlt: 'GOSI — General Organization for Social Insurance logo',
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
    imageAlt: 'Leading bank — logo',
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
    brandSiteForLogo: 'https://cambridgeitconsultancy.co.uk/',
    imageAlt: 'Cambridge IT Consultancy — logo',
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
    imageAlt: 'The Federation TCC marketing site hero — federation branding and headline',
  },
  {
    id: 'federation-crm',
    title: 'The Federation TCC — admin CRM',
    summary:
      'Admin React (Vite) CRM for event management and analytics against the shared Laravel API (`/api/admin`). Secure authentication, editors, and operational workflows for the same federation project.',
    role: 'Software Engineer · Frontend · Contract',
    type: 'freelance',
    tags: ['React', 'Vite', 'Admin UI', 'Laravel API'],
    links: {},
    imageAlt: 'The Federation TCC CRM — admin login',
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
    imageAlt: 'Linguists Collective — brand',
    previewLabel: 'Linguists Collective',
  },
]

export function projectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type)
}

export type HeroStripItem = {
  key: string
  href: string
  label: string
  imageAlt: string
  /** Resolved from `brandLogoUrl` on the project / hero tile (local `public/` assets only). May be empty; UI uses copy fallback. */
  brandLogoCandidates: string[]
}

function normalizeHeroHref(href: string): string {
  try {
    const u = new URL(href)
    u.hash = ''
    const path = u.pathname.replace(/\/$/, '') || '/'
    return `${u.origin.toLowerCase()}${path}`
  } catch {
    return href.trim().toLowerCase()
  }
}

function hrefKeySuffix(href: string): string {
  try {
    const u = new URL(href)
    const host = u.hostname.replace(/\./g, '-')
    const path = u.pathname.replace(/\/$/, '').replace(/\//g, '-') || 'root'
    return `${host}-${path}`.replace(/-+/g, '-')
  } catch {
    return 'link'
  }
}

/** One hero card per distinct public URL across all projects (`links.live`, `links.more`, or `heroStrip`). */
export function heroFeaturedItems(): HeroStripItem[] {
  const out: HeroStripItem[] = []
  const seen = new Set<string>()

  const tryPush = (
    key: string,
    href: string,
    label: string,
    imageAlt: string,
    logoSource: Parameters<typeof brandLogoCandidatesForProject>[0],
  ) => {
    if (!href.startsWith('http')) return
    const norm = normalizeHeroHref(href)
    if (seen.has(norm)) return
    seen.add(norm)
    out.push({
      key,
      href,
      label,
      imageAlt,
      brandLogoCandidates: brandLogoCandidatesForProject(logoSource),
    })
  }

  for (const p of projects) {
    if (p.heroStrip?.length) {
      for (const t of p.heroStrip) {
        tryPush(t.id, t.href, t.label, t.imageAlt, {
          brandLogoUrl: t.brandLogoUrl,
          links: { live: t.href },
        })
      }
      continue
    }

    const live = p.links.live
    if (live?.startsWith('http')) {
      tryPush(
        p.id,
        live,
        p.links.liveLabel ?? p.previewLabel ?? p.title,
        p.imageAlt ?? p.title,
        p,
      )
    }

    for (const m of p.links.more ?? []) {
      if (!m.href.startsWith('http')) continue
      const key = `${p.id}--${hrefKeySuffix(m.href)}`
      tryPush(key, m.href, m.label, `${m.label} — preview`, p)
    }
  }

  const federationFirst = (href: string) =>
    normalizeHeroHref(href).includes('thefederationtcc.com') ? 0 : 1

  out.sort((a, b) => federationFirst(a.href) - federationFirst(b.href))

  return out
}
