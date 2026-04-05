import raw from './siteContent.json'
import type { SiteContent } from './siteContent.types'

export const siteContent = raw as SiteContent

/** Canonical site URL with trailing slash (for links, OG URL). */
export function getSiteUrlSlash(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL
  const base =
    typeof fromEnv === 'string' && fromEnv.trim().length > 0
      ? fromEnv.trim()
      : siteContent.meta.siteUrl.trim()
  return base.endsWith('/') ? base : `${base}/`
}
