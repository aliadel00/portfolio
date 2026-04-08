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
    for (const tile of items) {
      expect(tile.key).toBeTruthy()
      expect(tile.label).toBeTruthy()
      expect(tile.imageAlt).toBeTruthy()
      expect(tile.href.startsWith('http') || tile.href === '#work').toBe(true)
      expect(Array.isArray(tile.brandLogoCandidates)).toBe(true)
      for (const u of tile.brandLogoCandidates) {
        expect(u.startsWith('/')).toBe(true)
      }
    }
  })
})
