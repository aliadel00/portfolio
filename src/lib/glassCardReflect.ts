import { resetElementReflectVars, setElementReflectVars } from './pointerReflectVars'

/** Soft pool highlight on `.glass-card-reflect` — `--gcr-lx` / `--gcr-ly`, `data-gcr-reflect` / `data-gcr-sweeping`. */

export function setGlassCardReflect(el: HTMLElement, clientX: number, clientY: number) {
  setElementReflectVars(el, clientX, clientY, 'gcr')
}

export function resetGlassCardReflect(el: HTMLElement) {
  resetElementReflectVars(el, 'gcr', { lx: '50%', ly: '35%' })
}
