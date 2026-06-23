/** Navigation: header, footer, skip links, scroll spy, section routing. Styles: ./navigation.css */
export { Header } from './components/Header'
export { Footer } from './components/Footer'
export { SkipLinks } from './components/SkipLinks'
export { useArrowSectionNav } from './hooks/useArrowSectionNav'
export {
  buildSectionHref,
  HERO_CAPABILITIES_SECTION_ID,
  HERO_INTRO_SECTION_ID,
  replaceUrlWithSection,
  scrollToSectionById,
} from './lib/sectionNavigation'
