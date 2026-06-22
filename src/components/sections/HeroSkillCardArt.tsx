import { Suspense } from 'react'
import { isSkillArtCategoryId, lazySkillArtById } from '../../lib/skillArtAssets'

type Props = {
  categoryId: string
  isActive?: boolean
}

export function HeroSkillCardArt({ categoryId, isActive = true }: Props) {
  if (!isSkillArtCategoryId(categoryId)) return null
  const Art = lazySkillArtById[categoryId]

  return (
    <aside
      className={[
        'hero-skill-card-visual',
        isActive ? 'hero-skill-card-visual--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-skill-art={categoryId}
      aria-hidden
    >
      <div className="hero-skill-card-visual__panel">
        <Suspense fallback={null}>
          <Art />
        </Suspense>
      </div>
    </aside>
  )
}
