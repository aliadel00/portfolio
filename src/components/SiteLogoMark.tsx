import { useId } from 'react'

type Props = {
  className?: string
}

/**
 * Inline AA ligature — uses theme CSS variables (matches public/favicon.svg geometry).
 */
export function SiteLogoMark({ className }: Props) {
  const uid = useId().replace(/:/g, '')
  const gradId = `site-logo-grad-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 48 44"
      width={48}
      height={44}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={gradId} x1="6" y1="6" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-accent-2)" />
          <stop offset="0.38" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-hot)" />
        </linearGradient>
      </defs>
      <g
        stroke={`url(#${gradId})`}
        strokeWidth="1.38"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 37L16.5 8L25 37" />
        <path d="M25 37L33.5 8L42 37" />
        <path d="M11.5 26h10" />
        <path d="M28.5 26h10" />
      </g>
    </svg>
  )
}
