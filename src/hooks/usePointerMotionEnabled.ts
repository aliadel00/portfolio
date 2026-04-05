import { useEffect, useState } from 'react'

/** Matches Tailwind `sm:` — effects align with “desktop” layout breakpoint. */
const MIN_WIDTH_MEDIA = '(min-width: 640px)'

function computeEnabled(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(pointer: fine)').matches && window.matchMedia(MIN_WIDTH_MEDIA).matches
  )
}

/**
 * True when cursor-follow, hero particles, liquid nav, and hover-lift CSS should run:
 * fine pointer (mouse / trackpad) **and** viewport at least `sm` (640px).
 */
export function usePointerMotionEnabled(): boolean {
  const [enabled, setEnabled] = useState(computeEnabled)

  useEffect(() => {
    const mqFine = window.matchMedia('(pointer: fine)')
    const mqWide = window.matchMedia(MIN_WIDTH_MEDIA)
    const update = () => setEnabled(mqFine.matches && mqWide.matches)
    update()
    mqFine.addEventListener('change', update)
    mqWide.addEventListener('change', update)
    return () => {
      mqFine.removeEventListener('change', update)
      mqWide.removeEventListener('change', update)
    }
  }, [])

  return enabled
}
