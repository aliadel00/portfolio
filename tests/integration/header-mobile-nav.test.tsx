import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Header } from '../../src/components/layout/Header'
import { siteContent } from '../../src/data/site'
import { ThemeProvider } from '../../src/theme/ThemeProvider'

vi.mock('../../src/hooks/useScrollSpy', () => ({
  useScrollSpy: () => null,
}))

vi.mock('../../src/hooks/usePointerMotionEnabled', () => ({
  usePointerMotionEnabled: () => false,
}))

vi.mock('../../src/hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

vi.mock('../../src/hooks/useNavActivePill', () => ({
  useNavActivePill: () => ({
    visible: false,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  }),
}))

vi.mock('../../src/hooks/useSlashFocusNav', () => ({
  useSlashFocusNav: () => {},
}))

vi.mock('../../src/lib/navLiquidGlass', () => ({
  resetNavLinkLiquid: () => {},
  resetNavRailLiquid: () => {},
  setNavLinkLiquid: () => {},
  setNavRailLiquid: () => {},
}))

vi.mock('../../src/lib/sectionNavigation', () => ({
  buildSectionHref: (sectionId: string) => `#${sectionId}`,
  replaceUrlWithSection: () => {},
  scrollToSectionById: () => true,
}))

vi.mock('../../src/lib/showcaseScroll', () => ({
  invalidateShowcaseStickyTopPx: () => {},
}))

vi.mock('../../src/components/SiteLogoMark', () => ({
  SiteLogoMark: () => <span data-testid="site-logo-mark" />,
}))

vi.mock('../../src/components/ui/MaskIcon', () => ({
  MaskIcon: ({ className = '' }: { className?: string }) => (
    <span aria-hidden className={className} data-testid="mask-icon" />
  ),
}))

function appendTopLevelSections() {
  const elements = siteContent.nav.map(({ id, label }) => {
    const section = document.createElement('section')
    section.id = id
    section.setAttribute('aria-label', label)
    document.body.appendChild(section)
    return section
  })

  return () => {
    for (const element of elements) element.remove()
  }
}

afterEach(() => {
  document.documentElement.style.removeProperty('--site-header-total')
})

describe('Header mobile navigation', () => {
  it('keeps the tapped drawer link highlighted until scroll spy updates', async () => {
    const user = userEvent.setup()
    const removeSections = appendTopLevelSections()
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    const { unmount } = render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: siteContent.header.mobileOpenMenu }))

    const mobileNav = screen.getByRole('dialog', { name: siteContent.header.navAriaDesktop })
    const contactLink = within(mobileNav).getByRole('link', { name: 'Contact' })
    expect(contactLink).not.toHaveClass('nav-link-art--active')

    await user.click(contactLink)
    await user.click(screen.getByRole('button', { name: siteContent.header.mobileOpenMenu }))

    const reopenedMobileNav = screen.getByRole('dialog', { name: siteContent.header.navAriaDesktop })
    const reopenedContactLink = within(reopenedMobileNav).getByRole('link', { name: 'Contact' })

    expect(reopenedContactLink).toHaveClass('nav-link-art--active')
    expect(reopenedContactLink).toHaveAttribute('aria-current', 'true')

    unmount()
    scrollTo.mockRestore()
    removeSections()
  })
})
