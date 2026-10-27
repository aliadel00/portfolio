import { useEffect, useState, type RefObject } from 'react'

export const ARCHIVED_REFRESH_PULL_PX = 80

export type ArchivedPullProgress = {
  /** 0–1 while dragging; 1 while reloading. */
  progress: number
  refreshing: boolean
}

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

export function archivedPullProgress(scrollTop: number, startX: number, startY: number, x: number, y: number): number {
  if (scrollTop > 0) return 0
  const dy = y - startY
  const dx = x - startX
  if (dy <= 0 || dy <= Math.abs(dx)) return 0
  return Math.min(1, dy / ARCHIVED_REFRESH_PULL_PX)
}

/** A downward pull that starts at the top of an archived version. */
export function shouldRefreshArchivedPull(
  scrollTop: number,
  startX: number,
  startY: number,
  x: number,
  y: number,
): boolean {
  return archivedPullProgress(scrollTop, startX, startY, x, y) >= 1
}

type BindOptions = {
  onProgress: (state: ArchivedPullProgress) => void
  onRefresh: () => void
}

export function bindArchivedPullToRefresh(frame: HTMLIFrameElement, options: BindOptions): () => void {
  const win = frame.contentWindow
  const doc = frame.contentDocument
  if (!win || !doc) return () => {}

  let startX = 0
  let startY = 0
  let armed = false
  let progress = 0
  let refreshing = false

  const publish = (next: number, isRefreshing: boolean) => {
    progress = next
    refreshing = isRefreshing
    options.onProgress({ progress: next, refreshing: isRefreshing })
  }

  const onStart = (event: TouchEvent) => {
    if (refreshing || event.touches.length !== 1) {
      armed = false
      return
    }
    const touch = event.touches[0]
    startX = touch.clientX
    startY = touch.clientY
    armed = frameScrollTop(win, win.top) <= 0
    if (armed) publish(0, false)
  }

  const onMove = (event: TouchEvent) => {
    if (!armed || refreshing || event.touches.length !== 1) return
    const touch = event.touches[0]
    const next = archivedPullProgress(frameScrollTop(win, win.top), startX, startY, touch.clientX, touch.clientY)
    if (next !== progress) publish(next, false)
  }

  const finish = () => {
    if (!armed || refreshing) return
    armed = false
    if (progress >= 1) {
      publish(1, true)
      options.onRefresh()
      return
    }
    publish(0, false)
  }

  const onEnd = () => finish()
  const onCancel = () => {
    if (refreshing) return
    armed = false
    publish(0, false)
  }

  doc.addEventListener('touchstart', onStart, { passive: true })
  doc.addEventListener('touchmove', onMove, { passive: true })
  doc.addEventListener('touchend', onEnd, { passive: true })
  doc.addEventListener('touchcancel', onCancel, { passive: true })
  return () => {
    doc.removeEventListener('touchstart', onStart)
    doc.removeEventListener('touchmove', onMove)
    doc.removeEventListener('touchend', onEnd)
    doc.removeEventListener('touchcancel', onCancel)
  }
}

/** Archived shells scroll inside an iframe, which never shows the browser refresh control. */
export function useArchivedFrameRefresh(
  frameRef: RefObject<HTMLIFrameElement | null>,
  enabled: boolean,
): ArchivedPullProgress {
  const [state, setState] = useState<ArchivedPullProgress>({ progress: 0, refreshing: false })

  useEffect(() => {
    if (!enabled) return
    const frame = frameRef.current
    if (!frame) return

    let detach = () => {}
    const bind = () => {
      detach()
      detach = bindArchivedPullToRefresh(frame, {
        onProgress: setState,
        onRefresh: () => {
          window.location.reload()
        },
      })
    }

    frame.addEventListener('load', bind)
    if (frame.contentDocument?.readyState === 'complete') bind()
    return () => {
      frame.removeEventListener('load', bind)
      detach()
    }
  }, [enabled, frameRef])

  if (!enabled) return { progress: 0, refreshing: false }
  return state
}
