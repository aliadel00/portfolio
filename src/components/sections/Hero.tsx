import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { siteContent } from '../../data/site'
import { SegmentedLead } from '../ui/SegmentedLead'
import { HeroCapabilityChip } from './HeroCapabilityChip'
import { HeroImmersiveShowcase } from './HeroImmersiveShowcase'
import {
  buildSectionHref,
  replaceUrlWithSection,
  scrollToSectionById,
} from '../../lib/sectionNavigation'

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
    <div className="relative mx-auto flex min-h-0 flex-1 w-full max-w-5xl flex-col justify-center px-4 sm:px-6">
      <div className="flex min-h-0 flex-col justify-center py-6 sm:py-8">
        <div className="hero-enter mx-auto flex min-h-0 w-full max-w-3xl flex-col items-center gap-6 text-center sm:gap-7">
          <div className="hero-intro-copy relative z-[2] flex w-full flex-col items-center gap-6 sm:gap-7">
            <p className="hero-eyebrow-pill hero-os-eyebrow m-0 w-fit max-w-full text-pretty">
              {siteContent.hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="hero-os-title hero-intro-copy__title m-0 max-w-[22ch] text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] sm:max-w-[26ch] sm:text-[2.65rem] sm:leading-[1.06] lg:text-[3rem] lg:leading-[1.05]"
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
              className="hero-intro-copy__body m-0 max-w-xl text-[1.0625rem] font-normal leading-[1.55] sm:text-[1.125rem] sm:leading-[1.58]"
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
            className="hero-os-capabilities relative z-[2] m-0 flex w-full max-w-2xl list-none flex-wrap justify-center gap-2 p-0"
            aria-label="Core capabilities"
          >
            {heroCapabilities.map((label) => (
              <HeroCapabilityChip key={label} label={label} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function HeroShowcase() {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24">
      <HeroImmersiveShowcase reducedMotion={reducedMotion} />
    </div>
  )
}

/** @deprecated Use HeroIntro + HeroShowcase in App with HeroIntroShell. */
export function Hero() {
  return (
    <>
      <HeroIntro />
      <HeroShowcase />
    </>
  )
}
