import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ARROW_SECTION_IDS,
  HERO_CAPABILITIES_SECTION_ID,
  HERO_INTRO_SECTION_ID,
  resolveNavActiveSectionId,
  scrollToSectionById,
} from '@/features/navigation/lib/sectionNavigation'

vi.mock('@/features/hero/lib/showcaseScroll', () => ({
  isHeroCapabilitiesNavActive: vi.fn(() => false),
  getHeroCapabilitiesEntryScrollY: vi.fn(() => null),
}))

import { isHeroCapabilitiesNavActive } from '@/features/hero/lib/showcaseScroll'

const mockedCapabilitiesActive = vi.mocked(isHeroCapabilitiesNavActive)

function mockRect(el: HTMLElement, rect: Partial<DOMRect>) {
  el.getBoundingClientRect = () =>
    ({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      toJSON: () => ({}),
      ...rect,
    }) as DOMRect
}

describe('sectionNavigation', () => {
  beforeEach(() => {
    mockedCapabilitiesActive.mockReturnValue(false)
    document.body.replaceChildren()
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000, writable: true })
  })

  afterEach(() => {
    document.body.replaceChildren()
  })

  it('places hero intro and capabilities before about for arrow-key navigation', () => {
    const heroIntroIndex = ARROW_SECTION_IDS.indexOf(HERO_INTRO_SECTION_ID)
    const capabilitiesIndex = ARROW_SECTION_IDS.indexOf(HERO_CAPABILITIES_SECTION_ID)
    const aboutIndex = ARROW_SECTION_IDS.indexOf('about')

    expect(heroIntroIndex).toBe(0)
    expect(capabilitiesIndex).toBe(heroIntroIndex + 1)
    expect(aboutIndex).toBe(capabilitiesIndex + 1)
  })

  it('returns null while the hero intro still dominates the viewport', () => {
    const heroIntro = document.createElement('section')
    heroIntro.id = HERO_INTRO_SECTION_ID
    mockRect(heroIntro, { bottom: 500 })
    document.body.appendChild(heroIntro)

    const about = document.createElement('section')
    about.id = 'about'
    mockRect(about, { top: 200 })
    document.body.appendChild(about)

    expect(resolveNavActiveSectionId(['about'])).toBeNull()
  })

  it('returns null while the hero capabilities showcase is active', () => {
    const capabilities = document.createElement('section')
    capabilities.id = HERO_CAPABILITIES_SECTION_ID
    document.body.appendChild(capabilities)
    mockedCapabilitiesActive.mockReturnValue(true)

    const about = document.createElement('section')
    about.id = 'about'
    mockRect(about, { top: 100 })
    document.body.appendChild(about)

    expect(resolveNavActiveSectionId(['about'])).toBeNull()
    expect(mockedCapabilitiesActive).toHaveBeenCalledWith(capabilities)
  })

  it('highlights the last section whose top passed the scroll marker', () => {
    const about = document.createElement('section')
    about.id = 'about'
    mockRect(about, { top: 100 })
    document.body.appendChild(about)

    const skills = document.createElement('section')
    skills.id = 'skills'
    mockRect(skills, { top: 400 })
    document.body.appendChild(skills)

    expect(resolveNavActiveSectionId(['about', 'skills'])).toBe('about')

    mockRect(skills, { top: 250 })
    expect(resolveNavActiveSectionId(['about', 'skills'])).toBe('skills')
  })

  it('uses smooth section scroll on touch viewports when reduced motion is off', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query === '(min-width: 640px)' ? false : query === '(pointer: coarse)',
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as MediaQueryList,
    )

    const section = document.createElement('section')
    section.id = 'about'
    mockRect(section, { top: 120 })
    document.body.appendChild(section)

    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToSectionById('about', false)

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }))
  })

  it('keeps instant scroll for programmatic jumps', () => {
    const section = document.createElement('section')
    section.id = 'about'
    mockRect(section, { top: 120 })
    document.body.appendChild(section)

    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    scrollToSectionById('about', false, true)

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }))
  })
})
