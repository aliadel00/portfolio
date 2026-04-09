import { useEffect, useState } from 'react'

const SECTION_IDS = ['about', 'skills', 'work', 'contact'] as const

/**
 * Highlights the nav item for the section whose top has passed ~upper third of the viewport.
 * At the top of the page (hero), no section is active.
 */
export function useScrollSpy(): (typeof SECTION_IDS)[number] | null {
  const [active, setActive] = useState<(typeof SECTION_IDS)[number] | null>(null)

  useEffect(() => {
    let raf = 0

    const tick = () => {
      const marker = window.innerHeight * 0.32
      let current: (typeof SECTION_IDS)[number] | null = null

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top } = el.getBoundingClientRect()
        if (top <= marker) current = id
      }

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return active
}
