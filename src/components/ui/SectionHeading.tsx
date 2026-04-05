import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  title: string
  eyebrow?: string
  className?: string
  children?: ReactNode
}

export function SectionHeading({ id, title, eyebrow, className = '', children }: SectionHeadingProps) {
  return (
    <header className={`section-heading-wrap ${className}`.trim()}>
      {eyebrow ? (
        <p className="section-eyebrow m-0 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent-2)]">
          <span className="section-eyebrow-line" aria-hidden />
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="section-title font-display m-0 mt-3 text-3xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl">
        <span className="text-gradient-section">{title}</span>
      </h2>
      {children ? <div className="mt-4 sm:mt-5">{children}</div> : null}
    </header>
  )
}
