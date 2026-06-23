import { useEffect } from 'react'

const ATTR = 'data-render-quality'
const LITE = 'lite'
const FULL = 'full'
const RESIZE_DEBOUNCE_MS = 700

/**
 * Adaptive rendering quality:
 * - Measures frame pacing with rAF.
 * - Switches to "lite" mode when frame-time is unstable.
 * - Keeps full visual quality on capable devices.
 */
export function useRenderQuality() {
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute(ATTR, FULL)

    let raf = 0
    let running = false
    let resizeTimer: number | undefined

    const sample = (sampleCount = 120) =>
      new Promise<{ droppedRatio: number; avgDelta: number }>((resolve) => {
        let count = 0
        let drops = 0
        let sum = 0
        let last = performance.now()

        const step = (now: number) => {
          const dt = now - last
          last = now
          count += 1
          sum += dt
          if (dt > 22) drops += 1

          if (count >= sampleCount) {
            resolve({ droppedRatio: drops / count, avgDelta: sum / count })
            return
          }
          raf = requestAnimationFrame(step)
        }

        raf = requestAnimationFrame(step)
      })

    const runProbe = async (waitForHeroIntro = false) => {
      if (running) return
      running = true
      // Wait for hero shader intro (~3.2s) on first probe only.
      if (waitForHeroIntro) {
        await new Promise((resolve) => window.setTimeout(resolve, 3800))
      }
      const { droppedRatio, avgDelta } = await sample()
      const shouldUseLite = droppedRatio > 0.22 || avgDelta > 18.5
      root.setAttribute(ATTR, shouldUseLite ? LITE : FULL)
      running = false
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') void runProbe(false)
    }

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => void runProbe(false), RESIZE_DEBOUNCE_MS)
    }

    void runProbe(true)
    window.addEventListener('resize', onResize, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      root.removeAttribute(ATTR)
    }
  }, [])
}
