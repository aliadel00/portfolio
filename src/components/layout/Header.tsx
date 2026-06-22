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
import { usePointerMotionEnabled } from '../../hooks/usePointerMotionEnabled'
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
import { SiteLogoMark } from '../SiteLogoMark'
import { MaskIcon } from '../ui/MaskIcon'
import { siteContent } from '../../data/site'
import { useTheme } from '../../theme/ThemeProvider'
import {
  buildSectionHref,
  replaceUrlWithSection,
  scrollToSectionById,
} from '../../lib/sectionNavigation'
import { invalidateShowcaseStickyTopPx } from '../../lib/showcaseScroll'

const nav = siteContent.nav

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

function NavItemIcon({ id }: { id: string }) {
  const iconById: Record<string, string> = {
    about: 'icons/nav-about.svg',
    skills: 'icons/nav-skills.svg',
    work: 'icons/nav-work.svg',
    contact: 'icons/nav-contact.svg',
  }
  const src = iconById[id]
  if (!src) return null
  return <MaskIcon src={src} className="nav-link-art__icon h-[1.1rem] w-[1.1rem] shrink-0 opacity-90" width={18} height={18} />
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

function ThemeGlyphSun() {
  return <MaskIcon src="icons/theme-sun.svg" className="h-[1.125rem] w-[1.125rem]" width={18} height={18} />
}

function ThemeGlyphMoon() {
  return <MaskIcon src="icons/theme-moon.svg" className="h-[1.125rem] w-[1.125rem]" width={18} height={18} />
}

function ThemeToggle({ variant = 'icon' }: { variant?: 'drawer' | 'icon' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? siteContent.header.themeSwitchToLight : siteContent.header.themeSwitchToDark

  if (variant === 'drawer') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={[
          'nav-theme-toggle nav-theme-toggle--drawer',
          'nav-link-art nav-link-art--idle relative z-[1] flex min-h-11 w-full min-w-0 items-center justify-start overflow-hidden rounded-full bg-transparent px-3 font-display text-[0.8125rem] font-medium leading-none tracking-[0.04em] outline-none',
          'ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] focus-visible:ring-2',
          'motion-safe:active:scale-[0.97]',
        ].join(' ')}
        aria-label={label}
      >
        <span className="nav-link-art__inner">
          {isDark ? <ThemeGlyphSun /> : <ThemeGlyphMoon />}
          <span className="nav-link-art__label">{label}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={[
        'nav-theme-toggle',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)]',
      ].join(' ')}
      aria-label={label}
    >
      {isDark ? <ThemeGlyphSun /> : <ThemeGlyphMoon />}
    </button>
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
  const pointerMotionEnabled = usePointerMotionEnabled()
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

  const scrollToSection = useCallback(
    (sectionId: (typeof nav)[number]['id']) => {
      const didScroll = scrollToSectionById(sectionId, reducedMotion)
      if (!didScroll) return
      replaceUrlWithSection(sectionId)
    },
    [reducedMotion],
  )

  const navigateToSection =
    (sectionId: (typeof nav)[number]['id']) => (e: MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (!document.getElementById(sectionId)) return
      e.preventDefault()

      if (mobileNavOpen) {
        closeMobileNav({ preventScrollOnBurger: true })
        requestAnimationFrame(() => {
          requestAnimationFrame(() => scrollToSection(sectionId))
        })
      } else {
        scrollToSection(sectionId)
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

  const liquid = !reducedMotion && pointerMotionEnabled

  const updateNavOverlayTop = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    const height = Math.ceil(el.getBoundingClientRect().height)
    setNavOverlayTop(height)
    document.documentElement.style.setProperty('--site-header-total', `${height}px`)
    invalidateShowcaseStickyTopPx()
  }, [])

  useLayoutEffect(() => {
    updateNavOverlayTop()
    const el = shellRef.current
    if (!el) return
    const ro = new ResizeObserver(updateNavOverlayTop)
    ro.observe(el)
    window.addEventListener('resize', updateNavOverlayTop)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateNavOverlayTop)
    }
  }, [updateNavOverlayTop])

  useEffect(() => {
    if (!mobileNavOpen) return
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.width = '100%'
    style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileNav()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.width = ''
      style.overflow = ''
      window.scrollTo(0, scrollY)
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
    mobileLinkRefs.current[0]?.focus({ preventScroll: true })
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
    const hero = document.getElementById('hero')
    if (hero) {
      scrollToSectionById('hero', reducedMotion)
      replaceUrlWithSection('hero')
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
  }

  const onLogoPointerMove = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (reducedMotion || !pointerMotionEnabled) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      if (r.width < 1 || r.height < 1) return
      const x = ((e.clientX - r.left) / r.width) * 100
      const y = ((e.clientY - r.top) / r.height) * 100
      el.style.setProperty('--logo-glow-x', `${x.toFixed(2)}%`)
      el.style.setProperty('--logo-glow-y', `${y.toFixed(2)}%`)
    },
    [reducedMotion, pointerMotionEnabled],
  )

  const onLogoPointerLeave = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.removeProperty('--logo-glow-x')
    e.currentTarget.style.removeProperty('--logo-glow-y')
  }, [])

  return (
    <div ref={shellRef} className="dynamic-island-header sticky top-0 z-50">
      <div className="relative z-[52] flex justify-center px-4 pb-3 pt-[max(0.65rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-4 sm:pt-4">
        <header className="site-header-bar dynamic-island-bar relative flex w-full max-w-xl items-center justify-between gap-2 rounded-full px-2 py-1.5 pl-2.5 sm:w-auto sm:max-w-none sm:justify-center sm:gap-3 sm:px-3 sm:py-2 sm:pl-3">
          <span className="dynamic-island-bar__gem shrink-0" aria-hidden>
            <span className="dynamic-island-bar__sensor">
              <span className="dynamic-island-bar__gem-silk" aria-hidden />
              <span className="dynamic-island-bar__gem-star" aria-hidden />
            </span>
          </span>
          <a
            href={homeHref}
            onClick={onLogoClick}
            onMouseMove={pointerMotionEnabled && !reducedMotion ? onLogoPointerMove : undefined}
            onMouseLeave={pointerMotionEnabled ? onLogoPointerLeave : undefined}
            className="dynamic-island-bar__logo site-logo-masthead group/site-logo relative z-[1] flex min-h-9 min-w-0 shrink-0 items-center gap-2 rounded-full no-underline outline-none ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] focus-visible:ring-2 sm:min-h-0 sm:gap-2.5 sm:py-0.5 sm:pl-0.5 sm:pr-1"
          >
            <SiteLogoMark className="site-logo-masthead__mark relative z-[1]" />
            <span className="dynamic-island-bar__logo-copy relative z-[1] flex min-w-0 flex-col justify-center">
              <span className="font-display text-[0.9375rem] font-semibold tracking-[-0.02em] sm:text-[1rem]">
                Ali Abolwafa
              </span>
              <span className="dynamic-island-bar__logo-eyebrow font-display text-[0.625rem] font-medium leading-tight tracking-[0.12em]">
                Portfolio
              </span>
            </span>
          </a>

          <nav
            id="site-navigation"
            aria-label={siteContent.header.navAriaPrimary}
            aria-keyshortcuts="/"
            aria-description="Arrow keys move between links. Press slash to jump here from the page."
            tabIndex={-1}
            onFocus={(e) => {
              if (e.target !== e.currentTarget) return
              if (typeof window === 'undefined' || window.matchMedia('(min-width: 640px)').matches) return
              focusFirstMobileLinkOnOpenRef.current = true
              setMobileNavOpen(true)
            }}
            className="dynamic-island-bar__nav relative z-[1] flex min-w-0 items-center justify-end gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)] sm:gap-2"
          >
            <button
              ref={burgerRef}
              type="button"
              className={[
                'site-nav-burger dynamic-island-bar__menu relative z-[2] flex h-9 w-9 shrink-0 items-center justify-center overflow-visible rounded-full border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-2)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-deep)] motion-safe:active:scale-[0.97] sm:hidden',
                reducedMotion
                  ? 'transition-transform duration-200 ease-out'
                  : 'transition-transform duration-220 ease-[cubic-bezier(0.22,1,0.36,1)]',
                mobileNavOpen ? 'dynamic-island-bar__menu--open' : '',
              ].join(' ')}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={
                mobileNavOpen ? siteContent.header.mobileCloseMenu : siteContent.header.mobileOpenMenu
              }
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
                'nav-rail-liquid nav-rail-art dynamic-island-bar__rail relative hidden items-center gap-px rounded-full p-1 sm:flex sm:gap-0.5',
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
                        href={buildSectionHref(id)}
                        data-nav-id={id}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={navigateToSection(id)}
                        onFocus={() => onLinkFocus(i)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                            e.preventDefault()
                            return
                          }
                          onLinkKeyDown(i)(e)
                          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
                          const len = nav.length
                          const nextIndex =
                            e.key === 'ArrowDown' ? (i + 1) % len : (i - 1 + len) % len
                          scrollToSection(nav[nextIndex].id)
                        }}
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
                        <span className="nav-link-art__inner">
                          <NavItemIcon id={id} />
                          <span className="nav-link-art__label">{label}</span>
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div
              className={[
                'nav-theme-rail dynamic-island-bar__theme-rail hidden sm:flex nav-rail-liquid nav-rail-art',
                'relative items-center gap-px rounded-full p-1 sm:gap-0.5',
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
              <ThemeToggle />
            </div>

          </nav>
        </header>
      </div>

      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={siteContent.header.navAriaDesktop}
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
          className="site-mobile-nav-backdrop absolute inset-0 border-0 p-0 backdrop-blur-[3px]"
          aria-label={siteContent.header.drawerClose}
          onClick={() => closeMobileNav()}
        />
        <div
          className={[
            'site-mobile-nav-panel dynamic-island-bar__drawer relative z-[1] mx-3 mt-2 overflow-hidden rounded-[1.35rem] border',
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
                      href={buildSectionHref(id)}
                      data-nav-id={id}
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
                      <span className="nav-link-art__inner">
                        <NavItemIcon id={id} />
                        <span className="nav-link-art__label">{label}</span>
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <div className="site-mobile-nav-footer relative z-[2] mt-px border-t border-[color-mix(in_oklab,white_10%,transparent)] pt-px">
              <ThemeToggle variant="drawer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
