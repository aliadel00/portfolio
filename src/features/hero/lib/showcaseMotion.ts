export type ShowcaseSlideMotion = {
  opacity: number
  transform: string
  zIndex: number
  pointerEvents: 'auto' | 'none'
  filter: string
}

export type ChipRevealStyle = {
  opacity: number
  transform: string
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

/** Holds at the start and end of a stage, then exchanges in the middle. */
function holdEase(value: number) {
  const t = clamp01(value)
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function slideDelta(index: number, activeIndex: number, progress: number) {
  return index - (activeIndex + progress)
}

/** Stacked-card motion for the capabilities scroll. Tracks scroll 1:1 (no blur). */
export function getStackedSlideMotion(
  index: number,
  activeIndex: number,
  progress: number,
): ShowcaseSlideMotion {
  const delta = slideDelta(index, activeIndex, progress)

  if (delta <= -1 || delta >= 1) {
    return {
      opacity: 0,
      transform: `translate3d(0, ${delta > 0 ? 18 : -12}%, 0) scale(0.94)`,
      zIndex: 0,
      pointerEvents: 'none',
      filter: 'none',
    }
  }

  if (delta < 0) {
    const t = holdEase(-delta)
    return {
      opacity: 1 - t,
      transform: `translate3d(0, ${(-16 * t).toFixed(2)}%, 0) scale(${(1 - 0.06 * t).toFixed(3)})`,
      zIndex: 12,
      pointerEvents: 'none',
      filter: 'none',
    }
  }

  if (delta > 0) {
    const t = holdEase(delta)
    return {
      opacity: 1 - t,
      transform: `translate3d(0, ${(22 * t).toFixed(2)}%, 0) scale(${(1 - 0.07 * t).toFixed(3)})`,
      zIndex: 24,
      pointerEvents: 'none',
      filter: 'none',
    }
  }

  return {
    opacity: 1,
    transform: 'translate3d(0, 0, 0) scale(1)',
    zIndex: 30,
    pointerEvents: 'auto',
    filter: 'none',
  }
}

/**
 * Chips rise in as their card arrives, and stay readable while it leaves.
 * `delta` is the card's distance from the scroll position (0 = settled).
 */
export function chipRevealStyle(chipIndex: number, delta: number): ChipRevealStyle {
  if (delta < 0) return { opacity: 1, transform: 'none' }

  const arrive = 1 - holdEase(delta)
  const stagger = chipIndex * 0.045
  const opacity = clamp01((arrive - stagger) / (1 - stagger))
  if (opacity >= 1) return { opacity: 1, transform: 'none' }

  return {
    opacity,
    transform: `translate3d(0, ${((1 - opacity) * 0.4).toFixed(3)}rem, 0)`,
  }
}
