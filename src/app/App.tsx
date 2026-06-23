import { Suspense, useLayoutEffect } from 'react'
import { Footer, Header, SkipLinks, useArrowSectionNav } from '@/features/navigation'
import { HeroIntro, HeroIntroShell, HeroShowcase, useBeamsLoading, useRenderQuality } from '@/features/hero'
import { AppSpinner } from '@/shared/ui/AppSpinner'
import { lazyNamedExport } from '@/shared/lib/lazyNamedExport'

const About = lazyNamedExport(() => import('@/features/about/About'), 'About')
const Skills = lazyNamedExport(() => import('@/features/skills/Skills'), 'Skills')
const Projects = lazyNamedExport(() => import('@/features/projects/Projects'), 'Projects')
const Contact = lazyNamedExport(() => import('@/features/contact/Contact'), 'Contact')

function MainSectionsFallback() {
  const { isBeamsReady } = useBeamsLoading()

  return (
    <div className="app-section-loader" aria-hidden>
      <AppSpinner label={isBeamsReady ? 'Loading sections' : 'Loading background'} />
    </div>
  )
}

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
        <Suspense fallback={<MainSectionsFallback />}>
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