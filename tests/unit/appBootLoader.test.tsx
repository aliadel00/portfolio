import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppSpinner } from '../../src/components/ui/AppSpinner'
import {
  APP_BOOT_LOADER_ID,
  dismissAppBootLoader,
} from '../../src/lib/appBootLoader'

describe('AppSpinner', () => {
  it('exposes an accessible loading status', () => {
    render(<AppSpinner label="Loading portfolio" />)
    expect(screen.getByRole('status', { name: 'Loading portfolio' })).toBeInTheDocument()
  })
})

describe('appBootLoader', () => {
  it('removes the static boot loader element', () => {
    vi.useFakeTimers()
    const el = document.createElement('div')
    el.id = APP_BOOT_LOADER_ID
    document.body.appendChild(el)

    dismissAppBootLoader()
    vi.advanceTimersByTime(420)

    expect(document.getElementById(APP_BOOT_LOADER_ID)).toBeNull()
    vi.useRealTimers()
  })
})
