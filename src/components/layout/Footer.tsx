import type { MouseEvent } from 'react'
import { siteContent } from '../../data/site'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { buildSectionHref, scrollToSectionById } from '../../lib/sectionNavigation'
import { SiteLogoMark } from '../SiteLogoMark'
import { MaskIcon } from '../ui/MaskIcon'

export function Footer() {
  const reducedMotion = usePrefersReducedMotion()
  const { meta, nav, footer } = siteContent
  const year = new Date().getFullYear()

  const onSectionClick =
    (sectionId: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      scrollToSectionById(sectionId, reducedMotion)
    }

  const onBackToTop = onSectionClick('hero')

  return (
    <footer className="site-footer site-footer-edge mx-auto max-w-5xl px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 sm:px-6 sm:pb-10 sm:pt-14">
      <div className="site-footer__brand">
        <a
          href={buildSectionHref('hero')}
          onClick={onBackToTop}
          className="site-footer__brand-link group inline-flex max-w-full items-center gap-3 no-underline outline-none"
        >
          <SiteLogoMark className="site-footer__mark h-8 w-auto shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.03]" />
          <span className="min-w-0 text-left">
            <span className="font-display block text-[0.875rem] font-semibold tracking-[-0.01em] text-[var(--color-fg)] sm:truncate">
              {meta.personName}
            </span>
            <span className="mt-0.5 block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-[var(--color-fg-muted)] sm:truncate">
              {meta.jobTitle}
            </span>
          </span>
        </a>
      </div>

      <nav className="site-footer__nav" aria-label={footer.navAriaLabel}>
        <ul className="site-footer__nav-list m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 sm:justify-end">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={buildSectionHref(item.id)}
                onClick={onSectionClick(item.id)}
                className="site-footer__link"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p className="site-footer__meta m-0 text-pretty">
        <span className="site-footer__meta-primary">© {year} {meta.personName}</span>
        <span className="site-footer__meta-sep" aria-hidden>
          ·
        </span>
        <span className="site-footer__meta-secondary">
          {footer.builtWith}
          <span className="site-footer__meta-sep" aria-hidden>
            ·
          </span>
          {footer.hostedOn}
        </span>
      </p>

      <a
        href={buildSectionHref('hero')}
        onClick={onBackToTop}
        className="site-footer__top max-sm:hero-os-capability max-sm:glass-chip"
      >
        <span className="site-footer__top-line" aria-hidden />
        {footer.backToTop}
        <MaskIcon src="icons/arrow-down.svg" className="site-footer__top-icon" width={14} height={14} />
      </a>
    </footer>
  )
}
