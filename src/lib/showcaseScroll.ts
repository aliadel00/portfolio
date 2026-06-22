const SHOWCASE_STICKY_GAP_PX = 8

export function getShowcaseStickyTopPx(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
  const parsed = Number.parseFloat(raw)
  const header = Number.isFinite(parsed) && parsed > 0 ? parsed : 72
  return Math.ceil(header + SHOWCASE_STICKY_GAP_PX)
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
