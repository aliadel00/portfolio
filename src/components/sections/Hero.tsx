import { useRef, type PointerEvent } from 'react'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { HeroFeatured } from './HeroFeatured'
import { HeroPointField, type HeroPointerCanvas } from './HeroPointField'

function syncHeroPointerVars(el: HTMLElement, nx: number, ny: number) {
  el.style.setProperty('--hero-nx', nx.toFixed(3))
  el.style.setProperty('--hero-ny', ny.toFixed(3))
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const bgRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HeroPointerCanvas>({ x: 0, y: 0, active: false })
  const cursorRef = useRef<HTMLDivElement>(null)

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

    if (!reducedMotion) {
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
        className="hero-cursor-glow pointer-events-none fixed left-0 top-0 z-[80] opacity-0 mix-blend-screen will-change-transform"
        aria-hidden
      />

      <section
        className="hero-point-stage relative isolate min-h-dvh w-screen max-w-[100vw] overflow-x-clip pb-20 pt-12 [margin-inline:calc(50%-50vw)] sm:pb-28 sm:pt-16"
        aria-labelledby="hero-heading"
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0">
          <HeroPointField reducedMotion={reducedMotion} pointerRef={pointerRef} />
        </div>

        <div className="relative z-[1] mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="hero-3d-content hero-enter flex min-h-0 max-w-3xl flex-col gap-7 sm:gap-8">
            <p className="hero-eyebrow-pill m-0 w-fit">
              <span className="hero-eyebrow-dot" aria-hidden />
              Ali Abolwafa · Software engineer · Full-stack · Frontend &amp; 3D
            </p>
            <h1
              id="hero-heading"
              className="font-display text-gradient-hero m-0 max-w-[26ch] text-balance text-4xl font-semibold leading-[1.06] tracking-tight sm:max-w-[32ch] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]"
            >
              End-to-end software — APIs, data, and interfaces users love.
            </h1>
            <p className="m-0 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)] sm:text-[1.0625rem]">
              I started as a <strong className="font-medium text-[var(--color-fg)]">full-stack</strong> engineer (Laravel,
              MERN/MEAN, databases); today I am strongest as a{' '}
              <strong className="font-medium text-[var(--color-fg)]">senior frontend</strong> on Angular and React for
              banking and insurance — while still owning delivery, CI/CD, mentoring, and creative{' '}
              <strong className="font-medium text-[var(--color-fg)]">3D</strong> on the web.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#work"
                className="cta-primary glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">View work</span>
              </a>
              <a
                href="#contact"
                className="cta-secondary glass-pointer-track cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">Get in touch</span>
              </a>
            </div>
          </div>
          <HeroFeatured />
        </div>
      </section>
    </>
  )
}
