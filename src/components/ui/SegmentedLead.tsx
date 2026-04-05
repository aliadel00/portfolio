import { Fragment } from 'react'
import type { TextSegment } from '../../data/siteContent.types'

type Props = {
  segments: TextSegment[]
  className?: string
}

/** Renders JSON-driven lead copy with safe inline emphasis (no raw HTML). */
export function SegmentedLead({ segments, className }: Props) {
  return (
    <p className={className}>
      {segments.map((s, i) =>
        s.type === 'strong' ? (
          <strong key={i} className="font-medium text-[var(--color-fg)]">
            {s.value}
          </strong>
        ) : (
          <Fragment key={i}>{s.value}</Fragment>
        ),
      )}
    </p>
  )
}
