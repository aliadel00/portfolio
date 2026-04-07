import { describe, expect, it } from 'vitest'
import { publicUrl } from '../../src/lib/publicAsset'

describe('publicUrl', () => {
  it('returns http, https, and data URLs unchanged', () => {
    expect(publicUrl('https://example.com/x')).toBe('https://example.com/x')
    expect(publicUrl('http://example.com/x')).toBe('http://example.com/x')
    expect(publicUrl('data:image/svg+xml,<svg/>')).toBe('data:image/svg+xml,<svg/>')
  })

  it('joins Vite base with a path and normalizes a leading slash', () => {
    expect(publicUrl('icons/a.svg')).toBe('/portfolio/icons/a.svg')
    expect(publicUrl('/icons/a.svg')).toBe('/portfolio/icons/a.svg')
  })
})
