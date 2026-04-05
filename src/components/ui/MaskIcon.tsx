import { publicUrl } from '../../lib/publicAsset'

type Props = {
  /** Path under `public/`, e.g. `icons/external-link.svg` */
  src: string
  className?: string
  width?: number
  height?: number
}

/** Renders a monochrome SVG from `public/` tinted with `currentColor`. */
export function MaskIcon({ src, className, width = 16, height = 16 }: Props) {
  const url = publicUrl(src)
  return (
    <span
      className={className}
      style={{
        width,
        height,
        display: 'inline-block',
        flexShrink: 0,
        backgroundColor: 'currentColor',
        maskImage: `url("${url}")`,
        WebkitMaskImage: `url("${url}")`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
      aria-hidden
    />
  )
}
