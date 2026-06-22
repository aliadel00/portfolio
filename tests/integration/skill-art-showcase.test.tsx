import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { HeroImmersiveShowcase } from '../../src/components/sections/HeroImmersiveShowcase'
import { BeamsLoadingProvider } from '../../src/hooks/useBeamsLoading'
import { ThemeProvider } from '../../src/theme/ThemeProvider'

describe('Hero skill art showcase (integration)', () => {
  it('renders skill category slides with external SVG illustrations', async () => {
    render(
      <BeamsLoadingProvider initialReady>
        <ThemeProvider>
          <HeroImmersiveShowcase reducedMotion />
        </ThemeProvider>
      </BeamsLoadingProvider>,
    )

    await waitFor(() => {
      const arts = document.querySelectorAll('[data-skill-art] svg')
      expect(arts.length).toBeGreaterThanOrEqual(4)
    })
  })
})
