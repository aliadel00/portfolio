import type { KeyboardEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { handleRovingLinkKeyDown } from '../../src/hooks/useRovingNavLinks'

describe('handleRovingLinkKeyDown', () => {
  it('moves focus within the provided ref list', () => {
    const second = document.createElement('a')
    const focus = vi.spyOn(second, 'focus')
    const refs = { current: [document.createElement('a'), second] }
    const onIndexChange = vi.fn()

    handleRovingLinkKeyDown(refs, 2, onIndexChange, 0, {
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLAnchorElement>)

    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(focus).toHaveBeenCalled()
  })
})
