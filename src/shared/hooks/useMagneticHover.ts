import { useRef } from 'react'
import { usePointerMotionEnabled } from '@/shared/hooks/usePointerMotionEnabled'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'

type Options = {
  strength?: number
  radius?: number
  maxOffset?: number
}

type Handlers = {
  onPointerMove?: (e: React.PointerEvent<HTMLElement>) => void
  onPointerLeave?: (e: React.PointerEvent<HTMLElement>) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function applyMagneticTransform(
  el: HTMLElement,
  clientX: number,
  clientY: number,
  strength: number,
  radius: number,
  maxOffset: number,
) {
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = clientX - cx
  const dy = clientY - cy
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
  const rafRef = useRef<number | null>(null)
  const pendingRef = useRef<{ el: HTMLElement; x: number; y: number } | null>(null)

  if (reducedMotion || !pointerMotionEnabled) {
    return {}
  }

  const flush = () => {
    const pending = pendingRef.current
    rafRef.current = null
    if (!pending) return
    applyMagneticTransform(pending.el, pending.x, pending.y, strength, radius, maxOffset)
  }

  return {
    onPointerMove: (e) => {
      pendingRef.current = { el: e.currentTarget, x: e.clientX, y: e.clientY }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(flush)
    },
    onPointerLeave: (e) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      pendingRef.current = null
      e.currentTarget.style.transform = ''
    },
  }
}
