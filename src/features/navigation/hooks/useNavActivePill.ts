import { useLayoutEffect, useState, type MutableRefObject, type RefObject } from 'react'

export type NavActivePillRect = {
  visible: boolean
  left: number
  top: number
  width: number
  height: number
}

const HIDDEN_PILL: NavActivePillRect = {
  visible: false,
  left: 0,
  top: 0,
  width: 0,
  height: 0,
}

type Options = {
  /** When false, skips layout observers (e.g. hidden desktop rail on mobile). */
  enabled?: boolean
  nestedScrollRef?: RefObject<HTMLElement | null>
  /** Re-run when this changes (e.g. drawer open) so nested scroll listeners attach. */
  rerunToken?: unknown
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
  { enabled = true, nestedScrollRef, rerunToken }: Options = {},
): NavActivePillRect {
  const [pill, setPill] = useState<NavActivePillRect>(HIDDEN_PILL)

  useLayoutEffect(() => {
    if (!enabled) return

    const rail = railRef.current
    if (!rail || typeof window === 'undefined') return

    let raf = 0

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

    const scheduleUpdate = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()

    const ro = new ResizeObserver(scheduleUpdate)
    ro.observe(rail)
    window.addEventListener('resize', scheduleUpdate, { passive: true })

    const nested = nestedScrollRef?.current
    if (nested) nested.addEventListener('scroll', scheduleUpdate, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
      if (nested) nested.removeEventListener('scroll', scheduleUpdate)
    }
  }, [activeSectionId, enabled, navIds, railRef, linkRefs, nestedScrollRef, rerunToken])

  return enabled ? pill : HIDDEN_PILL
}
