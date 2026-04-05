/** Pointer position for About panel soft highlight (--about-lx / --about-ly). */

const SWEEP_MS = 1180
const SWEEP_LY_PCT = 44

/**
 * One left → right highlight pass when the panel enters view (navigation / scroll).
 * Blocks pointer-driven updates while `data-about-sweeping` is set.
 */
export function runAboutPanelSweep(el: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    if (el.hasAttribute('data-about-sweeping')) {
      resolve()
      return
    }

    el.setAttribute('data-about-sweeping', 'true')
    el.setAttribute('data-about-reflect', 'on')

    let start: number | null = null
    let raf = 0

    const finish = () => {
      el.removeAttribute('data-about-sweeping')
      // Keep data-about-reflect and final --about-lx / --about-ly so the glow stays on the right.
      resolve()
    }

    const step = (t: number) => {
      if (start === null) start = t
      const raw = Math.min(1, (t - start) / SWEEP_MS)
      const p = 1 - (1 - raw) ** 3
      el.style.setProperty('--about-lx', `${p * 100}%`)
      el.style.setProperty('--about-ly', `${SWEEP_LY_PCT}%`)
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

export function setAboutPanelReflect(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100

  el.style.setProperty('--about-lx', `${clamp(x, 0, 100)}%`)
  el.style.setProperty('--about-ly', `${clamp(y, 0, 100)}%`)
}

export function resetAboutPanelReflect(el: HTMLElement) {
  el.style.setProperty('--about-lx', '50%')
  el.style.setProperty('--about-ly', '35%')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
