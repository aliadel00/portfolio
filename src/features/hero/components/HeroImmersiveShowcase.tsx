import { memo, useSyncExternalStore } from 'react'
import { matchesCompactViewport, subscribeCompactViewport } from '@/features/hero/lib/compactViewport'
import { siteContent } from '@/content/site'
import { HERO_CAPABILITIES_SECTION_ID } from '@/features/navigation/lib/sectionNavigation'
import type { SkillCategory } from '@/content/skills'
import { heroSkillCategories, HERO_SKILL_PROGRESS_LABELS } from '@/features/hero/lib/heroShowcaseSlides'
import { chipRevealDelay, getStackedSlideMotion } from '@/features/hero/lib/showcaseMotion'
import {
  HERO_CAPABILITIES_STAGE_HEIGHT_VH,
  isHeroCapabilitiesWheelEngaged,
  resolveHeroCapabilitiesDisplayStage,
  resolveHeroCapabilitiesWheelIndex,
} from '@/features/hero/lib/showcaseScroll'
import { useGlassCardReflectHandlers } from '@/shared/hooks/useGlassCardReflectHandlers'
import { SkillArtSharedDefs } from '@/features/hero/components/SkillArtSharedDefs'
import { ScrollShowcase } from '@/features/hero/components/ScrollShowcase'
import { SectionOsEyebrow } from '@/shared/ui/SectionHeading'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { PORTFOLIO_GLASS_CARD_SHELL } from '@/shared/ui/portfolioGlassCard'
import { HeroSkillCardArt } from './HeroSkillCardArt'

const HeroSkillSlide = memo(function HeroSkillSlide({
  category,
  isActive,
  progress,
}: {
  category: SkillCategory
  isActive: boolean
  progress: number
}) {
  const panelReflect = useGlassCardReflectHandlers()

  return (
    <article
      className="hero-immersive-slide hero-immersive-slide--skill min-w-0 h-full min-h-0"
      aria-hidden={!isActive}
    >
      <div className={PORTFOLIO_GLASS_CARD_SHELL} {...panelReflect}>
        <div className="hero-skill-card-copy">
          <h2 className="font-display m-0 text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.75rem]">
            {category.title}
          </h2>
          <p className="skill-category-blurb m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">
            {category.blurb}
          </p>
        </div>
        <ul className="hero-skill-card-chips m-0 list-none p-0" aria-label={`${category.title} skills`}>
          {category.items.map((item, chipIndex) => (
            <li key={item} className="m-0 min-w-0">
              <span
                className="hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]"
                style={{ opacity: isActive ? chipRevealDelay(chipIndex, progress, true) : 0.35 }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
        <HeroSkillCardArt categoryId={category.id} isActive={isActive} />
      </div>
    </article>
  )
}, (prev, next) => {
  if (prev.category.id !== next.category.id || prev.isActive !== next.isActive) return false
  if (!next.isActive) return true
  return prev.progress === next.progress
})

function useCompactViewport() {
  return useSyncExternalStore(subscribeCompactViewport, matchesCompactViewport, () => false)
}

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
        return (
          <div
            key={category.id}
            className="hero-immersive-stack-slide absolute inset-0 will-change-transform"
            style={{
              opacity: motion.opacity,
              transform: motion.transform,
              zIndex: motion.zIndex,
              pointerEvents: motion.pointerEvents,
              filter: motion.filter,
            }}
          >
            <HeroSkillSlide category={category} isActive={isActive} progress={progress} />
          </div>
        )
      })}
    </div>
  )
}

function HeroSkillsGridFallback() {
  const categories = heroSkillCategories()
  return (
    <div className="hero-skills-mobile-stack">
      {categories.map((cat) => (
        <HeroSkillSlide key={cat.id} category={cat} isActive progress={1} />
      ))}
    </div>
  )
}

function HeroSkillsShowcaseShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hero-immersive-showcase w-full pt-0 sm:pt-12">
      <SkillArtSharedDefs />
      <SectionMotion
        as="section"
        id={HERO_CAPABILITIES_SECTION_ID}
        className="hero-immersive-showcase-block hero-immersive-showcase-block--skills"
        aria-labelledby="hero-skills-showcase-label"
      >
        <div id="hero-skills-showcase-label" className="scroll-showcase-intro">
          <SectionOsEyebrow>{siteContent.skills.eyebrow}</SectionOsEyebrow>
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
