import type { SkillCategory } from '@/content/skills'
import { skillCategories } from '@/content/skills'

export const HERO_SKILL_IDS = ['frontend', 'backend', 'delivery', 'creative'] as const

export type HeroSkillCategoryId = (typeof HERO_SKILL_IDS)[number]

const HERO_SKILL_CATEGORY_LIST: SkillCategory[] = HERO_SKILL_IDS.map((id) =>
  skillCategories.find((c) => c.id === id),
).filter((c): c is SkillCategory => Boolean(c))

export function heroSkillCategories(): readonly SkillCategory[] {
  return HERO_SKILL_CATEGORY_LIST
}

export function heroSkillProgressLabel(category: SkillCategory): string {
  const segment = category.title.split('&')[0]?.trim() ?? category.title
  return segment.split(/[\s,]+/)[0] ?? category.title
}

/** Precomputed rail labels — static skill data. */
export const HERO_SKILL_PROGRESS_LABELS = HERO_SKILL_CATEGORY_LIST.map(heroSkillProgressLabel)
