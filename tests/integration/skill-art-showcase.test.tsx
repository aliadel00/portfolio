import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import { HeroImmersiveShowcase } from '@/features/hero/components/HeroImmersiveShowcase'
import { BeamsLoadingProvider } from '@/features/hero/hooks/useBeamsLoading'
import { ThemeProvider } from '@/features/theme/ThemeProvider'

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
