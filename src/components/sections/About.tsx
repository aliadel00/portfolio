export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="about-heading"
    >
      <div className="glass-panel p-6 sm:p-10">
        <h2
          id="about-heading"
          className="font-display m-0 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl"
        >
          About
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-fg-muted)] sm:text-lg">
          This portfolio highlights selected <strong className="font-medium text-[var(--color-fg)]">career</strong>{' '}
          contributions and <strong className="font-medium text-[var(--color-fg)]">freelance</strong> engagements.
          Update this section with your background, principles, and the kinds of problems you like to solve.
        </p>
        <ul className="mt-6 grid gap-3 text-[var(--color-fg-muted)] sm:grid-cols-3">
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">Performance-first delivery</li>
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">Accessible UI by default</li>
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">Design–engineering collaboration</li>
        </ul>
      </div>
    </section>
  )
}
