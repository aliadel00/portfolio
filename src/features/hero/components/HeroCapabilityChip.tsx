import { Chip } from 'caustica-design/core'
import { useMagneticHover } from '@/shared/hooks/useMagneticHover'

type Props = {
  label: string
}

export function HeroCapabilityChip({ label }: Props) {
  const magnetic = useMagneticHover({ strength: 0.32, radius: 110, maxOffset: 8 })

  return (
    <li className="m-0 list-none">
      <Chip className="will-change-transform" {...magnetic}>
        {label}
      </Chip>
    </li>
  )
}
