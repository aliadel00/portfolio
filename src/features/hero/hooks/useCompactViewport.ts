import { useSyncExternalStore } from 'react'
import { matchesCompactViewport, subscribeCompactViewport } from '@/features/hero/lib/compactViewport'

/** Portrait phones and short landscape — matches capabilities static fallback. */
export function useCompactViewport(): boolean {
  return useSyncExternalStore(subscribeCompactViewport, matchesCompactViewport, () => false)
}
