import { describe, expect, it } from 'vitest'
import { chipRevealDelay, getStackedSlideMotion } from '../../src/lib/showcaseMotion'

describe('chipRevealDelay', () => {
  it('shows all chips when resting on an active stage', () => {
    expect(chipRevealDelay(0, 0, true)).toBe(1)
    expect(chipRevealDelay(9, 0, true)).toBe(1)
  })

  it('dims chips on inactive slides', () => {
    expect(chipRevealDelay(0, 0, false)).toBe(0.35)
  })
})

describe('getStackedSlideMotion', () => {
  it('keeps the active slide visible', () => {
    const motion = getStackedSlideMotion(0, 0, 0)
    expect(motion.opacity).toBe(1)
  })
})
