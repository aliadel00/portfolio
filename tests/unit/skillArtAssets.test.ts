import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { HERO_SKILL_IDS } from '../../src/lib/heroShowcaseSlides'
import { isSkillArtCategoryId } from '../../src/lib/skillArtAssets'

const assetDir = join(process.cwd(), 'src/assets/illustrations/skill-art')

describe('skillArtAssets', () => {
  it('aligns art ids with hero showcase categories', () => {
    expect(HERO_SKILL_IDS).toEqual(['frontend', 'backend', 'delivery', 'creative'])
    for (const id of HERO_SKILL_IDS) {
      expect(isSkillArtCategoryId(id)).toBe(true)
    }
  })

  it('ships one standalone SVG file per hero category', () => {
    for (const id of HERO_SKILL_IDS) {
      const file = join(assetDir, `${id}.svg`)
      const svg = readFileSync(file, 'utf8')
      expect(svg).toContain('<svg')
      expect(svg).toContain('viewBox="0 0 320 240"')
      expect(svg).not.toContain('<defs')
      expect(svg).not.toMatch(/<script/i)
      expect(svg).not.toMatch(/\bon\w+\s*=/i)
    }
  })
})
