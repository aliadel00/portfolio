import { useEffect, useRef, type MutableRefObject } from 'react'

type ColorMode = 'light' | 'dark'

export type HeroPointerCanvas = { x: number; y: number; active: boolean }

type Props = {
  reducedMotion: boolean
  /** When false, dot grid ignores pointer proximity (e.g. coarse-pointer / mobile). */
  pointerHover: boolean
  pointerRef: MutableRefObject<HeroPointerCanvas>
  colorMode: ColorMode
}

/** Bounds layout reads so backing-store math cannot explode on pathological values. */
const MAX_LAYOUT_CSS_PX = 8192
const POINTER_INACTIVE = -1e5

/** Two outward wave bursts from center; total duration */
const PULSE_MS = 1280
const PULSE_WAVE_SPACING = 40
const PULSE_WAVE_DECAY = 0.74
const PULSE_WAVE_RINGS = 8
/** Ultra-thin crest (smaller σ = sharper, lighter ring) */
const PULSE_SIGMA_CORE = 8.5
const PULSE_HALO_SIGMA_FRAC = 3.05
const PULSE_HALO_MIX = 0.3
const PULSE_R_BOOST = 3.1
const PULSE_ALPHA_BOOST = 0.22
const PULSE_GLOBAL_BREATH = 0.09
const PULSE_RGB_PUSH = 24
const PULSE_WAVE_GAIN = 0.78

const GRID_SPACING = 20
const DOT_BASE_R = 1.1
const DOT_MAX_BOOST = 4.2
const POINTER_INFLUENCE = 168

function clampLayoutCss(n: number): number {
  if (!Number.isFinite(n) || n <= 0) return 1
  return Math.min(Math.floor(n), MAX_LAYOUT_CSS_PX)
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2
}

function maxRadiusFromCenter(cx: number, cy: number, w: number, h: number) {
  return Math.max(
    Math.hypot(cx, cy),
    Math.hypot(w - cx, cy),
    Math.hypot(cx, h - cy),
    Math.hypot(w - cx, h - cy),
  )
}

function outwardDoubleBurstTravel(u: number, maxR: number) {
  const v = u * 2
  const local = v < 1 ? v : v - 1
  return maxR * easeInOutCubic(Math.min(1, Math.max(0, local)))
}

function pulseRingEnvelope(ringDist: number, sigma: number) {
  const u0 = ringDist / sigma
  const u1 = ringDist / (sigma * PULSE_HALO_SIGMA_FRAC)
  const g0 = Math.exp(-(u0 * u0))
  const g1 = Math.exp(-(u1 * u1))
  return Math.min(1, g0 + PULSE_HALO_MIX * g1)
}

function outwardWaveAtDist(dist: number, travel: number) {
  if (travel <= 0) return 0
  let sum = 0
  for (let k = 0; k < PULSE_WAVE_RINGS; k++) {
    const crest = travel - k * PULSE_WAVE_SPACING
    if (crest <= 0) continue
    const ring = Math.abs(dist - crest)
    sum += pulseRingEnvelope(ring, PULSE_SIGMA_CORE) * Math.pow(PULSE_WAVE_DECAY, k)
  }
  return Math.min(1, sum * PULSE_WAVE_GAIN)
}

/** Smoothstep proximity 0..1 for pointer highlight */
function pointerHighlightT(px: number, py: number, x: number, y: number, influence: number): number {
  if (px <= POINTER_INACTIVE / 2) return 0
  const d = Math.hypot(x - px, y - py)
  if (d >= influence) return 0
  const raw = 1 - d / influence
  return raw * raw * (3 - 2 * raw)
}

function breathEnvelope(u: number): number {
  const w = Math.sin(Math.PI * u * 2)
  return w * w * (3 - 2 * Math.abs(w))
}

function dotFillRgba(lm: boolean, t: number, pulse: number): string {
  const r = lm ? Math.round(72 + t * 88) : Math.round(118 + t * 95)
  const g = lm ? Math.round(86 + t * 78) : Math.round(128 + t * 92)
  const b = lm ? Math.round(148 + t * 92) : Math.round(168 + t * 102)
  const push = Math.round(pulse * PULSE_RGB_PUSH)
  const a = Math.min(1, (lm ? 0.14 + t * 0.52 : 0.2 + t * 0.72) + pulse * PULSE_ALPHA_BOOST)
  return `rgba(${Math.min(255, r + push)},${Math.min(255, g + push)},${Math.min(255, b + push)},${a})`
}

type LandPulseRef = { startedAt: number | null }

function computePulseFrame(
  now: number,
  lp: LandPulseRef,
  reducedMotion: boolean,
  cx: number,
  cy: number,
  w: number,
  h: number,
): { ringPulseOn: boolean; waveTravel: number; breath: number } {
  let waveTravel = 0
  let breath = 1
  let ringPulseOn = false
  if (!reducedMotion && lp.startedAt !== null && lp.startedAt > 0) {
    const u = (now - lp.startedAt) / PULSE_MS
    if (u < 1) {
      ringPulseOn = true
      const maxR = maxRadiusFromCenter(cx, cy, w, h)
      waveTravel = outwardDoubleBurstTravel(u, maxR)
      breath = 1 + PULSE_GLOBAL_BREATH * breathEnvelope(u)
    }
  }
  return { ringPulseOn, waveTravel, breath }
}

