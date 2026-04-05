import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { resetGlassCardReflect, runAboutPanelSweep, setGlassCardReflect } from '../../lib/glassCardReflect'
import { usePointerMotionEnabled } from '../../hooks/usePointerMotionEnabled'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { siteContent } from '../../data/site'
import { publicUrl } from '../../lib/publicAsset'
import { useTheme } from '../../theme/ThemeProvider'
import { SegmentedLead } from '../ui/SegmentedLead'

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
  const a = siteContent.about
  return (
    <>
      <SectionHeading id={isClone ? undefined : 'about-heading'} eyebrow={a.eyebrow} title={a.title} />

      <SegmentedLead segments={a.lead} className="section-lead m-0 max-w-3xl" />

      <div className="mt-10 grid gap-8 border-t border-[color-mix(in_oklab,white_10%,transparent)] pt-10 sm:grid-cols-2">
        <div>
          <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)]">
            {a.educationHeading}
          </h3>
          <ul className="mt-4 list-none space-y-3 p-0 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {a.educationItems.map((item) => (
              <li key={item} className="m-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display m-0 text-lg font-semibold tracking-tight text-[var(--color-fg)]">
            {a.highlightsHeading}
          </h3>
          <ul className="mt-4 list-none space-y-3 p-0 text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {a.highlightsItems.map((item) => (
              <li key={item} className="m-0">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="mt-10 grid gap-3 sm:grid-cols-3">
        {a.chips.map((chip) => (
          <li key={chip} className="glass-chip m-0 list-none px-4 py-3.5 text-sm text-[var(--color-fg-muted)]">
            {chip}
          </li>
        ))}
      </ul>
    </>
  )
}

function AboutMagnifierGlass({ x, y, revealed }: { x: number; y: number; revealed: boolean }) {
  const half = FRAME_SIZE / 2
  const { theme } = useTheme()
  const src =
    theme === 'dark' ? publicUrl('about-magnifier-dark.svg') : publicUrl('about-magnifier-light.svg')

  return (
    <img
      src={src}
      alt=""
      width={FRAME_SIZE}
      height={FRAME_SIZE}
      decoding="async"
      className={`about-magnifier-frame pointer-events-none fixed z-[46] drop-shadow-[0_10px_28px_color-mix(in_oklab,black_42%,transparent)]${revealed ? ' about-magnifier-frame--revealed' : ''}`}
      style={{ left: x - half, top: y - half }}
      aria-hidden
    />
  )
}

export function About() {
  const reducedMotion = usePrefersReducedMotion()
  const pointerMotionEnabled = usePointerMotionEnabled()
  /** Cursor-follow glass + magnifier — off on coarse pointer or narrow viewport. */
  const pointerHoverEffects = !reducedMotion && pointerMotionEnabled
  const useMagnifier = pointerHoverEffects

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
    if (reducedMotion) return
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
  }, [reducedMotion])

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
    if (!pointerHoverEffects) return
    if (e.currentTarget.hasAttribute('data-gcr-sweeping')) return
    const el = e.currentTarget
    el.setAttribute('data-gcr-reflect', 'on')
    setGlassCardReflect(el, e.clientX, e.clientY)
  }

  const onPanelPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (useMagnifier && lens.portalOpen) {
      setLens((s) => ({ ...s, x: e.clientX, y: e.clientY }))
    }
    if (!pointerHoverEffects) return
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
    if (!pointerHoverEffects) return
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
