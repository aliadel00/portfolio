import { useEffect } from 'react'

/**
 * Locks page scroll while the mobile nav drawer is open.
 * Always restores the pre-lock scroll position on close so smooth section jumps
 * start from where the user was, not from the top.
 */
export function useMobileNavScrollLock(isOpen: boolean, onEscape?: () => void) {
  useEffect(() => {
    if (!isOpen) return

    const scrollY = window.scrollY
    const { style } = document.body
    style.position = 'fixed'
    style.top = `-${scrollY}px`
    style.left = '0'
    style.right = '0'
    style.width = '100%'
    style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape?.()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)

      style.position = ''
      style.top = ''
      style.left = ''
      style.right = ''
      style.width = ''
      style.overflow = ''

      window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' })
    }
  }, [isOpen, onEscape])
}
