import { describe, expect, it } from 'vitest'
import {
  beamReflectMode,
  beamReflectShaderMode,
  beamReflectSurface,
  HERO_BEAMS_IDLE_TIMEOUT_MS,
  shouldSkipHeroBeams,
} from '@/features/hero/lib/heroBeams'

describe('heroBeams', () => {
  it('shouldSkipHeroBeams only when reduced motion is preferred', () => {
    expect(shouldSkipHeroBeams(true)).toBe(true)
    expect(shouldSkipHeroBeams(false)).toBe(false)
  })

  it('exports a bounded idle timeout for deferred beam mount', () => {
    expect(HERO_BEAMS_IDLE_TIMEOUT_MS).toBeGreaterThan(1000)
    expect(HERO_BEAMS_IDLE_TIMEOUT_MS).toBeLessThan(5000)
  })

  it('maps caustica pillars to glass and copper pillars to metal', () => {
    expect(beamReflectMode('caustica')).toBe('glass')
    expect(beamReflectMode('copper')).toBe('copper')
    expect(beamReflectMode('minimal-dark')).toBe('sapphire')
    expect(beamReflectMode('minimal-light')).toBe('sapphire')
    expect(beamReflectShaderMode('glass')).toBe(1)
    expect(beamReflectShaderMode('copper')).toBe(2)
    expect(beamReflectSurface('glass')).toEqual({ roughness: 0.05, metalness: 0 })
    expect(beamReflectSurface('copper').metalness).toBe(1)
  })
})
