import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { useMagneticHover } from '../../hooks/useMagneticHover'

type Props = {
  label: string
}

export function HeroCapabilityChip({ label }: Props) {
  const reflect = useGlassCardReflectHandlers()
  const magnetic = useMagneticHover({ strength: 0.32, radius: 110, maxOffset: 8 })

  return (
    <li className="m-0 list-none">
      <span
        className="hero-os-capability glass-card-reflect glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)] will-change-transform"
        {...reflect}
        {...magnetic}
      >
        {label}
      </span>
    </li>
  )
}
