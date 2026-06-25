import { expect, test } from '@playwright/test'
import { APP_BOOT_LOADER_SELECTOR, waitForAppReady } from './helpers'

test.describe('boot loader', () => {
  test('hides after the app mounts', async ({ page }) => {
    await page.goto('./')
    await waitForAppReady(page)
    await expect(page.locator(APP_BOOT_LOADER_SELECTOR)).toHaveCount(1)
  })
})
