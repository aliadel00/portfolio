import type { HTMLAttributes } from 'react'
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
  if (reducedMotion || !pointerMotionEnabled) {
    return {}
  }

  return {
    onPointerEnter: (e) => {
      const el = e.currentTarget
      el.setAttribute('data-ptr-reflect', 'on')
      setPointerReflectVars(el, e.clientX, e.clientY)
    },
    onPointerMove: (e) => {
      if (!e.currentTarget.hasAttribute('data-ptr-reflect')) return
      setPointerReflectVars(e.currentTarget, e.clientX, e.clientY)
    },
    onPointerLeave: (e) => {
      const el = e.currentTarget
      el.removeAttribute('data-ptr-reflect')
      resetPointerReflectVars(el)
    },
  }
}
