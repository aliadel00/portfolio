import { siteContent } from '../../data/site'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { Reveal } from '../ui/Reveal'
import { MaskIcon } from '../ui/MaskIcon'
import { PORTFOLIO_GLASS_CARD_SHELL } from '../ui/portfolioGlassCard'

export function Contact() {
  const c = siteContent.contact
  const panelReflect = useGlassCardReflectHandlers()

  return (
    <section
      id="contact"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24 sm:pb-28"
      aria-labelledby="contact-heading"
    >
      <Reveal className="min-w-0">
        <article
          className={`contact-card flex w-full flex-col text-center ${PORTFOLIO_GLASS_CARD_SHELL}`}
          {...panelReflect}
        >
          <div className="contact-card__copy mx-auto min-w-0 max-w-xl">
            <p className="hero-immersive-slide__eyebrow m-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
              {c.eyebrow}
            </p>
            <h2
              id="contact-heading"
              className="font-display m-0 mt-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]"
            >
              {c.title}
            </h2>
            <p className="skill-category-blurb section-lead m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">
              {c.lead}
            </p>
          </div>

          <div className="contact-card__actions mt-8 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <a
              href={`mailto:${c.email}`}
              className="contact-card__link contact-card__link--primary work-project-card__link work-project-card__link--live hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium"
            >
              {c.email}
            </a>
            <a
              href={c.phoneHref}
              className="contact-card__link work-project-card__link hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]"
            >
              {c.phoneDisplay}
            </a>
          </div>

          <div className="contact-card__social mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9">
            <a
              href={c.linkedInUrl}
              className="contact-card__link contact-social-link work-project-card__link work-project-card__link--live hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium"
              target="_blank"
              rel="noreferrer noopener"
            >
              <MaskIcon
                src="icons/linkedin.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.linkedInLabel}
              <MaskIcon
                src="icons/external-link.svg"
                className="work-project-card__link-icon shrink-0 opacity-75"
                width={14}
                height={14}
              />
            </a>
            <a
              href={c.githubUrl}
              className="contact-card__link contact-social-link work-project-card__link work-project-card__link--code hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium"
              target="_blank"
              rel="noreferrer noopener"
            >
              <MaskIcon
                src="icons/github.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.githubLabel}
              <MaskIcon
                src="icons/external-link.svg"
                className="work-project-card__link-icon shrink-0 opacity-75"
                width={14}
                height={14}
              />
            </a>
          </div>
        </article>
      </Reveal>
    </section>
  )
}
