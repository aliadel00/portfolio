import type { SkillCategory } from '@/content/skills'
import { skillCategories } from '@/content/skills'

export const HERO_SKILL_IDS = [
  'frontend',
  'backend',
  'data',
  'delivery',
  'integrations',
  'creative',
] as const

export type HeroSkillCategoryId = (typeof HERO_SKILL_IDS)[number]

/** Every skill group, shown once in the hero showcase. */
export function heroSkillCategories(): readonly SkillCategory[] {
  return skillCategories
}

export function heroSkillProgressLabel(category: SkillCategory): string {
  const segment = category.title.split('&')[0]?.trim() ?? category.title
  return segment.split(/[\s,]+/)[0] ?? category.title
}

/** Precomputed rail labels — static skill data. */
export const HERO_SKILL_PROGRESS_LABELS = skillCategories.map(heroSkillProgressLabel)
