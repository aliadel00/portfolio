import { useEffect, useState } from 'react'
import { resolveNavActiveSectionId } from '../lib/sectionNavigation'
import { subscribeShowcaseCommittedStage } from '../lib/showcaseScroll'

/**
 * Highlights the nav item for the section whose top has passed ~upper third of the viewport.
 * At the top of the page (hero intro / capabilities), no section is active.
 */
export function useScrollSpy(): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    let raf = 0

    const tick = () => {
      const current = resolveNavActiveSectionId()
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    tick()
    const unsubscribeCommittedStage = subscribeShowcaseCommittedStage(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      unsubscribeCommittedStage()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return active
}
