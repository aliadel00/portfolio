import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  enterHeroCapabilitiesAtStage,
  getHeroCapabilitiesEntryScrollY,
  getHeroIntroClearedScrollY,
  getScrollStageMetrics,
  getShowcaseSnappedStageIndex,
  getShowcaseStageScrollY,
  handleHeroCapabilitiesArrowKey,
  HERO_CAPABILITIES_ENTRY_GAP_PX,
  invalidateShowcaseStickyTopPx,
  isHeroCapabilitiesNavActive,
  resetCapabilitiesArrowCommitForTests,
  resolveShowcaseStickyTopPx,
} from '@/features/hero/lib/showcaseScroll'

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
    const targetY = getShowcaseStageScrollY(track, 0, 4, 64, stickyTopPx)

    Object.defineProperty(window, 'scrollY', { value: targetY, configurable: true })
    const { activeIndex, progress } = getScrollStageMetrics(track, 4, 64, stickyTopPx)

    expect(targetY).toBe(400)
    expect(activeIndex).toBe(0)
    expect(progress).toBeCloseTo(0, 2)

    track.remove()
  })

  it('resolveShowcaseStickyTopPx prefers the pinned stage top from CSS', () => {
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

    invalidateShowcaseStickyTopPx()
    expect(resolveShowcaseStickyTopPx(section)).toBe(96)

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
    const pinnedY = getShowcaseStageScrollY(track, 0, 4, 64, 88)

    expect(entryY).toBe(812 - HERO_CAPABILITIES_ENTRY_GAP_PX)
    expect(pinnedY).toBe(860)
    expect(entryY).toBeLessThan(pinnedY)

    section.remove()
  })

  it('getHeroCapabilitiesEntryScrollY never stops short of the hero intro shell', () => {
    const heroIntro = document.createElement('div')
    heroIntro.id = 'hero-intro'
    const section = document.createElement('section')
    const intro = document.createElement('div')
    intro.className = 'scroll-showcase-intro'
    const track = document.createElement('div')
    track.className = 'scroll-showcase-track'
    section.append(intro, track)
    document.body.append(heroIntro, section)

    Object.defineProperty(window, 'scrollY', { value: 2400, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    heroIntro.getBoundingClientRect = () =>
      ({ top: -200, bottom: 12, left: 0, right: 0, width: 0, height: 212, x: 0, y: -200, toJSON: () => ({}) }) as DOMRect
    intro.getBoundingClientRect = () =>
      ({ top: 40, bottom: 76, left: 0, right: 0, width: 0, height: 36, x: 0, y: 40, toJSON: () => ({}) }) as DOMRect
    track.getBoundingClientRect = () =>
      ({ top: 88, bottom: 2000, left: 0, right: 0, width: 0, height: 0, x: 0, y: 88, toJSON: () => ({}) }) as DOMRect

    Object.defineProperty(window, 'getComputedStyle', {
      configurable: true,
      value: (el: Element) =>
        el.classList.contains('scroll-showcase-pin')
          ? { top: '88px', getPropertyValue: () => '' }
          : { top: '0px', fontSize: '16px', getPropertyValue: () => '' },
    })

    expect(getHeroIntroClearedScrollY()).toBe(2412)
    expect(getHeroCapabilitiesEntryScrollY(section)).toBeGreaterThanOrEqual(2412)

    heroIntro.remove()
    section.remove()
  })
})

function buildCapabilitiesSection({
  scrollY,
  introTop,
  trackTop,
  stageCount = 4,
}: {
  scrollY: number
  introTop: number
  trackTop: number
  stageCount?: number
}) {
  const section = document.createElement('section')
  section.id = 'hero-capabilities'
  const intro = document.createElement('div')
  intro.className = 'scroll-showcase-intro'
  const track = document.createElement('div')
  track.className = 'scroll-showcase-track'
  const pin = document.createElement('div')
  pin.className = 'scroll-showcase-pin'
  track.append(pin)
  const rail = document.createElement('ol')
  rail.className = 'scroll-showcase-rail__list'
  for (let i = 0; i < stageCount; i += 1) {
    const item = document.createElement('li')
    item.className = 'scroll-showcase-rail__item'
    rail.append(item)
  }
  section.append(intro, track, rail)
  document.body.append(section)
  invalidateShowcaseStickyTopPx()

  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

  intro.getBoundingClientRect = () =>
    ({
      top: introTop,
      bottom: introTop + 36,
      left: 0,
      right: 0,
      width: 0,
      height: 36,
      x: 0,
      y: introTop,
      toJSON: () => ({}),
    }) as DOMRect
  track.getBoundingClientRect = () =>
    ({
      top: trackTop,
      bottom: trackTop + 2000,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: trackTop,
      toJSON: () => ({}),
    }) as DOMRect

  Object.defineProperty(window, 'getComputedStyle', {
    configurable: true,
    value: (el: Element) =>
      el.classList.contains('scroll-showcase-pin')
        ? { top: '88px', getPropertyValue: () => '' }
        : { top: '0px', fontSize: '16px', getPropertyValue: () => '' },
  })

  return section
}

