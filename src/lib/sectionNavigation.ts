import { siteContent } from '../data/site'

const TOP_LEVEL_SECTION_IDS = ['hero', ...siteContent.nav.map((item) => item.id)]
const TOP_LEVEL_SECTION_SET = new Set(TOP_LEVEL_SECTION_IDS)
const WORK_SUBSECTION_IDS = ['work-career', 'work-freelance']
export const ARROW_SECTION_IDS = TOP_LEVEL_SECTION_IDS.flatMap((id) =>
  id === 'work' ? [id, ...WORK_SUBSECTION_IDS] : [id],
)
const DESKTOP_MIN_WIDTH_QUERY = '(min-width: 640px)'
const DESKTOP_SECTION_TOP_GAP_PX = 4
const DESKTOP_WORK_SUBSECTION_TOP_GAP_PX = 104

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
  const topGap = desktop
    ? WORK_SUBSECTION_IDS.includes(sectionId)
      ? DESKTOP_WORK_SUBSECTION_TOP_GAP_PX
      : DESKTOP_SECTION_TOP_GAP_PX
    : 0
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - topGap)
  window.scrollTo({ top, left: 0, behavior })
  return true
}

export function buildSectionHref(sectionId: string): string {
  if (!TOP_LEVEL_SECTION_SET.has(sectionId)) return import.meta.env.BASE_URL
  return import.meta.env.BASE_URL
}

export function replaceUrlWithSection(sectionId: string): void {
  if (!TOP_LEVEL_SECTION_SET.has(sectionId)) return
  // Keep a single stable URL in the address bar for cleaner canonical indexing.
}

export function isTopLevelSectionId(sectionId: string): boolean {
  return TOP_LEVEL_SECTION_SET.has(sectionId)
}

export function getInitialSectionFromUrl(): string | null {
  return null
}
