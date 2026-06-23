import { useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from 'react'
import {
  getShowcaseCommittedStageForTrack,
  invalidateShowcaseStickyTopPx,
  resolveShowcaseDisplayStage,
  subscribeShowcaseCommittedStage,
} from '@/features/hero/lib/showcaseScroll'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'

type Options = {
  stageCount: number
  /** Viewport heights consumed per stage while pinned */
  stageHeightVh?: number
  /** Scroll budget consumed before stage 0 (label outside track, etc.) */
  stageScrollInsetPx?: number
}

export type ScrollStageState = {
  activeIndex: number
  /** 0–1 progress within the current stage */
  progress: number
  reducedMotion: boolean
}

/**
 * Maps vertical scroll position inside a tall track to an active stage index + progress.
 */
export function useScrollStageIndex(
  trackRef: RefObject<HTMLElement | null>,
  { stageCount, stageHeightVh = 78, stageScrollInsetPx = 0 }: Options,
): ScrollStageState {
  const reducedMotion = usePrefersReducedMotion()
  const disabled = reducedMotion || stageCount <= 1
  const [state, setState] = useState({ activeIndex: 0, progress: 0 })

  const scrollOptions = useMemo(
    () => ({ stageCount, stageHeightVh, stageScrollInsetPx }),
    [stageCount, stageHeightVh, stageScrollInsetPx],
  )

  const committedStage = useSyncExternalStore(
    subscribeShowcaseCommittedStage,
    () => {
      const track = trackRef.current
      if (!track) return null
      return getShowcaseCommittedStageForTrack(track)
    },
    () => null,
  )

  useEffect(() => {
    if (disabled) return

    const track = trackRef.current
    if (!track) return

    let raf = 0

    const tick = () => {
      const next = resolveShowcaseDisplayStage(track, scrollOptions)
      setState((prev) => {
        if (prev.activeIndex === next.activeIndex && prev.progress === next.progress) return prev
        return next
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    const header = document.querySelector('.dynamic-island-header')
    let headerObserver: ResizeObserver | undefined
    if (header) {
      headerObserver = new ResizeObserver(() => {
        invalidateShowcaseStickyTopPx()
        onScroll()
      })
      headerObserver.observe(header)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      headerObserver?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [disabled, scrollOptions, trackRef])

  if (disabled) {
    return { activeIndex: 0, progress: 0, reducedMotion }
  }

  if (committedStage !== null) {
    return { activeIndex: committedStage, progress: 0, reducedMotion }
  }

  return { ...state, reducedMotion }
}
