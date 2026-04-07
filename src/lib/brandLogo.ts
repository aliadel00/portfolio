type LogoFields = {
  brandLogoUrl?: string
  brandSiteForLogo?: string
  links?: { live?: string; repo?: string }
}

/**
 * Local-only brand marks under `public/` (e.g. `/logos/foo.svg`).
 * Use `brandLogoUrl` on each project / hero tile — no remote favicon or third-party icon APIs.
 */
export function brandLogoCandidatesForProject(p: LogoFields): string[] {
  if (!p.brandLogoUrl?.trim()) return []
  return [p.brandLogoUrl.trim()]
}
