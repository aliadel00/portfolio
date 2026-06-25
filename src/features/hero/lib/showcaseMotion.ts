export type ShowcaseSlideMotion = {
  opacity: number
  transform: string
  zIndex: number
  pointerEvents: 'auto' | 'none'
  filter: string
}

/** Stacked-card motion for vertical scroll stages (skills). */
export function getStackedSlideMotion(
  index: number,
  activeIndex: number,
  progress: number,
): ShowcaseSlideMotion {
  const virtual = activeIndex + progress
  const delta = index - virtual

  if (delta < -0.02) {
    const t = Math.min(1, -delta)
    return {
      opacity: Math.max(0, 1 - t * 1.15),
      transform: `translate3d(0, ${-14 * t}%, 0) scale(${1 - t * 0.05})`,
      zIndex: 20 - index,
      pointerEvents: 'none',
      filter: `blur(${t * 4}px)`,
    }
  }

  if (delta > 0.02) {
    const t = Math.min(1, delta)
    const opacity = Math.max(0, 0.35 - t * 0.35)
    return {
      opacity,
      transform: `translate3d(0, ${22 * t}%, 0) scale(${0.94 - t * 0.04})`,
      zIndex: 20 - index,
      pointerEvents: 'none',
      filter: opacity > 0 ? `blur(${t * 3}px)` : 'none',
    }
  }

  return {
    opacity: 1,
    transform: 'translate3d(0, 0, 0) scale(1)',
    zIndex: 30,
    pointerEvents: 'auto',
    filter: 'blur(0)',
  }
}

/** Per-slide chip stagger when its panel is active (0–1). */
export function chipRevealDelay(chipIndex: number, stageProgress: number, isActive: boolean): number {
  if (!isActive) return 0.35
  // Resting on a stage — show every chip (progress 0 was hiding them all)
  if (stageProgress <= 0.06 || stageProgress >= 0.94) return 1
  const gate = Math.min(1, stageProgress * 2.2 + 0.55)
  const stagger = chipIndex * 0.045
  return Math.max(0.35, Math.min(1, gate - stagger))
}
