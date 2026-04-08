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
    const scrollToHash = () => {
      const raw = window.location.hash
      if (!raw || raw === '#') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }
      const id = decodeURIComponent(raw.slice(1))
      const target = id ? document.getElementById(id) : null
      if (!target) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        return
      }

      const paddingTop = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || '0') || 0
      const y = Math.max(0, target.getBoundingClientRect().top + window.scrollY - paddingTop)
      window.scrollTo({ top: y, left: 0, behavior: 'auto' })
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [])

  return (
    <div className="site-root relative z-[1] min-h-dvh">
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
