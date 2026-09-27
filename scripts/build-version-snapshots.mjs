#!/usr/bin/env node
/**
 * Builds archived portfolio shells into public/versions so the live shell can iframe them.
 * v3 is the current checkout and is not snapshotted.
 * Prefer release/X.Y.Z; fall back to legacy flat branch names when they still exist.
 */
import { execFileSync } from 'node:child_process'
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const ARCHIVED_VERSIONS = {
  v1: ['release/1.0.0', 'v1'],
  v2: ['release/2.0.0', 'v2'],
}

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

function fetchRemoteBranch(ref) {
  try {
    execFileSync(
      'git',
      ['fetch', 'origin', `+refs/heads/${ref}:refs/remotes/origin/${ref}`],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    return null
  } catch (error) {
    const stderr = error instanceof Error && 'stderr' in error ? error.stderr?.toString() : ''
    return (stderr || (error instanceof Error ? error.message : String(error))).trim()
  }
}

function resolveVersionRef(version) {
  const candidates = ARCHIVED_VERSIONS[version]
  if (!candidates) {
    throw new Error(`No git ref candidates for portfolio version ${version}`)
  }

  const failures = []
  for (const ref of candidates) {
    const failure = fetchRemoteBranch(ref)
    const remote = `origin/${ref}`
    if (hasRef(remote)) return remote
    if (hasRef(ref)) return ref
    if (failure) failures.push(`${ref}: ${failure}`)
  }

  const detail = failures.length > 0 ? ` (${failures.join('; ')})` : ''
  throw new Error(`Cannot find git ref for portfolio version ${version}${detail}`)
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

for (const version of Object.keys(ARCHIVED_VERSIONS)) {
  await buildVersion(version)
}
