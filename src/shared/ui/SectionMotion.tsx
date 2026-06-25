import { createElement, type ReactNode } from 'react'
import { useRevealOnView } from '@/shared/hooks/useRevealOnView'

type SectionMotionProps = {
  as?: 'section' | 'div'
  children: ReactNode
  className?: string
  id?: string
  'aria-labelledby'?: string
  /** Play the shared mount entrance instead of waiting for scroll intersection. */
  enterOnMount?: boolean
}

/**
 * Section shell with shared micro-entrance motion.
 * Hero intro uses `enterOnMount` — LCP copy must not wait on scroll intersection or WebGL.
 */
export function SectionMotion({
  as = 'section',
  children,
  className = '',
  enterOnMount = false,
  ...rest
}: SectionMotionProps) {
  const { ref, isRevealed } = useRevealOnView()

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
      children,
    )
  }

  return createElement(
    as,
    { className, ...rest },
    createElement('div', { ref, className: motionClass }, children),
  )
}
