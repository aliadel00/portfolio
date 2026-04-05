import { siteContent } from '../../data/site'

export function Footer() {
  const line = siteContent.footer.template.replace('{year}', String(new Date().getFullYear()))
  return (
    <footer className="site-footer-edge px-4 py-12 text-center text-sm text-[var(--color-fg-muted)]">
      <p className="m-0">{line}</p>
    </footer>
  )
}
