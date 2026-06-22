import { useEffect, useState, type RefObject } from 'react'
import { getScrollStageMetrics, invalidateShowcaseStickyTopPx, resolveShowcaseStickyTopPx } from '../lib/showcaseScroll'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

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

  useEffect(() => {
    if (disabled) return

    const track = trackRef.current
    if (!track) return

    let raf = 0

    const tick = () => {
      const stickyTopPx = resolveShowcaseStickyTopPx(track)
      const { activeIndex, progress } = getScrollStageMetrics(
        track,
        stageCount,
        stageHeightVh,
        stickyTopPx,
        stageScrollInsetPx,
      )

      setState((prev) => {
        if (prev.activeIndex === activeIndex && Math.abs(prev.progress - progress) < 0.006) return prev
        return { activeIndex, progress }
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
  }, [disabled, stageCount, stageHeightVh, stageScrollInsetPx, trackRef])

  if (disabled) {
    return { activeIndex: 0, progress: 0, reducedMotion }
  }

  return { ...state, reducedMotion }
}
