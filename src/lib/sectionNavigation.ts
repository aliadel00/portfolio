import { siteContent } from '../data/site'
import { getShowcaseStickyTopPx } from './showcaseScroll'

export const HERO_INTRO_SECTION_ID = 'hero-intro'
export const HERO_CAPABILITIES_SECTION_ID = 'hero-capabilities'

const TOP_LEVEL_SECTION_IDS = ['hero', ...siteContent.nav.map((item) => item.id)]
const TOP_LEVEL_SECTION_SET = new Set(TOP_LEVEL_SECTION_IDS)
const WORK_SUBSECTION_IDS = ['work-career', 'work-freelance']
export const ARROW_SECTION_IDS = [
  HERO_INTRO_SECTION_ID,
  HERO_CAPABILITIES_SECTION_ID,
  ...TOP_LEVEL_SECTION_IDS.slice(1).flatMap((id) =>
    id === 'work' ? [id, ...WORK_SUBSECTION_IDS] : [id],
  ),
]
const DESKTOP_MIN_WIDTH_QUERY = '(min-width: 640px)'
const DESKTOP_SECTION_TOP_GAP_PX = 4
const DESKTOP_WORK_SUBSECTION_TOP_GAP_PX = 104
const FALLBACK_SITE_HEADER_OFFSET_PX = 72

function getScrollBehavior(reducedMotion: boolean): ScrollBehavior {
  if (reducedMotion) return 'auto'
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return 'auto'
  return 'smooth'
}

function getSiteHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
  const parsed = Number.parseFloat(raw)
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  const header = document.querySelector('.dynamic-island-header')
  return header ? Math.ceil(header.getBoundingClientRect().height) : FALLBACK_SITE_HEADER_OFFSET_PX
}

function scrollToHeroCapabilities(reducedMotion: boolean): boolean {
  const section = document.getElementById(HERO_CAPABILITIES_SECTION_ID)
  if (!section) return false

  const behavior = getScrollBehavior(reducedMotion)
  const track = section.querySelector<HTMLElement>('.scroll-showcase-track')
  if (track) {
    const stickyTopPx = getShowcaseStickyTopPx()
    const trackTop = track.getBoundingClientRect().top + window.scrollY
    const top = Math.max(0, trackTop - stickyTopPx)
    window.scrollTo({ top, left: 0, behavior })
    return true
  }

  const desktop = window.matchMedia(DESKTOP_MIN_WIDTH_QUERY).matches
  const headerOffset = getSiteHeaderOffsetPx()
  const topGap = headerOffset + (desktop ? DESKTOP_SECTION_TOP_GAP_PX : 8)
  const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - topGap)
  window.scrollTo({ top, left: 0, behavior })
  return true
}

export function scrollToSectionById(sectionId: string, reducedMotion: boolean): boolean {
  const target = document.getElementById(sectionId)
  if (!target) return false
  const behavior = getScrollBehavior(reducedMotion)
  if (sectionId === 'hero' || sectionId === HERO_INTRO_SECTION_ID) {
    window.scrollTo({ top: 0, left: 0, behavior })
    return true
  }

  if (sectionId === HERO_CAPABILITIES_SECTION_ID) {
    return scrollToHeroCapabilities(reducedMotion)
  }

  const desktop = window.matchMedia(DESKTOP_MIN_WIDTH_QUERY).matches
  const headerOffset = getSiteHeaderOffsetPx()
  const sectionGap = desktop
    ? WORK_SUBSECTION_IDS.includes(sectionId)
      ? DESKTOP_WORK_SUBSECTION_TOP_GAP_PX
      : DESKTOP_SECTION_TOP_GAP_PX
    : 8
  const topGap = headerOffset + sectionGap
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
