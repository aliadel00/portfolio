/**
 * Skill groups aligned with the 2026 CV: product systems plus enterprise delivery.
 */
/** Curated strip under the heading — mirrors core CV strengths. */
export const skillHighlights: string[] = [
  'Angular (v8–20+)',
  'React',
  'Full stack',
  'TypeScript',
  'Hono',
  'Laravel',
  'PostgreSQL',
  'Design systems',
  'CI/CD',
  'Arabic & English UI',
  'Stripe',
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
    blurb: 'Product interfaces and enterprise SPAs — design systems, accessible markup, and Arabic and English layouts.',
    accent: 'violet',
    items: [
      'Angular (v8–20+)',
      'React',
      'TypeScript',
      'JavaScript (ES6+)',
      'Tailwind CSS',
      'HTML5 & semantic markup',
      'NgRx & RxJS',
      'Vite',
      'Design systems',
      'Accessibility (WCAG-minded)',
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    blurb: 'Services in Hono, Node, and Laravel — REST, auth, and the workflows behind the screen.',
    accent: 'cyan',
    items: [
      'Hono',
      'Node.js',
      'Express',
      'Laravel',
      'REST APIs',
      'Sanctum & session auth',
      'MERN / MEAN stacks',
    ],
  },
  {
    id: 'data',
    title: 'Data & persistence',
    blurb: 'Relational and document models for multi-tenant products, reporting, and integrations.',
    accent: 'amber',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL', 'Drizzle ORM', 'Data modeling'],
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
    blurb: 'Payments, documents, maps, and bilingual product flows from client and independent work.',
    accent: 'cyan',
    items: [
      'Stripe',
      'PDF generation & tickets',
      'Third-party APIs',
      'Maps / location APIs',
      'Marketplace & booking flows',
      'Admin & CRM UIs',
      'Arabic & English UI',
    ],
  },
  {
    id: 'creative',
    title: 'Creative & 3D',
    blurb: 'Visual craft alongside product work — 3D tooling and interactive web experiments.',
    accent: 'violet',
    items: ['Three.js', 'WebGL', 'Blender', '3D on the web'],
  },
]
