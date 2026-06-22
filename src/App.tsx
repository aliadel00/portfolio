import { Suspense, useLayoutEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLinks } from './components/layout/SkipLinks'
import { HeroIntro, HeroShowcase } from './components/sections/Hero'
import { HeroIntroShell } from './components/sections/HeroIntroShell'
import { AppSpinner } from './components/ui/AppSpinner'
import { lazyNamedExport } from './lib/lazyNamedExport'
import { useArrowSectionNav } from './hooks/useArrowSectionNav'
import { useRenderQuality } from './hooks/useRenderQuality'

const About = lazyNamedExport(() => import('./components/sections/About'), 'About')
const Skills = lazyNamedExport(() => import('./components/sections/Skills'), 'Skills')
const Projects = lazyNamedExport(() => import('./components/sections/Projects'), 'Projects')
const Contact = lazyNamedExport(() => import('./components/sections/Contact'), 'Contact')

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
        <Suspense
          fallback={
            <div className="app-section-loader" aria-hidden>
              <AppSpinner label="Loading sections" />
            </div>
          }
        >
          <About />
          <Skills />
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}