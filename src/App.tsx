import { lazy, Suspense } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLinks } from './components/layout/SkipLinks'
import { Hero } from './components/sections/Hero'

const About = lazy(() => import('./components/sections/About').then((m) => ({ default: m.About })))
const Skills = lazy(() => import('./components/sections/Skills').then((m) => ({ default: m.Skills })))
const Projects = lazy(() => import('./components/sections/Projects').then((m) => ({ default: m.Projects })))
const Contact = lazy(() => import('./components/sections/Contact').then((m) => ({ default: m.Contact })))

export default function App() {
  return (
    <div className="site-root relative z-[1] min-h-dvh">
      <SkipLinks />
      <Header />
      <main id="main-content" className="min-w-0 overflow-x-clip">
        <Hero />
        <Suspense fallback={null}>
          <About />
        </Suspense>
        <Suspense fallback={null}>
          <Skills />
        </Suspense>
        <Suspense fallback={null}>
          <Projects />
        </Suspense>
        <Suspense fallback={null}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
