import { lazy, type ComponentType } from 'react'

/** Lazy-load a named export from a dynamic import module. */
export function lazyNamedExport<M extends Record<string, ComponentType<unknown>>>(
  factory: () => Promise<M>,
  name: keyof M & string,
) {
  return lazy(() => factory().then((module) => ({ default: module[name] })))
}
