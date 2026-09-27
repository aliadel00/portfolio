import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { primaryNav, waitForAppReady } from './helpers'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as {
  about: { eyebrow: string; title: string }
  skills: { title: string }
  work: { title: string }
  contact: { email: string; title: string }
  header: { navAriaPrimary: string }
}

const SECTIONS = [
  { id: 'about', activity: site.about.title, file: site.about.eyebrow },
  { id: 'skills', activity: site.skills.title, file: 'Frontend & UI engineering' },
  { id: 'work', activity: site.work.title, file: 'Leading bank' },
  { id: 'contact', activity: site.contact.title, file: site.contact.email },
] as const

async function loadLazySections(page: import('@playwright/test').Page) {
  const nav = primaryNav(page)
  for (const item of SECTIONS) {
    await nav.getByRole('button', { name: item.activity, exact: true }).click()
    await page.getByRole('treeitem', { name: item.file, exact: true }).click()
    await expect(page.locator(`#${item.id}`)).toBeVisible()
  }
}

function formatViolations(violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations']) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `  - ${node.html}${node.failureSummary ? `\n    ${node.failureSummary}` : ''}`)
        .join('\n')
      return `[${violation.impact}] ${violation.id}: ${violation.help}\n${nodes}`
    })
    .join('\n\n')
}

test.describe('accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('home has no axe violations after lazy sections load', async ({ page }) => {
    await page.goto('./')
    await waitForAppReady(page)
    await loadLazySections(page)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(
      results.violations,
      results.violations.length ? formatViolations(results.violations) : undefined,
    ).toEqual([])
  })

  test('primary navigation has no axe violations', async ({ page }) => {
    await page.goto('./')
    await waitForAppReady(page)

    const results = await new AxeBuilder({ page })
      .include(`nav[aria-label="${site.header.navAriaPrimary}"]`)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(
      results.violations,
      results.violations.length ? formatViolations(results.violations) : undefined,
    ).toEqual([])
  })
})
