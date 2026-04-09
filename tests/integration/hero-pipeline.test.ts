import { describe, expect, it } from 'vitest'
import { heroFeaturedItems, projectsByType } from '../../src/data/projects'

describe('hero featured data pipeline', () => {
  it('exposes career and freelance slices', () => {
    expect(projectsByType('career').length).toBeGreaterThan(0)
    expect(projectsByType('freelance').length).toBeGreaterThan(0)
  })

  it('builds hero strip items with stable keys, copy, and outbound hrefs (logos optional)', () => {
    const items = heroFeaturedItems()
    expect(items.length).toBeGreaterThan(0)
    const hrefs = items.map((t) => t.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
    expect(items[0].href).toContain('thefederationtcc.com')
    expect(hrefs.some((h) => h.includes('linguistscollective.com'))).toBe(true)
    expect(hrefs.some((h) => h.includes('languageshop.uk'))).toBe(true)
    expect(hrefs.some((h) => h.includes('thefederationtcc.com'))).toBe(true)
    for (const tile of items) {
      expect(tile.key).toBeTruthy()
      expect(tile.label).toBeTruthy()
      expect(tile.imageAlt).toBeTruthy()
      expect(tile.href.startsWith('http')).toBe(true)
      expect(Array.isArray(tile.brandLogoCandidates)).toBe(true)
      for (const u of tile.brandLogoCandidates) {
        expect(u.startsWith('/')).toBe(true)
      }
    }
  })
})
