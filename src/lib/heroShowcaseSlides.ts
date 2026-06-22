import type { SkillCategory } from '../data/skills'
import { skillCategories } from '../data/skills'

const HERO_SKILL_IDS = ['frontend', 'backend', 'delivery', 'creative'] as const

export function heroSkillCategories(): SkillCategory[] {
  return HERO_SKILL_IDS.map((id) => skillCategories.find((c) => c.id === id)).filter(
    (c): c is SkillCategory => Boolean(c),
  )
}

export function heroSkillProgressLabel(category: SkillCategory): string {
  const segment = category.title.split('&')[0]?.trim() ?? category.title
  return segment.split(/[\s,]+/)[0] ?? category.title
}
