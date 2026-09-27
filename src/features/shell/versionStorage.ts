export const VERSION_STORAGE_KEY = 'portfolio-version' as const

export const PORTFOLIO_VERSIONS = ['v1', 'v2', 'v3'] as const

export type PortfolioVersion = (typeof PORTFOLIO_VERSIONS)[number]

const VERSION_SET = new Set<string>(PORTFOLIO_VERSIONS)

export function parsePortfolioVersion(raw: string | null): PortfolioVersion | null {
  if (raw && VERSION_SET.has(raw)) return raw as PortfolioVersion
  return null
}

export function readStoredVersion(): PortfolioVersion {
  if (typeof sessionStorage === 'undefined') return 'v3'
  try {
    return parsePortfolioVersion(sessionStorage.getItem(VERSION_STORAGE_KEY)) ?? 'v3'
  } catch {
    return 'v3'
  }
}

export function storeVersion(version: PortfolioVersion): void {
  try {
    sessionStorage.setItem(VERSION_STORAGE_KEY, version)
  } catch {
    /* private mode */
  }
}
