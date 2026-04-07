import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { BrandLogoImg } from '../../src/components/BrandLogoImg'

describe('BrandLogoImg', () => {
  it('renders a muted placeholder when there are no candidates', () => {
    render(<BrandLogoImg candidates={[]} alt="Acme" />)
    expect(screen.getByRole('img', { name: 'Acme' })).toHaveTextContent('Acme')
  })

  it('renders an image that resolves through publicUrl', () => {
    render(<BrandLogoImg candidates={['/logos/x.svg']} alt="Brand" />)
    const img = screen.getByRole('img', { name: 'Brand' }) as HTMLImageElement
    expect(img).toHaveAttribute('src', '/portfolio/logos/x.svg')
  })

  it('keeps the current candidate when load succeeds with non-zero dimensions', () => {
    render(<BrandLogoImg candidates={['/logos/site-mark-dark.svg']} alt="Ok" />)
    const img = screen.getByRole('img', { name: 'Ok' }) as HTMLImageElement
    Object.defineProperty(img, 'naturalWidth', { configurable: true, value: 48 })
    fireEvent.load(img)
    expect(screen.getByRole('img', { name: 'Ok' })).toHaveAttribute('src', '/portfolio/logos/site-mark-dark.svg')
  })

  it('advances to the next candidate on error', () => {
    render(<BrandLogoImg candidates={['/bad-a.svg', '/logos/site-mark-dark.svg']} alt="Acme" />)
    const first = screen.getByRole('img', { name: 'Acme' }) as HTMLImageElement
    expect(first).toHaveAttribute('src', '/portfolio/bad-a.svg')
    fireEvent.error(first)
    const second = screen.getByRole('img', { name: 'Acme' }) as HTMLImageElement
    expect(second).toHaveAttribute('src', '/portfolio/logos/site-mark-dark.svg')
  })

  it('advances when load reports zero natural width', () => {
    render(<BrandLogoImg candidates={['/bad.svg', '/logos/site-mark-dark.svg']} alt="Co" />)
    const img = screen.getByRole('img', { name: 'Co' }) as HTMLImageElement
    Object.defineProperty(img, 'naturalWidth', { configurable: true, value: 0 })
    fireEvent.load(img)
    expect(screen.getByRole('img', { name: 'Co' })).toHaveAttribute('src', '/portfolio/logos/site-mark-dark.svg')
  })

  it('shows a text fallback after all candidates fail', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<BrandLogoImg candidates={['/missing-one.svg', '/missing-two.svg']} alt="Gone" />)
    fireEvent.error(screen.getByRole('img', { name: 'Gone' }))
    fireEvent.error(screen.getByRole('img', { name: 'Gone' }))
    expect(screen.getByRole('img', { name: 'Gone' })).toHaveTextContent('Missing ONE')
    spy.mockRestore()
  })
})
