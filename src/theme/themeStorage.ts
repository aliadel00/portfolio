/**
 * Theme persistence. Keep the string literal in sync with the boot script in index.html
 * (that script cannot import modules).
 */
export const THEME_STORAGE_KEY = 'portfolio-theme' as const

export type StoredTheme = 'light' | 'dark'

export function parseStoredTheme(raw: string | null): StoredTheme | null {
  return raw === 'light' || raw === 'dark' ? raw : null
}
