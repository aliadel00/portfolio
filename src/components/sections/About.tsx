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
          I am a <strong className="font-medium text-[var(--color-fg)]">senior frontend developer</strong> with a strong
          visual side — <strong className="font-medium text-[var(--color-fg)]">3D art and design</strong>. I started in
          Laravel/MERN/MEAN full-stack roles before specializing in <strong className="font-medium text-[var(--color-fg)]">React</strong> and{' '}
          <strong className="font-medium text-[var(--color-fg)]">Angular</strong> (v8 through 20+). I have shipped
          enterprise experiences for <strong className="font-medium text-[var(--color-fg)]">GOSI (Ameen)</strong>,{' '}
          <strong className="font-medium text-[var(--color-fg)]">Banque Misr</strong>,{' '}
          <strong className="font-medium text-[var(--color-fg)]">Suez Canal Bank</strong>, and UK-based platforms for
          linguists — mentoring teammates, owning deployments, and integrating AI-assisted tooling (Cursor, agents) where
          it genuinely helps quality and speed.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display m-0 text-lg font-semibold text-[var(--color-fg)]">Education &amp; languages</h3>
            <ul className="mt-3 list-none space-y-2 p-0 text-sm text-[var(--color-fg-muted)]">
              <li className="m-0">Computer Science &amp; AI, Helwan University (2018–2024; studies paused two years for national service)</li>
              <li className="m-0">Arabic — native · English — advanced</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display m-0 text-lg font-semibold text-[var(--color-fg)]">Highlights</h3>
            <ul className="mt-3 list-none space-y-2 p-0 text-sm text-[var(--color-fg-muted)]">
              <li className="m-0">MERN &amp; MEAN internships (Nvision X, 2020)</li>
              <li className="m-0">Google Android developer scholarship</li>
              <li className="m-0">30+ certificates across software, cloud, agile, AI tools, and 3D</li>
            </ul>
          </div>
        </div>
        <ul className="mt-8 grid gap-3 text-[var(--color-fg-muted)] sm:grid-cols-3">
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">Angular &amp; TypeScript at scale</li>
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">React, Node, Laravel ecosystems</li>
          <li className="glass-chip m-0 list-none px-4 py-3 text-sm">Three.js · Blender · 3D on the web</li>
        </ul>
      </div>
    </section>
  )
}
