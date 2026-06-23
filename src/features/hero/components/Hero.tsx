import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useGlassPointerTrackHandlers } from '@/shared/hooks/useGlassPointerTrack'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { siteContent } from '@/content/site'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { SegmentedLead } from '@/shared/ui/SegmentedLead'
import { HeroCapabilityChip } from './HeroCapabilityChip'
import { HeroImmersiveShowcase } from './HeroImmersiveShowcase'
import {
  buildSectionHref,
  replaceUrlWithSection,
  scrollToSectionById,
} from '@/features/navigation/lib/sectionNavigation'

const heroCapabilities = ['Frontend', 'Backend', '3D on the web', 'System design']

function useHeroIntroState() {
  const reducedMotion = usePrefersReducedMotion()
  const heroHeadlineRotator = useMemo(
    () =>
      siteContent.hero.headlineRotator.length > 0
        ? siteContent.hero.headlineRotator
        : [siteContent.hero.headline],
    [],
  )
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [headlineVisible, setHeadlineVisible] = useState(true)
  const headline = heroHeadlineRotator[headlineIndex] ?? heroHeadlineRotator[0]
  const longestHeadline = useMemo(
    () => heroHeadlineRotator.reduce((longest, current) => (current.length > longest.length ? current : longest), ''),
    [heroHeadlineRotator],
  )

  useEffect(() => {
    if (reducedMotion || heroHeadlineRotator.length < 2) return
    let swapId: number | undefined
    const id = window.setInterval(() => {
      setHeadlineVisible(false)
      swapId = window.setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % heroHeadlineRotator.length)
        setHeadlineVisible(true)
      }, 380)
    }, 5200)
    return () => {
      window.clearInterval(id)
      if (swapId) window.clearTimeout(swapId)
    }
  }, [reducedMotion, heroHeadlineRotator])

  return { reducedMotion, headline, longestHeadline, headlineVisible }
}

export function HeroIntro() {
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const { reducedMotion, headline, longestHeadline, headlineVisible } = useHeroIntroState()

  const onCtaClick =
    (sectionId: 'work' | 'contact') => (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      const didScroll = scrollToSectionById(sectionId, reducedMotion)
      if (!didScroll) return
      replaceUrlWithSection(sectionId)
    }

  return (
    <div className="hero-intro-shell__stage relative mx-auto flex min-h-0 flex-1 w-full max-w-5xl flex-col justify-center px-4 sm:px-6">
      <div className="hero-intro-shell__copy flex min-h-0 flex-col justify-center py-4 max-sm:py-2 sm:py-8">
        <SectionMotion
          as="div"
          gateOnBeams
          enterOnMount
          className="mx-auto flex min-h-0 w-full max-w-3xl flex-col items-center gap-5 text-center max-sm:gap-4 sm:gap-7"
        >
          <div className="hero-intro-copy relative z-[2] flex w-full flex-col items-center gap-5 max-sm:gap-4 sm:gap-7">
            <p className="hero-eyebrow-pill hero-os-eyebrow m-0 w-fit max-w-full text-pretty">
              {siteContent.hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="hero-os-title hero-intro-copy__title m-0 max-w-[22ch] text-balance text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.028em] max-sm:max-w-[19ch] sm:max-w-[26ch] sm:text-[2.65rem] sm:leading-[1.06] lg:text-[3rem] lg:leading-[1.05]"
            >
              <span className="hero-os-title__sizer" aria-hidden>
                {longestHeadline}
              </span>
              <span
                className={[
                  'hero-os-title__text',
                  headlineVisible ? '' : 'hero-os-title__text--hidden',
                ].join(' ')}
              >
                {headline}
              </span>
            </h1>
            <SegmentedLead
              segments={siteContent.hero.intro}
              className="hero-intro-copy__body m-0 max-w-xl text-[0.9375rem] font-normal leading-[1.5] max-sm:max-w-[34ch] sm:text-[1.125rem] sm:leading-[1.58]"
            />
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              <a
                href={buildSectionHref('work')}
                onClick={onCtaClick('work')}
                className="cta-primary cta-primary--os glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{siteContent.hero.ctaWork}</span>
              </a>
              <a
                href={buildSectionHref('contact')}
                onClick={onCtaClick('contact')}
                className="cta-secondary cta-secondary--os glass-pointer-track cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{siteContent.hero.ctaContact}</span>
              </a>
            </div>
          </div>
          <ul
            className="hero-os-capabilities relative z-[2] m-0 hidden w-full max-w-2xl list-none flex-wrap justify-center gap-2 p-0 sm:flex"
            aria-label="Core capabilities"
          >
            {heroCapabilities.map((label) => (
              <HeroCapabilityChip key={label} label={label} />
            ))}
          </ul>
        </SectionMotion>
      </div>
    </div>
  )
}

export function HeroShowcase() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <SectionMotion
      as="div"
      className="hero-showcase relative mx-auto w-full max-w-5xl px-4 pb-16 pt-8 max-sm:px-4 max-sm:pt-10 sm:px-6 sm:pb-24 sm:pt-12"
    >
      <HeroImmersiveShowcase reducedMotion={reducedMotion} />
    </SectionMotion>
  )
}
