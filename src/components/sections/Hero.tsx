import { useEffect, useRef, type PointerEvent } from 'react'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { usePointerMotionEnabled } from '../../hooks/usePointerMotionEnabled'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useTheme } from '../../theme/ThemeProvider'
import { siteContent } from '../../data/site'
import { SegmentedLead } from '../ui/SegmentedLead'
import { HeroFeatured } from './HeroFeatured'
import { HeroPointField, type HeroPointerCanvas } from './HeroPointField'

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

  useEffect(() => {
    if (heroPointerMotion) return
    const el = sectionRef.current
    pointerRef.current = { x: 0, y: 0, active: false }
    if (el) syncHeroPointerVars(el, 0, 0)
    const cr = cursorRef.current
    if (cr) cr.style.opacity = '0'
  }, [heroPointerMotion])

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

  return (
    <>
      <div
        ref={cursorRef}
        className={
          theme === 'light'
            ? 'hero-cursor-glow pointer-events-none fixed left-0 top-0 z-[80] opacity-0 mix-blend-multiply will-change-transform'
            : 'hero-cursor-glow pointer-events-none fixed left-0 top-0 z-[80] opacity-0 mix-blend-screen will-change-transform'
        }
        aria-hidden
      />

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

        <div className="relative z-[1] mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-4 sm:px-6">
          <div className="flex min-h-0 flex-1 flex-col justify-center py-10 sm:py-14">
            <div className="hero-3d-content hero-enter mx-auto flex min-h-0 w-full max-w-3xl flex-col items-center gap-7 text-center sm:gap-8">
              <p className="hero-eyebrow-pill m-0 w-fit">
                <span className="hero-eyebrow-dot" aria-hidden />
                {siteContent.hero.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="font-display text-gradient-hero m-0 max-w-[26ch] text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:max-w-[32ch] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]"
              >
                {siteContent.hero.headline}
              </h1>
              <SegmentedLead
                segments={siteContent.hero.intro}
                className="m-0 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-[1.0625rem]"
              />
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="#work"
                  className="cta-primary glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                  {...ctaPointerTrack}
                >
                  <span className="glass-pointer-track-fg">{siteContent.hero.ctaWork}</span>
                </a>
                <a
                  href="#contact"
                  className="cta-secondary glass-pointer-track cursor-pointer"
                  {...ctaPointerTrack}
                >
                  <span className="glass-pointer-track-fg">{siteContent.hero.ctaContact}</span>
                </a>
              </div>
            </div>
          </div>
          <HeroFeatured />
        </div>
      </section>
    </>
  )
}
