export const APP_BOOT_LOADER_ID = 'app-boot-loader'

const EXIT_MS = 420

/** Fade out the static boot loader once React has painted — keep in DOM so LCP can hand off cleanly. */
export function dismissAppBootLoader() {
  const el = document.getElementById(APP_BOOT_LOADER_ID)
  if (!el) return

  el.setAttribute('aria-busy', 'false')

  const hide = () => {
    el.setAttribute('aria-hidden', 'true')
    el.style.display = 'none'
  }

  el.classList.add('app-boot-loader--exit')
  el.addEventListener('transitionend', hide, { once: true })
  window.setTimeout(hide, EXIT_MS)
}

/** Wait for the hero heading so LCP can register before the boot overlay fades. */
export function dismissAppBootLoaderAfterPaint() {
  const tryDismiss = (attempts = 0) => {
    const hero = document.getElementById('hero-heading')
    if (hero || attempts >= 120) {
      dismissAppBootLoader()
      return
    }
    requestAnimationFrame(() => tryDismiss(attempts + 1))
  }

  requestAnimationFrame(() => requestAnimationFrame(() => tryDismiss()))
}
