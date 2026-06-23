import { describe, expect, it } from 'vitest'
import { projectsByType } from '@/content/projects'

describe('projects data', () => {
  it('exposes career and freelance slices', () => {
    expect(projectsByType('career').length).toBeGreaterThan(0)
    expect(projectsByType('freelance').length).toBeGreaterThan(0)
  })

  it('includes outbound links on public-facing freelance work', () => {
    const freelance = projectsByType('freelance')
    const withLive = freelance.filter((p) => p.links.live?.startsWith('http'))
    expect(withLive.length).toBeGreaterThan(0)
  })
})
