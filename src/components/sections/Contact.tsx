import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

function ContactExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  )
}

function ContactLinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function ContactGitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export function Contact() {
  const panelReflect = useGlassCardReflectHandlers()
  const ctaPointerTrack = useGlassPointerTrackHandlers()
  const socialPointerTrack = useGlassPointerTrackHandlers()

  return (
    <section
      id="contact"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:pb-28"
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
              eyebrow="Let’s talk"
              title="Contact"
              className="text-center [&_.section-eyebrow]:justify-center [&_.section-title]:text-center"
            />

            <p className="section-lead mx-auto m-0 max-w-xl text-center">
              New Cairo, Egypt · Open to freelance and software engineering roles (full-stack or frontend-heavy). Reach out
              by email or LinkedIn.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <a
                href="mailto:ali.adel20120@gmail.com"
                className="cta-primary glass-pointer-track glass-pointer-track--solid-bg cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">ali.adel20120@gmail.com</span>
              </a>
              <a
                href="tel:+201128095352"
                className="cta-secondary glass-pointer-track cursor-pointer"
                {...ctaPointerTrack}
              >
                <span className="glass-pointer-track-fg">+20 11 28095352</span>
              </a>
            </div>

            <div className="contact-social-row mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4">
              <a
                href="https://www.linkedin.com/in/ali-abolwafa-93b1161b1/"
                className="contact-social-link contact-social-link--linkedin project-card-link project-card-link--live glass-pointer-track glass-pointer-track--clip"
                target="_blank"
                rel="noreferrer noopener"
                {...socialPointerTrack}
              >
                <span className="glass-pointer-track-fg">
                  <ContactLinkedInIcon className="project-card-link__icon shrink-0 opacity-95" />
                  <span className="font-medium">LinkedIn</span>
                  <ContactExternalIcon className="project-card-link__icon shrink-0 opacity-75" />
                </span>
              </a>
              <a
                href="https://github.com/aliadel00"
                className="contact-social-link contact-social-link--github project-card-link project-card-link--code glass-pointer-track glass-pointer-track--clip"
                target="_blank"
                rel="noreferrer noopener"
                {...socialPointerTrack}
              >
                <span className="glass-pointer-track-fg">
                  <ContactGitHubIcon className="project-card-link__icon shrink-0 opacity-95" />
                  <span className="font-medium">GitHub</span>
                  <ContactExternalIcon className="project-card-link__icon shrink-0 opacity-75" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
