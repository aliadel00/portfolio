import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { useBeamsLoading } from '@/features/hero/hooks/useBeamsLoading'
import { useCompactViewport } from '@/features/hero/hooks/useCompactViewport'
import { HERO_BEAMS_IDLE_TIMEOUT_MS, shouldSkipHeroBeams } from '@/features/hero/lib/heroBeams'
import { useInView } from '@/shared/hooks/useInView'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { scheduleIdleWork } from '@/shared/lib/scheduleIdleWork'

const BeamsStage = lazy(() =>
  import('./ethereal-beams-hero').then((mod) => ({ default: mod.BeamsStage })),
)

export function HeroIntroBeams() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const compact = useCompactViewport()
  const inView = useInView(containerRef, { rootMargin: '120px 0px' })
  const { markBeamsReady } = useBeamsLoading()
  const [shouldMountBeams, setShouldMountBeams] = useState(false)

  const skipBeams = shouldSkipHeroBeams(reducedMotion, compact)

  useEffect(() => {
    if (skipBeams) {
      markBeamsReady()
      return
    }

    return scheduleIdleWork(() => setShouldMountBeams(true), { timeout: HERO_BEAMS_IDLE_TIMEOUT_MS })
  }, [markBeamsReady, skipBeams])

  const paused = skipBeams || !inView

  return (
    <div
      ref={containerRef}
      className="hero-intro-shell__beams pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {shouldMountBeams && !skipBeams ? (
        <Suspense fallback={null}>
          <BeamsStage paused={paused} />
        </Suspense>
      ) : null}
      <div className="hero-intro-shell__scrim absolute inset-0" />
    </div>
  )
}
