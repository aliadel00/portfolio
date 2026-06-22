import { siteContent } from '../../data/site'
import type { SkillCategory } from '../../data/skills'
import {
  heroLivePreviewItems,
  heroProjectProgressLabel,
  heroSkillCategories,
  heroSkillProgressLabel,
} from '../../lib/heroShowcaseSlides'
import { chipRevealDelay, getHorizontalTrackTransform, getStackedSlideMotion } from '../../lib/showcaseMotion'
import { ScrollShowcase } from '../ui/ScrollShowcase'
import { HeroFeatured, HeroFeaturedTile } from './HeroFeatured'
import { HeroSkillCardArt } from './HeroSkillCardArt'

function HeroShowcaseSectionLabel({ children }: { children: string }) {
  return (
    <p className="hero-live-previews-label hero-os-section-label m-0 flex w-fit max-w-full items-center gap-2 text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--color-fg-muted)]">
      <span
        className="inline-block h-px w-5 bg-[color-mix(in_oklab,var(--color-fg-muted)_35%,transparent)]"
        aria-hidden
      />
      {children}
    </p>
  )
}

function HeroSkillSlide({
  category,
  isActive,
  progress,
}: {
  category: SkillCategory
  isActive: boolean
  progress: number
}) {
  return (
    <article
      className="hero-immersive-slide hero-immersive-slide--skill h-full"
      aria-hidden={!isActive}
    >
      <div
        className="hero-skill-card-shell hero-glass-island hero-os-panel glass-panel pro-glass relative min-h-0 w-full overflow-hidden p-5 sm:p-7"
      >
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

function HeroProjectsCarousel({
  activeIndex,
  progress,
}: {
  activeIndex: number
  progress: number
}) {
  const items = heroLivePreviewItems()

  return (
    <div className="hero-immersive-viewport relative mx-auto h-full w-full max-w-4xl overflow-hidden">
      <div
        className="hero-immersive-row flex h-full will-change-transform"
        style={getHorizontalTrackTransform(activeIndex, progress)}
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <div key={item.key} className="hero-immersive-slide-wrap w-full shrink-0 px-0.5">
              <div className="hero-immersive-slide hero-immersive-slide--project h-full" aria-hidden={!isActive}>
                <HeroFeaturedTile item={item} immersive />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HeroSkillsGridFallback() {
  const categories = heroSkillCategories()
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {categories.map((cat) => (
        <HeroSkillSlide key={cat.id} category={cat} isActive progress={1} />
      ))}
    </div>
  )
}

type Props = {
  reducedMotion: boolean
}

export function HeroImmersiveShowcase({ reducedMotion }: Props) {
  const skillCategories = heroSkillCategories()
  const previewItems = heroLivePreviewItems()

  if (skillCategories.length === 0 && previewItems.length === 0) return null

  if (reducedMotion) {
    return (
      <div className="hero-immersive-showcase w-full pt-10 sm:pt-12">
        <HeroShowcaseSectionLabel>{siteContent.skills.eyebrow}</HeroShowcaseSectionLabel>
        <HeroSkillsGridFallback />
        <div className="hero-immersive-showcase-block hero-immersive-showcase-block--previews">
          <HeroFeatured />
        </div>
      </div>
    )
  }

  return (
    <div className="hero-immersive-showcase w-full pt-10 sm:pt-12">
      {skillCategories.length > 0 ? (
        <section
          className="hero-immersive-showcase-block hero-immersive-showcase-block--skills"
          aria-labelledby="hero-skills-showcase-label"
        >
          <ScrollShowcase
            stageCount={skillCategories.length}
            stageHeightVh={64}
            ariaLabel="Core skill categories"
            progressLabels={skillCategories.map(heroSkillProgressLabel)}
            reducedFallback={<HeroSkillsGridFallback />}
            variant="stack"
            railVariant="connected-vertical"
            wheelStep
            intro={
              <div id="hero-skills-showcase-label" className="scroll-showcase-intro">
                <HeroShowcaseSectionLabel>{siteContent.skills.eyebrow}</HeroShowcaseSectionLabel>
              </div>
            }
          >
            {({ activeIndex, progress }) => (
              <HeroSkillsStack
                activeIndex={activeIndex}
                progress={progress}
                categories={skillCategories}
              />
            )}
          </ScrollShowcase>
        </section>
      ) : null}

      {previewItems.length > 0 ? (
        <section
          className="hero-immersive-showcase-block hero-immersive-showcase-block--previews"
          aria-labelledby="hero-previews-showcase-label"
        >
          <div id="hero-previews-showcase-label">
            <HeroShowcaseSectionLabel>{siteContent.heroFeatured.sectionLabel}</HeroShowcaseSectionLabel>
          </div>
          <ScrollShowcase
            stageCount={previewItems.length}
            stageHeightVh={68}
            ariaLabel="Live project previews"
            progressLabels={previewItems.map(heroProjectProgressLabel)}
            reducedFallback={<HeroFeatured />}
            variant="horizontal"
          >
            {({ activeIndex, progress }) => (
              <HeroProjectsCarousel activeIndex={activeIndex} progress={progress} />
            )}
          </ScrollShowcase>
        </section>
      ) : null}
    </div>
  )
}
