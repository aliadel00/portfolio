const nav = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
] as const

export function Header() {
  return (
    <header className="glass-panel sticky top-0 z-50 mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-6">
      <a
        href="#top"
        className="font-display text-lg font-semibold tracking-tight text-[var(--color-fg)] no-underline transition-opacity hover:opacity-90"
      >
        Ali Abolwafa
      </a>
      <nav aria-label="Primary">
        <ul className="m-0 flex list-none flex-wrap gap-1 p-0 sm:gap-2">
          {nav.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="glass-chip block px-3 py-1.5 text-sm font-medium text-[var(--color-fg)] no-underline transition-colors hover:bg-white/10"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
