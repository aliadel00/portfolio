import { useEffect, type RefObject } from 'react'
import {
  clearShowcaseCommittedStage,
  getScrollStageMetrics,
  isShowcaseScrollLocked,
  isShowcaseStageEngaged,
  resolveShowcaseActiveIndex,
  resolveShowcaseStickyTopPx,
  scrollShowcaseToStage,
} from '@/features/hero/lib/showcaseScroll'

type Options = {
  stageCount: number
  stageHeightVh: number
  stageScrollInsetPx?: number
  reducedMotion: boolean
  enabled: boolean
  resolveActiveIndex?: (track: HTMLElement) => number
  isEngaged?: (track: HTMLElement) => boolean
}

const WHEEL_DELTA_THRESHOLD = 72
const STEP_COOLDOWN_MS = 640

/**
 * One wheel gesture → one showcase stage while the track is pinned.
 * At the first/last stage, wheel exits and normal page scroll resumes.
 */
export function useScrollStageWheelStep(
  trackRef: RefObject<HTMLElement | null>,
  {
    stageCount,
    stageHeightVh,
    stageScrollInsetPx = 0,
    reducedMotion,
    enabled,
    resolveActiveIndex,
    isEngaged,
  }: Options,
) {
  useEffect(() => {
    if (!enabled || stageCount <= 1) return

    const track = trackRef.current
    if (!track) return

    let accumulated = 0
    let resetTimer: number | undefined
    let cooldownUntil = 0

    const scrollOptions = {
      stageCount,
      stageHeightVh,
      stageScrollInsetPx,
      reducedMotion,
    }

    const getEngagement = () => {
      const stickyTopPx = resolveShowcaseStickyTopPx(track)
      const { trackRect } = getScrollStageMetrics(
        track,
        stageCount,
        stageHeightVh,
        stickyTopPx,
        stageScrollInsetPx,
      )
      return { trackRect, stickyTopPx }
    }

    const onWheel = (event: WheelEvent) => {
      const { trackRect, stickyTopPx } = getEngagement()
      const engaged =
        isEngaged?.(track) ?? isShowcaseStageEngaged(trackRect, stickyTopPx)
      if (!engaged) {
        accumulated = 0
        clearShowcaseCommittedStage()
        return
      }

      const activeIndex =
        resolveActiveIndex?.(track) ?? resolveShowcaseActiveIndex(track, scrollOptions)
      const scrollingDown = event.deltaY > 0
      const scrollingUp = event.deltaY < 0
      const atFirst = activeIndex <= 0
      const atLast = activeIndex >= stageCount - 1

      if ((atFirst && scrollingUp) || (atLast && scrollingDown)) {
        accumulated = 0
        clearShowcaseCommittedStage()
        return
      }

      event.preventDefault()

      if (isShowcaseScrollLocked() || Date.now() < cooldownUntil) return

      accumulated += event.deltaY
      if (resetTimer) window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => {
        accumulated = 0
      }, 140)

      if (Math.abs(accumulated) < WHEEL_DELTA_THRESHOLD) return

      const direction = accumulated > 0 ? 1 : -1
      accumulated = 0
      if (resetTimer) window.clearTimeout(resetTimer)

      const nextIndex = Math.min(stageCount - 1, Math.max(0, activeIndex + direction))
      if (nextIndex === activeIndex) return

      cooldownUntil = Date.now() + STEP_COOLDOWN_MS
      scrollShowcaseToStage(track, nextIndex, scrollOptions)
    }

    const onScroll = () => {
      const { trackRect, stickyTopPx } = getEngagement()
      const engaged =
        isEngaged?.(track) ?? isShowcaseStageEngaged(trackRect, stickyTopPx)
      if (!engaged) {
        clearShowcaseCommittedStage()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [
    enabled,
    reducedMotion,
    resolveActiveIndex,
    isEngaged,
    stageCount,
    stageHeightVh,
    stageScrollInsetPx,
    trackRef,
  ])
}
