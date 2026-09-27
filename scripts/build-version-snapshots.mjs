#!/usr/bin/env node
/**
 * Builds the v1, v2, and v3 branches into public/versions so the shell can open them.
 */
import { execFileSync } from 'node:child_process'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const versions = ['v1', 'v2', 'v3']

function git(args, stdio = 'inherit') {
  execFileSync('git', args, { cwd: root, stdio })
}

function hasRef(ref) {
  try {
    execFileSync('git', ['rev-parse', '--verify', '--quiet', ref], { cwd: root, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function resolveVersionRef(version) {
  if (hasRef(version)) return version
  if (hasRef(`origin/${version}`)) return `origin/${version}`
  git(['fetch', 'origin', version])
  if (hasRef(`origin/${version}`)) return `origin/${version}`
  throw new Error(`Cannot find git ref for portfolio version ${version}`)
}

async function buildVersion(version) {
  const ref = resolveVersionRef(version)
  const work = join(root, '.version-builds', version)
  const dest = join(root, 'public', 'versions', version)
  const base = `/portfolio/versions/${version}/`

  try {
    git(['worktree', 'remove', '--force', work], 'ignore')
  } catch {
    /* no existing worktree */
  }
  await rm(work, { recursive: true, force: true })
  git(['worktree', 'add', '--detach', work, ref])

  execFileSync('npm', ['ci'], { cwd: work, stdio: 'inherit' })
  execFileSync('npm', ['run', 'build'], {
    cwd: work,
    stdio: 'inherit',
    env: { ...process.env, VITE_BASE_PATH: base },
  })

  await rm(dest, { recursive: true, force: true })
  await mkdir(dest, { recursive: true })
  await cp(join(work, 'dist'), dest, { recursive: true })
  await isolateThemeStorage(dest, version)

  git(['worktree', 'remove', '--force', work])
  console.log(`[versions] ${version} → public/versions/${version}`)
}

async function isolateThemeStorage(dir, version) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      await isolateThemeStorage(path, version)
      continue
    }
    if (!entry.name.endsWith('.html') && !entry.name.endsWith('.js')) continue
    const source = await readFile(path, 'utf8')
    const next = source.replaceAll('portfolio-theme', `portfolio-theme-${version}`)
    if (next !== source) await writeFile(path, next)
  }
}

for (const version of versions) {
  await buildVersion(version)
}
