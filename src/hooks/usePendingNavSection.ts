import { useCallback, useEffect, useRef, useState } from 'react'

const PENDING_SECTION_TIMEOUT_MS = 1500

/**
 * Optimistic nav highlight after a section link is tapped, until scroll spy confirms
 * the destination (or the timeout elapses).
 */
export function usePendingNavSection(activeSection: string | null) {
  const [pendingSection, setPendingSection] = useState<string | null>(null)
  const pendingResetRef = useRef<number | null>(null)

  const displayedActiveSection = activeSection ?? pendingSection

  const commitPendingSection = useCallback((sectionId: string) => {
    setPendingSection(sectionId)
    if (pendingResetRef.current !== null) {
      window.clearTimeout(pendingResetRef.current)
    }
    pendingResetRef.current = window.setTimeout(() => {
      pendingResetRef.current = null
      setPendingSection(null)
    }, PENDING_SECTION_TIMEOUT_MS)
  }, [])

  useEffect(
    () => () => {
      if (pendingResetRef.current !== null) {
        window.clearTimeout(pendingResetRef.current)
      }
    },
    [],
  )

  return { displayedActiveSection, commitPendingSection }
}
