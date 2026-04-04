export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:pb-24"
      aria-labelledby="contact-heading"
    >
      <div className="glass-panel p-6 text-center sm:p-10">
        <h2
          id="contact-heading"
          className="font-display m-0 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl"
        >
          Contact
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[var(--color-fg-muted)]">
          New Cairo, Egypt · Open to freelance and senior frontend roles. Reach out by email or LinkedIn.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:ali.adel20120@gmail.com"
            className="glass-chip inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[var(--color-fg)] no-underline hover:bg-white/12"
          >
            ali.adel20120@gmail.com
          </a>
          <a
            href="tel:+201128095352"
            className="glass-chip inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[var(--color-fg)] no-underline hover:bg-white/12"
          >
            +20 11 28095352
          </a>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <a
            href="https://www.linkedin.com/in/ali-abolwafa-93b1161b1/"
            className="font-semibold text-[var(--color-accent-2)] no-underline underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/aliadel00"
            className="font-semibold text-[var(--color-accent)] no-underline underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  )
}
