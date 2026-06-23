import type { ReactNode } from 'react'
import { HERO_INTRO_SECTION_ID } from '@/features/navigation/lib/sectionNavigation'
import { HeroIntroBeams } from './HeroIntroBeams'

/** Full-bleed beams backdrop for hero intro; overlaps under the sticky site header. */
export function HeroIntroShell({ children }: { children: ReactNode }) {
  return (
    <div
      id={HERO_INTRO_SECTION_ID}
      className="hero-intro-shell relative isolate flex w-screen max-w-[100vw] flex-col overflow-x-clip [margin-inline:calc(50%-50vw)] [margin-top:calc(-1*var(--site-header-total,4.5rem))]"
    >
      <HeroIntroBeams />
      <div className="hero-intro-shell__content relative z-[1] flex min-h-0 flex-1 flex-col pt-[var(--site-header-total,4.5rem)]">
        {children}
      </div>
    </div>
  )
}
