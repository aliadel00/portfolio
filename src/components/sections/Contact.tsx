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
          Open to freelance collaborations and selective full-time conversations. Replace the mailto with your
          address.
        </p>
        <a
          href="mailto:hello@example.com"
          className="glass-chip mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-[var(--color-fg)] no-underline hover:bg-white/12"
        >
          hello@example.com
        </a>
      </div>
    </section>
  )
}
