import type { StoredTheme } from '@/features/theme/themeStorage'

/** Max wait before mounting the Three.js beams chunk after first paint (ms). */
export const HERO_BEAMS_IDLE_TIMEOUT_MS = 2400

/** How hero pillars catch light. Minimal themes keep the sapphire sweep. */
export type BeamReflectMode = 'sapphire' | 'glass' | 'copper'

export function shouldSkipHeroBeams(reducedMotion: boolean): boolean {
  return reducedMotion
}

export function beamReflectMode(theme: StoredTheme): BeamReflectMode {
  if (theme === 'caustica') return 'glass'
  if (theme === 'copper') return 'copper'
  return 'sapphire'
}

/** Shader branch: 0 sapphire, 1 glass, 2 copper. */
export function beamReflectShaderMode(mode: BeamReflectMode): number {
  if (mode === 'glass') return 1
  if (mode === 'copper') return 2
  return 0
}

export function beamReflectSurface(mode: BeamReflectMode): { roughness: number; metalness: number } {
  if (mode === 'glass') return { roughness: 0.05, metalness: 0 }
  if (mode === 'copper') return { roughness: 0.14, metalness: 1 }
  return { roughness: 0.42, metalness: 0.18 }
}
