import {
  clearShowcaseCommittedStage,
  commitShowcaseStage,
  getShowcaseCommittedStageForTrack,
  resetShowcaseCommittedStageForTests,
  subscribeShowcaseCommittedStage,
} from './showcaseStageCommit'

export {
  clearShowcaseCommittedStage,
  clearShowcaseCommittedStage as clearCapabilitiesArrowStage,
  getShowcaseCommittedStageForTrack,
  getShowcaseCommittedStageForTrack as getCapabilitiesArrowStageForTrack,
  resetShowcaseCommittedStageForTests,
  resetShowcaseCommittedStageForTests as resetCapabilitiesArrowCommitForTests,
  subscribeShowcaseCommittedStage,
  subscribeShowcaseCommittedStage as subscribeCapabilitiesArrowStage,
}

const SHOWCASE_STICKY_GAP_PX = 8

let stickyTopCache: { scope: ParentNode; value: number } | null = null

/** Clears cached sticky offset — call when header height or pin CSS changes. */
export function invalidateShowcaseStickyTopPx() {
  stickyTopCache = null
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', invalidateShowcaseStickyTopPx, { passive: true })
}

/** Matches `stageHeightVh` on the hero capabilities ScrollShowcase and pin min-height. */
export const HERO_CAPABILITIES_STAGE_HEIGHT_VH = 72

/** Matches `.hero-immersive-showcase-block--skills .scroll-showcase-pin` min-height. */
export const HERO_CAPABILITIES_PIN_MIN_VH = 72

/** @deprecated Trail runway removed — stage height now matches pin height. */
export function getShowcaseTrackTrailVh(): number {
  return 0
}

export function getShowcaseTrackHeightVh(
  stageCount: number,
  stageHeightVh: number,
): number {
  return stageCount * stageHeightVh
}

function getShowcaseDeclaredStageHeightPx(trackEl: HTMLElement): number | null {
  const raw = trackEl.dataset.showcaseStageVh
  if (!raw) return null
  const vh = Number.parseFloat(raw)
  if (!Number.isFinite(vh) || vh <= 0) return null
  return (vh / 100) * window.innerHeight
}

function getShowcaseTrackTrailPx(trackEl: HTMLElement): number {
  const raw = trackEl.dataset.showcaseTrailVh
  if (!raw) return 0
  const trailVh = Number.parseFloat(raw)
  if (!Number.isFinite(trailVh) || trailVh <= 0) return 0
  return (trailVh / 100) * window.innerHeight
}

/** Keep the capabilities eyebrow visibly below the header — not flush-pinned. */
export const HERO_CAPABILITIES_ENTRY_GAP_PX = 12

const HERO_INTRO_SECTION_ID = 'hero-intro'

/** Minimum scroll Y so the full-bleed hero intro shell is above the viewport. */
export function getHeroIntroClearedScrollY(): number {
  const heroIntro = document.getElementById(HERO_INTRO_SECTION_ID)
  if (!heroIntro) return 0
  const rect = heroIntro.getBoundingClientRect()
  return Math.max(0, Math.ceil(rect.bottom + window.scrollY))
}

export function getShowcaseStickyTopPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
  const parsed = Number.parseFloat(raw)
  const header = Number.isFinite(parsed) && parsed > 0 ? parsed : 72
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  const halfRem = Number.isFinite(rootFontSize) ? rootFontSize / 2 : SHOWCASE_STICKY_GAP_PX
  return Math.ceil(header + halfRem)
}

