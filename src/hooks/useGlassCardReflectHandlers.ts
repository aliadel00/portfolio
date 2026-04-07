import { useRef, type HTMLAttributes } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { usePointerMotionEnabled } from './usePointerMotionEnabled'
import { resetGlassCardReflect, setGlassCardReflect } from '../lib/glassCardReflect'

type Handlers = Pick<HTMLAttributes<HTMLElement>, 'onPointerEnter' | 'onPointerMove' | 'onPointerLeave'>

/** Cursor-follow soft highlight for `.glass-card-reflect` (same look as About). */
export function useGlassCardReflectHandlers(): Handlers {
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
    setGlassCardReflect(pending.el, pending.x, pending.y)
  }

  return {
    onPointerEnter: (e) => {
      if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
      const el = e.currentTarget
      el.setAttribute('data-gcr-reflect', 'on')
      setGlassCardReflect(el, e.clientX, e.clientY)
    },
    onPointerMove: (e) => {
      if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
      pendingRef.current = { el: e.currentTarget, x: e.clientX, y: e.clientY }
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(flush)
    },
    onPointerLeave: (e) => {
      if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      pendingRef.current = null
      const el = e.currentTarget
      el.removeAttribute('data-gcr-reflect')
      resetGlassCardReflect(el)
    },
  }
}
