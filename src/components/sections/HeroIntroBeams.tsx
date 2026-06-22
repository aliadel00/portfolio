import { Suspense, lazy } from 'react'
import { useBeamsLoading } from '../../hooks/useBeamsLoading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { AppSpinner } from '../ui/AppSpinner'

const BeamsStage = lazy(() =>
  import('../ui/ethereal-beams-hero').then((mod) => ({ default: mod.BeamsStage })),
)

export function HeroIntroBeams() {
  const reducedMotion = usePrefersReducedMotion()
  const { isBeamsReady } = useBeamsLoading()

  return (
    <div className="hero-intro-shell__beams pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {!isBeamsReady ? (
        <div className="hero-intro-shell__beams-loader">
          <AppSpinner label="Loading background" />
        </div>
      ) : null}
      <Suspense fallback={null}>
        <BeamsStage paused={reducedMotion} />
      </Suspense>
      <div className="hero-intro-shell__scrim absolute inset-0" />
    </div>
  )
}
