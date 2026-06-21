import { usePointerMotionEnabled } from './usePointerMotionEnabled'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type Options = {
  strength?: number
  radius?: number
  maxOffset?: number
}

type Handlers = {
  onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void
  onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void
}

/**
 * Soft magnetic pull toward the pointer. Spring return via CSS transition on the element.
 */
export function useMagneticHover({
  strength = 0.28,
  radius = 120,
  maxOffset = 10,
}: Options = {}): Handlers {
  const reducedMotion = usePrefersReducedMotion()
  const pointerMotionEnabled = usePointerMotionEnabled()
  if (reducedMotion || !pointerMotionEnabled) {
    return {}
  }

  return {
    onPointerMove: (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      if (dist >= radius || dist < 0.001) {
        el.style.transform = ''
        return
      }
      const falloff = 1 - dist / radius
      const pull = strength * falloff
      const x = clamp(dx * pull, -maxOffset, maxOffset)
      const y = clamp(dy * pull, -maxOffset, maxOffset)
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
    },
    onPointerLeave: (e) => {
      e.currentTarget.style.transform = ''
    },
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
