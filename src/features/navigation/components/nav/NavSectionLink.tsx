import type { KeyboardEvent, MouseEvent } from 'react'
import { resetNavLinkLiquid, setNavLinkLiquid } from '@/features/navigation/lib/navLiquidGlass'
import { MaskIcon } from '@/shared/ui/MaskIcon'

const NAV_ICON_BY_ID: Record<string, string> = {
  about: 'icons/nav-about.svg',
  skills: 'icons/nav-skills.svg',
  work: 'icons/nav-work.svg',
  contact: 'icons/nav-contact.svg',
}

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
  const src = NAV_ICON_BY_ID[id]
  if (!src) return null
  return (
    <MaskIcon
      src={src}
      className="nav-link-art__icon h-[1.1rem] w-[1.1rem] shrink-0 opacity-90"
      width={18}
      height={18}
    />
  )
}

type Props = {
  id: string
  label: string
  href: string
  isActive: boolean
  liquid: boolean
  tabIndex?: number
  linkRef: (el: HTMLAnchorElement | null) => void
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void
  onFocus: () => void
  onKeyDown: (e: KeyboardEvent<HTMLAnchorElement>) => void
}

export function NavSectionLink({
  id,
  label,
  href,
  isActive,
  liquid,
  tabIndex,
  linkRef,
  onClick,
  onFocus,
  onKeyDown,
}: Props) {
  return (
    <a
      ref={linkRef}
      href={href}
      data-nav-id={id}
      tabIndex={tabIndex}
      aria-current={isActive ? 'true' : undefined}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
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
  )
}