/** Prefer the live pinned `top` so scroll math matches `.scroll-showcase-pin` CSS. */
export function resolveShowcaseStickyTopPx(scope: ParentNode = document): number {
  if (stickyTopCache?.scope === scope) return stickyTopCache.value

  const pin = scope.querySelector('.scroll-showcase-pin')
  if (pin) {
    const topPx = Number.parseFloat(getComputedStyle(pin).top)
    if (Number.isFinite(topPx) && topPx > 0) {
      const value = Math.ceil(topPx)
      stickyTopCache = { scope, value }
      return value
    }
  }

  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  const halfRem = Number.isFinite(rootFontSize) ? Math.ceil(rootFontSize / 2) : SHOWCASE_STICKY_GAP_PX

  const header = document.querySelector('.dynamic-island-header')
  if (header) {
    const headerHeight = Math.ceil(header.getBoundingClientRect().height)
    if (headerHeight > 0) {
      const value = headerHeight + halfRem
      stickyTopCache = { scope, value }
      return value
    }
  }

  const value = getShowcaseStickyTopPx()
  stickyTopCache = { scope, value }
  return value
}

/** Pin stage height — matches `--hero-capabilities-stage-height` in CSS. */
export function readShowcasePinStageHeightPx(trackEl: HTMLElement): number | null {
  const pinStage = trackEl.querySelector<HTMLElement>('.scroll-showcase-pin__stage')
  if (!pinStage) return null
  const height = pinStage.offsetHeight
  return height > 0 ? height : null
}

/** Measured runway first — declared 72vh ignores CSS `min(72dvh, 40rem)` and causes boundary stutter. */
export function resolveShowcaseStageHeightPx(
  trackEl: HTMLElement,
  stageCount: number,
  stageHeightVh: number,
): number {
  const pinStageHeight = readShowcasePinStageHeightPx(trackEl)
  if (pinStageHeight !== null) return pinStageHeight

  const trailPx = getShowcaseTrackTrailPx(trackEl)
  const trackRunway = Math.max(0, trackEl.offsetHeight - trailPx)
  if (trackRunway > 0 && stageCount > 0) return trackRunway / stageCount

  const declared = getShowcaseDeclaredStageHeightPx(trackEl)
  if (declared !== null) return declared

  return (stageHeightVh / 100) * window.innerHeight
}

/** Document scroll Y that pins a showcase track at the given stage index. */
export function getShowcaseStageScrollY(
  trackEl: HTMLElement,
  stageIndex: number,
  stageCount: number,
  stageHeightVh: number,
  stickyTopPx: number,
  stageScrollInsetPx = 0,
): number {
  const trackTop = trackEl.getBoundingClientRect().top + window.scrollY
  const stageHeight = resolveShowcaseStageHeightPx(trackEl, stageCount, stageHeightVh)
  const target = trackTop + stageScrollInsetPx + stageIndex * stageHeight - stickyTopPx
  return Math.max(0, Math.round(target))
}

/**
 * Hero capabilities entry — eyebrow + first card framed, before the track fully pins.
 * Stops short of stage-0 pin so the intro label stays visible under the header.
 */
export function getHeroCapabilitiesEntryScrollY(section: HTMLElement): number | null {
  const intro = section.querySelector<HTMLElement>('.scroll-showcase-intro')
  const track = section.querySelector<HTMLElement>('.scroll-showcase-track')
  if (!intro || !track) return null

  const stickyTopPx = resolveShowcaseStickyTopPx(section)
  const introTop = intro.getBoundingClientRect().top + window.scrollY
  const trackTop = track.getBoundingClientRect().top + window.scrollY
  const introToTrackPx = Math.max(0, trackTop - introTop)

  const introAlignedTop = introTop - stickyTopPx - HERO_CAPABILITIES_ENTRY_GAP_PX
  const stageCount = getHeroCapabilitiesStageCount(section)
  const trackPinnedTop = getShowcaseStageScrollY(
    track,
    0,
    stageCount,
    HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    stickyTopPx,
  )

  // Never reach full track-pin — that scrolls the eyebrow out of frame.
  const maxEntryTop = trackPinnedTop - introToTrackPx
  const entry = Math.max(0, Math.min(introAlignedTop, maxEntryTop))

  // Programmatic jumps (arrow keys) can stop short of manual scroll and expose the hero scrim.
  return Math.max(entry, getHeroIntroClearedScrollY())
}

