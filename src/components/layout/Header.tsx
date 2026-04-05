import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
} from 'react'
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

function navLinkClasses(liquid: boolean, isActive: boolean) {
  return [
    'nav-link-art relative z-[1] flex min-h-11 w-full min-w-0 items-center justify-start overflow-hidden rounded-full bg-transparent px-3 font-display text-[0.8125rem] font-medium leading-none tracking-[0.04em] no-underline outline-none transition-[color,background-color,box-shadow,transform,letter-spacing] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-9 sm:w-auto sm:min-w-[2.65rem] sm:justify-center sm:px-3.5 sm:text-[0.84375rem]',
    'ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] focus-visible:ring-2',
    'motion-safe:active:scale-[0.97]',
    liquid ? 'nav-liquid-glass' : '',
    isActive ? 'nav-link-art--active' : 'nav-link-art--idle',
  ].join(' ')
}

function BurgerGlyph() {
  return (
    <span className="relative block h-4 w-5 overflow-visible px-0.5" aria-hidden>
      <span className="absolute left-0.5 right-0.5 top-1 h-0.5 rounded-full bg-current" />
      <span className="absolute left-0.5 right-0.5 top-[calc(50%-1px)] h-0.5 rounded-full bg-current" />
      <span className="absolute bottom-1 left-0.5 right-0.5 h-0.5 rounded-full bg-current" />
    </span>
  )
}

function CloseGlyph() {
  return (
    <span className="relative flex h-6 w-6 items-center justify-center overflow-visible" aria-hidden>
      <span className="absolute h-0.5 w-[1.35rem] rounded-full bg-current [transform:rotate(45deg)]" />
      <span className="absolute h-0.5 w-[1.35rem] rounded-full bg-current [transform:rotate(-45deg)]" />
    </span>
  )
}

function BurgerXCrossfade({ open, reducedMotion }: { open: boolean; reducedMotion: boolean }) {
  const t = reducedMotion
    ? 'duration-0'
    : 'duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transition-[opacity,transform]'

  return (
    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center" aria-hidden>
      <span
        className={[
          'absolute inset-0 flex items-center justify-center will-change-[opacity,transform]',
          t,
          open ? 'scale-85 opacity-0' : 'scale-100 opacity-100',
        ].join(' ')}
      >
        <BurgerGlyph />
      </span>
      <span
        className={[
          'absolute inset-0 flex items-center justify-center will-change-[opacity,transform]',
          t,
          open ? 'scale-100 opacity-100' : 'scale-85 opacity-0',
        ].join(' ')}
      >
        <CloseGlyph />
      </span>
    </span>
  )
}

