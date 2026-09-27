import { expect, test } from '@playwright/test'
import { waitForAppReady } from './helpers'

test.describe('entry', () => {
  test('shows the hero without a boot spinner', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('#app-boot-loader')).toHaveCount(0)
    await waitForAppReady(page)
  })
})
