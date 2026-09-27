import { memo, Suspense, useEffect, useRef } from 'react'
import { HeroIntro, HeroIntroShell, HeroShowcase } from '@/features/hero'
import {
  HERO_CAPABILITIES_SECTION_ID,
  HERO_INTRO_SECTION_ID,
  scrollToSectionById,
} from '@/features/navigation/lib/sectionNavigation'
import { lazyNamedExport } from '@/shared/lib/lazyNamedExport'
import { usePrefersReducedMotion } from '@/shared/hooks/usePrefersReducedMotion'
import { scrollPageTo, scrollportOffsetTop } from '@/shared/lib/pageScroll'
import type { ShellFile } from './shellModel'

const About = lazyNamedExport(() => import('@/features/about/About'), 'About')
const Skills = lazyNamedExport(() => import('@/features/skills/Skills'), 'Skills')
const Projects = lazyNamedExport(() => import('@/features/projects/Projects'), 'Projects')
const Contact = lazyNamedExport(() => import('@/features/contact/Contact'), 'Contact')

// Start section chunks with the shell module so a nav click finds content.
// Hero stays synchronous; these fetches do not block first paint.
for (const section of [About, Skills, Projects, Contact]) section.preload()

/** Keep aligning until the prefetched section is in the document. */
const SECTION_TARGET_WAIT_MS = 8000

function scrollWindow(top: number, behavior: ScrollBehavior) {
  if (navigator.userAgent.includes('jsdom')) return
  scrollPageTo(top, behavior, { releaseOnInput: true })
}

function scrollFileIntoView(file: ShellFile, reducedMotion: boolean) {
  const behavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth'
  if (file.targetId === 'hero' || file.targetId === HERO_INTRO_SECTION_ID) {
    scrollWindow(0, behavior)
    return true
  }
  if (file.targetId === HERO_CAPABILITIES_SECTION_ID) {
    return scrollToSectionById(HERO_CAPABILITIES_SECTION_ID, reducedMotion)
  }
  const target = document.getElementById(file.targetId)
  if (!target) return false
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
  const header = Number.parseFloat(raw)
  const offset = Number.isFinite(header) ? header : 72
  const top = Math.max(0, scrollportOffsetTop(target) - offset - 12)
  scrollWindow(top, behavior)
  return true
}

export const EditorDocument = memo(function EditorDocument({
  file,
  scrollToken,
}: {
  file: ShellFile
  scrollToken: number
}) {
  const reducedMotion = usePrefersReducedMotion()
  const fileRef = useRef(file)

  useEffect(() => {
    fileRef.current = file
  }, [file])

  useEffect(() => {
    if (scrollToken === 0) return
    // Scroll spy updates `file` while the user moves. Re-scrolling on that change
    // restarts a smooth jump and stutters against the gesture.
    const targetFile = fileRef.current
    const started = performance.now()
    let cancelled = false
    const align = () => {
      if (cancelled) return
      if (scrollFileIntoView(targetFile, reducedMotion)) return
      if (performance.now() - started < SECTION_TARGET_WAIT_MS) requestAnimationFrame(align)
    }
    align()
    return () => {
      cancelled = true
    }
  }, [reducedMotion, scrollToken])

  return (
    <>
      <section
        id="hero"
        className="hero-point-stage hero-os-stage relative z-[1] flex w-full flex-col overflow-x-clip"
        aria-labelledby="hero-heading"
      >
        <HeroIntroShell framed>
          <HeroIntro />
        </HeroIntroShell>
      </section>
      <HeroShowcase />
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
    </>
  )
})
