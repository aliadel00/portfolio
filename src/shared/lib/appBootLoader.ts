export const APP_BOOT_LOADER_ID = 'app-boot-loader'

const EXIT_MS = 420

/** Fade out and remove the static boot loader once React has painted. */
export function dismissAppBootLoader() {
  const el = document.getElementById(APP_BOOT_LOADER_ID)
  if (!el) return

  el.setAttribute('aria-busy', 'false')

  const remove = () => {
    el.remove()
  }

  el.classList.add('app-boot-loader--exit')
  el.addEventListener('transitionend', remove, { once: true })
  window.setTimeout(remove, EXIT_MS)
}

/** Wait for the next frame(s) so the hero shell is on screen before hiding the boot loader. */
export function dismissAppBootLoaderAfterPaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dismissAppBootLoader()
    })
  })
}
