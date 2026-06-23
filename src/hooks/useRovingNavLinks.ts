import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MutableRefObject } from 'react'

export type NavLinkRefs = MutableRefObject<(HTMLAnchorElement | null)[]>

function focusNavLinkAt(
  refs: NavLinkRefs,
  itemCount: number,
  index: number,
  onIndexChange: (index: number) => void,
) {
  if (itemCount === 0) return
  const i = ((index % itemCount) + itemCount) % itemCount
  onIndexChange(i)
  refs.current[i]?.focus()
}

/** Shared roving-keyboard handler for a specific link ref list (desktop rail or mobile drawer). */
export function createRovingLinkKeyDown(
  refs: NavLinkRefs,
  itemCount: number,
  onIndexChange: (index: number) => void,
) {
  return (i: number) => (e: KeyboardEvent<HTMLAnchorElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        focusNavLinkAt(refs, itemCount, i + 1, onIndexChange)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        focusNavLinkAt(refs, itemCount, i - 1, onIndexChange)
        break
      case 'Home':
        e.preventDefault()
        focusNavLinkAt(refs, itemCount, 0, onIndexChange)
        break
      case 'End':
        e.preventDefault()
        focusNavLinkAt(refs, itemCount, itemCount - 1, onIndexChange)
        break
      default:
        break
    }
  }
}

/**
 * Roving tabindex for a horizontal link list (WAI-ARIA toolbar / menubar-style keyboard pattern).
 * One tab stop in the group; Arrow Left/Right (and Up/Down) move focus; Home/End jump to ends.
 *
 * Pass `linkRefs` when measuring or focusing a separate DOM list (e.g. mobile drawer links).
 */
export function useRovingNavLinks(itemCount: number, linkRefs?: NavLinkRefs) {
  const internalRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const refs = linkRefs ?? internalRefs
  const [focusedIndex, setFocusedIndex] = useState(0)

  const focusAt = useCallback(
    (index: number) => {
      focusNavLinkAt(refs, itemCount, index, setFocusedIndex)
    },
    [itemCount, refs],
  )

  const setLinkRef = useCallback((i: number) => (el: HTMLAnchorElement | null) => {
    refs.current[i] = el
  }, [refs])

  const onLinkKeyDown = useCallback(
    (i: number) => createRovingLinkKeyDown(refs, itemCount, setFocusedIndex)(i),
    [itemCount, refs],
  )

  const onLinkFocus = useCallback((i: number) => {
    setFocusedIndex(i)
  }, [])

  const focusFirstLink = useCallback(() => {
    focusAt(0)
  }, [focusAt])

  useEffect(() => {
    refs.current.length = itemCount
  }, [itemCount, refs])

  return {
    focusedIndex,
    setLinkRef,
    onLinkKeyDown,
    onLinkFocus,
    focusFirstLink,
    navLinkRefs: refs,
  }
}
