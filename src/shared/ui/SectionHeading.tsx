import type { ReactNode } from 'react'
import { SectionEyebrow as CausticaSectionEyebrow } from 'caustica-design/core'

const SECTION_LEAD_BASE =
  'skill-category-blurb section-lead m-0 text-[0.9375rem] leading-relaxed sm:text-base'

/** Lead copy under section headings (SegmentedLead). */
export const SECTION_LEAD_CLASS = `${SECTION_LEAD_BASE} max-w-2xl`

/** Standalone section lead paragraph (e.g. contact). */
export const SECTION_BODY_LEAD_CLASS = `${SECTION_LEAD_BASE} mt-3`

type SectionHeadingProps = {
  /** Omit for decorative / duplicate headings (e.g. magnifier clones). */
  id?: string
  title: string
  eyebrow?: string
  /** `classic` — gradient title + accent eyebrow. Default uses the glass pill OS label. */
  variant?: 'os' | 'classic'
  className?: string
  children?: ReactNode
}

/** Glass pill section label — section headings and hero showcase intro. */
export function SectionOsEyebrow({ children }: { children: ReactNode }) {
  return <CausticaSectionEyebrow>{children}</CausticaSectionEyebrow>
}

/** Uppercase muted label — glass cards (contact, project cards). */
export function SectionEyebrow({ children }: { children: ReactNode }) {
  return <CausticaSectionEyebrow>{children}</CausticaSectionEyebrow>
}

export function SectionHeading({
  id,
  title,
  eyebrow,
  variant = 'os',
  className = '',
  children,
}: SectionHeadingProps) {
  const isClassic = variant === 'classic'

  return (
    <header className={`section-heading-wrap ${className}`.trim()}>
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      <h2
        {...(id ? { id } : {})}
        className="section-title font-display m-0 mt-3 text-3xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl"
      >
        {isClassic ? <span className="text-gradient-section">{title}</span> : title}
      </h2>
      {children ? <div className="mt-4 sm:mt-5">{children}</div> : null}
    </header>
  )
}
