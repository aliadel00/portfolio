import { lazy, type ComponentType, type LazyExoticComponent, type SVGProps } from 'react'
import { HERO_SKILL_IDS, type HeroSkillCategoryId } from './heroShowcaseSlides'

export type SkillArtCategoryId = HeroSkillCategoryId
export type SkillArtComponent = ComponentType<SVGProps<SVGSVGElement>>
export type LazySkillArtComponent = LazyExoticComponent<SkillArtComponent>

const importers = import.meta.glob<{ default: SkillArtComponent }>(
  '../../../assets/illustrations/skill-art/*.svg',
  { query: '?react' },
)

function importerFor(id: SkillArtCategoryId): () => Promise<{ default: SkillArtComponent }> {
  const key = Object.keys(importers).find((path) => path.endsWith(`/${id}.svg`))
  if (!key) throw new Error(`Missing skill art SVG for "${id}"`)
  return importers[key]!
}

/** Lazy SVG components — created once at module load (not during render). */
export const lazySkillArtById = Object.fromEntries(
  HERO_SKILL_IDS.map((id) => [id, lazy(importerFor(id))]),
) as Record<SkillArtCategoryId, LazySkillArtComponent>

export function isSkillArtCategoryId(id: string): id is SkillArtCategoryId {
  return (HERO_SKILL_IDS as readonly string[]).includes(id)
}
