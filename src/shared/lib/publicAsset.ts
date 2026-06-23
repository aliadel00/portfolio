/** Resolve a path under `public/` for use in `src`, `mask-image`, etc. Respects Vite `base` (e.g. GitHub project Pages). */
export function publicUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL
  const p = path.replace(/^\//, '')
  return `${base}${p}`
}
