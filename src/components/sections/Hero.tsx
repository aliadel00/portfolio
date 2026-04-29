import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent } from 'react'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { usePointerMotionEnabled } from '../../hooks/usePointerMotionEnabled'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useTheme } from '../../theme/ThemeProvider'
import { siteContent } from '../../data/site'
import { SegmentedLead } from '../ui/SegmentedLead'
import { MaskIcon } from '../ui/MaskIcon'
import { HeroFeatured } from './HeroFeatured'
import { HeroPointField, type HeroPointerCanvas } from './HeroPointField'
import {
  buildSectionHref,
  replaceUrlWithSection,
  scrollToSectionById,
} from '../../lib/sectionNavigation'

const heroQuestBadges = [
  { id: 'frontend', label: 'Frontend Mastery', score: '93 XP' },
  { id: 'backend', label: 'Backend Mastery', score: '91 XP' },
  { id: '3d', label: '3D Mastery', score: '90 XP' },
  { id: 'system', label: 'System Design', score: '88 XP' },
]

const heroQuestTrack = [
  { label: 'Current streak', value: '24 days' },
  { label: 'Projects shipped', value: '32+' },
  { label: 'Mentor boosts', value: '15' },
]

const headlinePriorityKeywords = new Set([
  'frontend',
  'backend',
  'mastery',
  'full-stack',
  'apis',
  'production',
  'architecture',
  'impact',
  'systems',
])

function syncHeroPointerVars(el: HTMLElement, nx: number, ny: number) {
  el.style.setProperty('--hero-nx', nx.toFixed(3))
  el.style.setProperty('--hero-ny', ny.toFixed(3))
}

