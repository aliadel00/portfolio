import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { resetGlassCardReflect, runAboutPanelSweep, setGlassCardReflect } from '../../lib/glassCardReflect'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

const MAG_SCALE = 1.42
/** 2× base (168) — lens + chrome scale together */
const FRAME_SIZE = 336
/** SVG viewBox 0 0 100 100 — lens circle cx=50 cy=46 r=28 */
const LENS_VB_R = 28
const LENS_VB_CY = 46
const SVG_PX = FRAME_SIZE / 100
/** Radius of the magnified area in px (matches glass lens, not the whole frame) */
const LENS_CLIP_R = LENS_VB_R * SVG_PX
/** Lens center Y is slightly above frame center in the SVG */
const LENS_CENTER_OFFSET_Y = (LENS_VB_CY - 50) * SVG_PX

const MAGNIFIER_EXIT_MS = 260
/** Hide system cursor shortly after the loupe fades in so the handoff feels gradual */
const MAGNIFIER_CURSOR_HIDE_DELAY_MS = 100

function AboutPanelBody({ isClone }: { isClone?: boolean }) {
  return (
    <>
      <SectionHeading
        id={isClone ? undefined : 'about-heading'}
        eyebrow="Profile"
        title="About"
      />

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
    </>
  )
}

function AboutMagnifierGlass({ x, y, revealed }: { x: number; y: number; revealed: boolean }) {
  const half = FRAME_SIZE / 2
  const uid = useId().replace(/:/g, '')
  const sh = `about-mag-sh-${uid}`
  const gl = `about-mag-gl-${uid}`
  const rim = `about-mag-rim-${uid}`
  const rimDark = `about-mag-rim-dark-${uid}`
  const handleGrad = `about-mag-handle-${uid}`
  const handleShine = `about-mag-handle-shine-${uid}`
  const spec = `about-mag-spec-${uid}`

  return (
    <svg
      className={`about-magnifier-frame pointer-events-none fixed z-[46] drop-shadow-[0_10px_28px_color-mix(in_oklab,black_42%,transparent)]${revealed ? ' about-magnifier-frame--revealed' : ''}`}
      width={FRAME_SIZE}
      height={FRAME_SIZE}
      style={{ left: x - half, top: y - half }}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter id={sh} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="1.8" floodOpacity="0.35" />
        </filter>
        <filter id={gl} x="-45%" y="-45%" width="190%" height="190%">
          <feGaussianBlur stdDeviation="1.8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={rim} cx="32%" cy="28%" r="78%">
          <stop offset="0%" stopColor="color-mix(in oklab, white 55%, var(--color-fg-muted))" stopOpacity="0.95" />
          <stop offset="42%" stopColor="color-mix(in oklab, var(--color-fg-muted) 70%, var(--color-bg))" stopOpacity="1" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--color-bg) 55%, black)" stopOpacity="1" />
        </radialGradient>
        <linearGradient id={rimDark} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="color-mix(in oklab, black 35%, transparent)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={handleGrad} gradientUnits="userSpaceOnUse" x1="72" y1="66" x2="90" y2="88">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--color-fg-muted) 88%, black)" />
          <stop offset="35%" stopColor="color-mix(in oklab, var(--color-accent-2) 22%, var(--color-fg-muted))" />
          <stop offset="72%" stopColor="color-mix(in oklab, var(--color-bg) 40%, var(--color-fg-muted))" />
          <stop offset="100%" stopColor="color-mix(in oklab, black 45%, var(--color-fg-muted))" />
        </linearGradient>
        <linearGradient id={handleShine} gradientUnits="userSpaceOnUse" x1="74" y1="64" x2="82" y2="78">
          <stop offset="0%" stopColor="color-mix(in oklab, white 70%, transparent)" stopOpacity="0.5" />
          <stop offset="55%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={spec} gradientUnits="userSpaceOnUse" x1="38" y1="28" x2="52" y2="42">
          <stop offset="0%" stopColor="color-mix(in oklab, white 85%, transparent)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${sh})`}>
        {/* Handle — cylinder + ferrule */}
        <path
          d="M 73 69 L 89 87"
          stroke={`url(#${handleGrad})`}
          strokeWidth="6.2"
          strokeLinecap="round"
        />
        <path
          d="M 73 69 L 89 87"
          stroke={`url(#${handleShine})`}
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity={0.85}
        />
        <circle cx="71.2" cy="67.4" r="3.4" fill={`url(#${rim})`} opacity={0.92} />
        <circle
          cx="71.2"
          cy="67.4"
          r="3.4"
          stroke="color-mix(in oklab, black 40%, transparent)"
          strokeWidth="0.45"
          opacity={0.5}
        />
      </g>
      {/* Bezel — outer metal ring (opening stays transparent) */}
      <circle cx="50" cy="46" r="29.6" stroke={`url(#${rim})`} strokeWidth="3.6" filter={`url(#${gl})`} />
      <circle
        cx="50"
        cy="46"
        r="28.15"
        stroke="color-mix(in oklab, black 32%, transparent)"
        strokeWidth="0.85"
        opacity={0.65}
      />
      <circle
        cx="50"
        cy="46"
        r="29.9"
        stroke="color-mix(in oklab, white 38%, transparent)"
        strokeWidth="0.55"
        opacity={0.4}
      />
      {/* Rim specular (arc on lens circle cx=50 cy=46 r=28) */}
      <path
        d="M 23.7 36.4 A 28 28 0 0 1 36 21.8"
        stroke={`url(#${spec})`}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity={0.55}
      />
      <circle
        cx="50"
        cy="46"
        r="26.35"
        stroke={`url(#${rimDark})`}
        strokeWidth="1.2"
        opacity={0.4}
      />
    </svg>
  )
}

