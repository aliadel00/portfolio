import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { primaryNav } from './helpers'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/data/siteContent.json'), 'utf8')) as {
  nav: Array<{ href: string; id: string; label: string }>
  header: { navAriaPrimary: string }
}

async function waitForAppReady(page: import('@playwright/test').Page) {
  await expect(page.locator('#app-boot-loader')).toHaveCount(0, { timeout: 10_000 })
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}

async function loadLazySections(page: import('@playwright/test').Page) {
  const nav = primaryNav(page)
  for (const item of site.nav) {
    await nav.getByRole('link', { name: item.label, exact: true }).click()
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
