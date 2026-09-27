import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { primaryNav } from './helpers'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as {
  hero: { headline: string }
  contact: { email: string }
  header: { navAriaPrimary: string }
  shell: { versionMenuLabel: string; versions: { id: string; label: string }[] }
}

test.describe('production-shaped preview', () => {
  test('home renders the hero inside the editor shell', async ({ page }) => {
    await page.goto('./')
    await expect(page.getByRole('heading', { name: site.hero.headline, level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation', { name: site.header.navAriaPrimary })).toBeVisible()
    await expect(page.getByRole('button', { name: `${site.shell.versionMenuLabel}, v3` })).toBeVisible()
  })

  test('section files open from the activity bar', async ({ page }) => {
    await page.goto('./')
    await primaryNav(page).getByRole('button', { name: 'Contact', exact: true }).click()
    await page.getByRole('treeitem', { name: site.contact.email }).click()
    await expect(page.locator('#contact')).toBeVisible()
  })
})