/** Pinned showcase with a known active stage index (sticky top = 88, stage height = 512px). */
function buildEngagedCapabilitiesSection(activeIndex: number, stageCount = 4) {
  const stickyTopPx = 88
  const stageHeight = (64 / 100) * 800
  const scrolled = activeIndex * stageHeight + 16
  const trackTop = 88 - activeIndex * stageHeight
  const scrollY = trackTop + scrolled - stickyTopPx
  return buildCapabilitiesSection({
    scrollY,
    introTop: trackTop - 48,
    trackTop,
    stageCount,
  })
}

describe('handleHeroCapabilitiesArrowKey', () => {
  beforeEach(() => {
    resetCapabilitiesArrowCommitForTests()
  })
  it('steps from entry to the first card on ArrowDown', () => {
    const section = buildCapabilitiesSection({ scrollY: 812, introTop: 88, trackTop: 136 })
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    expect(isHeroCapabilitiesNavActive(section)).toBe(true)
    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({ action: 'stepped' })
    expect(scrollTo).toHaveBeenCalledOnce()

    scrollTo.mockRestore()
    section.remove()
  })

  it('enterHeroCapabilitiesAtStage jumps to the requested card', async () => {
    const section = buildCapabilitiesSection({ scrollY: 0, introTop: 900, trackTop: 948 })
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    enterHeroCapabilitiesAtStage(section, 3)
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    })

    expect(scrollTo).toHaveBeenCalled()

    scrollTo.mockRestore()
    section.remove()
  })

  it('exits downward on the last card', () => {
    const section = buildEngagedCapabilitiesSection(3)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({
      action: 'exit-section',
      direction: 'down',
    })
    expect(scrollTo).not.toHaveBeenCalled()

    scrollTo.mockRestore()
    section.remove()
  })

  it('steps backward while engaged and exits upward on the first card', () => {
    const section = buildEngagedCapabilitiesSection(1)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowUp')).toEqual({ action: 'stepped' })
    expect(scrollTo).toHaveBeenCalledOnce()

    scrollTo.mockRestore()
    section.remove()

    const firstCard = buildEngagedCapabilitiesSection(0)
    const scrollToFirst = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    expect(handleHeroCapabilitiesArrowKey(firstCard, 'ArrowUp')).toEqual({
      action: 'exit-section',
      direction: 'up',
    })
    expect(scrollToFirst).not.toHaveBeenCalled()

    scrollToFirst.mockRestore()
    firstCard.remove()
  })

  it('steps through every card on repeated ArrowDown presses', () => {
    const section = buildEngagedCapabilitiesSection(0)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({ action: 'stepped' })
    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({ action: 'stepped' })
    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({ action: 'stepped' })
    expect(handleHeroCapabilitiesArrowKey(section, 'ArrowDown')).toEqual({
      action: 'exit-section',
      direction: 'down',
    })
    expect(scrollTo).toHaveBeenCalledTimes(3)

    scrollTo.mockRestore()
    section.remove()
  })

  it('getShowcaseStageScrollY advances evenly across all stages', () => {
    const track = document.createElement('div')
    track.className = 'scroll-showcase-track'
    Object.defineProperty(track, 'offsetHeight', { value: 2048, configurable: true })
    document.body.append(track)

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true })
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    track.getBoundingClientRect = () =>
      ({
        top: 1200,
        bottom: 3248,
        left: 0,
        right: 0,
        width: 0,
        height: 2048,
        x: 0,
        y: 1200,
        toJSON: () => ({}),
      }) as DOMRect

    const stickyTopPx = 88
    const stageCount = 4
    const ys = [0, 1, 2, 3].map((i) =>
      getShowcaseStageScrollY(track, i, stageCount, 64, stickyTopPx),
    )

    expect(ys[1] - ys[0]).toBe(512)
    expect(ys[2] - ys[1]).toBe(512)
    expect(ys[3] - ys[2]).toBe(512)

    track.remove()
  })

  it('getShowcaseSnappedStageIndex rounds mid-stage scroll to the nearest card', () => {
    const section = buildEngagedCapabilitiesSection(1)
    const track = section.querySelector<HTMLElement>('.scroll-showcase-track')!
    const stickyTopPx = 88

    Object.defineProperty(window, 'scrollY', { value: 900, configurable: true })
    track.getBoundingClientRect = () =>
      ({
        top: -424,
        bottom: 1576,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: -424,
        toJSON: () => ({}),
      }) as DOMRect

    const snap = getShowcaseSnappedStageIndex(track, 4, 64, stickyTopPx)
    expect(snap.index).toBe(1)
    expect(snap.aligned).toBe(true)

    section.remove()
  })
})