export function isHeroCapabilitiesAtEntry(section: HTMLElement, tolerancePx = 20): boolean {
  const targetY = getHeroCapabilitiesEntryScrollY(section)
  if (targetY === null) return false
  return Math.abs(window.scrollY - targetY) <= tolerancePx
}

export function getScrollStageMetrics(
  trackEl: HTMLElement,
  stageCount: number,
  stageHeightVh: number,
  stickyTopPx: number,
  /** Extra scroll through the track before stage 0 begins (e.g. section label outside the pin) */
  stageScrollInsetPx = 0,
) {
  const trackRect = trackEl.getBoundingClientRect()
  const trackTop = window.scrollY + trackRect.top
  const stageHeight = resolveShowcaseStageHeightPx(trackEl, stageCount, stageHeightVh)
  const scrolled = window.scrollY - trackTop + stickyTopPx - stageScrollInsetPx
  const raw = scrolled / Math.max(stageHeight, 1)
  const clamped = Math.min(stageCount - 1, Math.max(0, raw))
  const activeIndex = Math.floor(clamped)

  return {
    trackRect,
    trackTop,
    stageHeight,
    activeIndex,
    progress: clamped - activeIndex,
  }
}

export function isShowcaseStageEngaged(trackRect: DOMRect, stickyTopPx: number): boolean {
  return trackRect.top <= stickyTopPx + 12 && trackRect.bottom > stickyTopPx + 120
}

const SHOWCASE_STAGE_ALIGN_TOLERANCE = 0.05

export function getShowcaseSnappedStageIndex(
  trackEl: HTMLElement,
  stageCount: number,
  stageHeightVh: number,
  stickyTopPx: number,
  stageScrollInsetPx = 0,
): { index: number; aligned: boolean } {
  const { activeIndex, progress } = getScrollStageMetrics(
    trackEl,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )

  if (progress <= SHOWCASE_STAGE_ALIGN_TOLERANCE) {
    return { index: activeIndex, aligned: true }
  }
  if (progress >= 1 - SHOWCASE_STAGE_ALIGN_TOLERANCE) {
    return { index: Math.min(stageCount - 1, activeIndex + 1), aligned: true }
  }
  return { index: Math.round(activeIndex + progress), aligned: false }
}

export type ShowcaseStageScrollOptions = {
  stageCount: number
  stageHeightVh: number
  stageScrollInsetPx?: number
  reducedMotion?: boolean
}

let scrollLockUntil = 0
let pendingStageFinalizeId = 0

export function isShowcaseScrollLocked(): boolean {
  return Date.now() < scrollLockUntil
}