export function About() {
  const reducedMotion = usePrefersReducedMotion()
  const trackReflect = !reducedMotion
  const [finePointer, setFinePointer] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(pointer: fine)').matches : false,
  )
  const useMagnifier = trackReflect && finePointer

  const panelRef = useRef<HTMLDivElement>(null)
  const sweepAllowedRef = useRef(true)
  const sweepRunningRef = useRef(false)

  const [lens, setLens] = useState<{
    x: number
    y: number
    portalOpen: boolean
    revealed: boolean
  }>({ x: 0, y: 0, portalOpen: false, revealed: false })
  const [suppressCursor, setSuppressCursor] = useState(false)
  const [panelRect, setPanelRect] = useState<DOMRect | null>(null)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cursorHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const refreshRect = useCallback(() => {
    const el = panelRef.current
    if (el) setPanelRect(el.getBoundingClientRect())
  }, [])

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
      if (cursorHideTimerRef.current) clearTimeout(cursorHideTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const onChange = () => setFinePointer(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

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

  useEffect(() => {
    if (!lens.portalOpen || !useMagnifier) return
    refreshRect()
    const onScrollOrResize = () => refreshRect()
    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [lens.portalOpen, useMagnifier, refreshRect])

  const onPanelPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (useMagnifier) {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current)
        leaveTimerRef.current = null
      }
      if (cursorHideTimerRef.current) {
        clearTimeout(cursorHideTimerRef.current)
        cursorHideTimerRef.current = null
      }
      const el = panelRef.current
      if (el) setPanelRect(el.getBoundingClientRect())
      setSuppressCursor(false)
      setLens({ x: e.clientX, y: e.clientY, portalOpen: true, revealed: false })

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLens((s) => ({ ...s, revealed: true }))
          cursorHideTimerRef.current = setTimeout(() => {
            setSuppressCursor(true)
            cursorHideTimerRef.current = null
          }, MAGNIFIER_CURSOR_HIDE_DELAY_MS)
        })
      })
    }
    if (!trackReflect) return
    if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
    const el = e.currentTarget
    el.setAttribute('data-gcr-reflect', 'on')
    setGlassCardReflect(el, e.clientX, e.clientY)
  }

  const onPanelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (useMagnifier && lens.portalOpen) {
      setLens((s) => ({ ...s, x: e.clientX, y: e.clientY }))
    }
    if (!trackReflect) return
    if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
    setGlassCardReflect(e.currentTarget, e.clientX, e.clientY)
  }

  const onPanelPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (useMagnifier) {
      if (cursorHideTimerRef.current) {
        clearTimeout(cursorHideTimerRef.current)
        cursorHideTimerRef.current = null
      }
      setSuppressCursor(false)
      setLens((s) => ({ ...s, revealed: false }))

      leaveTimerRef.current = setTimeout(() => {
        setLens({ x: 0, y: 0, portalOpen: false, revealed: false })
        leaveTimerRef.current = null
      }, MAGNIFIER_EXIT_MS)
    }
    if (!trackReflect) return
    if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
    const el = e.currentTarget
    el.removeAttribute('data-gcr-reflect')
    resetGlassCardReflect(el)
  }

  const lensCenterX = lens.x
  const lensCenterY = lens.y + LENS_CENTER_OFFSET_Y
  const uVis = panelRect ? lensCenterX - panelRect.left : 0
  const vVis = panelRect ? lensCenterY - panelRect.top : 0

  const magnifierPortal =
    useMagnifier &&
    lens.portalOpen &&
    panelRect &&
    typeof document !== 'undefined' &&
    createPortal(
      <>
        <div
          className={`about-magnifier-lens pointer-events-none fixed z-[44] overflow-hidden rounded-full${lens.revealed ? ' about-magnifier-lens--revealed' : ''}`}
          style={{
            left: lensCenterX - LENS_CLIP_R,
            top: lensCenterY - LENS_CLIP_R,
            width: LENS_CLIP_R * 2,
            height: LENS_CLIP_R * 2,
          }}
          aria-hidden
        >
          <div
            className="pointer-events-none absolute z-[1]"
            style={{
              left: LENS_CLIP_R - MAG_SCALE * uVis,
              top: LENS_CLIP_R - MAG_SCALE * vVis,
              width: panelRect.width,
              height: panelRect.height,
              transform: `scale(${MAG_SCALE})`,
              transformOrigin: '0 0',
            }}
          >
            <div
              className="about-magnifier-panel-clone h-full w-full p-6 sm:p-10 lg:p-12"
              aria-hidden
            >
              <AboutPanelBody isClone />
            </div>
          </div>
        </div>
        <AboutMagnifierGlass x={lens.x} y={lens.y} revealed={lens.revealed} />
      </>,
      document.body,
    )

  return (
    <section
      id="about"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="about-heading"
    >
      <Reveal className="min-w-0">
        <div
          ref={panelRef}
          className={`glass-card-reflect glass-panel pro-glass p-6 sm:p-10 lg:p-12${useMagnifier ? ' about-panel-magnify' : ''}${useMagnifier && suppressCursor ? ' about-panel-magnify--active' : ''}`}
          onPointerEnter={onPanelPointerEnter}
          onPointerMove={onPanelPointerMove}
          onPointerLeave={onPanelPointerLeave}
        >
          <AboutPanelBody />
        </div>
      </Reveal>
      {magnifierPortal}
    </section>
  )
}
