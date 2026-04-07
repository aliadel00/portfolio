import { useState } from 'react'
import { publicUrl } from '../lib/publicAsset'

type Props = {
  candidates: string[]
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'eager' | 'lazy'
}

function titleCaseWords(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 3) return word.toUpperCase()
      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
    })
    .join(' ')
}

function brandNameFromCandidate(path: string | undefined): string | null {
  if (!path) return null
  const last = path.split('/').filter(Boolean).pop()
  if (!last) return null
  const base = last.replace(/\.[a-z0-9]+$/i, '')
  const cleaned = base.replace(/[-_]+/g, ' ').trim()
  if (!cleaned) return null
  return titleCaseWords(cleaned)
}

function brandNameFromAlt(alt: string): string | null {
  const first = alt.split('—')[0]?.trim() ?? ''
  if (!first) return null
  const cleaned = first.replace(/\s*logo$/i, '').replace(/\s*brand$/i, '').trim()
  return cleaned || null
}

function BrandFallback({ alt, brandName }: { alt: string; brandName: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center rounded-xl border border-[color-mix(in_oklab,var(--color-fg)_18%,transparent)] bg-[color-mix(in_oklab,var(--color-fg)_8%,transparent)] px-3 py-2 text-center backdrop-blur-sm"
      role="img"
      aria-label={alt}
    >
      <span className="font-display line-clamp-2 text-sm font-semibold tracking-tight text-[var(--color-fg)]">
        {brandName}
      </span>
    </span>
  )
}

/** Tries each candidate URL until one loads (favicons often fail cross-origin or return empty). */
export function BrandLogoImg({ candidates, alt, className, width = 160, height = 160, loading = 'lazy' }: Props) {
  const [index, setIndex] = useState(0)
  const fallbackBrandName = brandNameFromCandidate(candidates[0]) ?? brandNameFromAlt(alt) ?? 'Brand'

  if (candidates.length === 0) {
    return <BrandFallback alt={alt} brandName={fallbackBrandName} />
  }

  if (index >= candidates.length) {
    return <BrandFallback alt={alt} brandName={fallbackBrandName} />
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
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={tryNext}
      onLoad={(e) => {
        // Some CDNs return 200 with an empty or broken body; no onError.
        if (e.currentTarget.naturalWidth === 0) tryNext()
      }}
    />
  )
}
