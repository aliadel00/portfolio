import { useLayoutEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLinks } from './components/layout/SkipLinks'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { HeroIntro, HeroShowcase } from './components/sections/Hero'
import { HeroIntroShell } from './components/sections/HeroIntroShell'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { useArrowSectionNav } from './hooks/useArrowSectionNav'
import { useRenderQuality } from './hooks/useRenderQuality'

export default function App() {
  useArrowSectionNav()
  useRenderQuality()
  useLayoutEffect(() => {
    const canonicalPath = import.meta.env.BASE_URL
    const hasExtraUrlState = window.location.search.length > 0 || window.location.hash.length > 0
    const wrongPath = window.location.pathname !== canonicalPath
    if (!hasExtraUrlState && !wrongPath) return
    window.history.replaceState(window.history.state, '', canonicalPath)
  }, [])

  return (
    <div className="site-root relative z-[1] min-h-svh">
      <SkipLinks />
      <Header />
      <section
        id="hero"
        className="hero-point-stage hero-os-stage relative z-[1] flex w-full flex-col overflow-x-clip"
        aria-labelledby="hero-heading"
      >
        <HeroIntroShell>
          <HeroIntro />
        </HeroIntroShell>
        <HeroShowcase />
      </section>
      <main id="main-content" className="relative z-[1] min-w-0 overflow-x-clip">
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
