import { describe, expect, it } from 'vitest'
import {
  getHeroCapabilitiesEntryScrollY,
  getScrollStageMetrics,
  getShowcaseStageScrollY,
  HERO_CAPABILITIES_ENTRY_GAP_PX,
  resolveShowcaseStickyTopPx,
} from '../../src/lib/showcaseScroll'

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

  it('getShowcaseStageScrollY pins stage 0 when the track top reaches sticky top', () => {
    const track = document.createElement('div')
    document.body.append(track)

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    track.getBoundingClientRect = () =>
      ({
        top: 488,
        bottom: 1800,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 488,
        toJSON: () => ({}),
      }) as DOMRect

    const stickyTopPx = 88
    const targetY = getShowcaseStageScrollY(track, 0, 64, stickyTopPx)

    Object.defineProperty(window, 'scrollY', { value: targetY, configurable: true })
    const { activeIndex, progress } = getScrollStageMetrics(track, 4, 64, stickyTopPx)

    expect(targetY).toBe(400)
    expect(activeIndex).toBe(0)
    expect(progress).toBeCloseTo(0, 2)

    track.remove()
  })

  it('resolveShowcaseStickyTopPx prefers the live header height', () => {
    const section = document.createElement('section')
    const header = document.createElement('header')
    header.className = 'dynamic-island-header'
    const pin = document.createElement('div')
    pin.className = 'scroll-showcase-pin'
    section.append(pin)
    document.body.append(header, section)

    header.getBoundingClientRect = () =>
      ({ top: 0, bottom: 80, left: 0, right: 0, width: 0, height: 80, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect

    Object.defineProperty(document.documentElement, 'fontSize', {
      configurable: true,
      get: () => '16px',
    })
    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: (el: Element) =>
        el.classList.contains('scroll-showcase-pin')
          ? { top: '96px', fontSize: '16px', getPropertyValue: () => '' }
          : { fontSize: '16px', getPropertyValue: () => '' },
    })

    expect(resolveShowcaseStickyTopPx(section)).toBe(88)

    header.remove()
    section.remove()
  })

  it('resolveShowcaseStickyTopPx falls back to pinned stage top from CSS', () => {
    const section = document.createElement('section')
    const pin = document.createElement('div')
    pin.className = 'scroll-showcase-pin'
    section.append(pin)
    document.body.append(section)

    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: () => ({ top: '96px', fontSize: '16px', getPropertyValue: () => '' }),
    })

    expect(resolveShowcaseStickyTopPx(section)).toBe(96)

    section.remove()
  })

  it('getHeroCapabilitiesEntryScrollY stops before the full track-pin snap', () => {
    const section = document.createElement('section')
    const intro = document.createElement('div')
    intro.className = 'scroll-showcase-intro'
    const track = document.createElement('div')
    track.className = 'scroll-showcase-track'
    const pin = document.createElement('div')
    pin.className = 'scroll-showcase-pin'
    track.append(pin)
    section.append(intro, track)
    document.body.append(section)

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    intro.getBoundingClientRect = () =>
      ({ top: 900, bottom: 936, left: 0, right: 0, width: 0, height: 36, x: 0, y: 900, toJSON: () => ({}) }) as DOMRect
    track.getBoundingClientRect = () =>
      ({ top: 948, bottom: 2000, left: 0, right: 0, width: 0, height: 0, x: 0, y: 948, toJSON: () => ({}) }) as DOMRect

    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: (el: Element) =>
        el.classList.contains('scroll-showcase-pin')
          ? { top: '88px', getPropertyValue: () => '' }
          : { top: '0px', fontSize: '16px', getPropertyValue: () => '' },
    })

    const entryY = getHeroCapabilitiesEntryScrollY(section)
    const pinnedY = getShowcaseStageScrollY(track, 0, 64, 88)

    expect(entryY).toBe(812 - HERO_CAPABILITIES_ENTRY_GAP_PX)
    expect(pinnedY).toBe(860)
    expect(entryY).toBeLessThan(pinnedY)

    section.remove()
  })
})
