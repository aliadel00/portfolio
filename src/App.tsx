import { useLayoutEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLinks } from './components/layout/SkipLinks'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
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
      <main id="main-content" className="min-w-0 overflow-x-clip">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
