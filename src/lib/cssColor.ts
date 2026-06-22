const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB_RE = /^rgba?\(\s*[\d.]+\s*,/

let colorProbe: HTMLSpanElement | null = null

function getColorProbe(): HTMLSpanElement | null {
  if (typeof document === 'undefined') return null
  if (!colorProbe) {
    colorProbe = document.createElement('span')
    colorProbe.style.display = 'none'
    document.documentElement.appendChild(colorProbe)
  }
  return colorProbe
}

/** Read a hex token (e.g. `--sapphire-gem-body-hex`) for WebGL — avoids oklch → Three.js mismatch. */
export function cssVarToHex(varName: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback

  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (HEX_RE.test(raw)) return raw

  return fallback
}

/** Resolve a CSS custom property to an `rgb()` / `rgba()` string for canvas / Three.js. */
export function cssVarToColor(varName: string, fallback = 'rgb(10, 10, 18)'): string {
  if (typeof document === 'undefined') return fallback

  const probe = getColorProbe()
  if (!probe) return fallback

  probe.style.color = `var(${varName})`
  const resolved = getComputedStyle(probe).color

  if (!resolved || resolved === 'rgba(0, 0, 0, 0)' || !RGB_RE.test(resolved)) return fallback
  return resolved
}