function lockShowcaseScroll(ms: number): void {
  scrollLockUntil = Date.now() + ms
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getScrollBehavior(reducedMotion = prefersReducedMotion()): ScrollBehavior {
  if (reducedMotion) return 'auto'
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return 'auto'
  return 'smooth'
}

function getStageTargetY(
  track: HTMLElement,
  stageIndex: number,
  options: ShowcaseStageScrollOptions,
): number {
  const { stageCount, stageHeightVh, stageScrollInsetPx = 0 } = options
  const stickyTopPx = resolveShowcaseStickyTopPx(track)
  return getShowcaseStageScrollY(
    track,
    stageIndex,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )
}

function finalizeStageScroll(track: HTMLElement, stageIndex: number, options: ShowcaseStageScrollOptions): void {
  const { stageCount, stageHeightVh, stageScrollInsetPx = 0 } = options
  const stickyTopPx = resolveShowcaseStickyTopPx(track)
  const targetY = getShowcaseStageScrollY(
    track,
    stageIndex,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )
  const distance = Math.abs(window.scrollY - targetY)

  if (distance <= 12) return

  const { activeIndex, progress } = getScrollStageMetrics(
    track,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )

  // User scrolled to a different card manually — do not pull them back.
  if (activeIndex !== stageIndex && distance > 24) return

  if (activeIndex !== stageIndex || progress > 0.04) {
    if (distance > 1) {
      window.scrollTo({ top: targetY, left: 0, behavior: 'auto' })
    }
  }
}

export function scrollShowcaseToStage(
  track: HTMLElement,
  stageIndex: number,
  options: ShowcaseStageScrollOptions,
): void {
  const reducedMotion = options.reducedMotion ?? prefersReducedMotion()
  const scrollBehavior = getScrollBehavior(reducedMotion)
  lockShowcaseScroll(scrollBehavior === 'smooth' ? 800 : 80)
  const finalizeId = ++pendingStageFinalizeId

  commitShowcaseStage(stageIndex, track)
  window.scrollTo({
    top: getStageTargetY(track, stageIndex, options),
    left: 0,
    behavior: scrollBehavior,
  })

  const settle = () => {
    if (finalizeId !== pendingStageFinalizeId) return
    finalizeStageScroll(track, stageIndex, options)
  }

  if (scrollBehavior === 'smooth') {
    let settled = false
    const runSettle = () => {
      if (settled) return
      settled = true
      settle()
    }
    if ('onscrollend' in window) {
      const onScrollEnd = () => {
        window.removeEventListener('scrollend', onScrollEnd)
        runSettle()
      }
      window.addEventListener('scrollend', onScrollEnd, { passive: true })
    }
    window.setTimeout(runSettle, 820)
  } else {
    requestAnimationFrame(() => {
      requestAnimationFrame(settle)
    })
  }
}

export function resolveShowcaseActiveIndex(
  track: HTMLElement,
  options: ShowcaseStageScrollOptions,
): number {
  const committed = getShowcaseCommittedStageForTrack(track)
  if (committed !== null) return committed

  const { stageCount, stageHeightVh, stageScrollInsetPx = 0 } = options
  const stickyTopPx = resolveShowcaseStickyTopPx(track)
  return getShowcaseSnappedStageIndex(
    track,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  ).index
}

export function resolveShowcaseDisplayStage(
  track: HTMLElement,
  options: ShowcaseStageScrollOptions,
): { activeIndex: number; progress: number } {
  const committed = getShowcaseCommittedStageForTrack(track)
  if (committed !== null) return { activeIndex: committed, progress: 0 }

  const { stageCount, stageHeightVh, stageScrollInsetPx = 0 } = options
  const stickyTopPx = resolveShowcaseStickyTopPx(track)
  const snap = getShowcaseSnappedStageIndex(
    track,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )
  return { activeIndex: snap.index, progress: 0 }
}

export function runAfterShowcaseLayoutSettled(run: () => void): void {
  invalidateShowcaseStickyTopPx()
  requestAnimationFrame(() => {
    requestAnimationFrame(run)
  })
}

export type HeroCapabilitiesArrowResult =
  | { action: 'stepped' }
  | { action: 'exit-section'; direction: 'up' | 'down' }
  | { action: 'none' }

function getHeroCapabilitiesTrack(section: HTMLElement): HTMLElement | null {
  return section.querySelector<HTMLElement>('.scroll-showcase-track')
}

export function getHeroCapabilitiesStageCount(section: HTMLElement): number {
  return section.querySelectorAll('.scroll-showcase-rail__item').length
}

export function isHeroCapabilitiesSteppable(section: HTMLElement): boolean {
  const track = getHeroCapabilitiesTrack(section)
  if (!track) return false
  return getHeroCapabilitiesStageCount(section) > 1
}

/** True while scroll position is still inside the hero capabilities showcase track. */
export function isHeroCapabilitiesNavActive(section: HTMLElement): boolean {
  if (!isHeroCapabilitiesSteppable(section)) return false

  const track = getHeroCapabilitiesTrack(section)
  if (!track) return false

  if (isHeroCapabilitiesAtEntry(section)) return true

  const stageCount = getHeroCapabilitiesStageCount(section)
  const stickyTopPx = resolveShowcaseStickyTopPx(section)
  const { trackRect } = getScrollStageMetrics(
    track,
    stageCount,
    HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    stickyTopPx,
  )

  if (isShowcaseStageEngaged(trackRect, stickyTopPx)) return true

  const entryY = getHeroCapabilitiesEntryScrollY(section)
  if (entryY === null) return false

  const lastStageY = getShowcaseStageScrollY(
    track,
    stageCount - 1,
    stageCount,
    HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    stickyTopPx,
  )

  return window.scrollY >= entryY - 24 && window.scrollY <= lastStageY + 48
}

function readCapabilitiesStageIndex(
  section: HTMLElement,
  track: HTMLElement,
  stageCount: number,
  stickyTopPx: number,
): number {
  const { trackRect, activeIndex } = getScrollStageMetrics(
    track,
    stageCount,
    HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    stickyTopPx,
  )
  const engaged = isShowcaseStageEngaged(trackRect, stickyTopPx)
  if (isHeroCapabilitiesAtEntry(section) && !engaged) return -1
  return activeIndex
}

/** Read-only stage index for capabilities — no committed-stage side effects. */
function readHeroCapabilitiesActiveIndex(
  section: HTMLElement,
  track: HTMLElement,
  scrollOptions: ShowcaseStageScrollOptions,
): number {
  if (!isHeroCapabilitiesNavActive(section)) {
    const stickyTopPx = resolveShowcaseStickyTopPx(section)
    return readCapabilitiesStageIndex(section, track, scrollOptions.stageCount, stickyTopPx)
  }

  const committed = getShowcaseCommittedStageForTrack(track)
  if (committed !== null) return committed

  const stickyTopPx = resolveShowcaseStickyTopPx(section)
  const { trackRect } = getScrollStageMetrics(
    track,
    scrollOptions.stageCount,
    scrollOptions.stageHeightVh,
    stickyTopPx,
  )
  if (isHeroCapabilitiesAtEntry(section) && !isShowcaseStageEngaged(trackRect, stickyTopPx)) {
    return -1
  }

  return resolveShowcaseActiveIndex(track, scrollOptions)
}

/** Next card after a wheel step; `null` when the gesture should exit the showcase. */
export function getNextShowcaseWheelStageIndex(
  activeIndex: number,
  direction: 1 | -1,
  stageCount: number,
): number | null {
  if (activeIndex < 0) return direction > 0 ? 0 : null
  const next = activeIndex + direction
  if (next < 0 || next >= stageCount) return null
  return next
}

/** True when a wheel gesture should release to native page scroll at a boundary. */
export function isShowcaseWheelBoundaryExit(
  activeIndex: number,
  direction: 1 | -1,
  stageCount: number,
): boolean {
  if (direction < 0) return activeIndex <= 0
  return activeIndex >= stageCount - 1
}

function getHeroCapabilitiesScrollOptions(
  section: HTMLElement,
  reducedMotion = false,
): ShowcaseStageScrollOptions | null {
  const track = getHeroCapabilitiesTrack(section)
  if (!track) return null
  const stageCount = getHeroCapabilitiesStageCount(section)
  if (stageCount <= 0) return null
  return {
    stageCount,
    stageHeightVh: HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    reducedMotion,
  }
}

/** True while wheel stepping should capture scroll (entry + pinned stages). */
export function isHeroCapabilitiesWheelEngaged(track: HTMLElement): boolean {
  const section = track.closest<HTMLElement>('#hero-capabilities')
  if (!section || !isHeroCapabilitiesSteppable(section)) return false
  return isHeroCapabilitiesNavActive(section)
}

/** Entry = -1; pinned cards = 0…n-1. */
export function resolveHeroCapabilitiesWheelIndex(
  track: HTMLElement,
  scrollOptions: ShowcaseStageScrollOptions,
): number {
  const section = track.closest<HTMLElement>('#hero-capabilities')
  if (!section) return resolveShowcaseActiveIndex(track, scrollOptions)
  return readHeroCapabilitiesActiveIndex(section, track, scrollOptions)
}

/**
 * Capabilities card + rail display — matches wheel index at entry/boundaries
 * so the first and last cards do not flicker between scroll metrics and committed stage.
 */
export function resolveHeroCapabilitiesDisplayStage(
  track: HTMLElement,
  options: ShowcaseStageScrollOptions,
): { activeIndex: number; progress: number } {
  const committed = getShowcaseCommittedStageForTrack(track)
  if (committed !== null) return { activeIndex: committed, progress: 0 }

  const section = track.closest<HTMLElement>('#hero-capabilities')
  if (!section) return resolveShowcaseDisplayStage(track, options)

  const { stageCount, stageHeightVh, stageScrollInsetPx = 0 } = options
  const stickyTopPx = resolveShowcaseStickyTopPx(section)
  const { trackRect, activeIndex, progress } = getScrollStageMetrics(
    track,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )

  if (isHeroCapabilitiesAtEntry(section) && !isShowcaseStageEngaged(trackRect, stickyTopPx)) {
    return { activeIndex: 0, progress: 0 }
  }

  if (!isHeroCapabilitiesNavActive(section)) {
    return { activeIndex, progress }
  }

  const snap = getShowcaseSnappedStageIndex(
    track,
    stageCount,
    stageHeightVh,
    stickyTopPx,
    stageScrollInsetPx,
  )
  if (snap.aligned) return { activeIndex: snap.index, progress: 0 }

  return { activeIndex, progress }
}

function resolveHeroCapabilitiesActiveIndex(
  section: HTMLElement,
  track: HTMLElement,
  scrollOptions: ShowcaseStageScrollOptions,
): number {
  return readHeroCapabilitiesActiveIndex(section, track, scrollOptions)
}

/** Jump directly to a capabilities card (used when entering from an adjacent section). */
export function enterHeroCapabilitiesAtStage(
  section: HTMLElement,
  stageIndex: number,
  reducedMotion = false,
): void {
  const scrollOptions = getHeroCapabilitiesScrollOptions(section, reducedMotion)
  if (!scrollOptions) return
  const track = getHeroCapabilitiesTrack(section)
  if (!track) return
  const clamped = Math.min(scrollOptions.stageCount - 1, Math.max(0, stageIndex))
  runAfterShowcaseLayoutSettled(() => {
    scrollShowcaseToStage(track, clamped, scrollOptions)
  })
}

/**
 * Arrow up/down while in the hero capabilities pinned showcase — one card per keypress.
 * At the first/last card, returns `exit-section` so section nav can jump out.
 */
export function handleHeroCapabilitiesArrowKey(
  section: HTMLElement,
  key: 'ArrowUp' | 'ArrowDown',
  reducedMotion = false,
): HeroCapabilitiesArrowResult {
  if (!isHeroCapabilitiesSteppable(section) || !isHeroCapabilitiesNavActive(section)) {
    return { action: 'none' }
  }

  const track = getHeroCapabilitiesTrack(section)!
  const scrollOptions = getHeroCapabilitiesScrollOptions(section, reducedMotion)!
  const activeIndex = resolveHeroCapabilitiesActiveIndex(section, track, scrollOptions)
  const { stageCount } = scrollOptions

  if (key === 'ArrowDown') {
    if (activeIndex >= stageCount - 1) return { action: 'exit-section', direction: 'down' }
    scrollShowcaseToStage(track, activeIndex + 1, scrollOptions)
    return { action: 'stepped' }
  }

  if (activeIndex <= 0) return { action: 'exit-section', direction: 'up' }
  scrollShowcaseToStage(track, activeIndex - 1, scrollOptions)
  return { action: 'stepped' }
}
