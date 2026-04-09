import { useEffect, useRef } from 'react'
import {
  resetAboutPanelReflect,
  runAboutPanelSweep,
  setAboutPanelReflect,
} from '../../lib/aboutPanelReflect'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const reducedMotion = usePrefersReducedMotion()
  const trackReflect = !reducedMotion
  const panelRef = useRef<HTMLDivElement>(null)
  const sweepAllowedRef = useRef(true)
  const sweepRunningRef = useRef(false)

  useEffect(() => {
    if (!trackReflect) return
    const el = panelRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e) return

        if (e.isIntersecting && e.intersectionRatio >= 0.22) {
          if (!sweepAllowedRef.current || sweepRunningRef.current) return
          sweepAllowedRef.current = false
          sweepRunningRef.current = true
          void runAboutPanelSweep(el).finally(() => {
            sweepRunningRef.current = false
          })
        }

        if (!e.isIntersecting || e.intersectionRatio < 0.12) {
          sweepAllowedRef.current = true
        }
      },
      { threshold: [0, 0.08, 0.12, 0.22, 0.4] },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [trackReflect])

  return (
    <section
      id="about"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="about-heading"
    >
      <Reveal className="min-w-0">
        <div
          ref={panelRef}
          className="about-panel-reflect glass-panel pro-glass p-6 sm:p-10 lg:p-12"
          onPointerEnter={
            trackReflect
              ? (e) => {
                  if (e.currentTarget.hasAttribute('data-about-sweeping')) return
                  const el = e.currentTarget
                  el.setAttribute('data-about-reflect', 'on')
                  setAboutPanelReflect(el, e.clientX, e.clientY)
                }
              : undefined
          }
          onPointerMove={
            trackReflect
              ? (e) => {
                  if (e.currentTarget.hasAttribute('data-about-sweeping')) return
                  setAboutPanelReflect(e.currentTarget, e.clientX, e.clientY)
                }
              : undefined
          }
          onPointerLeave={
            trackReflect
              ? (e) => {
                  if (e.currentTarget.hasAttribute('data-about-sweeping')) return
                  const el = e.currentTarget
                  el.removeAttribute('data-about-reflect')
                  resetAboutPanelReflect(el)
                }
              : undefined
          }
        >
        <SectionHeading id="about-heading" eyebrow="Profile" title="About" />

        <p className="section-lead m-0 max-w-3xl">
          I am a <strong className="font-medium text-[var(--color-fg)]">software engineer</strong> with a{' '}
          <strong className="font-medium text-[var(--color-fg)]">full-stack background</strong> — Laravel, MERN/MEAN,
          Node.js, SQL/NoSQL, REST, and shipping features across the stack. I am known for{' '}
          <strong className="font-medium text-[var(--color-fg)]">deep frontend expertise</strong> in{' '}
          <strong className="font-medium text-[var(--color-fg)]">Angular</strong> (v8–20+) and{' '}
          <strong className="font-medium text-[var(--color-fg)]">React</strong> for enterprise banking and insurance, plus
          a creative side in <strong className="font-medium text-[var(--color-fg)]">3D art, Blender, and Three.js</strong>.
          Recent work includes <strong className="font-medium text-[var(--color-fg)]">GOSI (Ameen)</strong>,{' '}
          <strong className="font-medium text-[var(--color-fg)]">Banque Misr</strong>,{' '}
          <strong className="font-medium text-[var(--color-fg)]">Suez Canal Bank</strong>, and UK linguist platforms — I
          mentor engineers, own CI/CD, and use AI-assisted tooling where it improves quality and speed.
        </p>

        <div className="mt-10 grid gap-8 border-t border-[color-mix(in_oklab,white_10%,transparent)] pt-10 sm:grid-cols-2">
          <div>
            <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)]">
              Education &amp; languages
            </h3>
            <ul className="mt-4 list-none space-y-3 p-0 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              <li className="m-0">
                Computer Science &amp; AI, Helwan University (2018–2024; studies paused two years for national service)
              </li>
              <li className="m-0">Arabic — native · English — advanced</li>
            </ul>
          </div>
          <div>
            <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)]">Highlights</h3>
            <ul className="mt-4 list-none space-y-3 p-0 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              <li className="m-0">MERN &amp; MEAN internships (Nvision X, 2020)</li>
              <li className="m-0">Google Android developer scholarship</li>
              <li className="m-0">30+ certificates across software, cloud, agile, AI tools, and 3D</li>
            </ul>
          </div>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-3">
          <li className="glass-chip m-0 list-none px-4 py-3.5 text-sm text-[var(--color-fg-muted)]">
            Full-stack · APIs · data modeling
          </li>
          <li className="glass-chip m-0 list-none px-4 py-3.5 text-sm text-[var(--color-fg-muted)]">
            Angular &amp; React · TypeScript at scale
          </li>
          <li className="glass-chip m-0 list-none px-4 py-3.5 text-sm text-[var(--color-fg-muted)]">
            Three.js · Blender · 3D on the web
          </li>
        </ul>
        </div>
      </Reveal>
    </section>
  )
}
