#!/usr/bin/env node
/**
 * Fast local gate before commit — lint, typecheck, unit tests.
 * Enable via: git config core.hooksPath .githooks
 */
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function run(label, command) {
  console.log(`\n[precommit] ${label}`)
  execSync(command, { cwd: root, stdio: 'inherit' })
}

try {
  run('lint', 'npm run lint')
  run('typecheck', 'npm run typecheck')
  run('test', 'npm run test')
  console.log('\n[precommit] all checks passed')
} catch {
  process.exit(1)
}
