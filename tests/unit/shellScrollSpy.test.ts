import { describe, expect, it } from 'vitest'
import type { ShellFile } from '@/features/shell/shellModel'
import { resolveShellFileFromViewport } from '@/features/shell/shellScrollSpy'

function file(id: string): ShellFile {
  return { id, label: id, panel: 'contact', targetId: id }
}

const contactFiles = [
  file('contact-email'),
  file('contact-phone'),
  file('contact-linkedin'),
  file('contact-github'),
]

describe('resolveShellFileFromViewport', () => {
  it('keeps GitHub when it shares the reading line with LinkedIn', () => {
    const rects: Record<string, { top: number; bottom: number }> = {
      'contact-email': { top: 40, bottom: 64 },
      'contact-phone': { top: 40, bottom: 64 },
      'contact-linkedin': { top: 88, bottom: 112 },
      'contact-github': { top: 88, bottom: 112 },
    }

    const active = resolveShellFileFromViewport(
      contactFiles,
      (id) => rects[id] ?? null,
      72,
      800,
      'contact-github',
    )

    expect(active?.id).toBe('contact-github')
  })

  it('keeps email when that row is the one on the reading line', () => {
    const rects: Record<string, { top: number; bottom: number }> = {
      'contact-email': { top: 84, bottom: 108 },
      'contact-phone': { top: 84, bottom: 108 },
      'contact-linkedin': { top: 160, bottom: 184 },
      'contact-github': { top: 160, bottom: 184 },
    }

    const active = resolveShellFileFromViewport(
      contactFiles,
      (id) => rects[id] ?? null,
      72,
      800,
      'contact-email',
    )

    expect(active?.id).toBe('contact-email')
  })

  it('moves to the row nearest the reading line while scrolling', () => {
    const rects: Record<string, { top: number; bottom: number }> = {
      'contact-email': { top: 20, bottom: 44 },
      'contact-phone': { top: 20, bottom: 44 },
      'contact-linkedin': { top: 90, bottom: 114 },
      'contact-github': { top: 90, bottom: 114 },
    }

    const active = resolveShellFileFromViewport(
      contactFiles,
      (id) => rects[id] ?? null,
      72,
      800,
      'contact-email',
    )

    expect(active?.id).toBe('contact-linkedin')
  })

  it('keeps GitHub when the page cannot scroll it up to the reading line', () => {
    const rects: Record<string, { top: number; bottom: number }> = {
      'contact-email': { top: 100, bottom: 124 },
      'contact-phone': { top: 100, bottom: 124 },
      'contact-linkedin': { top: 160, bottom: 184 },
      'contact-github': { top: 160, bottom: 184 },
    }

    const active = resolveShellFileFromViewport(
      contactFiles,
      (id) => rects[id] ?? null,
      72,
      800,
      'contact-github',
      { scrollRoom: 0 },
    )

    expect(active?.id).toBe('contact-github')
  })

  it('follows the nearer row when that link can still reach the reading line', () => {
    const rects: Record<string, { top: number; bottom: number }> = {
      'contact-email': { top: 100, bottom: 124 },
      'contact-phone': { top: 100, bottom: 124 },
      'contact-linkedin': { top: 160, bottom: 184 },
      'contact-github': { top: 160, bottom: 184 },
    }

    const active = resolveShellFileFromViewport(
      contactFiles,
      (id) => rects[id] ?? null,
      72,
      800,
      'contact-github',
      { scrollRoom: 400 },
    )

    expect(active?.id).toBe('contact-email')
  })
})
