/** Committed showcase stage — shared by keyboard and wheel steppers for rail/card sync. */

let committedIndex: number | null = null
let committedTrack: HTMLElement | null = null
const listeners = new Set<() => void>()

export function subscribeShowcaseCommittedStage(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getShowcaseCommittedStageForTrack(track: HTMLElement): number | null {
  if (committedTrack !== track) return null
  return committedIndex
}

export function commitShowcaseStage(stageIndex: number, track: HTMLElement): void {
  committedIndex = stageIndex
  committedTrack = track
  listeners.forEach((listener) => listener())
}

export function clearShowcaseCommittedStage(): void {
  if (committedIndex === null && committedTrack === null) return
  committedIndex = null
  committedTrack = null
  listeners.forEach((listener) => listener())
}

/** @internal Vitest-only */
export function resetShowcaseCommittedStageForTests(): void {
  clearShowcaseCommittedStage()
}
