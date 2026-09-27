import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from '@/app/App'
import type { SiteContent } from '@/content/siteContent.types'
import { siteContent } from '@/content/site'
import { projectsByType } from '@/content/projects'
import { skillCategories } from '@/content/skills'
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
  it('opens section files from the activity bar', async () => {
    const user = userEvent.setup()
    render(
      <BeamsLoadingProvider initialReady>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BeamsLoadingProvider>,
    )

    expect(screen.getByRole('button', { name: 'Versions, v3' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: siteContent.shell.homeLabel }).length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: siteContent.about.title }))
    await user.click(screen.getByRole('treeitem', { name: siteContent.about.eyebrow }))
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.about.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )

    await user.click(screen.getByRole('button', { name: siteContent.skills.title }))
    await user.click(screen.getByRole('treeitem', { name: skillCategories[0].title }))
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.skills.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )

    await user.click(screen.getByRole('button', { name: siteContent.work.title }))
    await user.click(screen.getByRole('treeitem', { name: projectsByType('career')[0].title }))
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.work.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )

    await user.click(screen.getByRole('button', { name: siteContent.contact.title }))
    await user.click(screen.getByRole('treeitem', { name: siteContent.contact.email }))
    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: siteContent.contact.title, level: 2 })).toBeInTheDocument()
      },
      { timeout: LAZY_SECTION_TIMEOUT },
    )

    await user.click(screen.getByRole('button', { name: 'Versions, v3' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'v1' }))
    expect(screen.getByTitle('Versions, v1')).toHaveAttribute('src', expect.stringContaining('versions/v1/index.html'))

    await user.click(screen.getByRole('button', { name: 'Versions, v1' }))
    await user.click(screen.getByRole('menuitemradio', { name: 'v2' }))
    expect(screen.getByTitle('Versions, v2')).toHaveAttribute('src', expect.stringContaining('versions/v2/index.html'))
  })
})
