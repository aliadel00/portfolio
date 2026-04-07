import { useRef, type HTMLAttributes } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { usePointerMotionEnabled } from './usePointerMotionEnabled'
import { resetPointerReflectVars, setPointerReflectVars } from '../lib/pointerReflect'

type Handlers = Pick<HTMLAttributes<HTMLElement>, 'onPointerEnter' | 'onPointerMove' | 'onPointerLeave'>

/**
 * Soft radial highlight that follows the pointer on `.glass-pointer-track` elements.
 * No-ops when `prefers-reduced-motion` is set, pointer is coarse, or viewport is below `sm`.
 */
export function useGlassPointerTrackHandlers(): Handlers {
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
    setPointerReflectVars(pending.el, pending.x, pending.y)
  }

  return {
    onPointerEnter: (e) => {
      const el = e.currentTarget
      el.setAttribute('data-ptr-reflect', 'on')
      setPointerReflectVars(el, e.clientX, e.clientY)
    },
    onPointerMove: (e) => {
      if (!e.currentTarget.hasAttribute('data-ptr-reflect')) return
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
      const el = e.currentTarget
      el.removeAttribute('data-ptr-reflect')
      resetPointerReflectVars(el)
    },
  }
}
