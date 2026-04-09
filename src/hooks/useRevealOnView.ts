import { useCallback, useEffect, useState, type RefCallback } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Intersection-observer reveal: adds `isRevealed` when the node enters the viewport.
 * Respects `prefers-reduced-motion` (treated as always revealed).
 */
export function useRevealOnView() {
  const reduced = usePrefersReducedMotion()
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [intersected, setIntersected] = useState(false)

  const ref = useCallback<RefCallback<HTMLDivElement>>((el) => {
    setNode(el)
  }, [])

  useEffect(() => {
    if (reduced || !node || intersected) return

    // Mobile: reveal a bit earlier to avoid "pop in while scrolling fast".
    const isMobileLike =
      typeof window !== 'undefined' &&
      (window.matchMedia('(max-width: 639.98px)').matches ||
        window.matchMedia('(pointer: coarse)').matches)
    const options: IntersectionObserverInit = isMobileLike
      ? { root: null, rootMargin: '20% 0px 18% 0px', threshold: 0 }
      : { root: null, rootMargin: '0px 0px -10% 0px', threshold: [0, 0.05, 0.12] }

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) setIntersected(true)
      },
      options,
    )
    io.observe(node)
    return () => io.disconnect()
  }, [node, reduced, intersected])

  return { ref, isRevealed: intersected || reduced }
}
