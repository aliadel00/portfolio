import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useMobileNavScrollLock } from '@/features/navigation/hooks/useMobileNavScrollLock'

describe('useMobileNavScrollLock', () => {
  afterEach(() => {
    document.body.style.cssText = ''
    vi.restoreAllMocks()
  })

  it('restores scroll position when the drawer closes', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240, writable: true })

    const { rerender } = renderHook(
      ({ isOpen }) => useMobileNavScrollLock(isOpen),
      { initialProps: { isOpen: true } },
    )

    expect(document.body.style.position).toBe('fixed')

    rerender({ isOpen: false })

    expect(scrollTo).toHaveBeenCalledWith({ top: 240, left: 0, behavior: 'auto' })
    expect(document.body.style.position).toBe('')
  })
})
