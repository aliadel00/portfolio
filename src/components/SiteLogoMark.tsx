import { useTheme } from '../theme/ThemeProvider'
import { publicUrl } from '../lib/publicAsset'

type Props = {
  className?: string
}

/**
 * AA ligature — geometry matches `public/favicon.svg`; gradient from theme-specific assets.
 */
export function SiteLogoMark({ className }: Props) {
  const { theme } = useTheme()
  const src =
    theme === 'dark' ? publicUrl('logos/site-mark-dark.svg') : publicUrl('logos/site-mark-light.svg')

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
