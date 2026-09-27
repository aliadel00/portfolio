import { useEffect, useState } from 'react'
import { beamReflectMode, type BeamReflectMode } from '@/features/hero/lib/heroBeams'
import { parseStoredTheme } from '@/features/theme/themeStorage'
import { cssVarToColor, cssVarToHex } from '@/shared/lib/cssColor'

export type BeamThemeColors = {
  background: string
  beamBase: string
  /** Pillar body. Sapphire on minimal themes, glass or copper otherwise. */
  glowBody: string
  glowDeep: string
  glowMilk: string
  glowBlue: string
  glowViolet: string
  reflectMode: BeamReflectMode
}

function readBeamThemeColors(): BeamThemeColors {
  const raw =
    typeof document === 'undefined' ? null : document.documentElement.getAttribute('data-theme')
  const reflectMode = beamReflectMode(parseStoredTheme(raw) ?? 'caustica')
  const background = cssVarToColor('--color-bg-deep')

  if (reflectMode === 'glass') {
    return {
      background,
      beamBase: background,
      glowBody: cssVarToHex('--beam-glass-body-hex', '#d4e2ef'),
      glowDeep: cssVarToHex('--beam-glass-deep-hex', '#6d8eab'),
      glowMilk: cssVarToHex('--beam-glass-milk-hex', '#f4f8fb'),
      glowBlue: cssVarToHex('--beam-glass-milk-hex', '#f4f8fb'),
      glowViolet: cssVarToHex('--beam-glass-edge-hex', '#e7eef4'),
      reflectMode,
    }
  }

  if (reflectMode === 'copper') {
    return {
      background,
      beamBase: cssVarToHex('--beam-copper-deep-hex', '#4a1e14'),
      glowBody: cssVarToHex('--beam-copper-body-hex', '#c45c32'),
      glowDeep: cssVarToHex('--beam-copper-deep-hex', '#4a1e14'),
      glowMilk: cssVarToHex('--beam-copper-milk-hex', '#ffe6d2'),
      glowBlue: cssVarToHex('--beam-copper-rim-hex', '#f4d2b4'),
      glowViolet: cssVarToHex('--beam-copper-edge-hex', '#ee8456'),
      reflectMode,
    }
  }

  return {
    background,
    beamBase: background,
    glowBody: cssVarToHex('--sapphire-gem-body-hex', '#3d7aff'),
    glowDeep: cssVarToHex('--sapphire-gem-deep-hex', '#1a4fd4'),
    glowMilk: cssVarToHex('--sapphire-gem-milk-hex', '#c8e4ff'),
    glowBlue: cssVarToHex('--sapphire-gem-blue-hex', '#2d9bff'),
    glowViolet: cssVarToHex('--sapphire-gem-violet-hex', '#7c5cff'),
    reflectMode,
  }
}

/** Hero pillar colors. Caustica is glass, copper is metal, minimal themes stay sapphire. */
export function useBeamThemeColors() {
  const [colors, setColors] = useState(readBeamThemeColors)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setColors(readBeamThemeColors())
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return colors
}
