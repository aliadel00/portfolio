import {
  CV_DOWNLOAD_FILENAME,
  CV_DOWNLOAD_PATH,
  type SkillCategory,
  skillCategories,
  skillHighlights,
} from '../../data/skills'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

function SkillCategoryCard({ cat, delayMs }: { cat: SkillCategory; delayMs: number }) {
  const cardReflect = useGlassCardReflectHandlers()

  return (
    <Reveal className="min-w-0" delayMs={delayMs}>
      <div className="skill-category-neon-wrap project-card-hover h-full" data-skill-neon={cat.accent}>
        <article
          id={`skills-${cat.id}`}
          className="glass-card-reflect glass-panel pro-glass skill-category-card flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-glass)-1px)] border-0 p-5 sm:p-6"
          {...cardReflect}
        >
          <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)] sm:text-xl">
            {cat.title}
          </h3>
          <p className="skill-category-blurb mt-2 m-0 text-sm leading-relaxed">{cat.blurb}</p>
          <ul className="mt-5 flex list-none flex-wrap gap-2 p-0" aria-label={`${cat.title} skills`}>
            {cat.items.map((item) => (
              <li key={item}>
                <span className="skill-category-chip inline-block rounded-lg border px-2.5 py-1.5 text-xs font-medium sm:text-[0.8125rem]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Reveal>
  )
}

export function Skills() {
  const cvPointerTrack = useGlassPointerTrackHandlers()

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

      <div className="relative isolate">
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
              className="cta-secondary glass-pointer-track inline-flex w-fit cursor-pointer"
              download={CV_DOWNLOAD_FILENAME}
              {...cvPointerTrack}
            >
              <span className="glass-pointer-track-fg inline-flex items-center gap-2">
                <span aria-hidden className="inline-flex h-4 w-4 items-center justify-center opacity-90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </span>
                Download CV (PDF)
              </span>
            </a>
          </div>
        </Reveal>

        <Reveal className="min-w-0" delayMs={50}>
          <div
            className="skills-highlight-rail mt-10 flex min-h-0 max-w-full gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
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
            <SkillCategoryCard key={cat.id} cat={cat} delayMs={i * 55} />
          ))}
        </div>
      </div>
    </section>
  )
}
