import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, type Page } from '@playwright/test'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as {
  header: { navAriaPrimary: string }
}

export function primaryNav(page: Page) {
  return page.getByRole('navigation', { name: site.header.navAriaPrimary })
}

/** Hero copy is the first paint — there is no boot spinner to dismiss. */
export async function waitForAppReady(page: Page) {
  await expect(page.locator('#app-boot-loader')).toHaveCount(0)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