export function Hero() {
  const { theme } = useTheme()
  const reducedMotion = usePrefersReducedMotion()
  const pointerMotionEnabled = usePointerMotionEnabled()
  const heroPointerMotion = pointerMotionEnabled && !reducedMotion
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const bgRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const pointerRef = useRef<HeroPointerCanvas>({ x: 0, y: 0, active: false })
  const cursorRef = useRef<HTMLDivElement>(null)
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
  const headlineWords = headline.split(' ')
  const headlineKeywordSet = useMemo(() => {
    const normalizedWords = headlineWords.map((word) =>
      word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9-]+$/g, ''),
    )
    const prioritized = normalizedWords.filter((word) => headlinePriorityKeywords.has(word))
    const fallback = normalizedWords.filter((word) => word.length >= 8)
    return new Set([...prioritized, ...fallback].filter(Boolean).slice(0, 3))
  }, [headlineWords])

  const isGradientKeyword = (word: string) => {
    const normalized = word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9-]+$/g, '')
    return headlineKeywordSet.has(normalized)
  }

  useEffect(() => {
    if (heroPointerMotion) return
    const el = sectionRef.current
    pointerRef.current = { x: 0, y: 0, active: false }
    if (el) syncHeroPointerVars(el, 0, 0)
    const cr = cursorRef.current
    if (cr) cr.style.opacity = '0'
  }, [heroPointerMotion])

  useEffect(() => {
    if (reducedMotion || heroHeadlineRotator.length < 2) return
    let swapId: number | undefined
    const id = window.setInterval(() => {
      setHeadlineVisible(false)
      swapId = window.setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % heroHeadlineRotator.length)
        setHeadlineVisible(true)
      }, 320)
    }, 4200)
    return () => {
      window.clearInterval(id)
      if (swapId) window.clearTimeout(swapId)
    }
  }, [reducedMotion, heroHeadlineRotator])

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    const section = e.currentTarget
    const bg = bgRef.current
    if (bg) {
      const r = bg.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
        active: true,
      }
    }

    const cr = cursorRef.current
    if (cr) {
      cr.style.opacity = '1'
      cr.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    if (heroPointerMotion) {
      const sr = section.getBoundingClientRect()
      const w = Math.max(sr.width, 1)
      const h = Math.max(sr.height, 1)
      const nx = ((e.clientX - sr.left) / w) * 2 - 1
      const ny = ((e.clientY - sr.top) / h) * 2 - 1
      syncHeroPointerVars(section, nx, -ny)
    }
  }

  const handlePointerLeave = (e: PointerEvent<HTMLElement>) => {
    pointerRef.current = { x: 0, y: 0, active: false }
    syncHeroPointerVars(e.currentTarget, 0, 0)
    const cr = cursorRef.current
    if (cr) cr.style.opacity = '0'
  }

  const handlePointerEnter = (e: PointerEvent<HTMLElement>) => {
    const cr = cursorRef.current
    if (cr) {
      cr.style.opacity = '1'
      cr.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }
  }

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
      ref={sectionRef}
      className="hero-point-stage relative isolate flex min-h-dvh w-screen max-w-[100vw] flex-col overflow-x-clip pb-16 [margin-inline:calc(50%-50vw)] sm:pb-24"
      aria-labelledby="hero-heading"
      {...(heroPointerMotion
        ? {
            onPointerMove: handlePointerMove,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
          }
        : {})}
    >
      <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0">
        <HeroPointField
          reducedMotion={reducedMotion}
          pointerHover={heroPointerMotion}
          pointerRef={pointerRef}
          colorMode={theme}
        />
      </div>

      <div
        ref={cursorRef}
        className={
          theme === 'light'
            ? 'hero-cursor-glow pointer-events-none fixed left-0 top-0 z-[1] opacity-0 mix-blend-multiply will-change-transform'
            : 'hero-cursor-glow pointer-events-none fixed left-0 top-0 z-[1] opacity-0 mix-blend-screen will-change-transform'
        }
        aria-hidden
      />

      <div className="relative z-[2] mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-10 sm:py-14">
          <div className="hero-3d-content hero-enter mx-auto flex min-h-0 w-full max-w-3xl flex-col items-center gap-7 text-center sm:gap-8">
            <p className="hero-eyebrow-pill m-0 w-fit">
              <span className="hero-eyebrow-dot" aria-hidden />
              {siteContent.hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="hero-glitch-title font-display m-0 max-w-[26ch] text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:max-w-[32ch] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]"
            >
              <span className="hero-glitch-title__sizer" aria-hidden>
                {longestHeadline}
              </span>
              <span
                className={[
                  'hero-glitch-title__base',
                  headlineVisible ? '' : 'hero-glitch-title__base--hidden',
                ].join(' ')}
              >
                {headlineWords.map((word, i) => (
                  <span
                    key={`${headline}-${word}-${i}`}
                    className={[
                      'hero-glitch-title__word',
                      isGradientKeyword(word) ? 'hero-glitch-title__word--keyword text-gradient-hero' : '',
                      i === headlineWords.length - 1 ? 'hero-glitch-title__word--last' : '',
                    ].join(' ')}
                    style={{ transitionDelay: `${i * 26}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="hero-glitch-title__layer hero-glitch-title__layer--a" aria-hidden>
                {headline}
              </span>
              <span className="hero-glitch-title__layer hero-glitch-title__layer--b" aria-hidden>
                {headline}
              </span>
            </h1>
            <SegmentedLead
              segments={siteContent.hero.intro}
              className="m-0 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-[1.0625rem]"
            />
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={buildSectionHref('work')}
                onClick={onCtaClick('work')}
                className="cta-primary glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{siteContent.hero.ctaWork}</span>
              </a>
              <a
                href={buildSectionHref('contact')}
                onClick={onCtaClick('contact')}
                className="cta-secondary glass-pointer-track cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{siteContent.hero.ctaContact}</span>
              </a>
            </div>
            <div className="hero-quest-grid w-full max-w-2xl" aria-label="Hero gamification highlights">
              <ul className="hero-quest-badges m-0 list-none p-0">
                {heroQuestBadges.map((badge) => (
                  <li key={badge.label} className="hero-quest-badge hero-quest-badge--featured">
                    <span className="hero-quest-badge__icon" aria-hidden>
                      <MaskIcon src="icons/quest-star.svg" className="h-3.5 w-3.5" width={14} height={14} />
                    </span>
                    <span className="hero-quest-badge__label">{badge.label}</span>
                    <span className="hero-quest-badge__score">{badge.score}</span>
                  </li>
                ))}
              </ul>
              <ul className="hero-quest-track m-0 list-none p-0">
                {heroQuestTrack.map((item) => (
                  <li key={item.label} className="hero-quest-track__item">
                    <span className="hero-quest-track__label">{item.label}</span>
                    <span className="hero-quest-track__value">{item.value}</span>
                    <span className="hero-quest-track__bar" aria-hidden />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <HeroFeatured />
      </div>
    </section>
  )
}
