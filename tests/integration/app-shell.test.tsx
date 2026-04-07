import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from '../../src/App'
import type { SiteContent } from '../../src/data/siteContent.types'
import { siteContent } from '../../src/data/site'
import { ThemeProvider } from '../../src/theme/ThemeProvider'

vi.mock('../../src/components/sections/Hero', async () => {
  const { readFileSync: rf } = await import('node:fs')
  const { join: j } = await import('node:path')
  const site = JSON.parse(rf(j(process.cwd(), 'src/data/siteContent.json'), 'utf8')) as SiteContent
  return {
    Hero: () => <h1 className="sr-only">{site.hero.headline}</h1>,
  }
})

describe('App shell (integration)', () => {
  it('renders primary navigation and lazy sections with site copy', async () => {
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    expect(screen.getByRole('link', { name: siteContent.nav[0].label })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByRole('heading', { name: siteContent.about.title, level: 2 }).length).toBeGreaterThan(0)
    })
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: siteContent.skills.title, level: 2 })).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: siteContent.work.title, level: 2 })).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: siteContent.contact.title, level: 2 })).toBeInTheDocument()
    })
  })
})
