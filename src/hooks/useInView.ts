import { useEffect, useState, type RefObject } from 'react'

type Options = {
  rootMargin?: string
  threshold?: number
  /** When true, treat as visible until the observer runs (avoids a paused first paint). */
  initialVisible?: boolean
}

/**
 * Tracks whether an element intersects the viewport — use to pause heavy work (WebGL, etc.) off-screen.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { rootMargin = '0px', threshold = 0, initialVisible = true }: Options = {},
): boolean {
  const [inView, setInView] = useState(initialVisible)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin, threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold])

  return inView
}
