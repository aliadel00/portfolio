import { useState } from 'react'
import { publicUrl } from '../lib/publicAsset'

type Props = {
  candidates: string[]
  alt: string
  className?: string
  width?: number
  height?: number
}

/** Tries each candidate URL until one loads (favicons often fail cross-origin or return empty). */
export function BrandLogoImg({ candidates, alt, className, width = 160, height = 160 }: Props) {
  const [index, setIndex] = useState(0)

  if (candidates.length === 0) {
    return (
      <span className="text-xs text-[var(--color-fg-muted)]" role="img" aria-label={alt}>
        Logo
      </span>
    )
  }

  if (index >= candidates.length) {
    return (
      <span
        className="font-display text-lg font-semibold tracking-tight text-[var(--color-fg-muted)]"
        role="img"
        aria-label={alt}
      >
        Brand
      </span>
    )
  }

  const tryNext = () => setIndex((i) => i + 1)

  const src = publicUrl(candidates[index])

  return (
    <img
      key={`${candidates[index]}-${index}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      onError={tryNext}
      onLoad={(e) => {
        // Some CDNs return 200 with an empty or broken body; no onError.
        if (e.currentTarget.naturalWidth === 0) tryNext()
      }}
    />
  )
}
