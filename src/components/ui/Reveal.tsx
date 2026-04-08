import type { CSSProperties, ReactNode } from 'react'
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
  const style: CSSProperties | undefined =
    delayMs > 0 ? { ['--reveal-delay' as string]: `${delayMs}ms` } : undefined

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
