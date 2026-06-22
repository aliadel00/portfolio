import { describe, expect, it } from 'vitest'
import {
  chipRailDragOffset,
  chipRailMaxOffset,
  chipRailNextOffset,
  chipRailPrevOffset,
  chipRailSnapToNearest,
  chipRailSwipeTargetOffset,
} from '../../src/lib/chipRailMotion'

describe('chipRailMotion', () => {
  const offsets = [0, 72, 148, 220]

  it('computes max offset from list and viewport width', () => {
    expect(chipRailMaxOffset(320, 280)).toBe(40)
    expect(chipRailMaxOffset(280, 280)).toBe(0)
  })

  it('steps forward to the next chip offset', () => {
    expect(chipRailNextOffset(0, offsets, 120)).toBe(72)
    expect(chipRailNextOffset(72, offsets, 120)).toBe(120)
  })

  it('steps backward to the previous chip offset', () => {
    expect(chipRailPrevOffset(120, offsets)).toBe(72)
    expect(chipRailPrevOffset(72, offsets)).toBe(0)
  })

  it('snaps to the nearest chip offset', () => {
    expect(chipRailSnapToNearest(80, offsets, 120)).toBe(72)
    expect(chipRailSnapToNearest(115, offsets, 120)).toBe(120)
  })

  it('follows drag position while clamped', () => {
    expect(chipRailDragOffset(72, 20, 120)).toBe(52)
    expect(chipRailDragOffset(0, -40, 120)).toBe(40)
    expect(chipRailDragOffset(120, 80, 120)).toBe(40)
  })

  it('uses swipe threshold to advance or snap', () => {
    expect(chipRailSwipeTargetOffset(0, -60, offsets, 120)).toBe(72)
    expect(chipRailSwipeTargetOffset(72, 60, offsets, 120)).toBe(0)
    expect(chipRailSwipeTargetOffset(0, -20, offsets, 120)).toBe(0)
  })
})
