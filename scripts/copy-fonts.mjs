/**
 * Copies variable WOFF2 subsets from @fontsource-variable into public/fonts for stable URLs
 * (preload in index.html + @font-face in src/fonts.css).
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const destDir = resolve(root, 'public/fonts')
const dm = resolve(root, 'node_modules/@fontsource-variable/dm-sans/files')
const syne = resolve(root, 'node_modules/@fontsource-variable/syne/files')

const files = [
  [resolve(dm, 'dm-sans-latin-wght-normal.woff2'), resolve(destDir, 'dm-sans-latin-wght-normal.woff2')],
  [resolve(dm, 'dm-sans-latin-ext-wght-normal.woff2'), resolve(destDir, 'dm-sans-latin-ext-wght-normal.woff2')],
  [resolve(dm, 'dm-sans-latin-wght-italic.woff2'), resolve(destDir, 'dm-sans-latin-wght-italic.woff2')],
  [resolve(dm, 'dm-sans-latin-ext-wght-italic.woff2'), resolve(destDir, 'dm-sans-latin-ext-wght-italic.woff2')],
  [resolve(syne, 'syne-latin-wght-normal.woff2'), resolve(destDir, 'syne-latin-wght-normal.woff2')],
  [resolve(syne, 'syne-latin-ext-wght-normal.woff2'), resolve(destDir, 'syne-latin-ext-wght-normal.woff2')],
]

mkdirSync(destDir, { recursive: true })

for (const [src, out] of files) {
  if (!existsSync(src)) {
    console.warn(`[copy-fonts] skip (missing): ${src}`)
    continue
  }
  copyFileSync(src, out)
}
