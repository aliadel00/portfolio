import { siteContent } from '../data/site'

const SECTION_IDS = new Set(['hero', ...siteContent.nav.map((item) => item.id)])

function getScrollBehavior(reducedMotion: boolean): ScrollBehavior {
  return reducedMotion ? 'auto' : 'smooth'
}

export function scrollToSectionById(sectionId: string, reducedMotion: boolean): boolean {
  const target = document.getElementById(sectionId)
  if (!target) return false
  target.scrollIntoView({
    behavior: getScrollBehavior(reducedMotion),
    block: 'start',
  })
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
