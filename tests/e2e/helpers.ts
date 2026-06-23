import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Page } from '@playwright/test'

const site = JSON.parse(readFileSync(resolve(process.cwd(), 'src/content/siteContent.json'), 'utf8')) as {
  header: { navAriaPrimary: string }
}

export function primaryNav(page: Page) {
  return page.getByRole('navigation', { name: site.header.navAriaPrimary })
}
