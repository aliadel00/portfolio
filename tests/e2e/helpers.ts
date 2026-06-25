import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, type Page } from '@playwright/test'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as {
  header: { navAriaPrimary: string }
}

export const APP_BOOT_LOADER_SELECTOR = '#app-boot-loader'

export function primaryNav(page: Page) {
  return page.getByRole('navigation', { name: site.header.navAriaPrimary })
}

/** Boot loader stays in DOM for LCP — assert it is hidden, not removed. */
export async function waitForAppReady(page: Page) {
  const loader = page.locator(APP_BOOT_LOADER_SELECTOR)
  await expect(loader).toBeHidden({ timeout: 10_000 })
  await expect(loader).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
}
