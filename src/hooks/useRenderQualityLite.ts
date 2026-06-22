import { useEffect, useState } from 'react'

/** True when `useRenderQuality` has switched the document to lite mode. */
export function useRenderQualityLite() {
  const [lite, setLite] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.getAttribute('data-render-quality') === 'lite'
  })

  useEffect(() => {
    const root = document.documentElement
    const read = () => setLite(root.getAttribute('data-render-quality') === 'lite')
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['data-render-quality'] })
    return () => observer.disconnect()
  }, [])

  return lite
}
