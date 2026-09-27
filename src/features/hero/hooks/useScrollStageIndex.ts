import { useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from 'react'
import {
  getShowcaseCommittedStageForTrack,
  invalidateShowcaseStickyTopPx,
  resolveShowcaseDisplayStage,
  subscribeShowcaseCommittedStage,
  type ShowcaseStageScrollOptions,
} from '@/features/hero/lib/showcaseScroll'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { subscribePageScroll } from '@/shared/lib/pageScroll'

type Options = {
  stageCount: number
  /** Viewport heights consumed per stage while pinned */
  stageHeightVh?: number
  /** Scroll budget consumed before stage 0 (label outside track, etc.) */
  stageScrollInsetPx?: number
  resolveDisplayStage?: (
    track: HTMLElement,
    options: ShowcaseStageScrollOptions,
  ) => { activeIndex: number; progress: number }
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
  { stageCount, stageHeightVh = 78, stageScrollInsetPx = 0, resolveDisplayStage }: Options,
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

    const resolveStage = (el: HTMLElement) =>
      resolveDisplayStage?.(el, scrollOptions) ?? resolveShowcaseDisplayStage(el, scrollOptions)

    const tick = () => {
      const next = resolveStage(track)
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
    const unsubscribeScroll = subscribePageScroll(onScroll)
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
      unsubscribeScroll()
      window.removeEventListener('resize', onScroll)
      headerObserver?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [disabled, scrollOptions, resolveDisplayStage, trackRef])

  if (disabled) {
    return { activeIndex: 0, progress: 0, reducedMotion }
  }

  if (committedStage !== null) {
    return { activeIndex: committedStage, progress: 0, reducedMotion }
  }

  return { ...state, reducedMotion }
}
