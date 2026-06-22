import { describe, expect, it } from 'vitest'
import { getScrollStageMetrics } from '../../src/lib/showcaseScroll'

describe('getScrollStageMetrics', () => {
  it('starts at stage 0 when the track top aligns with the sticky top', () => {
    const track = document.createElement('div')
    document.body.append(track)

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    track.getBoundingClientRect = () =>
      ({
        top: 88,
        bottom: 1800,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 88,
        toJSON: () => ({}),
      }) as DOMRect

    const { activeIndex, progress } = getScrollStageMetrics(track, 4, 64, 88)

    expect(activeIndex).toBe(0)
    expect(progress).toBeCloseTo(0, 2)

    track.remove()
  })

  it('advances stages as the track scrolls through the pin', () => {
    const track = document.createElement('div')
    document.body.append(track)

    Object.defineProperty(window, 'scrollY', { value: 900, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    track.getBoundingClientRect = () =>
      ({
        top: -424,
        bottom: 1400,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: -424,
        toJSON: () => ({}),
      }) as DOMRect

    const { activeIndex } = getScrollStageMetrics(track, 4, 64, 88)

    expect(activeIndex).toBe(1)

    track.remove()
  })
})
