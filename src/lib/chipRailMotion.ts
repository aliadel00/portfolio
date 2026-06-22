export function chipRailMaxOffset(listWidth: number, viewportWidth: number): number {
  return Math.max(0, listWidth - viewportWidth)
}

export function chipRailClampOffset(offset: number, maxOffset: number): number {
  return Math.min(maxOffset, Math.max(0, offset))
}

export function chipRailOffsets(children: HTMLElement[]): number[] {
  return children.map((child) => child.offsetLeft)
}

export function chipRailNextOffset(currentOffset: number, chipOffsets: number[], maxOffset: number): number {
  const next = chipOffsets.find((offset) => offset > currentOffset + 4)
  return Math.min(maxOffset, next ?? maxOffset)
}

export function chipRailPrevOffset(currentOffset: number, chipOffsets: number[]): number {
  const previous = chipOffsets.filter((offset) => offset < currentOffset - 4)
  return previous.length ? previous[previous.length - 1] : 0
}

export function chipRailSnapToNearest(offset: number, chipOffsets: number[], maxOffset: number): number {
  const clamped = chipRailClampOffset(offset, maxOffset)
  if (chipOffsets.length === 0) return clamped

  let nearest = chipOffsets[0]
  let nearestDistance = Math.abs(clamped - nearest)

  for (const chipOffset of chipOffsets) {
    const distance = Math.abs(clamped - chipOffset)
    if (distance < nearestDistance) {
      nearest = chipOffset
      nearestDistance = distance
    }
  }

  const maxDistance = Math.abs(clamped - maxOffset)
  return maxDistance < nearestDistance ? maxOffset : nearest
}

export const CHIP_RAIL_SWIPE_THRESHOLD_PX = 48
export const CHIP_RAIL_DRAG_ACTIVATION_PX = 8

export function chipRailSwipeTargetOffset(
  startOffset: number,
  deltaX: number,
  chipOffsets: number[],
  maxOffset: number,
): number {
  if (Math.abs(deltaX) >= CHIP_RAIL_SWIPE_THRESHOLD_PX) {
    if (deltaX < 0) return chipRailNextOffset(startOffset, chipOffsets, maxOffset)
    return chipRailPrevOffset(startOffset, chipOffsets)
  }

  return chipRailSnapToNearest(startOffset - deltaX, chipOffsets, maxOffset)
}

export function chipRailDragOffset(startOffset: number, deltaX: number, maxOffset: number): number {
  return chipRailClampOffset(startOffset - deltaX, maxOffset)
}
