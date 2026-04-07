import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { SiteContent, TextSegment } from '../../src/data/siteContent.types'

function isTextSegment(x: unknown): x is TextSegment {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (o.type === 'text' || o.type === 'strong') && typeof o.value === 'string'
}

function assertSiteContent(raw: unknown): asserts raw is SiteContent {
  if (typeof raw !== 'object' || raw === null) throw new Error('site content must be an object')
  const c = raw as Record<string, unknown>
  const meta = c.meta as Record<string, unknown> | undefined
  if (!meta) throw new Error('missing meta')

  for (const key of [
    'personName',
    'siteUrl',
    'title',
    'description',
    'ogTitle',
    'ogDescription',
    'ogLocale',
    'twitterTitle',
    'twitterDescription',
    'themeColor',
    'jobTitle',
    'structuredDataDescription',
  ] as const) {
    if (typeof meta[key] !== 'string' || !(meta[key] as string).trim()) {
      throw new Error(`meta.${key} must be a non-empty string`)
    }
  }

  if (!/^https:\/\//.test(meta.siteUrl as string)) {
    throw new Error('meta.siteUrl must be an https URL')
  }

  if (!Array.isArray(c.nav) || c.nav.length === 0) throw new Error('nav must be a non-empty array')
  for (const item of c.nav) {
    if (typeof item !== 'object' || item === null) throw new Error('nav item invalid')
    const n = item as Record<string, unknown>
    if (typeof n.href !== 'string' || typeof n.id !== 'string' || typeof n.label !== 'string') {
      throw new Error('nav item fields invalid')
    }
    if (!n.href.startsWith('#')) throw new Error(`nav href must be in-page: ${n.href}`)
  }

  const contact = c.contact as Record<string, unknown> | undefined
  if (!contact) throw new Error('missing contact')
  if (typeof contact.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    throw new Error('contact.email must look like an email')
  }
  for (const urlKey of ['linkedInUrl', 'githubUrl'] as const) {
    const u = contact[urlKey]
    if (typeof u !== 'string' || !/^https:\/\//.test(u)) {
      throw new Error(`contact.${urlKey} must be an https URL`)
    }
  }
  if (typeof contact.phoneHref !== 'string' || !contact.phoneHref.startsWith('tel:')) {
    throw new Error('contact.phoneHref must be a tel: link')
  }

  const hero = c.hero as Record<string, unknown> | undefined
  if (!hero || typeof hero.headline !== 'string' || !hero.headline.trim()) {
    throw new Error('hero.headline required')
  }
  if (!Array.isArray(hero.intro) || !hero.intro.every(isTextSegment)) {
    throw new Error('hero.intro must be TextSegment[]')
  }
}

describe('B2B / content contract (siteContent.json)', () => {
  it('parses and satisfies the public SiteContent contract', () => {
    const path = resolve(process.cwd(), 'src/data/siteContent.json')
    const raw = JSON.parse(readFileSync(path, 'utf8'))
    expect(() => assertSiteContent(raw)).not.toThrow()
  })
})
