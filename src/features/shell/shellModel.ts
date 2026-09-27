import { siteContent } from '@/content/site'
import { projectsByType } from '@/content/projects'
import { skillCategories } from '@/content/skills'
import {
  HERO_CAPABILITIES_SECTION_ID,
  HERO_INTRO_SECTION_ID,
} from '@/features/navigation/lib/sectionNavigation'

export type EditorPanel = 'hero' | 'about' | 'skills' | 'work' | 'contact'

export type ShellFile = {
  id: string
  label: string
  panel: EditorPanel
  targetId: string
}

export type ShellTreeNode = {
  id: string
  label: string
  icon?: string
  file?: ShellFile
  children?: ShellTreeNode[]
}

export type ActivityId = 'home' | 'about' | 'skills' | 'work' | 'contact'

export type ActivityView = {
  id: ActivityId
  label: string
  icon: string
  tree: ShellTreeNode[]
}

const shell = siteContent.shell
const about = siteContent.about
const work = siteContent.work
const contact = siteContent.contact

function file(
  id: string,
  label: string,
  panel: EditorPanel,
  targetId: string,
  icon?: string,
): ShellTreeNode {
  return { id, label, icon, file: { id, label, panel, targetId } }
}

function folder(id: string, label: string, children: ShellTreeNode[], icon?: string): ShellTreeNode {
  return { id, label, icon, children }
}

const SKILL_ICONS: Record<string, string> = {
  frontend: 'icons/frontend.svg',
  backend: 'icons/backend.svg',
  data: 'icons/data.svg',
  delivery: 'icons/delivery.svg',
  integrations: 'icons/integrations.svg',
  creative: 'icons/creative.svg',
}

const PROJECT_ICON = 'icons/project.svg'

function skillIcon(id: string): string {
  const icon = SKILL_ICONS[id]
  if (!icon) throw new Error(`Missing sidebar icon for skill category "${id}"`)
  return icon
}

/** Every section as one explorer, in page order. */
export function explorerTree(views: ActivityView[] = activityViews()): ShellTreeNode[] {
  return views.map((view) => folder(`section-${view.id}`, view.label, view.tree, view.icon))
}

export function sectionNodeId(id: ActivityId): string {
  return `section-${id}`
}

export function firstFileInNodes(nodes: ShellTreeNode[]): ShellFile | null {
  for (const node of nodes) {
    if (node.file) return node.file
    if (node.children) {
      const nested = firstFileInNodes(node.children)
      if (nested) return nested
    }
  }
  return null
}

export function heroFile(): ShellFile {
  return {
    id: 'hero',
    label: shell.homeLabel,
    panel: 'hero',
    targetId: HERO_INTRO_SECTION_ID,
  }
}

export function activityViews(): ActivityView[] {
  const career = projectsByType('career')
  const freelance = projectsByType('freelance')

  return [
    {
      id: 'home',
      label: shell.homeLabel,
      icon: 'icons/nav-home.svg',
      tree: [
        file('hero', shell.homeLabel, 'hero', HERO_INTRO_SECTION_ID, 'icons/hero.svg'),
        file(
          'capabilities',
          siteContent.skills.eyebrow,
          'hero',
          HERO_CAPABILITIES_SECTION_ID,
          'icons/capabilities.svg',
        ),
      ],
    },
    {
      id: 'about',
      label: about.title,
      icon: 'icons/nav-about.svg',
      tree: [
        file('about', about.eyebrow, 'about', 'about', 'icons/profile.svg'),
        file('about-education', about.educationHeading, 'about', 'about-education-heading', 'icons/education.svg'),
        file('about-highlights', about.highlightsHeading, 'about', 'about-highlights-heading', 'icons/highlights.svg'),
      ],
    },
    {
      id: 'skills',
      label: siteContent.skills.title,
      icon: 'icons/nav-skills.svg',
      tree: skillCategories.map((category) =>
        file(`skills-${category.id}`, category.title, 'skills', `skills-${category.id}`, skillIcon(category.id)),
      ),
    },
    {
      id: 'work',
      label: work.title,
      icon: 'icons/nav-work.svg',
      tree: [
        folder(
          'work-career',
          work.careerTitle,
          career.map((project) =>
            file(`work-project-${project.id}`, project.title, 'work', `work-project-${project.id}`, PROJECT_ICON),
          ),
          'icons/career.svg',
        ),
        folder(
          'work-freelance',
          work.freelanceTitle,
          freelance.map((project) =>
            file(`work-project-${project.id}`, project.title, 'work', `work-project-${project.id}`, PROJECT_ICON),
          ),
          'icons/freelance.svg',
        ),
      ],
    },
    {
      id: 'contact',
      label: contact.title,
      icon: 'icons/nav-contact.svg',
      tree: [
        file('contact-email', contact.email, 'contact', 'contact-email', 'icons/email.svg'),
        file('contact-phone', contact.phoneDisplay, 'contact', 'contact-phone', 'icons/phone.svg'),
        file('contact-linkedin', contact.linkedInLabel, 'contact', 'contact-linkedin', 'icons/linkedin.svg'),
        file('contact-github', contact.githubLabel, 'contact', 'contact-github', 'icons/github.svg'),
      ],
    },
  ]
}

export function activityIdForFile(file: ShellFile): ActivityId {
  if (file.panel === 'hero') return 'home'
  return file.panel
}

/** Files in document order, matching the editor from hero through contact. */
export function listShellFiles(): ShellFile[] {
  const files: ShellFile[] = []
  const walk = (nodes: ShellTreeNode[]) => {
    for (const node of nodes) {
      if (node.file) files.push(node.file)
      if (node.children) walk(node.children)
    }
  }
  for (const view of activityViews()) walk(view.tree)
  return files
}

export function findShellFile(id: string): ShellFile | null {
  const walk = (nodes: ShellTreeNode[]): ShellFile | null => {
    for (const node of nodes) {
      if (node.file?.id === id) return node.file
      if (node.children) {
        const nested = walk(node.children)
        if (nested) return nested
      }
    }
    return null
  }

  for (const view of activityViews()) {
    const match = walk(view.tree)
    if (match) return match
  }
  return null
}
