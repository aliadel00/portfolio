import { readdir } from 'node:fs/promises'
import { join } from 'node:path'

/** Depth-first walk; returns file paths only (directories omitted). */
export async function walkFiles(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) await walkFiles(path, out)
    else out.push(path)
  }
  return out
}
