import { useEffect } from 'react'

function isTypingContext(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  if (target.closest('[contenteditable="true"]')) return true
  if (target.closest('[role="textbox"]')) return true
  return false
}

/**
 * Press `/` (when not typing) to focus primary navigation — common on content-heavy sites.
 * Guarded so it does not fight inputs or Firefox quick-find when the target is already an input.
 */
export function useSlashFocusNav(focusNav: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingContext(e.target)) return
      e.preventDefault()
      focusNav()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, focusNav])
}
