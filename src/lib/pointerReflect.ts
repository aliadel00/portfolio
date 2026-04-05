/** Percent-based cursor position for `.glass-pointer-track` (--ptr-lx / --ptr-ly). */

export function setPointerReflectVars(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100

  el.style.setProperty('--ptr-lx', `${clamp(x, 0, 100)}%`)
  el.style.setProperty('--ptr-ly', `${clamp(y, 0, 100)}%`)
}

export function resetPointerReflectVars(el: HTMLElement) {
  el.style.setProperty('--ptr-lx', '50%')
  el.style.setProperty('--ptr-ly', '50%')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
