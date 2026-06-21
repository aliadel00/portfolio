import { useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { siteContent } from '../../data/site'
import { runAboutPanelSweep } from '../../lib/glassCardReflect'
import { SegmentedLead } from '../ui/SegmentedLead'
import { HeroCapabilityChip } from './HeroCapabilityChip'
import { HeroImmersiveShowcase } from './HeroImmersiveShowcase'
import {
  buildSectionHref,
  replaceUrlWithSection,
  scrollToSectionById,
} from '../../lib/sectionNavigation'

const heroCapabilities = ['Frontend', 'Backend', '3D on the web', 'System design']

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const islandReflect = useGlassCardReflectHandlers()
  const islandRef = useRef<HTMLDivElement>(null)
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

  useLayoutEffect(() => {
    if (reducedMotion) return
    const island = islandRef.current
    if (!island) return
    void runAboutPanelSweep(island)
  }, [reducedMotion])

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

  const onCtaClick =
    (sectionId: 'work' | 'contact') => (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      const didScroll = scrollToSectionById(sectionId, reducedMotion)
      if (!didScroll) return
      replaceUrlWithSection(sectionId)
    }

  return (
    <section
      id="hero"
      className="hero-point-stage hero-os-stage relative isolate flex min-h-dvh w-screen max-w-[100vw] flex-col overflow-x-clip pb-16 [margin-inline:calc(50%-50vw)] sm:pb-24"
      aria-labelledby="hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="hero-ambient-orbs hero-os-wallpaper" aria-hidden />
      </div>

      <div className="relative z-[2] mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-10 sm:py-14">
          <div className="hero-enter mx-auto flex min-h-0 w-full max-w-3xl flex-col items-center gap-6 text-center sm:gap-7">
            <div
              ref={islandRef}
              className="hero-glass-island hero-os-panel glass-card-reflect glass-panel pro-glass flex w-full flex-col items-center gap-6 sm:gap-7"
              {...islandReflect}
            >
              <p className="hero-eyebrow-pill hero-os-eyebrow m-0 w-fit max-w-full text-pretty">
                {siteContent.hero.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="hero-os-title m-0 max-w-[22ch] text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] sm:max-w-[26ch] sm:text-[2.65rem] sm:leading-[1.06] lg:text-[3rem] lg:leading-[1.05]"
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
                className="hero-glass-island__body m-0 max-w-xl text-[1.0625rem] font-normal leading-[1.55] text-[var(--color-fg-muted)] sm:text-[1.125rem] sm:leading-[1.58]"
              />
              <div className="hero-glass-island__actions flex flex-wrap justify-center gap-2.5 sm:gap-3">
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
              className="hero-os-capabilities m-0 flex w-full max-w-2xl list-none flex-wrap justify-center gap-2 p-0"
              aria-label="Core capabilities"
            >
              {heroCapabilities.map((label) => (
                <HeroCapabilityChip key={label} label={label} />
              ))}
            </ul>
          </div>
        </div>
        <HeroImmersiveShowcase reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}
