#!/usr/bin/env node
/**
 * Lightweight automated security checks (not a substitute for professional penetration testing).
 * - npm audit with a configurable severity floor
 * - forbidden patterns in first-party source
 */
import { execSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'src')

const auditLevel = process.env.NPM_AUDIT_LEVEL?.trim() || 'high'

const FORBIDDEN = [
  { name: 'eval()', re: /\beval\s*\(/ },
  { name: 'Function constructor', re: /\bnew\s+Function\s*\(/ },
  { name: 'dangerouslySetInnerHTML', re: /dangerouslySetInnerHTML/ },
  { name: 'document.write', re: /\bdocument\.write\s*\(/ },
  { name: 'inline script assignment', re: /\.innerHTML\s*=\s*[^;]+/ },
]

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) await walk(p, out)
    else out.push(p)
  }
  return out
}

function runAudit() {
  try {
    execSync(`npm audit --audit-level=${auditLevel}`, {
      cwd: root,
      stdio: 'inherit',
    })
  } catch {
    process.exitCode = 1
    throw new Error(`npm audit failed (level=${auditLevel}). Fix or set NPM_AUDIT_LEVEL=moderate to relax in dev.`)
  }
}

async function scanSources() {
  const files = (await walk(srcDir)).filter((f) => ['.ts', '.tsx'].includes(extname(f)))
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

try {
  runAudit()
  await scanSources()
  console.log('Security audit: npm audit + static source checks passed.')
} catch (e) {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
}
