const SCROLLPORT_SELECTOR = '.ide-editor'

/** The editor pane when it owns scrolling; otherwise the window. */
export function getScrollport(): HTMLElement | null {
  const el = document.querySelector(SCROLLPORT_SELECTOR)
  if (!(el instanceof HTMLElement)) return null
  const overflowY = getComputedStyle(el).overflowY
  if (overflowY !== 'auto' && overflowY !== 'scroll') return null
  return el
}

export function pageScrollY(): number {
  const port = getScrollport()
  return port ? port.scrollTop : window.scrollY
}

/** Top of `el` in the active scrollport's content coordinates. */
export function scrollportOffsetTop(el: HTMLElement): number {
  const port = getScrollport()
  if (!port) return el.getBoundingClientRect().top + window.scrollY
  return el.getBoundingClientRect().top - port.getBoundingClientRect().top + port.scrollTop
}

/** Bottom of `el` in the active scrollport's content coordinates. */
export function scrollportOffsetBottom(el: HTMLElement): number {
  const port = getScrollport()
  if (!port) return el.getBoundingClientRect().bottom + window.scrollY
  return el.getBoundingClientRect().bottom - port.getBoundingClientRect().top + port.scrollTop
}

export type PageScrollOptions = {
  /**
   * Smooth jumps from a click should stop as soon as the user scrolls.
   * Showcase wheel steps leave this off so a trackpad gesture cannot cancel its own animation.
   */
  releaseOnInput?: boolean
}

let navigationScrollActive = false
let releaseNavigationScroll = () => {}

/** True while a click-started smooth jump is still animating. */
export function isNavigationScrollActive(): boolean {
  return navigationScrollActive
}

function clearNavigationScroll(): void {
  navigationScrollActive = false
  releaseNavigationScroll()
  releaseNavigationScroll = () => {}
}

function armNavigationScrollRelease(): void {
  clearNavigationScroll()
  navigationScrollActive = true
  let userTookOver = false

  const releaseAfterEvent = () => {
    if (!navigationScrollActive || userTookOver) return
    userTookOver = true
    const top = pageScrollY()
    const port = getScrollport()
    // Stop the smooth animation before the browser applies this input.
    if (port) port.scrollTo({ top, left: 0, behavior: 'auto' })
    else window.scrollTo({ top, left: 0, behavior: 'auto' })
    // Keep the flag set through this event so the capabilities wheel stepper
    // does not preventDefault, then drop it after the native scroll applies.
    queueMicrotask(clearNavigationScroll)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'PageDown' ||
      event.key === 'PageUp' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === ' '
    ) {
      releaseAfterEvent()
    }
  }
  const onScrollEnd = () => {
    if (userTookOver) return
    clearNavigationScroll()
  }
  const port = getScrollport()
  const scrollEndTarget: HTMLElement | Window = port ?? window

  window.addEventListener('wheel', releaseAfterEvent, { capture: true, passive: true })
  window.addEventListener('touchmove', releaseAfterEvent, { capture: true, passive: true })
  window.addEventListener('keydown', onKeyDown, true)
  scrollEndTarget.addEventListener('scrollend', onScrollEnd)
  const timer = window.setTimeout(clearNavigationScroll, 2000)

  releaseNavigationScroll = () => {
    window.clearTimeout(timer)
    window.removeEventListener('wheel', releaseAfterEvent, true)
    window.removeEventListener('touchmove', releaseAfterEvent, true)
    window.removeEventListener('keydown', onKeyDown, true)
    scrollEndTarget.removeEventListener('scrollend', onScrollEnd)
  }
}

export function scrollPageTo(top: number, behavior: ScrollBehavior, options?: PageScrollOptions): void {
  const releaseOnInput = options?.releaseOnInput === true && behavior === 'smooth'
  if (!releaseOnInput) clearNavigationScroll()

  const port = getScrollport()
  if (!port) window.scrollTo({ top, left: 0, behavior })
  else port.scrollTo({ top, left: 0, behavior })

  if (releaseOnInput) armNavigationScrollRelease()
}

/** Drops a pending navigation-scroll release. Test-only. */
export function resetPageScrollForTests(): void {
  clearNavigationScroll()
}

export function subscribePageScroll(listener: () => void): () => void {
  const port = getScrollport()
  const target: HTMLElement | Window = port ?? window
  target.addEventListener('scroll', listener, { passive: true })
  return () => target.removeEventListener('scroll', listener)
}
