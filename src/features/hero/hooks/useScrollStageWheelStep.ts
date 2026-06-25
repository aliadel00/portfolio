import { useEffect, useMemo, type RefObject } from 'react'
import type { ShowcaseStageScrollOptions } from '@/features/hero/lib/showcaseScroll'
import {
  clearShowcaseCommittedStage,
  getNextShowcaseWheelStageIndex,
  getScrollStageMetrics,
  isShowcaseScrollLocked,
  isShowcaseStageEngaged,
  isShowcaseWheelBoundaryExit,
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

type EngagementSnapshot = {
  trackRect: DOMRect
  stickyTopPx: number
}

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
  const scrollOptions = useMemo<ShowcaseStageScrollOptions>(
    () => ({
      stageCount,
      stageHeightVh,
      stageScrollInsetPx,
      reducedMotion,
    }),
    [stageCount, stageHeightVh, stageScrollInsetPx, reducedMotion],
  )

  useEffect(() => {
    if (!enabled || stageCount <= 1) return

    const track = trackRef.current
    if (!track) return

    let accumulated = 0
    let resetTimer: number | undefined
    let cooldownUntil = 0
    let metricsAtScrollY: number | null = null
    let metricsSnapshot: EngagementSnapshot | null = null

    const invalidateMetrics = () => {
      metricsAtScrollY = null
      metricsSnapshot = null
    }

    const getEngagement = (): EngagementSnapshot => {
      const scrollY = window.scrollY
      if (metricsAtScrollY === scrollY && metricsSnapshot) return metricsSnapshot

      const stickyTopPx = resolveShowcaseStickyTopPx(track)
      const { trackRect } = getScrollStageMetrics(
        track,
        scrollOptions.stageCount,
        scrollOptions.stageHeightVh,
        stickyTopPx,
        scrollOptions.stageScrollInsetPx ?? 0,
      )
      metricsAtScrollY = scrollY
      metricsSnapshot = { trackRect, stickyTopPx }
      return metricsSnapshot
    }

    const onWheel = (event: WheelEvent) => {
      invalidateMetrics()
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
      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0
      if (direction === 0) return

      if (isShowcaseWheelBoundaryExit(activeIndex, direction, scrollOptions.stageCount)) {
        accumulated = 0
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

      const stepDirection = accumulated > 0 ? 1 : -1
      accumulated = 0
      if (resetTimer) window.clearTimeout(resetTimer)

      const nextIndex = getNextShowcaseWheelStageIndex(activeIndex, stepDirection, scrollOptions.stageCount)
      if (nextIndex === null || nextIndex === activeIndex) return

      cooldownUntil = Date.now() + STEP_COOLDOWN_MS
      scrollShowcaseToStage(track, nextIndex, scrollOptions)
    }

    const onScroll = () => {
      invalidateMetrics()
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
    scrollOptions,
    resolveActiveIndex,
    isEngaged,
    stageCount,
    trackRef,
  ])
}
