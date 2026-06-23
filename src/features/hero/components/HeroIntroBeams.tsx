import { Suspense, lazy, useRef } from 'react'
import { useBeamsLoading } from '@/features/hero/hooks/useBeamsLoading'
import { useInView } from '@/shared/hooks/useInView'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { AppSpinner } from '@/shared/ui/AppSpinner'

const BeamsStage = lazy(() =>
  import('./ethereal-beams-hero').then((mod) => ({ default: mod.BeamsStage })),
)

export function HeroIntroBeams() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const inView = useInView(containerRef, { rootMargin: '120px 0px' })
  const { isBeamsReady } = useBeamsLoading()
  const paused = reducedMotion || !inView

  return (
    <div
      ref={containerRef}
      className="hero-intro-shell__beams pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {!isBeamsReady ? (
        <div className="hero-intro-shell__beams-loader">
          <AppSpinner label="Loading background" />
        </div>
      ) : null}
      <Suspense fallback={null}>
        <BeamsStage paused={paused} />
      </Suspense>
      <div className="hero-intro-shell__scrim absolute inset-0" />
    </div>
  )
}
