import { describe, expect, it } from 'vitest'
import {
  ARCHIVED_REFRESH_PULL_PX,
  archivedPullProgress,
  shouldRefreshArchivedPull,
} from '@/features/shell/archivedFrameRefresh'

describe('archived pull-to-refresh', () => {
  it('tracks pull progress from the top of the archived page', () => {
    expect(archivedPullProgress(0, 40, 20, 48, 20 + ARCHIVED_REFRESH_PULL_PX / 2)).toBe(0.5)
    expect(shouldRefreshArchivedPull(0, 40, 20, 48, 20 + ARCHIVED_REFRESH_PULL_PX)).toBe(true)
  })

  it('ignores a pull once the archived page has scrolled', () => {
    expect(archivedPullProgress(12, 40, 20, 40, 20 + ARCHIVED_REFRESH_PULL_PX)).toBe(0)
    expect(shouldRefreshArchivedPull(12, 40, 20, 40, 20 + ARCHIVED_REFRESH_PULL_PX)).toBe(false)
  })

  it('ignores a short or sideways drag', () => {
    expect(shouldRefreshArchivedPull(0, 40, 20, 42, 20 + ARCHIVED_REFRESH_PULL_PX - 1)).toBe(false)
    expect(shouldRefreshArchivedPull(0, 40, 20, 40 + ARCHIVED_REFRESH_PULL_PX + 10, 40)).toBe(false)
  })
})
