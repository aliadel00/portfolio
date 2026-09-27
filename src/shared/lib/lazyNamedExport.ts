import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

export type LazyNamedComponent = LazyExoticComponent<ComponentType<unknown>> & {
  /** Start the chunk fetch without rendering. Safe to call more than once. */
  preload: () => void
}

/** Lazy-load a named export. `preload` shares one in-flight import with render. */
export function lazyNamedExport<M extends Record<string, ComponentType<unknown>>>(
  factory: () => Promise<M>,
  name: keyof M & string,
): LazyNamedComponent {
  let pending: Promise<{ default: M[typeof name] }> | undefined
  const load = () => {
    pending ??= factory().then((module) => ({ default: module[name] }))
    return pending
  }

  return Object.assign(lazy(load), {
    preload: () => {
      void load()
    },
  })
}
