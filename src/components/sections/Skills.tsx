import { siteContent } from '../../data/site'
import { type SkillCategory, skillCategories, skillHighlights } from '../../data/skills'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { Reveal } from '../ui/Reveal'
import { SectionMotion } from '../ui/SectionMotion'
import { SectionHeading } from '../ui/SectionHeading'
import { SegmentedLead } from '../ui/SegmentedLead'
import { PORTFOLIO_GLASS_CARD_STACKED } from '../ui/portfolioGlassCard'

function SkillCategoryCard({ cat, delayMs }: { cat: SkillCategory; delayMs: number }) {
  const panelReflect = useGlassCardReflectHandlers()

  return (
    <Reveal className="min-w-0 h-full" delayMs={delayMs} fadeOnly>
      <article
        id={`skills-${cat.id}`}
        className={`skill-category-card h-full ${PORTFOLIO_GLASS_CARD_STACKED}`}
        {...panelReflect}
      >
        <div className="hero-skill-card-copy">
          <p className="hero-immersive-slide__eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
            {siteContent.skills.eyebrow}
          </p>
          <h3 className="font-display m-0 mt-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]">
            {cat.title}
          </h3>
          <p className="skill-category-blurb m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">{cat.blurb}</p>
        </div>
        <ul className="hero-skill-card-chips m-0 list-none p-0" aria-label={`${cat.title} skills`}>
          {cat.items.map((item) => (
            <li key={item} className="m-0 min-w-0">
              <span className="hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  )
}

export function Skills() {
  const s = siteContent.skills

  return (
    <SectionMotion
      id="skills"
      className="relative mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="skills-heading"
    >
      <div className="relative isolate">
        <Reveal className="min-w-0">
          <SectionHeading id="skills-heading" eyebrow={s.eyebrow} title={s.title}>
            <SegmentedLead segments={s.lead} className="skill-category-blurb section-lead m-0 max-w-2xl text-[0.9375rem] leading-relaxed sm:text-base" />
          </SectionHeading>
        </Reveal>

        <Reveal className="min-w-0" delayMs={50} fadeOnly>
          <ul
            className="skills-highlight-rail mt-10 flex min-h-0 max-w-full list-none gap-2 overflow-x-auto p-0 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-12 sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label={s.highlightsAriaLabel}
          >
            {skillHighlights.map((label) => (
              <li key={label} className="m-0 shrink-0 snap-start">
                <span className="hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
          {skillCategories.map((cat, i) => (
            <SkillCategoryCard key={cat.id} cat={cat} delayMs={i * 55} />
          ))}
        </div>
      </div>
    </SectionMotion>
  )
}
