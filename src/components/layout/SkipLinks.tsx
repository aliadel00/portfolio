const linkClass =
  'sr-only left-4 z-[100] rounded-xl border border-[color-mix(in_oklab,white_18%,transparent)] bg-[var(--color-bg-elevated)] px-4 py-3 text-sm font-medium text-[var(--color-fg)] shadow-lg focus:not-sr-only focus:fixed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)]'

export function SkipLinks() {
  return (
    <>
      <a href="#main-content" className={`${linkClass} top-4`}>
        Skip to main content
      </a>
      <a
        href="#site-navigation"
        className={`${linkClass} top-[4.25rem] sm:top-[4.5rem]`}
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('site-navigation')?.focus()
        }}
      >
        Skip to primary navigation
      </a>
    </>
  )
}
