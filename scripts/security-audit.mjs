#!/usr/bin/env node
/**
 * Lightweight automated security checks (not a substitute for professional penetration testing).
 * - npm audit (production deps by default in CI via NPM_AUDIT_PRODUCTION=true)
 * - forbidden patterns in first-party source and SVG assets
 */
import { execSync } from 'node:child_process'
import { appendFile, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { walkFiles } from './lib/fs-walk.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')

const auditLevel = process.env.NPM_AUDIT_LEVEL?.trim() || 'high'
const productionOnly = process.env.NPM_AUDIT_PRODUCTION === 'true'

const FORBIDDEN = [
  { name: 'eval()', re: /\beval\s*\(/ },
  { name: 'Function constructor', re: /\bnew\s+Function\s*\(/ },
  { name: 'dangerouslySetInnerHTML', re: /dangerouslySetInnerHTML/ },
  { name: 'document.write', re: /\bdocument\.write\s*\(/ },
  { name: 'inline script assignment', re: /\.innerHTML\s*=\s*[^;]+/ },
]

const SVG_FORBIDDEN = [
  { name: 'script element', re: /<script[\s>]/i },
  { name: 'event handler attribute', re: /\son[a-z]+\s*=/i },
  { name: 'javascript: URL', re: /javascript\s*:/i },
  { name: 'foreignObject', re: /<foreignObject[\s>]/i },
]

async function appendCiSummary(lines) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY
  if (!summaryPath) return
  await appendFile(summaryPath, `${lines.join('\n')}\n`)
}

function runAudit() {
  const omitDev = productionOnly ? ' --omit=dev' : ''
  try {
    execSync(`npm audit --audit-level=${auditLevel}${omitDev}`, {
      cwd: root,
      stdio: 'inherit',
    })
    return { ok: true, scope: productionOnly ? 'production' : 'all' }
  } catch {
    return { ok: false, scope: productionOnly ? 'production' : 'all' }
  }
}

async function scanSources() {
  const files = (await walkFiles(srcDir)).filter((f) => ['.ts', '.tsx'].includes(extname(f)))
  const hits = []
  for (const file of files) {
    const text = await readFile(file, 'utf8')
    for (const { name, re } of FORBIDDEN) {
      if (re.test(text)) hits.push({ file: relative(root, file), name })
    }
  }
  if (hits.length) {
    console.error('Forbidden patterns in src/:')
    for (const h of hits) console.error(`  ${h.file}: ${h.name}`)
    throw new Error('Static security scan failed')
  }
}

async function scanSvgAssets() {
  const svgRoots = [join(root, 'src', 'assets'), join(root, 'public')]
  const hits = []
  for (const dir of svgRoots) {
    const files = (await walkFiles(dir)).filter((f) => extname(f) === '.svg')
    for (const file of files) {
      const text = await readFile(file, 'utf8')
      for (const { name, re } of SVG_FORBIDDEN) {
        if (re.test(text)) hits.push({ file: relative(root, file), name })
      }
    }
  }
  if (hits.length) {
    console.error('Forbidden patterns in SVG assets:')
    for (const h of hits) console.error(`  ${h.file}: ${h.name}`)
    throw new Error('SVG security scan failed')
  }
}

try {
  await scanSources()
  await scanSvgAssets()

  const audit = runAudit()
  await appendCiSummary([
    '## Security audit',
    '',
    `- Static source scan: passed`,
    `- SVG asset scan: passed`,
    `- npm audit (${audit.scope}, level=${auditLevel}): ${audit.ok ? 'passed' : 'failed'}`,
  ])

  if (!audit.ok) {
    throw new Error(
      `npm audit failed (level=${auditLevel}, scope=${audit.scope}). Fix dependencies or set NPM_AUDIT_LEVEL.`,
    )
  }

  console.log('Security audit: npm audit + static source checks passed.')
} catch (e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
