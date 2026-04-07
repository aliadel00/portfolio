import { describe, expect, it } from 'vitest'
import { brandLogoCandidatesForProject } from '../../src/lib/brandLogo'

describe('brandLogoCandidatesForProject', () => {
  it('returns an empty list when brandLogoUrl is missing or blank', () => {
    expect(brandLogoCandidatesForProject({})).toEqual([])
    expect(brandLogoCandidatesForProject({ brandLogoUrl: '' })).toEqual([])
    expect(brandLogoCandidatesForProject({ brandLogoUrl: '   ' })).toEqual([])
  })

  it('returns a single trimmed local path when brandLogoUrl is set', () => {
    expect(brandLogoCandidatesForProject({ brandLogoUrl: ' /logos/x.svg ' })).toEqual(['/logos/x.svg'])
  })
})
