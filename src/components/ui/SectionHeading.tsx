import type { ReactNode } from 'react'

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
  return (
    <p className="hero-live-previews-label hero-os-section-label m-0 flex w-fit max-w-full items-center gap-2 text-[0.8125rem] font-medium tracking-[-0.01em] text-[var(--color-fg-muted)]">
      <span
        className="inline-block h-px w-5 shrink-0 bg-[color-mix(in_oklab,var(--color-fg-muted)_35%,transparent)]"
        aria-hidden
      />
      {children}
    </p>
  )
}

/** Uppercase muted label — glass cards (contact, project cards). */
export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="hero-immersive-slide__eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
      {children}
    </p>
  )
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
      {eyebrow ? (
        isClassic ? (
          <p className="section-eyebrow m-0 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-2)]">
            <span className="section-eyebrow-line" aria-hidden />
            {eyebrow}
          </p>
        ) : (
          <SectionOsEyebrow>{eyebrow}</SectionOsEyebrow>
        )
      ) : null}
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
