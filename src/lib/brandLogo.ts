/** High-res favicon URL for a public page (used when there is no screenshot). */
export function faviconUrlForPage(pageUrl: string): string | null {
  if (!pageUrl.startsWith('http://') && !pageUrl.startsWith('https://')) return null
  try {
    const { hostname } = new URL(pageUrl)
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`
  } catch {
    return null
  }
}

/**
 * Ordered URLs to try for a brand mark (many banks block hotlinking or use non-standard paths).
 * The UI should advance on `img` `onError`.
 */
function brandLogoCandidateUrls(pageUrl: string): string[] {
  if (!pageUrl.startsWith('http://') && !pageUrl.startsWith('https://')) return []
  try {
    const u = new URL(pageUrl)
    const host = u.hostname
    const origin = u.origin
    const out: string[] = [`${origin}/favicon.ico`]

    if (host.startsWith('www.')) {
      const apex = host.slice(4)
      out.push(`${u.protocol}//${apex}/favicon.ico`)
    }

    out.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${host}.ico`,
    )

    return out
  } catch {
    return []
  }
}

type LogoFields = {
  brandLogoUrl?: string
  brandSiteForLogo?: string
  links?: { live?: string; repo?: string }
}

/** Deduplicated list for `<BrandLogoImg />` / project cards. */
export function brandLogoCandidatesForProject(p: LogoFields): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (s: string) => {
    if (!seen.has(s)) {
      seen.add(s)
      out.push(s)
    }
  }
  if (p.brandLogoUrl) push(p.brandLogoUrl)
  if (p.brandSiteForLogo) {
    for (const c of brandLogoCandidateUrls(p.brandSiteForLogo)) push(c)
  }
  const primary = p.links?.live ?? p.links?.repo
  if (primary) {
    for (const c of brandLogoCandidateUrls(primary)) push(c)
  }
  return out
}
