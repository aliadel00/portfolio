#!/usr/bin/env node
/**
 * Post-build performance budget checks.
 * Set SKIP_BUILD=1 when dist/ is already produced (e.g. CI build artifact).
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { execSync } from 'node:child_process'
import { gzipSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { walkFiles } from './lib/fs-walk.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distAssets = join(root, 'dist/assets')

/** Max total JS payload in dist/assets (bytes). */
const MAX_TOTAL_JS_BYTES = 1_450_000
/** Max single JS chunk (bytes) — keeps three.js hero path split. */
const MAX_SINGLE_JS_CHUNK_BYTES = 900_000
/** Max main CSS bundle (bytes, raw). */
const MAX_CSS_BYTES = 185_000
/** Max main CSS bundle (bytes, gzip). */
const MAX_CSS_GZIP_BYTES = 32_000

function formatKb(n) {
  return `${(n / 1024).toFixed(1)} KiB`
}

async function findCssBundle() {
  const files = await walkFiles(distAssets)
  const css = files.filter((f) => f.endsWith('.css'))
  if (css.length === 0) return null
  if (css.length === 1) return css[0]
  let largest = css[0]
  let size = 0
  for (const file of css) {
    const { size: s } = await stat(file)
    if (s > size) {
      size = s
      largest = file
    }
  }
  return largest
}

async function walkJs(dir) {
  const files = await walkFiles(dir)
  return files.filter((f) => f.endsWith('.js'))
}

async function appendCiSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (!summaryPath) return
  const { appendFile } = await import('node:fs/promises')
  await appendFile(summaryPath, `${lines.join('\n')}\n`)
}

async function main() {
  if (process.env.SKIP_BUILD !== '1') {
    execSync('npm run build', {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, VITE_BASE_PATH: process.env.VITE_BASE_PATH || '/portfolio/' },
    })
  }

  const jsFiles = await walkJs(distAssets)
  if (jsFiles.length === 0) throw new Error('No JS assets found in dist/assets')

  let totalJs = 0
  let largestJs = { file: '', size: 0 }

  for (const file of jsFiles) {
    const { size } = await stat(file)
    totalJs += size
    if (size > largestJs.size) largestJs = { file, size }
  }

  const cssFile = await findCssBundle()
  let cssSize = 0
  let cssGzip = 0
  if (cssFile) {
    const buf = await readFile(cssFile)
    cssSize = buf.length
    cssGzip = gzipSync(buf).length
  }

  console.log(`Performance budget: ${jsFiles.length} JS chunks, total ${formatKb(totalJs)}`)
  console.log(`Largest JS: ${largestJs.file.replace(root, '')} (${formatKb(largestJs.size)})`)
  if (cssFile) {
    console.log(`CSS bundle: ${cssFile.replace(root, '')} (${formatKb(cssSize)}, gzip ${formatKb(cssGzip)})`)
  }

  const failures = []
  if (totalJs > MAX_TOTAL_JS_BYTES) {
    failures.push(`Total JS ${formatKb(totalJs)} exceeds budget ${formatKb(MAX_TOTAL_JS_BYTES)}`)
  }
  if (largestJs.size > MAX_SINGLE_JS_CHUNK_BYTES) {
    failures.push(
      `Largest JS chunk ${formatKb(largestJs.size)} exceeds budget ${formatKb(MAX_SINGLE_JS_CHUNK_BYTES)}`,
    )
  }
  if (cssFile && cssSize > MAX_CSS_BYTES) {
    failures.push(`CSS ${formatKb(cssSize)} exceeds budget ${formatKb(MAX_CSS_BYTES)}`)
  }
  if (cssFile && cssGzip > MAX_CSS_GZIP_BYTES) {
    failures.push(`CSS gzip ${formatKb(cssGzip)} exceeds budget ${formatKb(MAX_CSS_GZIP_BYTES)}`)
  }

  await appendCiSummary([
    '## Performance budget',
    '',
    '| Asset | Size | Budget |',
    '| --- | --- | --- |',
    `| Total JS | ${formatKb(totalJs)} | ${formatKb(MAX_TOTAL_JS_BYTES)} |`,
    `| Largest JS chunk | ${formatKb(largestJs.size)} | ${formatKb(MAX_SINGLE_JS_CHUNK_BYTES)} |`,
    cssFile ? `| CSS (gzip) | ${formatKb(cssGzip)} | ${formatKb(MAX_CSS_GZIP_BYTES)} |` : '| CSS | n/a | n/a |',
    '',
    failures.length ? `**Result:** failed (${failures.length} check(s))` : '**Result:** passed',
  ])

  if (failures.length) {
    for (const f of failures) console.error(`  ✗ ${f}`)
    process.exit(1)
  }

  console.log('Performance budget: passed.')
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
