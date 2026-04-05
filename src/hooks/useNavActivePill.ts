import { useLayoutEffect, useState, type MutableRefObject, type RefObject } from 'react'

export type NavActivePillRect = {
  visible: boolean
  left: number
  top: number
  width: number
  height: number
}

/**
 * Positions a sliding “liquid glass” pill under the active nav link (Apple-style morph).
 * When no section is active (hero), the pill rests under the first item with opacity 0 so
 * the first reveal doesn’t animate from zero size.
 */
export function useNavActivePill(
  activeSectionId: string | null,
  navIds: readonly string[],
  railRef: RefObject<HTMLElement | null>,
  linkRefs: MutableRefObject<(HTMLAnchorElement | null)[]>,
): NavActivePillRect {
  const [pill, setPill] = useState<NavActivePillRect>({
    visible: false,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    const rail = railRef.current
    if (!rail || typeof window === 'undefined') return

    const update = () => {
      const idx =
        activeSectionId != null && activeSectionId.length > 0 ? navIds.indexOf(activeSectionId) : -1
      const targetIndex = idx >= 0 ? idx : 0
      const link = linkRefs.current[targetIndex]
      if (!link) return

      const railRect = rail.getBoundingClientRect()
      const r = link.getBoundingClientRect()
      setPill({
        visible: idx >= 0,
        left: r.left - railRect.left,
        top: r.top - railRect.top,
        width: r.width,
        height: r.height,
      })
    }

    update()

    const ro = new ResizeObserver(update)
    ro.observe(rail)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [activeSectionId, navIds, railRef, linkRefs])

  return pill
}
