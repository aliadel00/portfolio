/**
 * Skill groups aligned with your CV narrative (About + project history).
 *
 * **CV PDF:** Served from `public/cv/ali-abolwafa-cv.pdf` (replace that file with your real résumé; keep the name or update `CV_DOWNLOAD_*`).
 */
export const CV_DOWNLOAD_FILENAME = 'ali-abolwafa-cv.pdf'
export const CV_DOWNLOAD_PATH = `/cv/${CV_DOWNLOAD_FILENAME}` as const

/** Curated strip under the heading — mirrors core CV strengths. */
export const skillHighlights: string[] = [
  'Angular (v8–20+)',
  'React',
  'TypeScript',
  'Laravel',
  'Node.js',
  'REST APIs',
  'CI/CD',
  'Enterprise UI',
  'Stripe',
  'Three.js',
]

export type SkillCategory = {
  id: string
  title: string
  blurb: string
  /** Neon frame + glow palette for the skills card wrapper */
  accent: 'violet' | 'cyan' | 'amber' | 'rose'
  items: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend & UI engineering',
    blurb: 'Enterprise SPAs, design systems thinking, and accessible interfaces at banking and insurance scale.',
    accent: 'violet',
    items: [
      'Angular (v8–20+)',
      'React',
      'TypeScript',
      'JavaScript (ES6+)',
      'HTML5 & semantic markup',
      'CSS / responsive layouts',
      'Component architecture',
      'RxJS',
      'Vite',
      'Accessibility (WCAG-minded)',
      'UX collaboration',
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    blurb: 'Full-stack delivery with Laravel and Node ecosystems — REST, auth patterns, and pragmatic service design.',
    accent: 'cyan',
    items: [
      'Node.js',
      'Laravel',
      'Express',
      'REST APIs',
      'MERN / MEAN stacks',
      'Authentication & sessions',
      'Blade / server-rendered views',
    ],
  },
  {
    id: 'data',
    title: 'Data & persistence',
    blurb: 'Relational and document models for product features, reporting, and integrations.',
    accent: 'amber',
    items: ['SQL', 'MySQL', 'MongoDB', 'Data modeling', 'API-backed forms & workflows'],
  },
  {
    id: 'delivery',
    title: 'Delivery, quality & leadership',
    blurb: 'Shipping through CI/CD, mentoring juniors, and keeping codebases maintainable under pressure.',
    accent: 'rose',
    items: [
      'Git / GitHub',
      'CI/CD pipelines',
      'Code review',
      'Mentoring',
      'Agile / iterative delivery',
      'Technical documentation',
      'AI-assisted development (quality-first)',
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations & product surfaces',
    blurb: 'Payments, documents, maps, and multi-tenant style flows from real client work.',
    accent: 'cyan',
    items: [
      'Stripe',
      'PDF generation & tickets',
      'Third-party APIs',
      'Maps / location APIs',
      'Marketplace & booking flows',
      'Admin & CRM UIs',
    ],
  },
  {
    id: 'creative',
    title: 'Creative & 3D',
    blurb: 'Visual craft beyond the day job — 3D tooling and interactive web experiments.',
    accent: 'violet',
    items: ['Three.js', 'WebGL', 'Blender', '3D on the web'],
  },
]
