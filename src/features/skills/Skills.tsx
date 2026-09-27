import { Card, Chip } from 'caustica-design/core'
import { siteContent } from '@/content/site'
import { type SkillCategory, skillCategories, skillHighlights } from '@/content/skills'
import { Reveal } from '@/shared/ui/Reveal'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { SectionHeading, SECTION_LEAD_CLASS } from '@/shared/ui/SectionHeading'
import { SegmentedLead } from '@/shared/ui/SegmentedLead'
import { ChipRail } from '@/shared/ui/ChipRail'
import { useShellSelection } from '@/features/shell/useShellSelection'

function SkillCategoryCard({ cat, delayMs }: { cat: SkillCategory; delayMs: number }) {
  const { activeId, selectFile } = useShellSelection()
  const fileId = `skills-${cat.id}`
  const selected = activeId === fileId

  return (
    <Reveal className="min-w-0 h-full" delayMs={delayMs} fadeOnly>
      <Card
        id={fileId}
        tabIndex={0}
        aria-current={selected ? 'true' : undefined}
        className={
          selected
            ? 'skill-category-card ide-selected h-full hero-skill-card-shell hero-skill-card-shell--stacked'
            : 'skill-category-card h-full hero-skill-card-shell hero-skill-card-shell--stacked'
        }
        onClick={() => selectFile(fileId)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          selectFile(fileId)
        }}
      >
        <div className="hero-skill-card-copy">
          <h3 className="font-display m-0 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]">
            {cat.title}
          </h3>
          <p className="skill-category-blurb m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">{cat.blurb}</p>
        </div>
        <ul className="hero-skill-card-chips m-0 list-none p-0" aria-label={`${cat.title} skills`}>
          {cat.items.map((item) => (
            <li key={item} className="m-0">
              <Chip>{item}</Chip>
            </li>
          ))}
        </ul>
      </Card>
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
          <SectionHeading id="skills-heading" title={s.title}>
            <SegmentedLead segments={s.lead} className={SECTION_LEAD_CLASS} />
          </SectionHeading>
        </Reveal>

        <Reveal className="min-w-0" delayMs={50} fadeOnly>
          <ChipRail
            wrapperClassName="mt-10 sm:mt-12"
            className="skills-highlight-rail hero-skill-card-chips m-0 list-none p-0"
            ariaLabel={s.highlightsAriaLabel}
          >
            {skillHighlights.map((label) => (
              <li key={label} className="m-0">
                <Chip>{label}</Chip>
              </li>
            ))}
          </ChipRail>
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
