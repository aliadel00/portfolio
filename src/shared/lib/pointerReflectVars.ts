function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function setElementReflectVars(
  el: HTMLElement,
  clientX: number,
  clientY: number,
  prefix: 'ptr' | 'gcr',
) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100

  el.style.setProperty(`--${prefix}-lx`, `${clamp(x, 0, 100)}%`)
  el.style.setProperty(`--${prefix}-ly`, `${clamp(y, 0, 100)}%`)
}

export function resetElementReflectVars(
  el: HTMLElement,
  prefix: 'ptr' | 'gcr',
  defaults: { lx: string; ly: string },
) {
  el.style.setProperty(`--${prefix}-lx`, defaults.lx)
  el.style.setProperty(`--${prefix}-ly`, defaults.ly)
}
