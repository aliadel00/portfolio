/**
 * Export resume markdown files to ATS-friendly PDFs (Playwright).
 * Uses semantic blocks + print CSS so content is not chopped mid-section.
 * Usage: node scripts/export-resumes.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const resumesDir = join(root, 'resumes')

const FILES = [
  'Ali-Abolwafa-Senior-Frontend-Engineer.md',
  'Ali-Abolwafa-Software-Engineer.md',
]

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inline(text) {
  let t = escapeHtml(text)
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  t = t.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>')
  return t
}

/** Markdown → HTML with blocks that respect page breaks when printed. */
function mdToHtml(md) {
  const lines = md.split('\n')
  const out = []
  let inUl = false
  let inOl = false
  let inHeader = true
  let inSection = false
  let inEntry = false
  let inBlock = false

  const closeLists = () => {
    if (inUl) {
      out.push('</ul>')
      inUl = false
    }
    if (inOl) {
      out.push('</ol>')
      inOl = false
    }
  }

  const closeBlock = () => {
    closeLists()
    if (inBlock) {
      out.push('</div>')
      inBlock = false
    }
  }

  const openBlock = () => {
    closeBlock()
    out.push('<div class="resume-block">')
    inBlock = true
  }

  const closeEntry = () => {
    closeBlock()
    if (inEntry) {
      out.push('</article>')
      inEntry = false
    }
  }

  const openEntry = () => {
    closeEntry()
    out.push('<article class="resume-entry">')
    inEntry = true
  }

  const closeSection = () => {
    closeEntry()
    closeBlock()
    if (inSection) {
      out.push('</section>')
      inSection = false
    }
  }

  const openSection = () => {
    closeSection()
    inHeader = false
    out.push('<section class="resume-section">')
    inSection = true
  }

  const closeHeader = () => {
    closeLists()
    if (inHeader) {
      out.push('</header>')
      inHeader = false
    }
  }

  for (const raw of lines) {
    const trimmed = raw.trim()

    if (trimmed === '---') {
      closeLists()
      continue
    }

    if (trimmed.startsWith('# ')) {
      closeSection()
      out.push('<header class="resume-header">')
      inHeader = true
      out.push(`<h1>${inline(trimmed.slice(2))}</h1>`)
      continue
    }

    if (trimmed.startsWith('## ')) {
      closeHeader()
      openSection()
      out.push(`<h2>${inline(trimmed.slice(3))}</h2>`)
      continue
    }

    if (trimmed.startsWith('### ')) {
      closeBlock()
      openEntry()
      out.push(`<h3>${inline(trimmed.slice(4))}</h3>`)
      continue
    }

    if (trimmed.startsWith('- ')) {
      if (!inUl) {
        closeLists()
        if (!inEntry && !inBlock) openBlock()
        out.push('<ul>')
        inUl = true
      }
      out.push(`<li>${inline(trimmed.slice(2))}</li>`)
      continue
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (!inOl) {
        closeLists()
        if (!inEntry && !inBlock) openBlock()
        out.push('<ol>')
        inOl = true
      }
      out.push(`<li>${inline(trimmed.replace(/^\d+\.\s/, ''))}</li>`)
      continue
    }

    if (trimmed === '') {
      closeLists()
      continue
    }

    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
      closeLists()
      closeEntry()
      openBlock()
      out.push(`<p class="note">${inline(trimmed.slice(1, -1))}</p>`)
      continue
    }

    closeLists()

    const isMeta =
      inEntry &&
      (trimmed.startsWith('**') || /·\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})/i.test(trimmed))

    if (inEntry && isMeta) {
      out.push(`<p class="entry-meta">${inline(trimmed)}</p>`)
      continue
    }

    if (inEntry) {
      openBlock()
      out.push(`<p>${inline(trimmed)}</p>`)
      continue
    }

    if (inSection) {
      openBlock()
      out.push(`<p>${inline(trimmed)}</p>`)
      continue
    }

    if (inHeader) {
      out.push(`<p>${inline(trimmed)}</p>`)
    }
  }

  closeSection()
  closeHeader()

  return out.join('\n')
}

function wrapHtml(body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm;
    }

    * { box-sizing: border-box; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10.5pt;
      line-height: 1.52;
      color: #111;
      max-width: 100%;
      margin: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* Keep logical units on one page when they fit */
    .resume-header,
    .resume-section > h2,
    .resume-block,
    .resume-entry,
    .resume-entry > h3,
    .resume-entry > .entry-meta,
    ul, ol {
      break-inside: avoid;
      page-break-inside: avoid;
    }

  .resume-entry ul,
  .resume-entry ol {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    li {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    h2, h3 {
      break-after: avoid;
      page-break-after: avoid;
    }

    p, li {
      orphans: 3;
      widows: 3;
    }

    .resume-header {
      margin-bottom: 14pt;
      padding-bottom: 12pt;
      border-bottom: 1px solid #ccc;
    }
    .resume-header p {
      margin: 0 0 7pt;
      line-height: 1.45;
    }
    .resume-header p:last-child { margin-bottom: 0; }

    .resume-section { margin-bottom: 6pt; }
    .resume-section > h2 {
      margin-top: 20pt;
      margin-bottom: 12pt;
    }
    .resume-section > h2:first-child { margin-top: 0; }

    h1 { font-size: 20pt; margin: 0 0 8pt; font-weight: 700; line-height: 1.2; }
    h2 {
      font-size: 11pt;
      margin: 0 0 12pt;
      padding-bottom: 5pt;
      border-bottom: 1px solid #333;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    h3 {
      font-size: 10.5pt;
      margin: 0 0 5pt;
      font-weight: 700;
      line-height: 1.35;
    }

    .resume-block { margin-bottom: 11pt; }
    .resume-block:last-child { margin-bottom: 0; }
    .resume-entry { margin-bottom: 16pt; }
    .resume-entry:last-child { margin-bottom: 0; }

    .entry-meta {
      margin: 0 0 8pt;
      font-size: 10pt;
      color: #333;
      line-height: 1.4;
    }

    p { margin: 0 0 8pt; }
    .resume-block > p:last-child { margin-bottom: 0; }

    ul, ol {
      margin: 2pt 0 0;
      padding-left: 20pt;
    }
    li {
      margin-bottom: 7pt;
      line-height: 1.48;
      padding-left: 2pt;
    }
    li:last-child { margin-bottom: 0; }

    a { color: #111; text-decoration: none; }

    /* Editor note in .md only — omit from submitted PDF */
    .note { display: none; }
    strong { font-weight: 700; }
  </style>
</head>
<body>
${body}
</body>
</html>`
}

async function exportOne(browser, filename) {
  const mdPath = join(resumesDir, filename)
  const pdfName = filename.replace(/\.md$/, '.pdf')
  const pdfPath = join(resumesDir, pdfName)
  const htmlPath = join(resumesDir, filename.replace(/\.md$/, '.html'))

  const md = readFileSync(mdPath, 'utf8')
  const html = wrapHtml(mdToHtml(md))
  writeFileSync(htmlPath, html, 'utf8')

  const page = await browser.newPage()
  await page.goto(`file://${htmlPath}`, { waitUntil: 'load' })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '18mm', right: '15mm', bottom: '18mm', left: '15mm' },
  })
  await page.close()

  console.log(`Wrote ${pdfPath}`)
  return pdfPath
}

async function main() {
  mkdirSync(resumesDir, { recursive: true })
  const browser = await chromium.launch()
  try {
    for (const file of FILES) {
      await exportOne(browser, file)
    }
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
