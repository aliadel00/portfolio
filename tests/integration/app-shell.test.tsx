import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from '@/app/App'
import type { SiteContent } from '@/content/siteContent.types'
import { siteContent } from '@/content/site'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { BeamsLoadingProvider } from '@/features/hero/hooks/useBeamsLoading'

/** Lazy sections can exceed the default 1s on slower CI runners. */
const LAZY_SECTION_TIMEOUT = 15_000

vi.mock('@/features/hero/components/HeroIntroBeams', () => ({
  HeroIntroBeams: () => null,
}))

vi.mock('@/features/hero/components/Hero', async () => {
  const { readFileSync: rf } = await import('node:fs')
  const { join: j } = await import('node:path')
  const site = JSON.parse(rf(j(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as SiteContent
  return {
    HeroIntro: () => <h1 className="sr-only">{site.hero.headline}</h1>,
    HeroShowcase: () => null,
  }
})

describe('App shell (integration)', () => {
  it('renders primary navigation and lazy sections with site copy', async () => {
    render(
      <BeamsLoadingProvider initialReady>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BeamsLoadingProvider>,
    )

    expect(screen.getAllByRole('link', { name: siteContent.nav[0].label }).length).toBeGreaterThan(0)

    await waitFor(
      () => {
        expect(
          screen.getAllByRole('heading', { name: siteContent.about.title, level: 2 }).length,
        ).toBeGreaterThan(0)
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.skills.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.work.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.contact.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )
  })
})
