import type { CSSProperties } from 'react'
import type { NavActivePillRect } from '@/features/navigation/hooks/useNavActivePill'

type Props = {
  pill: NavActivePillRect
  show: boolean
  reducedMotion: boolean
}

export function NavActivePill({ pill, show, reducedMotion }: Props) {
  const style: CSSProperties = {
    left: pill.left,
    top: pill.top,
    width: Math.max(0, pill.width),
    height: Math.max(0, pill.height),
  }

  return (
    <div
      className={['nav-active-pill', reducedMotion ? 'nav-active-pill--instant' : ''].filter(Boolean).join(' ')}
      data-visible={show && pill.visible ? 'true' : 'false'}
      style={style}
      aria-hidden
    />
  )
}
