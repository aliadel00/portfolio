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
  shell: {
    repoName: string
    themeMenuLabel: string
    themes: { id: string; label: string }[]
    versionMenuLabel: string
    versions: { id: string; label: string }[]
    homeLabel: string
    explorerLabel: string
    editorTabsLabel: string
    closeFile: string
    closeSidebar: string
    rights: string
    poweredBy: string
    poweredByHref: string
  }
  footer: {
    navAriaLabel: string
    backToTop: string
    builtWith: string
    hostedOn: string
    poweredBy: string
    poweredByHref: string
  }
  hero: {
    eyebrow: string
    headline: string
    headlineRotator: string[]
    intro: TextSegment[]
    ctaWork: string
    ctaContact: string
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
