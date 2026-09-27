import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  isNavigationScrollActive,
  resetPageScrollForTests,
  scrollPageTo,
} from '@/shared/lib/pageScroll'

describe('pageScroll', () => {
  afterEach(() => {
    resetPageScrollForTests()
    vi.restoreAllMocks()
  })

  it('releases a smooth navigation jump when the user wheels', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollPageTo(400, 'smooth', { releaseOnInput: true })

    expect(isNavigationScrollActive()).toBe(true)
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ top: 400, behavior: 'smooth' }))

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 80, bubbles: true }))

    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }))
    await Promise.resolve()
    expect(isNavigationScrollActive()).toBe(false)
  })

  it('leaves showcase scrolls locked to the gesture that started them', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollPageTo(400, 'smooth')
    expect(isNavigationScrollActive()).toBe(false)
  })
})
