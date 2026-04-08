import { siteContent } from '../../data/site'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { MaskIcon } from '../ui/MaskIcon'

export function Contact() {
  const c = siteContent.contact
  const panelReflect = useGlassCardReflectHandlers()
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const socialPointerTrack = useGlassPointerTrackHandlers()

  return (
    <section
      id="contact"
      className="mx-auto min-h-svh max-w-5xl px-4 py-20 sm:px-6 sm:pb-28"
      aria-labelledby="contact-heading"
    >
      <Reveal className="min-w-0">
        <div
          className="contact-card-with-blobs glass-card-reflect glass-panel pro-glass relative overflow-hidden p-8 text-center sm:p-12"
          {...panelReflect}
        >
          <div
            className="contact-card-blob-field pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            aria-hidden
          >
            <div
              className="contact-blob contact-blob--a absolute"
              style={{
                left: '-22%',
                top: '-32%',
                width: '78%',
                height: '62%',
                background:
                  'radial-gradient(ellipse 72% 72% at 38% 42%, color-mix(in oklab, var(--color-accent-2) 42%, transparent) 0%, color-mix(in oklab, var(--color-accent) 22%, transparent) 48%, transparent 72%)',
              }}
            />
            <div
              className="contact-blob contact-blob--b absolute"
              style={{
                right: '-28%',
                top: '5%',
                width: '72%',
                height: '58%',
                background:
                  'radial-gradient(ellipse 68% 75% at 55% 35%, color-mix(in oklab, var(--color-accent) 38%, transparent) 0%, color-mix(in oklab, var(--color-accent-hot) 26%, transparent) 52%, transparent 70%)',
              }}
            />
            <div
              className="contact-blob contact-blob--c absolute"
              style={{
                left: '5%',
                bottom: '-35%',
                width: '82%',
                height: '58%',
                background:
                  'radial-gradient(ellipse 80% 70% at 50% 60%, color-mix(in oklab, var(--color-accent-hot) 32%, transparent) 0%, color-mix(in oklab, var(--color-accent-2) 18%, transparent) 48%, transparent 68%)',
              }}
            />
            <div
              className="contact-blob contact-blob--d absolute hidden sm:block"
              style={{
                right: '-5%',
                bottom: '-18%',
                width: '48%',
                height: '48%',
                background:
                  'radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-accent-2) 28%, transparent) 0%, transparent 65%)',
              }}
            />
          </div>

          <div className="contact-card-inner relative">
            <SectionHeading
              id="contact-heading"
              eyebrow={c.eyebrow}
              title={c.title}
              className="text-center [&_.section-eyebrow]:justify-center [&_.section-title]:text-center"
            />

            <p className="section-lead mx-auto m-0 max-w-xl text-center">{c.lead}</p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href={`mailto:${c.email}`}
                className="cta-primary glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{c.email}</span>
              </a>
              <a
                href={c.phoneHref}
                className="cta-secondary glass-pointer-track cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">{c.phoneDisplay}</span>
              </a>
            </div>

            <div className="contact-social-row mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4">
              <a
                href={c.linkedInUrl}
                className="contact-social-link contact-social-link--linkedin project-card-link project-card-link--live glass-pointer-track glass-pointer-track--clip"
                target="_blank"
                rel="noreferrer noopener"
                {...socialPointerTrack}
              >
                <span className="glass-pointer-track-fg">
                  <MaskIcon
                    src="icons/linkedin.svg"
                    className="project-card-link__icon shrink-0 opacity-95"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium">{c.linkedInLabel}</span>
                  <MaskIcon
                    src="icons/external-link.svg"
                    className="project-card-link__icon shrink-0 opacity-75"
                    width={14}
                    height={14}
                  />
                </span>
              </a>
              <a
                href={c.githubUrl}
                className="contact-social-link contact-social-link--github project-card-link project-card-link--code glass-pointer-track glass-pointer-track--clip"
                target="_blank"
                rel="noreferrer noopener"
                {...socialPointerTrack}
              >
                <span className="glass-pointer-track-fg">
                  <MaskIcon
                    src="icons/github.svg"
                    className="project-card-link__icon shrink-0 opacity-95"
                    width={16}
                    height={16}
                  />
                  <span className="font-medium">{c.githubLabel}</span>
                  <MaskIcon
                    src="icons/external-link.svg"
                    className="project-card-link__icon shrink-0 opacity-75"
                    width={14}
                    height={14}
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
