import { expect, test } from '@playwright/test'
import { primaryNav } from './helpers'

test.describe('skill art illustrations', () => {
  test('hero skill cards expose SVG artwork', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('[data-skill-art="frontend"] svg')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('[data-skill-art="backend"] svg')).toBeVisible()
  })

  test('lazy main sections hydrate after scroll', async ({ page }) => {
    await page.goto('./')
    await primaryNav(page).getByRole('link', { name: 'About' }).click()
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'About', level: 2 }).first()).toBeVisible()
  })
})
