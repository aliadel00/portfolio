/** Portrait phones and short landscape viewports (e.g. mobile turned sideways). */
export const COMPACT_VIEWPORT_MEDIA = '(max-width: 639px), (max-height: 520px)'

export function subscribeCompactViewport(listener: () => void) {
  const mq = window.matchMedia(COMPACT_VIEWPORT_MEDIA)
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}

export function matchesCompactViewport() {
  return window.matchMedia(COMPACT_VIEWPORT_MEDIA).matches
}
