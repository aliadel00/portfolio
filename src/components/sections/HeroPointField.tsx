import { useEffect, useRef, type MutableRefObject } from 'react'

type ColorMode = 'light' | 'dark'

export type HeroPointerCanvas = { x: number; y: number; active: boolean }

type Props = {
  reducedMotion: boolean
  pointerRef: MutableRefObject<HeroPointerCanvas>
  colorMode: ColorMode
}

/**
 * Full-bleed dot grid: proximity to pointer scales dots and shifts color (canvas 2D, rAF).
 * Pattern: distance falloff + smoothstep, common for interactive hero grids.
 */
export function HeroPointField({ reducedMotion, pointerRef, colorMode }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef(0)
  const pointsRef = useRef<{ x: number; y: number }[]>([])
  const colorModeRef = useRef<ColorMode>(colorMode)

  useEffect(() => {
    colorModeRef.current = colorMode
  }, [colorMode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return
    ctxRef.current = ctx

    const spacing = 20
    const baseR = 1.1
    const maxBoost = 4.2
    const influence = 168

    function rebuild(w: number, h: number) {
      const pts: { x: number; y: number }[] = []
      for (let y = spacing * 0.5; y < h; y += spacing) {
        for (let x = spacing * 0.5; x < w; x += spacing) {
          pts.push({ x, y })
        }
      }
      pointsRef.current = pts
    }

    function resize() {
      const wrap = wrapRef.current
      const cvs = canvasRef.current
      const c = ctxRef.current
      if (!wrap || !cvs || !c) return

      const w = wrap.clientWidth
      const h = wrap.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cvs.width = Math.max(1, Math.floor(w * dpr))
      cvs.height = Math.max(1, Math.floor(h * dpr))
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      rebuild(w, h)
    }

    const wrap = wrapRef.current
    if (!wrap) return

    const ro = new ResizeObserver(() => resize())
    ro.observe(wrap)
    resize()

    const draw = () => {
      const wrapEl = wrapRef.current
      const c = ctxRef.current
      if (!wrapEl || !c) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const w = wrapEl.clientWidth
      const h = wrapEl.clientHeight
      const ptr = pointerRef.current
      c.clearRect(0, 0, w, h)

      const active = !reducedMotion && ptr.active
      const px = active ? ptr.x : -99999
      const py = active ? ptr.y : -99999

      for (const p of pointsRef.current) {
        let t = 0
        if (active) {
          const d = Math.hypot(p.x - px, p.y - py)
          if (d < influence) {
            const raw = 1 - d / influence
            t = raw * raw * (3 - 2 * raw)
          }
        }

        const radius = baseR + t * maxBoost
        const lm = colorModeRef.current === 'light'
        const a = lm ? 0.14 + t * 0.52 : 0.2 + t * 0.72
        const r = lm ? Math.round(72 + t * 88) : Math.round(118 + t * 95)
        const g = lm ? Math.round(86 + t * 78) : Math.round(128 + t * 92)
        const b = lm ? Math.round(148 + t * 92) : Math.round(168 + t * 102)
        c.fillStyle = `rgba(${r},${g},${b},${a})`
        c.beginPath()
        c.arc(p.x, p.y, radius, 0, Math.PI * 2)
        c.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
      ctxRef.current = null
    }
  }, [reducedMotion, pointerRef])

  return (
    <div ref={wrapRef} className="absolute inset-0 h-full min-h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" aria-hidden />
    </div>
  )
}
