import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/data/siteContent.json'), 'utf8')) as {
  hero: { headline: string }
  skills: { title: string }
  work: { title: string }
  contact: { title: string }
  header: { navAriaPrimary: string }
}

test.describe('production-shaped preview', () => {
  test('home renders hero headline and primary sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: site.hero.headline, level: 1 })).toBeVisible()
    await expect(page.getByRole('navigation', { name: site.header.navAriaPrimary })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'About', level: 2 }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: site.skills.title, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: site.work.title, level: 2 })).toBeVisible()
    await expect(page.getByRole('heading', { name: site.contact.title, level: 2 })).toBeVisible()
  })

  test('in-page navigation targets exist', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Contact' }).click()
    await expect(page.locator('#contact')).toBeVisible()
  })
})
