import type { KeyboardEvent } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { createRovingLinkKeyDown } from '../../src/hooks/useRovingNavLinks'

describe('createRovingLinkKeyDown', () => {
  it('moves focus within the provided ref list', () => {
    const second = document.createElement('a')
    const focus = vi.spyOn(second, 'focus')
    const refs = { current: [document.createElement('a'), second] }
    const onIndexChange = vi.fn()
    const onKeyDown = createRovingLinkKeyDown(refs, 2, onIndexChange)(0)

    onKeyDown({
      key: 'ArrowDown',
      preventDefault: vi.fn(),
    } as unknown as KeyboardEvent<HTMLAnchorElement>)

    expect(onIndexChange).toHaveBeenCalledWith(1)
    expect(focus).toHaveBeenCalled()
  })
})
