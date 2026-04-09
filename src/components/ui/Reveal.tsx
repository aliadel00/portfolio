import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useRevealOnView } from '../../hooks/useRevealOnView'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay for nested sequences (ms). */
  delayMs?: number
  /** Use opacity-only reveal to avoid transform/compositor spikes. */
  fadeOnly?: boolean
}

/**
 * Scroll-triggered fade/slide-in. No extra wrapper semantics — use a `div` only.
 */
export function Reveal({ children, className = '', delayMs = 0, fadeOnly = false }: RevealProps) {
  const { ref, isRevealed } = useRevealOnView()
  const [mobileLikeViewport, setMobileLikeViewport] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 639.98px), (pointer: coarse)')
    const update = () => setMobileLikeViewport(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const effectiveDelayMs = mobileLikeViewport ? 0 : delayMs
  const style: CSSProperties | undefined =
    effectiveDelayMs > 0 ? { ['--reveal-delay' as string]: `${effectiveDelayMs}ms` } : undefined

  return (
    <div
      ref={ref}
      className={`reveal-on-view ${fadeOnly ? 'reveal-on-view--fade' : ''} ${isRevealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  )
}
