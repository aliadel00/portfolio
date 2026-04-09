import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

/**
 * Roving tabindex for a horizontal link list (WAI-ARIA toolbar / menubar-style keyboard pattern).
 * One tab stop in the group; Arrow Left/Right (and Up/Down) move focus; Home/End jump to ends.
 */
export function useRovingNavLinks(itemCount: number) {
  const refs = useRef<(HTMLAnchorElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = useState(0)

  const focusAt = useCallback(
    (index: number) => {
      const len = itemCount
      if (len === 0) return
      const i = ((index % len) + len) % len
      setFocusedIndex(i)
      refs.current[i]?.focus()
    },
    [itemCount],
  )

  const setLinkRef = useCallback((i: number) => (el: HTMLAnchorElement | null) => {
    refs.current[i] = el
  }, [])

  const onLinkKeyDown = useCallback(
    (i: number) => (e: KeyboardEvent<HTMLAnchorElement>) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          focusAt(i + 1)
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          focusAt(i - 1)
          break
        case 'Home':
          e.preventDefault()
          focusAt(0)
          break
        case 'End':
          e.preventDefault()
          focusAt(itemCount - 1)
          break
        default:
          break
      }
    },
    [focusAt, itemCount],
  )

  const onLinkFocus = useCallback((i: number) => {
    setFocusedIndex(i)
  }, [])

  /** Focus first nav link (e.g. / shortcut or “Skip to navigation”). */
  const focusFirstLink = useCallback(() => {
    focusAt(0)
  }, [focusAt])

  useEffect(() => {
    refs.current.length = itemCount
  }, [itemCount])

  return {
    focusedIndex,
    setLinkRef,
    onLinkKeyDown,
    onLinkFocus,
    focusFirstLink,
    /** For layout effects (e.g. active nav pill) — same refs as `setLinkRef`. */
    navLinkRefs: refs,
  }
}
