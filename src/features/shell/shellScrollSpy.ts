import type { ShellFile } from './shellModel'

/** How far below the chrome the reading line sits. Matches the sidenav scroll inset. */
const READING_LINE_OFFSET_PX = 20

export type ShellTargetBox = {
  top: number
  bottom: number
}

export type ShellSpyOptions = {
  /**
   * Pixels the scrollport can still move downward.
   * Contact sits at the end of the page, so a lower link (GitHub) often cannot
   * reach the reading line. In that case a higher link looks nearer and would
   * steal the highlight.
   */
  scrollRoom?: number
}

/**
 * Picks the sidebar file whose target is nearest the reading line.
 * Same-row links (email/phone, LinkedIn/GitHub) share a top, so a tie keeps
 * the file the user already chose instead of falling back to the first link.
 * A chosen link that is still on screen and cannot scroll up to the reading
 * line stays selected.
 */
export function resolveShellFileFromViewport(
  files: readonly ShellFile[],
  rectForTarget: (targetId: string) => ShellTargetBox | null,
  viewTop: number,
  viewBottom: number,
  currentId: string,
  options?: ShellSpyOptions,
): ShellFile | null {
  const marker = viewTop + READING_LINE_OFFSET_PX
  let best: ShellFile | null = null
  let bestDist = Infinity

  for (const file of files) {
    const rect = rectForTarget(file.targetId)
    if (!rect) continue
    if (rect.bottom <= viewTop || rect.top >= viewBottom) continue
    const dist = Math.abs(rect.top - marker)
    const closer = dist + 1 < bestDist
    const tied = Math.abs(dist - bestDist) <= 1
    if (closer || (tied && file.id === currentId)) {
      best = file
      bestDist = dist
    }
  }

  if (!best || best.id === currentId) return best

  const current = files.find((file) => file.id === currentId)
  const currentRect = current ? rectForTarget(current.targetId) : null
  const bestRect = rectForTarget(best.targetId)
  if (!current || !currentRect || !bestRect) return best

  const currentVisible = currentRect.bottom > viewTop && currentRect.top < viewBottom
  const gapToMarker = currentRect.top - marker
  const scrollRoom = options?.scrollRoom ?? Number.POSITIVE_INFINITY
  const cannotReachMarker = gapToMarker > scrollRoom + 1
  const proposedIsHigher = bestRect.top + 1 < currentRect.top
  if (currentVisible && cannotReachMarker && proposedIsHigher) return current

  return best
}
