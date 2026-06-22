const SHOWCASE_STICKY_GAP_PX = 8

/** Matches `stageHeightVh` on the hero capabilities ScrollShowcase. */
export const HERO_CAPABILITIES_STAGE_HEIGHT_VH = 64

/** Keep the capabilities eyebrow visibly below the header — not flush-pinned. */
export const HERO_CAPABILITIES_ENTRY_GAP_PX = 12

export function getShowcaseStickyTopPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
  const parsed = Number.parseFloat(raw)
  const header = Number.isFinite(parsed) && parsed > 0 ? parsed : 72
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  const halfRem = Number.isFinite(rootFontSize) ? rootFontSize / 2 : SHOWCASE_STICKY_GAP_PX
  return Math.ceil(header + halfRem)
}

/** Prefer the live header height so scroll math matches the rendered sticky offset. */
export function resolveShowcaseStickyTopPx(scope: ParentNode = document): number {
  const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
  const halfRem = Number.isFinite(rootFontSize) ? Math.ceil(rootFontSize / 2) : SHOWCASE_STICKY_GAP_PX

  const header = document.querySelector('.dynamic-island-header')
  if (header) {
    const headerHeight = Math.ceil(header.getBoundingClientRect().height)
    if (headerHeight > 0) return headerHeight + halfRem
  }

  const pin = scope.querySelector('.scroll-showcase-pin')
  if (pin) {
    const topPx = Number.parseFloat(getComputedStyle(pin).top)
    if (Number.isFinite(topPx) && topPx > 0) return Math.ceil(topPx)
  }
  return getShowcaseStickyTopPx()
}

/** Document scroll Y that pins a showcase track at the given stage index. */
export function getShowcaseStageScrollY(
  trackEl: HTMLElement,
  stageIndex: number,
  stageHeightVh: number,
  stickyTopPx: number,
  stageScrollInsetPx = 0,
): number {
  const trackTop = trackEl.getBoundingClientRect().top + window.scrollY
  const stageHeight = (stageHeightVh / 100) * window.innerHeight
  return Math.max(0, trackTop + stageScrollInsetPx + stageIndex * stageHeight - stickyTopPx)
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
  const trackPinnedTop = getShowcaseStageScrollY(
    track,
    0,
    HERO_CAPABILITIES_STAGE_HEIGHT_VH,
    stickyTopPx,
  )

  // Never reach full track-pin — that scrolls the eyebrow out of frame.
  const maxEntryTop = trackPinnedTop - introToTrackPx

  return Math.max(0, Math.min(introAlignedTop, maxEntryTop))
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
  const stageHeight = (stageHeightVh / 100) * window.innerHeight
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
