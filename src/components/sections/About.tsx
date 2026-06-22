import { siteContent } from '../../data/site'
import { Reveal } from '../ui/Reveal'
import { SectionMotion } from '../ui/SectionMotion'
import { SectionHeading, SECTION_LEAD_CLASS } from '../ui/SectionHeading'
import { SegmentedLead } from '../ui/SegmentedLead'
import { ChipRail } from '../ui/ChipRail'

function AboutFactGroup({
  heading,
  headingId,
  items,
}: {
  heading: string
  headingId: string
  items: string[]
}) {
  return (
    <div className="about-facts__group min-w-0">
      <header className="about-facts__header">
        <h3 id={headingId} className="about-facts__title m-0 font-display">
          {heading}
        </h3>
        <span className="about-facts__header-rule" aria-hidden />
      </header>
      <ul className="about-facts__list m-0 list-none p-0" aria-labelledby={headingId}>
        {items.map((item) => (
          <li key={item} className="about-facts__item m-0">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function About() {
  const a = siteContent.about

  return (
    <SectionMotion
      id="about"
      className="relative mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="about-heading"
    >
      <div className="relative isolate">
        <Reveal className="min-w-0">
          <SectionHeading id="about-heading" eyebrow={a.eyebrow} title={a.title}>
            <SegmentedLead segments={a.lead} className={SECTION_LEAD_CLASS} />
          </SectionHeading>
        </Reveal>

        <Reveal className="min-w-0" delayMs={50} fadeOnly>
          <ChipRail
            wrapperClassName="mt-10 sm:mt-12"
            className="about-highlight-rail hero-skill-card-chips m-0 list-none p-0"
            ariaLabel="About focus areas"
          >
            {a.chips.map((chip) => (
              <li key={chip} className="m-0">
                <span className="hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]">
                  {chip}
                </span>
              </li>
            ))}
          </ChipRail>
        </Reveal>

        <Reveal className="min-w-0" delayMs={100} fadeOnly>
          <div className="about-facts mt-10 sm:mt-12">
            <AboutFactGroup
              headingId="about-education-heading"
              heading={a.educationHeading}
              items={a.educationItems}
            />
            <AboutFactGroup
              headingId="about-highlights-heading"
              heading={a.highlightsHeading}
              items={a.highlightsItems}
            />
          </div>
        </Reveal>
      </div>
    </SectionMotion>
  )
}
