import { afterEach, describe, expect, it, vi } from 'vitest'
import { scheduleIdleWork } from '@/shared/lib/scheduleIdleWork'

describe('scheduleIdleWork', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('falls back to setTimeout when requestIdleCallback is unavailable', () => {
    vi.useFakeTimers()
    const callback = vi.fn()

    const cancel = scheduleIdleWork(callback)
    expect(callback).not.toHaveBeenCalled()

    vi.runAllTimers()
    expect(callback).toHaveBeenCalledOnce()

    cancel()
  })
})
