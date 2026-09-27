import { useLayoutEffect } from 'react'
import { invalidateShowcaseStickyTopPx } from '@/features/hero/lib/showcaseScroll'

/** Measures the fixed IDE chrome and publishes the offsets hero scroll already reads. */
export function useIdeChrome() {
  useLayoutEffect(() => {
    const apply = () => {
      const title = document.querySelector('.ide-titlebar')
      const tabs = document.querySelector('.ide-tabs')
      const status = document.querySelector('.ide-statusbar')
      const activity = document.querySelector('.ide-activity')
      const titleHeight = title?.getBoundingClientRect().height ?? 0
      const tabHeight = tabs?.getBoundingClientRect().height ?? 0
      const statusHeight = status?.getBoundingClientRect().height ?? 0
      const activityWidth = activity?.getBoundingClientRect().width ?? 0
      const root = document.documentElement
      root.style.setProperty('--ide-titlebar-height', `${Math.ceil(titleHeight)}px`)
      root.style.setProperty('--ide-tabbar-height', `${Math.ceil(tabHeight)}px`)
      root.style.setProperty('--ide-status-height', `${Math.ceil(statusHeight)}px`)
      root.style.setProperty('--ide-activity-width', `${Math.ceil(activityWidth)}px`)
      root.style.setProperty('--site-header-total', `${Math.ceil(titleHeight + tabHeight)}px`)
      invalidateShowcaseStickyTopPx()
    }

    apply()
    const observer = new ResizeObserver(apply)
    for (const el of [
      document.querySelector('.ide-titlebar'),
      document.querySelector('.ide-tabs'),
      document.querySelector('.ide-statusbar'),
      document.querySelector('.ide-activity'),
    ]) {
      if (el) observer.observe(el)
    }
    window.addEventListener('resize', apply)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])
}