export function Header() {
  const reducedMotion = usePrefersReducedMotion()
  const activeSection = useScrollSpy()
  const shellRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const mobileRailRef = useRef<HTMLDivElement>(null)
  const mobileNavUlRef = useRef<HTMLUListElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const mobileLinkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const focusFirstMobileLinkOnOpenRef = useRef(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [navOverlayTop, setNavOverlayTop] = useState(0)

  const navIds = useMemo(() => nav.map((item) => item.id), [])
  const { focusedIndex, setLinkRef, onLinkKeyDown, onLinkFocus, focusFirstLink, navLinkRefs } =
    useRovingNavLinks(nav.length)

  const pill = useNavActivePill(activeSection, navIds, railRef, navLinkRefs)
  const mobilePill = useNavActivePill(
    activeSection,
    navIds,
    mobileRailRef,
    mobileLinkRefs,
    mobileNavUlRef,
    mobileNavOpen,
  )

  const closeMobileNav = useCallback((opts?: { preventScrollOnBurger?: boolean }) => {
    setMobileNavOpen(false)
    const preventScroll = opts?.preventScrollOnBurger ?? false
    requestAnimationFrame(() => {
      burgerRef.current?.focus({ preventScroll })
    })
  }, [])

  /** Hash links: avoid relying on default scroll alone; closing the menu used to focus the burger and the browser scrolled that into view instead of the section. */
  const navigateToSection =
    (sectionId: (typeof nav)[number]['id']) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const el = document.getElementById(sectionId)
      if (!el) return
      e.preventDefault()

      const doScroll = () => {
        el.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          block: 'start',
        })
        window.history.pushState(null, '', `#${sectionId}`)
      }

      if (mobileNavOpen) {
        closeMobileNav({ preventScrollOnBurger: true })
        requestAnimationFrame(() => {
          requestAnimationFrame(doScroll)
        })
      } else {
        doScroll()
      }
    }

  const focusNavPrimary = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches) {
      focusFirstLink()
      return
    }
    focusFirstMobileLinkOnOpenRef.current = true
    setMobileNavOpen(true)
  }, [focusFirstLink])

  useSlashFocusNav(focusNavPrimary)

  const liquid = !reducedMotion

  const updateNavOverlayTop = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    setNavOverlayTop(el.getBoundingClientRect().bottom)
  }, [])

  useLayoutEffect(() => {
    updateNavOverlayTop()
    const el = shellRef.current
    if (!el) return
    const ro = new ResizeObserver(updateNavOverlayTop)
    ro.observe(el)
    window.addEventListener('scroll', updateNavOverlayTop, { passive: true })
    window.addEventListener('resize', updateNavOverlayTop)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', updateNavOverlayTop)
      window.removeEventListener('resize', updateNavOverlayTop)
    }
  }, [updateNavOverlayTop])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileNav()
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen, closeMobileNav])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useLayoutEffect(() => {
    if (!mobileNavOpen) return
    onLinkFocus(0)
    if (!focusFirstMobileLinkOnOpenRef.current) return
    focusFirstMobileLinkOnOpenRef.current = false
    mobileLinkRefs.current[0]?.focus()
  }, [mobileNavOpen, onLinkFocus])

  const setMobileLinkRef = useCallback((i: number) => (el: HTMLAnchorElement | null) => {
    mobileLinkRefs.current[i] = el
  }, [])

  const onMobileLinkKeyDown = useCallback(
    (i: number) => (e: ReactKeyboardEvent<HTMLAnchorElement>) => {
      const len = nav.length
      const refs = mobileLinkRefs.current
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault()
          refs[(i + 1) % len]?.focus()
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault()
          refs[(i - 1 + len) % len]?.focus()
          break
        case 'Home':
          e.preventDefault()
          refs[0]?.focus()
          break
        case 'End':
          e.preventDefault()
          refs[len - 1]?.focus()
          break
        default:
          break
      }
    },
    [],
  )

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
    <div ref={shellRef} className="sticky top-0 z-50">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[var(--color-bg-deep)] via-[color-mix(in_oklab,var(--color-bg-deep)_88%,transparent)] to-transparent opacity-[0.97]"
        aria-hidden
      />

      <div className="relative z-[52] px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
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
            onFocus={(e) => {
              if (e.target !== e.currentTarget) return
              if (typeof window === 'undefined' || window.matchMedia('(min-width: 640px)').matches) return
              focusFirstMobileLinkOnOpenRef.current = true
              setMobileNavOpen(true)
            }}
            className="relative z-[1] flex min-w-0 items-center justify-end gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)] sm:gap-0"
          >
            <button
              ref={burgerRef}
              type="button"
              className={[
                'site-nav-burger relative z-[2] flex h-11 w-11 shrink-0 items-center justify-center overflow-visible rounded-xl border bg-[color-mix(in_oklab,var(--color-bg-elevated)_72%,transparent)] shadow-[inset_0_1px_0_color-mix(in_oklab,white_10%,transparent)] backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)] motion-safe:active:scale-[0.97] sm:hidden',
                reducedMotion
                  ? 'transition-[transform,colors,box-shadow,border-color,text-shadow] duration-200 ease-out'
                  : 'transition-[transform,colors,box-shadow,border-color,color,text-shadow] duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]',
                mobileNavOpen
                  ? 'nav-link-art--active border-[color-mix(in_oklab,var(--color-accent-2)_32%,transparent)]'
                  : 'border-[color-mix(in_oklab,white_14%,transparent)] text-[var(--color-fg)] hover:border-[color-mix(in_oklab,var(--color-accent-2)_28%,transparent)] hover:text-[var(--color-fg)]',
              ].join(' ')}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
              onClick={() => {
                focusFirstMobileLinkOnOpenRef.current = false
                setMobileNavOpen((o) => !o)
              }}
            >
              <BurgerXCrossfade open={mobileNavOpen} reducedMotion={reducedMotion} />
            </button>

            <div
              ref={railRef}
              className={[
                'nav-rail-liquid nav-rail-art relative hidden items-center gap-px rounded-full p-[5px] sm:flex sm:gap-0.5 sm:p-1.5',
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
                        onClick={navigateToSection(id)}
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
                        className={navLinkClasses(liquid, isActive)}
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

      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        aria-hidden={!mobileNavOpen}
        inert={mobileNavOpen ? undefined : true}
        className={[
          'site-mobile-nav fixed left-0 right-0 bottom-0 z-[45] sm:hidden',
          mobileNavOpen ? 'pointer-events-auto' : 'pointer-events-none invisible opacity-0',
          reducedMotion ? '' : 'transition-[opacity,visibility] duration-100 ease-out',
        ].join(' ')}
        style={{ top: navOverlayTop > 0 ? navOverlayTop : 88 }}
      >
        <button
          type="button"
          tabIndex={-1}
          className="absolute inset-0 border-0 bg-[color-mix(in_oklab,black_52%,transparent)] p-0 backdrop-blur-[3px]"
          aria-label="Close menu"
          onClick={() => closeMobileNav()}
        />
        <div
          className={[
            'relative z-[1] mx-3 mt-2 overflow-hidden rounded-[1.35rem] border border-[color-mix(in_oklab,var(--color-accent-2)_11%,transparent)] shadow-[0_16px_48px_-12px_color-mix(in_oklab,black_50%,transparent)]',
            mobileNavOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
            reducedMotion ? '' : 'transition-[transform,opacity] duration-150 ease-out',
          ].join(' ')}
          style={{
            maxHeight:
              navOverlayTop > 0
                ? `min(calc(100dvh - ${navOverlayTop}px - 0.75rem), 28rem)`
                : 'min(78dvh, 28rem)',
          }}
        >
          <div
            ref={mobileRailRef}
            className={[
              'nav-rail-liquid nav-rail-art relative h-full max-h-[inherit] rounded-[1.35rem] p-[5px]',
              liquid ? 'overflow-hidden' : '',
            ].join(' ')}
            onPointerMove={
              liquid
                ? (e) => {
                    const el = mobileRailRef.current
                    if (el) setNavRailLiquid(el, e.clientX, e.clientY)
                  }
                : undefined
            }
            onPointerLeave={liquid ? (e) => resetNavRailLiquid(e.currentTarget) : undefined}
          >
            <div
              className={['nav-active-pill', reducedMotion ? 'nav-active-pill--instant' : ''].filter(Boolean).join(' ')}
              data-visible={mobilePill.visible && mobileNavOpen ? 'true' : 'false'}
              style={{
                left: mobilePill.left,
                top: mobilePill.top,
                width: Math.max(0, mobilePill.width),
                height: Math.max(0, mobilePill.height),
              }}
              aria-hidden
            />
            <ul
              ref={mobileNavUlRef}
              className="relative z-[2] m-0 flex max-h-[min(22rem,calc(100dvh-12rem))] list-none flex-col gap-px overflow-y-auto overflow-x-hidden p-0"
            >
              {nav.map(({ href, id, label }, i) => {
                const isActive = activeSection === id
                return (
                  <li key={`mobile-${href}`} className="w-full">
                    <a
                      ref={setMobileLinkRef(i)}
                      href={href}
                      tabIndex={mobileNavOpen && focusedIndex === i ? 0 : -1}
                      aria-current={isActive ? 'true' : undefined}
                      onClick={navigateToSection(id)}
                      onFocus={() => onLinkFocus(i)}
                      onKeyDown={onMobileLinkKeyDown(i)}
                      onPointerMove={
                        liquid
                          ? (e) => {
                              setNavLinkLiquid(e.currentTarget, e.clientX, e.clientY)
                            }
                          : undefined
                      }
                      onPointerLeave={liquid ? (e) => resetNavLinkLiquid(e.currentTarget) : undefined}
                      className={navLinkClasses(liquid, isActive)}
                    >
                      <span className="nav-link-art__label">{label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
