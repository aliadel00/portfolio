import type { ReactNode } from 'react'
import { ShellSelectionContext, type ShellSelectionValue } from './useShellSelection'

export function ShellSelectionProvider({
  value,
  children,
}: {
  value: ShellSelectionValue
  children: ReactNode
}) {
  return <ShellSelectionContext.Provider value={value}>{children}</ShellSelectionContext.Provider>
}
