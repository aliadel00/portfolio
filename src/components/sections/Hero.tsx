import { lazy, Suspense } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { HeroFeatured } from './HeroFeatured'

const HeroScene = lazy(() => import('../scene/HeroScene'))

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="top"
      className="mx-auto grid max-w-5xl gap-10 px-4 pb-16 pt-10 sm:grid-cols-[1.05fr_1fr] sm:items-center sm:gap-12 sm:px-6 sm:pb-24 sm:pt-14"
      aria-labelledby="hero-heading"
    >
      <div className="order-2 flex flex-col gap-6 sm:order-1">
        <p className="m-0 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-accent-2)]">
          Ali Abolwafa · Senior frontend · 3D &amp; design
        </p>
        <h1
          id="hero-heading"
          className="font-display m-0 text-4xl font-semibold leading-tight tracking-tight text-[var(--color-fg)] sm:text-5xl"
        >
          High-quality, user-centric web apps — from enterprise banking to creative 3D.
        </h1>
        <p className="m-0 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
          6+ years shipping Angular and React experiences for banking and insurance, plus full-stack MERN/Laravel
          work. I mentor developers, own CI/CD, and use modern AI tooling to move faster without sacrificing craft.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#work"
            className="glass-panel inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] no-underline transition-transform hover:-translate-y-0.5"
          >
            View work
          </a>
          <a
            href="#contact"
            className="glass-chip inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[var(--color-fg)] no-underline hover:bg-white/12"
          >
            Get in touch
          </a>
        </div>
        <HeroFeatured />
      </div>

      <div className="order-1 sm:order-2">
        <div
          className="glass-panel relative aspect-[4/3] w-full max-h-[min(55vw,420px)] overflow-hidden sm:max-h-[440px]"
          role="img"
          aria-label="Interactive 3D abstract shape representing digital craft. Drag to rotate when motion is allowed."
        >
          <Suspense
            fallback={
              <div
                className="flex h-full min-h-[220px] w-full items-center justify-center bg-white/5 text-sm text-[var(--color-fg-muted)]"
                aria-hidden
              >
                Loading scene…
              </div>
            }
          >
            <HeroScene reducedMotion={reducedMotion} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
