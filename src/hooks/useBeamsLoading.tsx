/* eslint-disable react-refresh/only-export-components -- context module: BeamsLoadingProvider + useBeamsLoading */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type BeamsLoadingContextValue = {
  isBeamsReady: boolean
  markBeamsReady: () => void
}

const BeamsLoadingContext = createContext<BeamsLoadingContextValue | null>(null)

type BeamsLoadingProviderProps = {
  children: ReactNode
  /** Test helper — skip the beams gate when WebGL is mocked out. */
  initialReady?: boolean
}

export function BeamsLoadingProvider({ children, initialReady = false }: BeamsLoadingProviderProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [isBeamsReady, setIsBeamsReady] = useState(initialReady || reducedMotion)

  useEffect(() => {
    if (reducedMotion) setIsBeamsReady(true)
  }, [reducedMotion])

  const markBeamsReady = useCallback(() => {
    setIsBeamsReady(true)
  }, [])

  const value = useMemo(
    () => ({ isBeamsReady, markBeamsReady }),
    [isBeamsReady, markBeamsReady],
  )

  return <BeamsLoadingContext.Provider value={value}>{children}</BeamsLoadingContext.Provider>
}

export function useBeamsLoading() {
  const ctx = useContext(BeamsLoadingContext)
  if (!ctx) {
    throw new Error('useBeamsLoading must be used within BeamsLoadingProvider')
  }
  return ctx
}
