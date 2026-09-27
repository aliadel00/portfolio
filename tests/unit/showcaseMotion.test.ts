import { describe, expect, it } from 'vitest'
import { chipRevealStyle, getStackedSlideMotion } from '@/features/hero/lib/showcaseMotion'

describe('chipRevealStyle', () => {
  it('shows every chip when the card is settled', () => {
    expect(chipRevealStyle(0, 0).opacity).toBe(1)
    expect(chipRevealStyle(9, 0).opacity).toBe(1)
  })

  it('hides chips until the card has arrived', () => {
    expect(chipRevealStyle(0, 1).opacity).toBe(0)
  })

  it('keeps chips readable while the card leaves', () => {
    expect(chipRevealStyle(3, -0.4).opacity).toBe(1)
  })
})

describe('getStackedSlideMotion', () => {
  it('keeps the settled slide fully visible without blur', () => {
    const motion = getStackedSlideMotion(0, 0, 0)
    expect(motion.opacity).toBe(1)
    expect(motion.filter).toBe('none')
    expect(motion.pointerEvents).toBe('auto')
  })

  it('parks the next slide offstage until the exchange', () => {
    const motion = getStackedSlideMotion(1, 0, 0)
    expect(motion.opacity).toBe(0)
    expect(motion.pointerEvents).toBe('none')
  })

  it('crossfades the current and next slides at mid-stage', () => {
    const leaving = getStackedSlideMotion(0, 0, 0.5)
    const arriving = getStackedSlideMotion(1, 0, 0.5)
    expect(leaving.opacity).toBeCloseTo(0.5, 5)
    expect(arriving.opacity).toBeCloseTo(0.5, 5)
    expect(arriving.zIndex).toBeGreaterThan(leaving.zIndex)
  })
})
