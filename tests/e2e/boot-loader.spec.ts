import { expect, test } from '@playwright/test'

test.describe('boot loader', () => {
  test('hides after the app mounts', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('#app-boot-loader')).toHaveCount(0, { timeout: 10_000 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
