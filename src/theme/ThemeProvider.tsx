/* eslint-disable react-refresh/only-export-components -- context module: ThemeProvider + useTheme */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { parseStoredTheme, THEME_STORAGE_KEY, type StoredTheme } from './themeStorage'

type ThemeContextValue = {
  theme: StoredTheme
  setTheme: (t: StoredTheme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readThemeFromDom(): StoredTheme {
  if (typeof document === 'undefined') return 'dark'
  return parseStoredTheme(document.documentElement.getAttribute('data-theme')) ?? 'dark'
}

function applyThemeToDom(theme: StoredTheme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', theme === 'light' ? '#f2eff7' : '#0a0b12')
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasViewTransition(): boolean {
  return typeof document !== 'undefined' && typeof document.startViewTransition === 'function'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<StoredTheme>(readThemeFromDom)

  useEffect(() => {
    applyThemeToDom(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const runTransition = useCallback((next: StoredTheme) => {
    if (next !== 'light' && next !== 'dark') return
    if (typeof document === 'undefined') {
      setThemeState(next)
      return
    }
    if (hasViewTransition() && !prefersReducedMotion()) {
      document.startViewTransition(() => {
        applyThemeToDom(next)
        flushSync(() => setThemeState(next))
      })
    } else {
      setThemeState(next)
    }
  }, [])

  const setTheme = useCallback((t: StoredTheme) => runTransition(t), [runTransition])

  const toggleTheme = useCallback(() => {
    runTransition(theme === 'dark' ? 'light' : 'dark')
  }, [theme, runTransition])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
