/** Inline copy with optional emphasis — safe rendering (no HTML injection). */
export type TextSegment = { type: 'text' | 'strong'; value: string }

export type SiteNavItem = {
  href: string
  id: string
  label: string
}

export type SiteContent = {
  meta: {
    personName: string
    siteUrl: string
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    ogLocale: string
    twitterTitle: string
    twitterDescription: string
    themeColor: string
    jobTitle: string
    structuredDataDescription: string
  }
  nav: SiteNavItem[]
  skipLinks: {
    toMain: string
    toNav: string
  }
  header: {
    navAriaPrimary: string
    navAriaDesktop: string
    mobileOpenMenu: string
    mobileCloseMenu: string
    drawerClose: string
    themeSwitchToLight: string
    themeSwitchToDark: string
  }
  footer: {
    template: string
  }
  hero: {
    eyebrow: string
    headline: string
    intro: TextSegment[]
    ctaWork: string
    ctaContact: string
  }
  heroFeatured: {
    sectionLabel: string
    liveBadge: string
    openLive: string
    goToWork: string
    chipNewTab: string
    chipOnPage: string
    ariaExternalTab: string
    ariaInternalWork: string
  }
  about: {
    eyebrow: string
    title: string
    lead: TextSegment[]
    educationHeading: string
    educationItems: string[]
    highlightsHeading: string
    highlightsItems: string[]
    chips: string[]
  }
  skills: {
    eyebrow: string
    title: string
    lead: TextSegment[]
    highlightsAriaLabel: string
  }
  work: {
    eyebrow: string
    title: string
    lead: TextSegment[]
    careerTitle: string
    careerDescription: string
    freelanceTitle: string
    freelanceDescription: string
  }
  contact: {
    eyebrow: string
    title: string
    lead: string
    email: string
    phoneDisplay: string
    phoneHref: string
    linkedInUrl: string
    githubUrl: string
    linkedInLabel: string
    githubLabel: string
  }
}
