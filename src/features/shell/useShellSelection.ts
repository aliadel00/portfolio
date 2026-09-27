import { createContext, useContext } from 'react'

export type ShellSelectionValue = {
  activeId: string
  selectFile: (id: string) => void
}

export const ShellSelectionContext = createContext<ShellSelectionValue>({
  activeId: '',
  selectFile: () => {},
})

export function useShellSelection(): ShellSelectionValue {
  return useContext(ShellSelectionContext)
}
