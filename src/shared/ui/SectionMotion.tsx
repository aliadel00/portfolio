import { createElement, type ReactNode } from 'react'
import { useBeamsLoading } from '@/features/hero/hooks/useBeamsLoading'
import { useRevealOnView } from '@/shared/hooks/useRevealOnView'

type SectionMotionProps = {
  as?: 'section' | 'div'
  children: ReactNode
  className?: string
  id?: string
  'aria-labelledby'?: string
  /** Hide content until the hero beams canvas has rendered its first frame. */
  gateOnBeams?: boolean
  /** Play the shared mount entrance instead of waiting for scroll intersection. */
  enterOnMount?: boolean
}

/**
 * Section shell with shared micro-entrance motion. Hero intro can gate on beams readiness.
 */
export function SectionMotion({
  as = 'section',
  children,
  className = '',
  gateOnBeams = false,
  enterOnMount = false,
  ...rest
}: SectionMotionProps) {
  const { isBeamsReady } = useBeamsLoading()
  const { ref, isRevealed } = useRevealOnView()
  const beamsPending = gateOnBeams && !isBeamsReady

  const motionClass = [
    'section-motion',
    enterOnMount ? 'section-motion--mount' : 'section-motion--scroll reveal-on-view',
    !enterOnMount && isRevealed ? 'is-revealed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (enterOnMount) {
    return createElement(
      as,
      {
        className: [className, motionClass].filter(Boolean).join(' '),
        ...rest,
      },
      !beamsPending ? children : null,
    )
  }

  return createElement(
    as,
    { className, ...rest },
    createElement('div', { ref, className: motionClass }, children),
  )
}
