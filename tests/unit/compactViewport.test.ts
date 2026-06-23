import { describe, expect, it } from 'vitest'
import { COMPACT_VIEWPORT_MEDIA } from '../../src/lib/compactViewport'

describe('COMPACT_VIEWPORT_MEDIA', () => {
  it('matches portrait phones and short landscape viewports', () => {
    expect(COMPACT_VIEWPORT_MEDIA).toContain('max-width: 639px')
    expect(COMPACT_VIEWPORT_MEDIA).toContain('max-height: 520px')
  })
})
