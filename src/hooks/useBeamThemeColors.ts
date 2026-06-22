import { useEffect, useState } from 'react'
import { cssVarToColor, cssVarToHex } from '../lib/cssColor'

export type BeamThemeColors = {
  background: string
  beamBase: string
  /** Kashmir sapphire body — matches header gem */
  glowBody: string
  glowDeep: string
  glowMilk: string
  glowBlue: string
  glowViolet: string
}

function readBeamThemeColors(): BeamThemeColors {
  return {
    background: cssVarToColor('--color-bg-deep'),
    beamBase: cssVarToColor('--color-bg-deep'),
    glowBody: cssVarToHex('--sapphire-gem-body-hex', '#3d7aff'),
    glowDeep: cssVarToHex('--sapphire-gem-deep-hex', '#1a4fd4'),
    glowMilk: cssVarToHex('--sapphire-gem-milk-hex', '#c8e4ff'),
    glowBlue: cssVarToHex('--sapphire-gem-blue-hex', '#2d9bff'),
    glowViolet: cssVarToHex('--sapphire-gem-violet-hex', '#7c5cff'),
  }
}

/** Design-system sapphire colors for the hero beams canvas (updates on theme toggle). */
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
