import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePendingNavSection } from '@/features/navigation/hooks/usePendingNavSection'

describe('usePendingNavSection', () => {
  it('shows the pending section until scroll spy confirms it', () => {
    const { result, rerender } = renderHook(
      ({ activeSection }: { activeSection: string | null }) => usePendingNavSection(activeSection),
      { initialProps: { activeSection: null as string | null } },
    )

    act(() => {
      result.current.commitPendingSection('contact')
    })

    expect(result.current.displayedActiveSection).toBe('contact')

    rerender({ activeSection: 'contact' })
    expect(result.current.displayedActiveSection).toBe('contact')
  })
})
