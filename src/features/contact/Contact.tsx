import { Card, Link } from 'caustica-design/core'
import { siteContent } from '@/content/site'
import { Reveal } from '@/shared/ui/Reveal'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { SectionEyebrow, SECTION_BODY_LEAD_CLASS } from '@/shared/ui/SectionHeading'
import { useShellSelection } from '@/features/shell/useShellSelection'

export function Contact() {
  const c = siteContent.contact
  const { activeId } = useShellSelection()
  const linkClass = (id: string, className: string) =>
    activeId === id ? `${className} ide-selected` : className

  return (
    <SectionMotion
      id="contact"
      className="mx-auto max-w-5xl px-4 py-16 max-sm:min-h-0 sm:min-h-dvh sm:px-6 sm:py-24 sm:pb-28"
      aria-labelledby="contact-heading"
    >
      <Reveal className="min-w-0">
        <Card className="contact-card hero-skill-card-shell w-full text-center">
          <div className="contact-card__copy mx-auto min-w-0 max-w-xl">
            <SectionEyebrow>{c.eyebrow}</SectionEyebrow>
            <h2
              id="contact-heading"
              className="font-display m-0 mt-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]"
            >
              {c.title}
            </h2>
            <p className={SECTION_BODY_LEAD_CLASS}>
              {c.lead}
            </p>
          </div>

          <div className="contact-card__actions mt-8 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
            <Link id="contact-email" className={linkClass('contact-email', '')} href={`mailto:${c.email}`} aria-current={activeId === 'contact-email' ? 'true' : undefined}>
              <MaskIcon
                src="icons/email.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.email}
            </Link>
            <Link id="contact-phone" className={linkClass('contact-phone', '')} href={c.phoneHref} aria-current={activeId === 'contact-phone' ? 'true' : undefined}>
              <MaskIcon
                src="icons/phone.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.phoneDisplay}
            </Link>
          </div>

          <div className="contact-card__social mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-9">
            <Link
              id="contact-linkedin"
              className={linkClass('contact-linkedin', '')}
              href={c.linkedInUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-current={activeId === 'contact-linkedin' ? 'true' : undefined}
            >
              <MaskIcon
                src="icons/linkedin.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.linkedInLabel}
            </Link>
            <Link
              id="contact-github"
              className={linkClass('contact-github', '')}
              href={c.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-current={activeId === 'contact-github' ? 'true' : undefined}
            >
              <MaskIcon
                src="icons/github.svg"
                className="work-project-card__link-icon shrink-0 opacity-95"
                width={16}
                height={16}
              />
              {c.githubLabel}
            </Link>
          </div>
        </Card>
      </Reveal>
    </SectionMotion>
  )
}
