import type { HTMLAttributes } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { resetGlassCardReflect, setGlassCardReflect } from '../lib/glassCardReflect'

type Handlers = Pick<HTMLAttributes<HTMLElement>, 'onPointerEnter' | 'onPointerMove' | 'onPointerLeave'>

/** Cursor-follow soft highlight for `.glass-card-reflect` (same look as About). */
export function useGlassCardReflectHandlers(): Handlers {
  const reducedMotion = usePrefersReducedMotion()
  if (reducedMotion) {
    return {}
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
      setGlassCardReflect(e.currentTarget, e.clientX, e.clientY)
    },
    onPointerLeave: (e) => {
      if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
      const el = e.currentTarget
      el.removeAttribute('data-gcr-reflect')
      resetGlassCardReflect(el)
    },
  }
}
