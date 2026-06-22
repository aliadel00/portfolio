import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { HeroSkillCardArt } from '../../src/components/sections/HeroSkillCardArt'
import { ThemeProvider } from '../../src/theme/ThemeProvider'

describe('HeroSkillCardArt', () => {
  it('renders lazy-loaded SVG art for a known category', async () => {
    render(
      <ThemeProvider>
        <HeroSkillCardArt categoryId="frontend" isActive />
      </ThemeProvider>,
    )

    expect(document.querySelector('[data-skill-art="frontend"]')).toBeTruthy()
    await waitFor(() => {
      expect(document.querySelector('[data-skill-art="frontend"] svg')).toBeTruthy()
    })
  })

  it('returns null for unknown categories', () => {
    const { container } = render(<HeroSkillCardArt categoryId="nope" />)
    expect(container.firstChild).toBeNull()
  })
})