/**
 * Full-bleed dot grid: pointer proximity scales dots (canvas 2D, rAF).
 * Land pulse: two outward wave bursts from center + breath; values are clamped for safe layout math.
 */
export function HeroPointField({ reducedMotion, pointerHover, pointerRef, colorMode }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef(0)
  const pointsRef = useRef<{ x: number; y: number }[]>([])
  const colorModeRef = useRef<ColorMode>(colorMode)
  const landPulseRef = useRef<LandPulseRef>({ startedAt: null })
  /** When false, stop the rAF loop so scrolling the rest of the page stays smooth. */
  const canvasVisibleRef = useRef(true)

  useEffect(() => {
    colorModeRef.current = colorMode
  }, [colorMode])

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    ctxRef.current = ctx

    if (reducedMotion) {
      landPulseRef.current = { startedAt: -1 }
    } else {
      landPulseRef.current = { startedAt: null }
    }

    function rebuild(w: number, h: number) {
      const pts: { x: number; y: number }[] = []
      for (let y = GRID_SPACING * 0.5; y < h; y += GRID_SPACING) {
        for (let x = GRID_SPACING * 0.5; x < w; x += GRID_SPACING) {
          pts.push({ x, y })
        }
      }
      pointsRef.current = pts
    }

    function resize() {
      const wEl = wrapRef.current
      const cvs = canvasRef.current
      const c = ctxRef.current
      if (!wEl || !cvs || !c) return

      const w = clampLayoutCss(wEl.clientWidth)
      const h = clampLayoutCss(wEl.clientHeight)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const bw = Math.max(1, Math.min(MAX_LAYOUT_CSS_PX * 2, Math.floor(w * dpr)))
      const bh = Math.max(1, Math.min(MAX_LAYOUT_CSS_PX * 2, Math.floor(h * dpr)))
      cvs.width = bw
      cvs.height = bh
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      rebuild(w, h)
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(wrap)
    resize()

    const startLoop = () => {
      if (rafRef.current) return
      const tick = () => {
        if (!canvasVisibleRef.current) {
          rafRef.current = 0
          return
        }

        const wrapEl = wrapRef.current
        const c = ctxRef.current
        if (!wrapEl || !c) {
          rafRef.current = canvasVisibleRef.current ? requestAnimationFrame(tick) : 0
          return
        }

        const w = clampLayoutCss(wrapEl.clientWidth)
        const h = clampLayoutCss(wrapEl.clientHeight)
        const cx = w * 0.5
        const cy = h * 0.5
        const ptr = pointerRef.current
        c.clearRect(0, 0, w, h)

        const { ringPulseOn, waveTravel, breath } = computePulseFrame(
          performance.now(),
          landPulseRef.current,
          reducedMotion,
          cx,
          cy,
          w,
          h,
        )

        const active = pointerHover && !reducedMotion && ptr.active
        const px = active ? ptr.x : POINTER_INACTIVE
        const py = active ? ptr.y : POINTER_INACTIVE

        for (const p of pointsRef.current) {
          const t = pointerHighlightT(px, py, p.x, p.y, POINTER_INFLUENCE)

          let pulse = 0
          if (ringPulseOn) {
            const dist = Math.hypot(p.x - cx, p.y - cy)
            pulse = outwardWaveAtDist(dist, waveTravel)
          }

          const radius = (DOT_BASE_R + t * DOT_MAX_BOOST) * breath + pulse * PULSE_R_BOOST
          const lm = colorModeRef.current === 'light'
          c.fillStyle = dotFillRgba(lm, t, pulse)
          c.beginPath()
          c.arc(p.x, p.y, radius, 0, Math.PI * 2)
          c.fill()
        }

        rafRef.current = canvasVisibleRef.current ? requestAnimationFrame(tick) : 0
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const visibilityIo = new IntersectionObserver(
      ([entry]) => {
        const vis = Boolean(entry?.isIntersecting)
        canvasVisibleRef.current = vis
        if (vis) {
          if (!reducedMotion && landPulseRef.current.startedAt === null) {
            landPulseRef.current.startedAt = performance.now()
          }
          startLoop()
        } else {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = 0
        }
      },
      { threshold: [0, 0.08, 0.12], rootMargin: '48px 0px 120px 0px' },
    )
    visibilityIo.observe(wrap)

    startLoop()

    return () => {
      visibilityIo.disconnect()
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      ctxRef.current = null
    }
  }, [reducedMotion, pointerHover, pointerRef])

  return (
    <div ref={wrapRef} className="absolute inset-0 h-full min-h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-hidden />
    </div>
  )
}
