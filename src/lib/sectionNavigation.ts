import { siteContent } from '../data/site'

const SECTION_IDS = new Set(['hero', ...siteContent.nav.map((item) => item.id)])
const DESKTOP_MIN_WIDTH_QUERY = '(min-width: 640px)'
const DESKTOP_SECTION_TOP_GAP_PX = 4

function getScrollBehavior(reducedMotion: boolean): ScrollBehavior {
  return reducedMotion ? 'auto' : 'smooth'
}

export function scrollToSectionById(sectionId: string, reducedMotion: boolean): boolean {
  const target = document.getElementById(sectionId)
  if (!target) return false
  const behavior = getScrollBehavior(reducedMotion)
  if (sectionId === 'hero') {
    window.scrollTo({ top: 0, left: 0, behavior })
    return true
  }

  const desktop = window.matchMedia(DESKTOP_MIN_WIDTH_QUERY).matches
  const topGap = desktop ? DESKTOP_SECTION_TOP_GAP_PX : 0
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - topGap)
  window.scrollTo({ top, left: 0, behavior })
  return true
}

export function buildSectionHref(sectionId: string): string {
  if (!SECTION_IDS.has(sectionId)) return import.meta.env.BASE_URL
  return import.meta.env.BASE_URL
}

export function replaceUrlWithSection(sectionId: string): void {
  if (!SECTION_IDS.has(sectionId)) return
  // Keep a single stable URL in the address bar for cleaner canonical indexing.
}

export function getInitialSectionFromUrl(): string | null {
  return null
}
