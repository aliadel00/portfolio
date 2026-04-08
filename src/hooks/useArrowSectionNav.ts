import { useEffect } from 'react'
import { siteContent } from '../data/site'
import { replaceUrlWithSection, scrollToSectionById } from '../lib/sectionNavigation'

const SECTION_IDS = ['hero', ...siteContent.nav.map((item) => item.id)]
const ARROW_TARGET_IDS = ['hero', 'about', 'skills', 'work', 'work-career', 'work-freelance', 'contact']

function isTypingContext(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  if (target.closest('[contenteditable="true"]')) return true
  if (target.closest('[role="textbox"]')) return true
  return false
}

function isInteractiveContext(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false
  return Boolean(target.closest('#site-navigation a, #site-navigation button, #mobile-nav-drawer a, #mobile-nav-drawer button'))
}

export function useArrowSectionNav(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const activeTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null
      if (isTypingContext(activeTarget) || isTypingContext(e.target)) return
      if (isInteractiveContext(activeTarget) || isInteractiveContext(e.target)) return

      const sections = ARROW_TARGET_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => el !== null,
      )
      if (sections.length === 0) return

      const marker = window.innerHeight * 0.32
      let currentIndex = -1
      for (let i = 0; i < sections.length; i += 1) {
        if (sections[i].getBoundingClientRect().top <= marker) currentIndex = i
      }

      let target: HTMLElement | null = null
      if (e.key === 'ArrowDown') {
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1)
        if (nextIndex !== currentIndex) target = sections[nextIndex]
      } else {
        if (currentIndex <= 0) {
          target = null
        } else {
          target = sections[currentIndex - 1]
        }
      }

      if (!target) return
      e.preventDefault()
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      scrollToSectionById(target.id, reducedMotion)
      if (SECTION_IDS.includes(target.id)) replaceUrlWithSection(target.id)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
