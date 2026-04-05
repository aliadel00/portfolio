import { useMemo, useRef, type MouseEvent } from 'react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useNavActivePill } from '../../hooks/useNavActivePill'
import { useRovingNavLinks } from '../../hooks/useRovingNavLinks'
import { useSlashFocusNav } from '../../hooks/useSlashFocusNav'
import {
  resetNavLinkLiquid,
  resetNavRailLiquid,
  setNavLinkLiquid,
  setNavRailLiquid,
} from '../../lib/navLiquidGlass'

const nav = [
  { href: '#about', id: 'about' as const, label: 'About' },
  { href: '#skills', id: 'skills' as const, label: 'Skills' },
  { href: '#work', id: 'work' as const, label: 'Work' },
  { href: '#contact', id: 'contact' as const, label: 'Contact' },
] as const

const homeHref = import.meta.env.BASE_URL

export function Header() {
  const reducedMotion = usePrefersReducedMotion()
  const activeSection = useScrollSpy()
  const railRef = useRef<HTMLDivElement>(null)
  const navIds = useMemo(() => nav.map((item) => item.id), [])
  const { focusedIndex, setLinkRef, onLinkKeyDown, onLinkFocus, focusFirstLink, navLinkRefs } =
    useRovingNavLinks(nav.length)

  const pill = useNavActivePill(activeSection, navIds, railRef, navLinkRefs)

  useSlashFocusNav(focusFirstLink)

  const liquid = !reducedMotion

  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="sticky top-0 z-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg-deep)] via-[color-mix(in_oklab,var(--color-bg-deep)_88%,transparent)] to-transparent opacity-[0.97]"
        aria-hidden
      />

      <div className="relative px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
        <header className="site-header-bar relative mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-[2rem] border border-transparent bg-transparent px-3 py-2 pl-3 sm:gap-5 sm:rounded-full sm:py-2 sm:pl-4 sm:pr-2.5">
          <a
            href={homeHref}
            onClick={onLogoClick}
            className="site-logo-masthead group/site-logo relative z-[1] flex min-h-11 min-w-0 shrink-0 items-stretch gap-2.5 rounded-xl no-underline outline-none ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] transition-[transform,colors,filter] duration-300 focus-visible:ring-2 motion-safe:active:scale-[0.99] sm:min-h-0 sm:rounded-full sm:py-0.5 sm:pl-0.5 sm:pr-1"
          >
            <span className="site-logo-masthead__accent" aria-hidden />
            <span className="flex min-w-0 flex-col justify-center">
              <span className="font-display text-base font-semibold tracking-[-0.02em] text-[var(--color-fg)] transition-colors duration-300 group-hover/site-logo:text-[color-mix(in_oklab,var(--color-fg)_88%,var(--color-accent-2))] sm:text-[1.0625rem]">
                Ali Abolwafa
              </span>
              <span className="font-display text-[0.625rem] font-medium leading-tight tracking-[0.14em] text-[color-mix(in_oklab,var(--color-fg-muted)_96%,var(--color-accent-2))] transition-colors duration-300 group-hover/site-logo:text-[color-mix(in_oklab,var(--color-fg-muted)_82%,var(--color-accent-2))] sm:text-[0.65rem]">
                Portfolio
              </span>
            </span>
          </a>

          <nav
            id="site-navigation"
            aria-label="Primary"
            aria-keyshortcuts="/"
            aria-description="Arrow keys move between links. Press slash to jump here from the page."
            tabIndex={-1}
            className="relative z-[1] min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)]"
          >
            <div
              ref={railRef}
              className={[
                'nav-rail-liquid nav-rail-art relative flex items-center gap-px rounded-full p-[5px] sm:gap-0.5 sm:p-1.5',
                liquid ? 'overflow-hidden' : '',
              ].join(' ')}
              onPointerMove={
                liquid
                  ? (e) => {
                      setNavRailLiquid(e.currentTarget, e.clientX, e.clientY)
                    }
                  : undefined
              }
              onPointerLeave={liquid ? (e) => resetNavRailLiquid(e.currentTarget) : undefined}
            >
              <div
                className={['nav-active-pill', reducedMotion ? 'nav-active-pill--instant' : ''].filter(Boolean).join(' ')}
                data-visible={pill.visible ? 'true' : 'false'}
                style={{
                  left: pill.left,
                  top: pill.top,
                  width: Math.max(0, pill.width),
                  height: Math.max(0, pill.height),
                }}
                aria-hidden
              />
              <ul className="relative z-[2] m-0 flex list-none items-center gap-px p-0 sm:gap-0.5">
                {nav.map(({ href, id, label }, i) => {
                  const isActive = activeSection === id
                  return (
                    <li key={href}>
                      <a
                        ref={setLinkRef(i)}
                        href={href}
                        tabIndex={focusedIndex === i ? 0 : -1}
                        aria-current={isActive ? 'true' : undefined}
                        onFocus={() => onLinkFocus(i)}
                        onKeyDown={onLinkKeyDown(i)}
                        onPointerMove={
                          liquid
                            ? (e) => {
                                setNavLinkLiquid(e.currentTarget, e.clientX, e.clientY)
                              }
                            : undefined
                        }
                        onPointerLeave={liquid ? (e) => resetNavLinkLiquid(e.currentTarget) : undefined}
                        className={[
                          'nav-link-art relative z-[1] flex min-h-11 min-w-[2.65rem] items-center justify-center overflow-hidden rounded-full bg-transparent px-3 font-display text-[0.8125rem] font-medium leading-none tracking-[0.04em] no-underline outline-none transition-[color,background-color,box-shadow,transform,letter-spacing] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-9 sm:px-3.5 sm:text-[0.84375rem]',
                          'ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] focus-visible:ring-2',
                          'motion-safe:active:scale-[0.97]',
                          liquid ? 'nav-liquid-glass' : '',
                          isActive ? 'nav-link-art--active' : 'nav-link-art--idle',
                        ].join(' ')}
                      >
                        <span className="nav-link-art__label">{label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </header>
      </div>
    </div>
  )
}
