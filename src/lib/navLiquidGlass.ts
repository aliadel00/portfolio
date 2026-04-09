/** Pointer-driven CSS vars for liquid-glass specular + chromatic layers (navbar). */

export function setNavLinkLiquid(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100
  const nx = (clientX - r.left) / w - 0.5
  const ny = (clientY - r.top) / h - 0.5
  const deg = Math.atan2(ny, nx) * (180 / Math.PI)
  el.style.setProperty('--nav-lx', `${clamp(x, 0, 100)}%`)
  el.style.setProperty('--nav-ly', `${clamp(y, 0, 100)}%`)
  el.style.setProperty('--nav-tx', `${deg}deg`)
}

export function resetNavLinkLiquid(el: HTMLElement) {
  el.style.setProperty('--nav-lx', '50%')
  el.style.setProperty('--nav-ly', '50%')
  el.style.setProperty('--nav-tx', '0deg')
}

export function setNavRailLiquid(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect()
  const w = Math.max(r.width, 1)
  const h = Math.max(r.height, 1)
  const x = ((clientX - r.left) / w) * 100
  const y = ((clientY - r.top) / h) * 100
  el.style.setProperty('--rail-lx', `${clamp(x, 0, 100)}%`)
  el.style.setProperty('--rail-ly', `${clamp(y, 0, 100)}%`)
}

export function resetNavRailLiquid(el: HTMLElement) {
  el.style.setProperty('--rail-lx', '50%')
  el.style.setProperty('--rail-ly', '50%')
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
