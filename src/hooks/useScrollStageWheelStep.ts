import { useEffect, type RefObject } from 'react'

type Options = {
  stageCount: number
  stageHeightVh: number
  stickyTopPx: number
  reducedMotion: boolean
  enabled: boolean
}

const WHEEL_DELTA_THRESHOLD = 72
const STEP_COOLDOWN_MS = 720

function isTrackEngaged(rect: DOMRect, stickyTopPx: number) {
  return rect.top <= stickyTopPx + 12 && rect.bottom > stickyTopPx + 120
}

/**
 * One wheel gesture → one showcase stage while the track is pinned.
 * At the first/last stage, wheel exits and normal page scroll resumes.
 */
export function useScrollStageWheelStep(
  trackRef: RefObject<HTMLElement | null>,
  { stageCount, stageHeightVh, stickyTopPx, reducedMotion, enabled }: Options,
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

    const getStageMetrics = () => {
      const rect = track.getBoundingClientRect()
      const trackTop = window.scrollY + rect.top
      const stageHeight = (stageHeightVh / 100) * window.innerHeight
      const scrolled = window.scrollY - trackTop + stickyTopPx
      const raw = scrolled / Math.max(stageHeight, 1)
      const clamped = Math.min(stageCount - 1, Math.max(0, raw))
      const activeIndex = Math.floor(clamped)
      return { rect, trackTop, stageHeight, activeIndex }
    }

    const resolveCommittedIndex = () => {
      if (committedIndex !== null) return committedIndex
      committedIndex = getStageMetrics().activeIndex
      return committedIndex
    }

    const scrollToStage = (index: number, trackTop: number, stageHeight: number) => {
      const targetY = trackTop + index * stageHeight - stickyTopPx
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? 'auto' : 'smooth',
      })
    }

    const onWheel = (event: WheelEvent) => {
      const { rect, trackTop, stageHeight } = getStageMetrics()
      if (!isTrackEngaged(rect, stickyTopPx)) {
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
      scrollToStage(nextIndex, trackTop, stageHeight)
    }

    const onScroll = () => {
      if (Date.now() < cooldownUntil) return
      const { rect } = getStageMetrics()
      if (!isTrackEngaged(rect, stickyTopPx)) {
        committedIndex = null
        return
      }
      committedIndex = getStageMetrics().activeIndex
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (resetTimer) window.clearTimeout(resetTimer)
    }
  }, [enabled, reducedMotion, stageCount, stageHeightVh, stickyTopPx, trackRef])
}
