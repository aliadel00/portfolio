import { useEffect, type RefObject } from 'react'
import {
  getScrollStageMetrics,
  getShowcaseStageScrollY,
  isShowcaseStageEngaged,
  resolveShowcaseStickyTopPx,
} from '../lib/showcaseScroll'

type Options = {
  stageCount: number
  stageHeightVh: number
  stageScrollInsetPx?: number
  reducedMotion: boolean
  enabled: boolean
}

const WHEEL_DELTA_THRESHOLD = 72
const STEP_COOLDOWN_MS = 720

/**
 * One wheel gesture → one showcase stage while the track is pinned.
 * At the first/last stage, wheel exits and normal page scroll resumes.
 */
export function useScrollStageWheelStep(
  trackRef: RefObject<HTMLElement | null>,
  { stageCount, stageHeightVh, stageScrollInsetPx = 0, reducedMotion, enabled }: Options,
) {
  useEffect(() => {
    if (!enabled || stageCount <= 1) return

    const track = trackRef.current
    if (!track) return

    let accumulated = 0
    let resetTimer: number | undefined
    let cooldownUntil = 0
    /** Discrete stage index — avoids mid-transition drift from smooth scroll */
    let committedIndex: number | null = null

    const getMetrics = () => {
      const stickyTopPx = resolveShowcaseStickyTopPx(track)
      const metrics = getScrollStageMetrics(
        track,
        stageCount,
        stageHeightVh,
        stickyTopPx,
        stageScrollInsetPx,
      )
      return { ...metrics, stickyTopPx }
    }

    const resolveCommittedIndex = () => {
      if (committedIndex !== null) return committedIndex
      committedIndex = getMetrics().activeIndex
      return committedIndex
    }

    const scrollToStage = (
      index: number,
      trackTop: number,
      stageHeight: number,
      stickyTopPx: number,
    ) => {
      const track = trackRef.current
      if (!track) return
      const targetY = getShowcaseStageScrollY(
        track,
        index,
        stageHeightVh,
        stickyTopPx,
        stageScrollInsetPx,
      )
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }

    const onWheel = (event: WheelEvent) => {
      const { trackRect, trackTop, stageHeight, stickyTopPx } = getMetrics()
      if (!isShowcaseStageEngaged(trackRect, stickyTopPx)) {
        accumulated = 0
        committedIndex = null
        return
      }

      const activeIndex = resolveCommittedIndex()
      const scrollingDown = event.deltaY > 0
      const scrollingUp = event.deltaY < 0
      const atFirst = activeIndex <= 0
      const atLast = activeIndex >= stageCount - 1

      if ((atFirst && scrollingUp) || (atLast && scrollingDown)) {
        accumulated = 0
        committedIndex = null
        return
      }

      event.preventDefault()

      if (Date.now() < cooldownUntil) return

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

      committedIndex = nextIndex
      cooldownUntil = Date.now() + STEP_COOLDOWN_MS
      scrollToStage(nextIndex, trackTop, stageHeight, stickyTopPx)
    }

    const onScroll = () => {
      if (Date.now() < cooldownUntil) return
      const { trackRect, stickyTopPx } = getMetrics()
      if (!isShowcaseStageEngaged(trackRect, stickyTopPx)) {
        committedIndex = null
        return
      }
      committedIndex = getMetrics().activeIndex
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [enabled, reducedMotion, stageCount, stageHeightVh, stageScrollInsetPx, trackRef])
}
