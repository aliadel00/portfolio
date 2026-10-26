import { useEffect, type RefObject } from 'react'

export const ARCHIVED_REFRESH_PULL_PX = 80

export function frameScrollTop(frame: Window, parent: Window | null): number {
  const doc = frame.document
  const own = Math.max(frame.scrollY || 0, doc.documentElement?.scrollTop || 0, doc.body?.scrollTop || 0)
  if (!parent || parent === frame) return own
  const parentDoc = parent.document
  const parentTop = Math.max(
    parent.scrollY || 0,
    parentDoc.documentElement?.scrollTop || 0,
    parentDoc.body?.scrollTop || 0,
  )
  return Math.max(own, parentTop)
}

/** A downward pull that starts at the top of an archived version. */
export function shouldRefreshArchivedPull(
  scrollTop: number,
  startX: number,
  startY: number,
  x: number,
  y: number,
): boolean {
  if (scrollTop > 0) return false
  const dy = y - startY
  const dx = x - startX
  return dy >= ARCHIVED_REFRESH_PULL_PX && dy > Math.abs(dx)
}

export function bindArchivedPullToRefresh(frame: HTMLIFrameElement, reload: () => void): () => void {
  const win = frame.contentWindow
  const doc = frame.contentDocument
  if (!win || !doc) return () => {}

  let startX = 0
  let startY = 0
  let armed = false
  let refreshed = false

  const onStart = (event: TouchEvent) => {
    if (event.touches.length !== 1) {
      armed = false
      return
    }
    const touch = event.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    armed = frameScrollTop(win, win.top) <= 0
  }

  const onMove = (event: TouchEvent) => {
    if (!armed || refreshed || event.touches.length !== 1) return
    const touch = event.touches[0]
    if (!shouldRefreshArchivedPull(frameScrollTop(win, win.top), startX, startY, touch.clientX, touch.clientY)) {
      return
    }
    refreshed = true
    armed = false
    reload()
  }

  doc.addEventListener('touchstart', onStart, { passive: true })
  doc.addEventListener('touchmove', onMove, { passive: true })
  return () => {
    doc.removeEventListener('touchstart', onStart)
    doc.removeEventListener('touchmove', onMove)
  }
}

/** Archived shells scroll inside an iframe, which never receives the browser refresh gesture. */
export function useArchivedFrameRefresh(frameRef: RefObject<HTMLIFrameElement | null>, enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return
    const frame = frameRef.current
    if (!frame) return

    let detach = () => {}
    const bind = () => {
      detach()
      detach = bindArchivedPullToRefresh(frame, () => {
        window.location.reload()
      })
    }

    frame.addEventListener('load', bind)
    if (frame.contentDocument?.readyState === 'complete') bind()
    return () => {
      frame.removeEventListener('load', bind)
      detach()
    }
  }, [enabled, frameRef])
}
