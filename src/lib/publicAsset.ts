/** Resolve a path under `public/` for use in `src`, `mask-image`, etc. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const p = path.replace(/^\//, '')
  return `${base}${p}`
}
