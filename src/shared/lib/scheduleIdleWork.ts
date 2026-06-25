type IdleOptions = {
  /** Max wait before the callback runs even if the browser stays busy (ms). */
  timeout?: number
}

/**
 * Run work after the main thread is idle — defers heavy chunks (WebGL, probes) past first paint.
 */
export function scheduleIdleWork(callback: () => void, options: IdleOptions = {}): () => void {
  const timeout = options.timeout ?? 2000

  if (typeof requestIdleCallback !== 'undefined') {
    const id = requestIdleCallback(callback, { timeout })
    return () => cancelIdleCallback(id)
  }

  const id = window.setTimeout(callback, 1)
  return () => window.clearTimeout(id)
}
