import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import type { SiteContent } from './src/data/siteContent.types'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadSiteContent(): SiteContent {
  const raw = readFileSync(resolve(__dirname, 'src/data/siteContent.json'), 'utf8')
  return JSON.parse(raw) as SiteContent
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\s+/g, ' ').trim()
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const content = loadSiteContent()
  const siteUrlSlash = (() => {
    const base = (env.VITE_SITE_URL?.trim() || content.meta.siteUrl.trim())
    return base.endsWith('/') ? base : `${base}/`
  })()

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: content.meta.personName,
    url: siteUrlSlash,
    email: content.contact.email,
    jobTitle: content.meta.jobTitle,
    sameAs: [content.contact.linkedInUrl, content.contact.githubUrl],
    description: content.meta.structuredDataDescription,
  }

  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-site-meta',
        transformIndexHtml(html) {
          return html
            .replace('%SITE_TITLE%', escapeHtmlAttr(content.meta.title))
            .replace('%SITE_META_DESCRIPTION%', escapeHtmlAttr(content.meta.description))
            .replace('%SITE_OG_TITLE%', escapeHtmlAttr(content.meta.ogTitle))
            .replace('%SITE_OG_DESCRIPTION%', escapeHtmlAttr(content.meta.ogDescription))
            .replace('%SITE_OG_URL%', escapeHtmlAttr(siteUrlSlash))
            .replace('%SITE_OG_LOCALE%', escapeHtmlAttr(content.meta.ogLocale))
            .replace('%SITE_CANONICAL_URL%', escapeHtmlAttr(siteUrlSlash))
            .replace('%SITE_TWITTER_TITLE%', escapeHtmlAttr(content.meta.twitterTitle))
            .replace('%SITE_TWITTER_DESCRIPTION%', escapeHtmlAttr(content.meta.twitterDescription))
            .replace('%SITE_THEME_COLOR%', escapeHtmlAttr(content.meta.themeColor))
            .replace('%SITE_JSON_LD%', JSON.stringify(ld).replace(/</g, '\\u003c'))
        },
      },
    ],
  }
})
