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
    glowBody: cssVarToHex('--sapphire-gem-body-hex', '#5068d6'),
    glowDeep: cssVarToHex('--sapphire-gem-deep-hex', '#2a5098'),
    glowMilk: cssVarToHex('--sapphire-gem-milk-hex', '#dce8fa'),
    glowBlue: cssVarToHex('--sapphire-gem-blue-hex', '#4a7de8'),
    glowViolet: cssVarToHex('--sapphire-gem-violet-hex', '#5b5fd4'),
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
