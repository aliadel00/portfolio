import { useLayoutEffect } from 'react'
import { useArrowSectionNav } from '@/features/navigation'
import { useRenderQuality } from '@/features/hero'
import { Shell } from '@/features/shell'

export default function App() {
  useArrowSectionNav()
  useRenderQuality()
  useLayoutEffect(() => {
    const canonicalPath = import.meta.env.BASE_URL
    const hasExtraUrlState = window.location.search.length > 0 || window.location.hash.length > 0
    const wrongPath = window.location.pathname !== canonicalPath
    if (!hasExtraUrlState && !wrongPath) return
    window.history.replaceState(window.history.state, '', canonicalPath)
  }, [])

  return <Shell />
}
