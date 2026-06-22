import { resetElementReflectVars, setElementReflectVars } from './pointerReflectVars'

/** Percent-based cursor position for `.glass-pointer-track` (--ptr-lx / --ptr-ly). */

export function setPointerReflectVars(el: HTMLElement, clientX: number, clientY: number) {
  setElementReflectVars(el, clientX, clientY, 'ptr')
}

export function resetPointerReflectVars(el: HTMLElement) {
  resetElementReflectVars(el, 'ptr', { lx: '50%', ly: '50%' })
}
