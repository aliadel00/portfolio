/**
 * Encode PNG screenshots in public/screenshots/ to WebP (quality 85).
 * Run after adding or changing PNGs: `npm run optimize-screenshots`
 */
import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'

const dir = resolve(process.cwd(), 'public/screenshots')
const files = await readdir(dir)
const pngs = files.filter((f) => f.toLowerCase().endsWith('.png'))

for (const name of pngs) {
  const input = resolve(dir, name)
  const output = resolve(dir, name.replace(/\.png$/i, '.webp'))
  await sharp(input).webp({ quality: 85, effort: 6 }).toFile(output)
  console.log('[optimize-screenshots]', name, '→', output.split('/').pop())
}

if (pngs.length === 0) console.log('[optimize-screenshots] no PNG files found')
