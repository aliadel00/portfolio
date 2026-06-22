import { useSyncExternalStore } from 'react'
import { siteContent } from '../../data/site'
import { HERO_CAPABILITIES_SECTION_ID } from '../../lib/sectionNavigation'
import type { SkillCategory } from '../../data/skills'
import { heroSkillCategories, heroSkillProgressLabel } from '../../lib/heroShowcaseSlides'
import { chipRevealDelay, getStackedSlideMotion } from '../../lib/showcaseMotion'
import { HERO_CAPABILITIES_STAGE_HEIGHT_VH } from '../../lib/showcaseScroll'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { SkillArtSharedDefs } from '../illustrations/SkillArtSharedDefs'
import { ScrollShowcase } from '../ui/ScrollShowcase'
import { SectionMotion } from '../ui/SectionMotion'
import { SectionOsEyebrow } from '../ui/SectionHeading'
import { PORTFOLIO_GLASS_CARD_SHELL } from '../ui/portfolioGlassCard'
import { HeroSkillCardArt } from './HeroSkillCardArt'

function HeroSkillSlide({
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
      className="hero-immersive-slide hero-immersive-slide--skill h-full"
      aria-hidden={!isActive}
    >
      <div className={PORTFOLIO_GLASS_CARD_SHELL} {...panelReflect}>
        <div className="hero-skill-card-copy">
          <p className="hero-immersive-slide__eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
            {siteContent.skills.eyebrow}
          </p>
          <h2 className="font-display m-0 mt-3 text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.75rem]">
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
}

const MOBILE_MEDIA = '(max-width: 639px)'

function subscribeNarrowViewport(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MEDIA)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getNarrowViewportSnapshot() {
  return window.matchMedia(MOBILE_MEDIA).matches
}

function useNarrowViewport() {
  return useSyncExternalStore(subscribeNarrowViewport, getNarrowViewportSnapshot, () => false)
}

function HeroSkillsStack({
  activeIndex,
  progress,
  categories,
}: {
  activeIndex: number
  progress: number
  categories: SkillCategory[]
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
    <div className="hero-skills-mobile-stack mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
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
  const narrow = useNarrowViewport()

  if (skillCategories.length === 0) return null

  if (reducedMotion || narrow) {
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
          progressLabels={skillCategories.map(heroSkillProgressLabel)}
          reducedFallback={<HeroSkillsGridFallback />}
          variant="stack"
          railVariant="connected-vertical"
          wheelStep
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
