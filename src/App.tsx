import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'

export default function App() {
  return (
    <div className="min-h-dvh">
      <a
        href="#main-content"
        className="sr-only left-4 top-4 z-[100] rounded-md bg-[var(--color-bg-elevated)] px-4 py-3 text-sm font-medium text-[var(--color-fg)] shadow-lg focus:not-sr-only focus:fixed focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
