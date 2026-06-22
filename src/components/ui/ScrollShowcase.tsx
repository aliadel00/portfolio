import type { ReactNode, RefObject } from 'react'
import { useRef } from 'react'
import { useScrollStageIndex } from '../../hooks/useScrollStageIndex'
import { useScrollStageWheelStep } from '../../hooks/useScrollStageWheelStep'

type StageRenderProps = {
  activeIndex: number
  progress: number
}

type Props = {
  stageCount: number
  stageHeightVh?: number
  ariaLabel: string
  /** Short labels for the progress rail */
  progressLabels: string[]
  intro?: ReactNode
  /** Shown when prefers-reduced-motion — typically the original grid */
  reducedFallback: ReactNode
  children: (props: StageRenderProps) => ReactNode
  /** `connected` — bottom timeline; `connected-vertical` — right-side vertical timeline */
  railVariant?: 'default' | 'connected' | 'connected-vertical'
  /** One wheel/touchpad gesture advances a single stage while pinned */
  wheelStep?: boolean
  trackRef?: RefObject<HTMLDivElement | null>
}

export function ScrollShowcase({
  stageCount,
  stageHeightVh = 78,
  ariaLabel,
  progressLabels,
  intro,
  reducedFallback,
  children,
  railVariant = 'default',
  wheelStep = false,
  trackRef: externalTrackRef,
}: Props) {
  const internalTrackRef = useRef<HTMLDivElement>(null)
  const trackRef = externalTrackRef ?? internalTrackRef
  const { activeIndex, progress, reducedMotion } = useScrollStageIndex(trackRef, {
    stageCount,
    stageHeightVh,
  })

  useScrollStageWheelStep(trackRef, {
    stageCount,
    stageHeightVh,
    reducedMotion,
    enabled: wheelStep && !reducedMotion && stageCount > 1,
  })

  if (reducedMotion || stageCount <= 1) {
    return (
      <div className="scroll-showcase-static">
        {intro}
        {reducedFallback}
      </div>
    )
  }

  return (
    <div className="scroll-showcase">
      {intro}
      <div
        ref={trackRef}
        className="scroll-showcase-track"
        style={{ height: `${stageCount * stageHeightVh}vh` }}
      >
        <div className="scroll-showcase-pin">
          <div
            className={[
              'scroll-showcase-pin__stage',
              railVariant === 'connected-vertical' ? 'scroll-showcase-pin__stage--with-rail' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className="scroll-showcase-viewport"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="additions text"
            >
              {children({ activeIndex, progress })}
            </div>

            <nav
            className={[
              'scroll-showcase-rail',
              railVariant === 'connected' ? 'scroll-showcase-rail--connected' : '',
              railVariant === 'connected-vertical'
                ? 'scroll-showcase-rail--connected scroll-showcase-rail--vertical'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={ariaLabel}
            style={{
              ['--showcase-rail-progress' as string]: `${((activeIndex + progress) / Math.max(stageCount - 1, 1)) * 100}%`,
              ['--showcase-stage-count' as string]: String(stageCount),
            }}
          >
            <ol className="scroll-showcase-rail__list m-0 list-none p-0">
              {progressLabels.map((label, i) => (
                <li key={`${label}-${i}`} className="scroll-showcase-rail__item m-0">
                  <span
                    className={[
                      'scroll-showcase-rail__dot',
                      i === activeIndex ? 'scroll-showcase-rail__dot--active' : '',
                      i < activeIndex ? 'scroll-showcase-rail__dot--past' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden
                  />
                  <span
                    className={[
                      'scroll-showcase-rail__label',
                      i === activeIndex ? 'scroll-showcase-rail__label--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ol>
            {railVariant === 'default' ? (
              <div className="scroll-showcase-rail__bar" aria-hidden />
            ) : null}
          </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
