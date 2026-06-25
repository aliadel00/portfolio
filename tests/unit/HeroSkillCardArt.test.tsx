import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { HeroSkillCardArt } from '@/features/hero/components/HeroSkillCardArt'
import { ThemeProvider } from '@/features/theme/ThemeProvider'

describe('HeroSkillCardArt', () => {
  it('renders lazy-loaded SVG art for a known category', async () => {
    render(
      <ThemeProvider>
        <HeroSkillCardArt categoryId="frontend" isActive />
      </ThemeProvider>,
    )

    expect(document.querySelector('[data-skill-art="frontend"]')).toBeTruthy()
    await waitFor(
      () => {
        expect(document.querySelector('[data-skill-art="frontend"] svg')).toBeTruthy()
      },
      { timeout: 3000 },
    )
  })

  it('returns null for unknown categories', () => {
    const { container } = render(<HeroSkillCardArt categoryId="nope" />)
    expect(container.firstChild).toBeNull()
  })
})
