/** Soft pool highlight on `.glass-card-reflect` — `--gcr-lx` / `--gcr-ly`, `data-gcr-reflect` / `data-gcr-sweeping`. */

const SWEEP_MS = 1180
const SWEEP_LY_PCT = 44

/**
 * About-only: one left → right pass when the panel enters view.
 * Pointer handlers should no-op while `data-gcr-sweeping` is set.
 */
export function runAboutPanelSweep(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (el.hasAttribute('data-gcr-sweeping')) {
      resolve()
      return
    }

    el.setAttribute('data-gcr-sweeping', 'true')
    el.setAttribute('data-gcr-reflect', 'on')

    let start: number | null = null
    let raf = 0

    const finish = () => {
      el.removeAttribute('data-gcr-sweeping')
      resolve()
    }

    const step = (t: number) => {
      if (start === null) start = t
      const raw = Math.min(1, (t - start) / SWEEP_MS)
      const p = 1 - (1 - raw) ** 3
      el.style.setProperty('--gcr-lx', `${p * 100}%`)
      el.style.setProperty('--gcr-ly', `${SWEEP_LY_PCT}%`)
      if (raw < 1) {
        raf = requestAnimationFrame(step)
      } else {
        cancelAnimationFrame(raf)
        finish()
      }
    }

    raf = requestAnimationFrame(step)
  })
}

export function setGlassCardReflect(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100

  el.style.setProperty('--gcr-lx', `${clamp(x, 0, 100)}%`)
  el.style.setProperty('--gcr-ly', `${clamp(y, 0, 100)}%`)
}

export function resetGlassCardReflect(el: HTMLElement) {
  el.style.setProperty('--gcr-lx', '50%')
  el.style.setProperty('--gcr-ly', '35%')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
