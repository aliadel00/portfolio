/**
 * Theme persistence. Keep the string literal in sync with the boot script in index.html
 * (that script cannot import modules).
 */
export const THEME_STORAGE_KEY = 'portfolio-theme' as const

export const THEME_IDS = ['minimal-light', 'minimal-dark', 'caustica', 'copper'] as const

export type StoredTheme = (typeof THEME_IDS)[number]

const THEME_ID_SET = new Set<string>(THEME_IDS)

export function parseStoredTheme(raw: string | null): StoredTheme | null {
  if (raw === 'light') return 'minimal-light'
  if (raw === 'dark') return 'caustica'
  if (raw && THEME_ID_SET.has(raw)) return raw as StoredTheme
  return null
}

export function isLightTheme(theme: StoredTheme): boolean {
  return theme === 'minimal-light'
}

export const THEME_COLORS: Record<StoredTheme, string> = {
  'minimal-light': '#f4f4f5',
  'minimal-dark': '#111113',
  caustica: '#0a0b12',
  copper: '#1c1410',
}
