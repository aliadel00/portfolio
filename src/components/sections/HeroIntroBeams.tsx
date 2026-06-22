import { Suspense, lazy } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const BeamsStage = lazy(() =>
  import('../ui/ethereal-beams-hero').then((mod) => ({ default: mod.BeamsStage })),
)

export function HeroIntroBeams() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="hero-intro-shell__beams pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <Suspense fallback={null}>
        <BeamsStage paused={reducedMotion} />
      </Suspense>
      <div className="hero-intro-shell__scrim absolute inset-0" />
    </div>
  )
}
