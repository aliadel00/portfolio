/** Max wait before mounting the Three.js beams chunk after first paint (ms). */
export const HERO_BEAMS_IDLE_TIMEOUT_MS = 2400

export function shouldSkipHeroBeams(reducedMotion: boolean, compactViewport: boolean): boolean {
  return reducedMotion || compactViewport
}
