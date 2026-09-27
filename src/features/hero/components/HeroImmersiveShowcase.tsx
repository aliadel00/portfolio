import { memo } from 'react'
import { Card, Chip, SectionEyebrow } from 'caustica-design/core'
import { siteContent } from '@/content/site'
import { HERO_CAPABILITIES_SECTION_ID } from '@/features/navigation/lib/sectionNavigation'
import type { SkillCategory } from '@/content/skills'
import { heroSkillCategories, HERO_SKILL_PROGRESS_LABELS } from '@/features/hero/lib/heroShowcaseSlides'
import { chipRevealStyle, getStackedSlideMotion } from '@/features/hero/lib/showcaseMotion'
import {
  HERO_CAPABILITIES_STAGE_HEIGHT_VH,
  isHeroCapabilitiesWheelEngaged,
  resolveHeroCapabilitiesDisplayStage,
  resolveHeroCapabilitiesWheelIndex,
} from '@/features/hero/lib/showcaseScroll'
import { useCompactViewport } from '@/features/hero/hooks/useCompactViewport'
import { SkillArtSharedDefs } from '@/features/hero/components/SkillArtSharedDefs'
import { ScrollShowcase } from '@/features/hero/components/ScrollShowcase'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { useShellSelection } from '@/features/shell/useShellSelection'
import { HeroSkillCardArt } from './HeroSkillCardArt'

const HeroSkillSlide = memo(function HeroSkillSlide({
  category,
  isActive,
  delta,
  selected = false,
  onSelect,
}: {
  category: SkillCategory
  isActive: boolean
  delta: number
  selected?: boolean
  onSelect?: () => void
}) {
  return (
    <Card
      className={
        selected
          ? 'hero-immersive-slide hero-immersive-slide--skill hero-skill-card-shell ide-selected min-w-0 h-full min-h-0'
          : 'hero-immersive-slide hero-immersive-slide--skill hero-skill-card-shell min-w-0 h-full min-h-0'
      }
      aria-hidden={!isActive}
      aria-current={selected ? 'true' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={
        onSelect
          ? (event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault()
              onSelect()
            }
          : undefined
      }
    >
      <div className="hero-skill-card-copy">
        <h2 className="card-title font-display m-0 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {category.title}
        </h2>
        <p className="card-sub skill-category-blurb m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">
          {category.blurb}
        </p>
      </div>
      <ul className="hero-skill-card-chips m-0 list-none p-0" aria-label={`${category.title} skills`}>
        {category.items.map((item, chipIndex) => (
          <li key={item} className="m-0">
            <Chip style={chipRevealStyle(chipIndex, delta)}>{item}</Chip>
          </li>
        ))}
      </ul>
      <HeroSkillCardArt categoryId={category.id} isActive={isActive} />
    </Card>
  )
}, (prev, next) => {
  if (prev.category.id !== next.category.id || prev.isActive !== next.isActive) return false
  if (prev.selected !== next.selected || prev.onSelect !== next.onSelect) return false
  return Math.abs(prev.delta - next.delta) < 0.01
})

function HeroSkillsStack({
  activeIndex,
  progress,
  categories,
}: {
  activeIndex: number
  progress: number
  categories: readonly SkillCategory[]
}) {
  return (
    <div className="hero-immersive-stack relative mx-auto h-full w-full max-w-5xl">
      {categories.map((category, i) => {
        const motion = getStackedSlideMotion(i, activeIndex, progress)
        const isActive = i === activeIndex
        const delta = i - (activeIndex + progress)
        return (
          <div
            key={category.id}
            className="hero-immersive-stack-slide absolute inset-0 will-change-transform"
            style={{
              opacity: motion.opacity,
              transform: motion.transform,
              zIndex: motion.zIndex,
              pointerEvents: motion.pointerEvents,
            }}
          >
            <HeroSkillSlide category={category} isActive={isActive} delta={delta} />
          </div>
        )
      })}
    </div>
  )
}

function HeroSkillsGridFallback() {
  const categories = heroSkillCategories()
  const { activeId, selectFile } = useShellSelection()
  return (
    <div className="hero-skills-mobile-stack">
      {categories.map((cat) => {
        const fileId = `skills-${cat.id}`
        return (
          <HeroSkillSlide
            key={cat.id}
            category={cat}
            isActive
            delta={0}
            selected={activeId === fileId}
            onSelect={() => selectFile(fileId)}
          />
        )
      })}
    </div>
  )
}

function HeroSkillsShowcaseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-immersive-showcase w-full pt-0 sm:pt-12">
      <SkillArtSharedDefs />
      <SectionMotion
        as="section"
        fadeOnly
        id={HERO_CAPABILITIES_SECTION_ID}
        className="hero-immersive-showcase-block hero-immersive-showcase-block--skills"
        aria-labelledby="hero-skills-showcase-label"
      >
        <div className="scroll-showcase-intro">
          <SectionEyebrow id="hero-skills-showcase-label">{siteContent.skills.eyebrow}</SectionEyebrow>
        </div>
        {children}
      </SectionMotion>
    </div>
  )
}

type Props = {
  reducedMotion: boolean
}

export function HeroImmersiveShowcase({ reducedMotion }: Props) {
  const skillCategories = heroSkillCategories()
  const compact = useCompactViewport()

  if (skillCategories.length === 0) return null

  if (reducedMotion || compact) {
    return (
      <HeroSkillsShowcaseShell>
        <HeroSkillsGridFallback />
      </HeroSkillsShowcaseShell>
    )
  }

  return (
    <HeroSkillsShowcaseShell>
        <ScrollShowcase
          stageCount={skillCategories.length}
          stageHeightVh={HERO_CAPABILITIES_STAGE_HEIGHT_VH}
          ariaLabel="Core skill categories"
          progressLabels={HERO_SKILL_PROGRESS_LABELS}
          reducedFallback={<HeroSkillsGridFallback />}
          railVariant="connected-vertical"
          wheelStep
          resolveWheelIndex={resolveHeroCapabilitiesWheelIndex}
          resolveDisplayStage={resolveHeroCapabilitiesDisplayStage}
          isWheelEngaged={isHeroCapabilitiesWheelEngaged}
        >
          {({ activeIndex, progress }) => (
            <HeroSkillsStack
              activeIndex={activeIndex}
              progress={progress}
              categories={skillCategories}
            />
          )}
        </ScrollShowcase>
    </HeroSkillsShowcaseShell>
  )
}
