import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { SkipLinks } from './components/layout/SkipLinks'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Skills } from './components/sections/Skills'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'

export default function App() {
  return (
    <div className="site-root relative z-[1] min-h-dvh overflow-x-clip">
      <SkipLinks />
      <Header />
      <main id="main-content">
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
