import { describe, expect, it } from 'vitest'
import { HERO_BEAMS_IDLE_TIMEOUT_MS, shouldSkipHeroBeams } from '@/features/hero/lib/heroBeams'

describe('heroBeams', () => {
  it('shouldSkipHeroBeams only when reduced motion is preferred', () => {
    expect(shouldSkipHeroBeams(true)).toBe(true)
    expect(shouldSkipHeroBeams(false)).toBe(false)
  })

  it('exports a bounded idle timeout for deferred beam mount', () => {
    expect(HERO_BEAMS_IDLE_TIMEOUT_MS).toBeGreaterThan(1000)
    expect(HERO_BEAMS_IDLE_TIMEOUT_MS).toBeLessThan(5000)
  })
})
