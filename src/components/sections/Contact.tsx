import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:pb-28"
      aria-labelledby="contact-heading"
    >
      <Reveal className="min-w-0">
        <div className="glass-panel pro-glass p-8 text-center sm:p-12">
        <SectionHeading id="contact-heading" eyebrow="Let’s talk" title="Contact" className="text-center [&_.section-eyebrow]:justify-center [&_.section-title]:text-center" />

        <p className="section-lead mx-auto m-0 max-w-xl text-center">
          New Cairo, Egypt · Open to freelance and software engineering roles (full-stack or frontend-heavy). Reach out by
          email or LinkedIn.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <a href="mailto:ali.adel20120@gmail.com" className="cta-primary cursor-pointer">
            ali.adel20120@gmail.com
          </a>
          <a href="tel:+201128095352" className="cta-secondary cursor-pointer">
            +20 11 28095352
          </a>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="https://www.linkedin.com/in/ali-abolwafa-93b1161b1/"
            className="link-accent link-accent-cyan no-underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/aliadel00"
            className="link-accent link-accent-violet no-underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </div>
        </div>
      </Reveal>
    </section>
  )
}
