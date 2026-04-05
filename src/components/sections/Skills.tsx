import {
  CV_DOWNLOAD_FILENAME,
  CV_DOWNLOAD_PATH,
  type SkillCategory,
  skillCategories,
  skillHighlights,
} from '../../data/skills'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const accentBorder: Record<SkillCategory['accent'], string> = {
  violet:
    'border-l-[color-mix(in_oklab,var(--color-accent)_58%,transparent)] shadow-[inset_1px_0_0_0_color-mix(in_oklab,var(--color-accent)_35%,transparent)]',
  cyan: 'border-l-[color-mix(in_oklab,var(--color-accent-2)_55%,transparent)] shadow-[inset_1px_0_0_0_color-mix(in_oklab,var(--color-accent-2)_30%,transparent)]',
  amber:
    'border-l-[color-mix(in_oklab,oklch(0.78_0.14_75)_50%,transparent)] shadow-[inset_1px_0_0_0_color-mix(in_oklab,oklch(0.78_0.12_75)_28%,transparent)]',
  rose: 'border-l-[color-mix(in_oklab,oklch(0.72_0.14_15)_48%,transparent)] shadow-[inset_1px_0_0_0_color-mix(in_oklab,oklch(0.7_0.12_15)_26%,transparent)]',
}

export function Skills() {
  return (
    <section
      id="skills"
      className="relative mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="skills-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_14%,transparent)] blur-3xl sm:top-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-20 h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--color-accent-2)_12%,transparent)] blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <Reveal className="min-w-0">
          <SectionHeading id="skills-heading" eyebrow="Capabilities" title="Skills & tools">
            <p className="section-lead m-0 max-w-2xl">
              Grouped from the same profile as my CV — full-stack roots with senior depth on{' '}
              <strong className="font-medium text-[var(--color-fg)]">Angular and React</strong>, plus delivery habits from
              banking, insurance, and product teams.
            </p>
          </SectionHeading>

          <div className="mt-6 sm:mt-8">
            <a
              href={CV_DOWNLOAD_PATH}
              className="cta-secondary inline-flex w-fit cursor-pointer items-center gap-2"
              download={CV_DOWNLOAD_FILENAME}
            >
              <span aria-hidden className="inline-flex h-4 w-4 items-center justify-center opacity-90">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </span>
              Download CV (PDF)
            </a>
          </div>

          <div
            className="skills-highlight-rail mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-10 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Highlighted skills"
          >
            {skillHighlights.map((label) => (
              <span
                key={label}
                role="listitem"
                className="skill-highlight-chip shrink-0 snap-start rounded-full border border-[color-mix(in_oklab,white_14%,transparent)] bg-[color-mix(in_oklab,white_8%,transparent)] px-3.5 py-2 text-xs font-semibold tracking-tight text-[var(--color-fg)] backdrop-blur-sm motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-200 hover:border-[color-mix(in_oklab,var(--color-accent-2)_35%,transparent)] hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--color-accent)_35%,transparent)] motion-safe:hover:-translate-y-0.5 sm:text-[0.8125rem]"
              >
                {label}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.id} className="min-w-0" delayMs={i * 55}>
              <article
                id={`skills-${cat.id}`}
                className={`glass-panel pro-glass skill-category-card flex h-full flex-col border-l-[3px] border-t border-t-[color-mix(in_oklab,white_8%,transparent)] p-5 sm:p-6 ${accentBorder[cat.accent]} project-card-hover`}
              >
                <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)] sm:text-xl">
                  {cat.title}
                </h3>
                <p className="mt-2 m-0 text-sm leading-relaxed text-[var(--color-fg-muted)]">{cat.blurb}</p>
                <ul className="mt-5 flex list-none flex-wrap gap-2 p-0" aria-label={`${cat.title} skills`}>
                  {cat.items.map((item) => (
                    <li key={item}>
                      <span className="inline-block rounded-lg border border-[color-mix(in_oklab,white_12%,transparent)] bg-[color-mix(in_oklab,white_5%,transparent)] px-2.5 py-1.5 text-xs font-medium text-[color-mix(in_oklab,var(--color-fg)_92%,transparent)] sm:text-[0.8125rem]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
