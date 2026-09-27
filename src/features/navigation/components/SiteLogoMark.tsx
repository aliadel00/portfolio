import { isLightTheme } from '@/features/theme/themeStorage'
import { useTheme } from '@/features/theme/ThemeProvider'
import { publicUrl } from '@/shared/lib/publicAsset'

type Props = {
  className?: string
}

/**
 * AA ligature — gradient from theme-specific assets.
 */
export function SiteLogoMark({ className }: Props) {
  const { theme } = useTheme()
  const src =
    isLightTheme(theme) ? publicUrl('logos/site-mark-light.svg') : publicUrl('logos/site-mark-dark.svg')

  return (
    <img
      src={src}
      alt=""
      width={48}
      height={44}
      className={className}
      decoding="async"
      fetchPriority="high"
      aria-hidden
    />
  )
}
