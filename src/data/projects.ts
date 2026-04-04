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
}

export const projects: Project[] = [
  {
    id: 'sample-career-1',
    title: 'Platform redesign',
    summary:
      'Led front-end architecture for a customer-facing dashboard with accessible components and performance budgets.',
    role: 'Senior front-end engineer',
    type: 'career',
    tags: ['React', 'TypeScript', 'Design system'],
    links: { live: 'https://example.com' },
  },
  {
    id: 'sample-freelance-1',
    title: 'Brand site + CMS',
    summary:
      'Delivered a static-first marketing site with a headless CMS and automated deploys for a small studio.',
    role: 'Freelance full-stack',
    type: 'freelance',
    tags: ['Vite', 'Tailwind', 'GitHub Actions'],
    links: { repo: 'https://github.com' },
  },
  {
    id: 'sample-freelance-2',
    title: 'Interactive 3D product tour',
    summary:
      'WebGL experience embedded in a landing page with lazy loading and reduced-motion fallbacks.',
    role: 'Freelance creative dev',
    type: 'freelance',
    tags: ['Three.js', 'WebGL', 'A11y'],
    links: {},
  },
]

export function projectsByType(type: ProjectType): Project[] {
  return projects.filter((p) => p.type === type)
}
