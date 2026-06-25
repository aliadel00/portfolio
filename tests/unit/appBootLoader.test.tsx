import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppSpinner } from '@/shared/ui/AppSpinner'
import {
  APP_BOOT_LOADER_ID,
  dismissAppBootLoader,
} from '@/shared/lib/appBootLoader'

describe('AppSpinner', () => {
  it('exposes an accessible loading status', () => {
    render(<AppSpinner label="Loading portfolio" />)
    expect(screen.getByRole('status', { name: 'Loading portfolio' })).toBeInTheDocument()
  })
})

describe('appBootLoader', () => {
  it('hides the static boot loader without removing it from the DOM', () => {
    vi.useFakeTimers()
    const el = document.createElement('div')
    el.id = APP_BOOT_LOADER_ID
    document.body.appendChild(el)

    dismissAppBootLoader()
    vi.advanceTimersByTime(420)

    expect(document.getElementById(APP_BOOT_LOADER_ID)).toBe(el)
    expect(el.style.display).toBe('none')
    expect(el.getAttribute('aria-hidden')).toBe('true')
    expect(el.getAttribute('aria-busy')).toBe('false')
    vi.useRealTimers()
  })
})
