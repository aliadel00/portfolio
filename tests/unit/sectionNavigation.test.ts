import { describe, expect, it } from 'vitest'
import {
  ARROW_SECTION_IDS,
  HERO_CAPABILITIES_SECTION_ID,
  HERO_INTRO_SECTION_ID,
} from '../../src/lib/sectionNavigation'

describe('sectionNavigation', () => {
  it('places hero intro and capabilities before about for arrow-key navigation', () => {
    const heroIntroIndex = ARROW_SECTION_IDS.indexOf(HERO_INTRO_SECTION_ID)
    const capabilitiesIndex = ARROW_SECTION_IDS.indexOf(HERO_CAPABILITIES_SECTION_ID)
    const aboutIndex = ARROW_SECTION_IDS.indexOf('about')

    expect(heroIntroIndex).toBe(0)
    expect(capabilitiesIndex).toBe(heroIntroIndex + 1)
    expect(aboutIndex).toBe(capabilitiesIndex + 1)
  })
})
