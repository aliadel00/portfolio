export function Footer() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-[var(--color-fg-muted)]">
      <p className="m-0">
        © {new Date().getFullYear()} Ali Abolwafa · Vite, React, Tailwind CSS, React Three Fiber · Hosted on GitHub Pages
      </p>
    </footer>
  )
}
