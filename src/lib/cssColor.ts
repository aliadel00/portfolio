const HEX_RE = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB_RE = /^rgba?\(\s*[\d.]+\s*,/

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

  const probe = document.createElement('span')
  probe.style.color = `var(${varName})`
  probe.style.display = 'none'
  document.documentElement.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()

  if (!resolved || resolved === 'rgba(0, 0, 0, 0)' || !RGB_RE.test(resolved)) return fallback
  return resolved
}
