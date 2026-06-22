/** Soft pool highlight on `.glass-card-reflect` — `--gcr-lx` / `--gcr-ly`, `data-gcr-reflect` / `data-gcr-sweeping`. */

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
