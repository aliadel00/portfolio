import { MaskIcon } from '@/shared/ui/MaskIcon'
import type { ActivityId, ActivityView } from './shellModel'

type Props = {
  label: string
  views: ActivityView[]
  activeId: ActivityId
  sidebarOpen: boolean
  onSelect: (id: ActivityId) => void
}

export function ActivityBar({ label, views, activeId, sidebarOpen, onSelect }: Props) {
  return (
    <nav id="site-navigation" className="ide-activity" aria-label={label}>
      <ul className="ide-activity__list">
        {views.map((view) => {
          const selected = view.id === activeId
          return (
            <li key={view.id}>
              <button
                type="button"
                className={selected ? 'ide-activity__btn is-active' : 'ide-activity__btn'}
                aria-label={view.label}
                aria-pressed={selected}
                aria-expanded={selected && sidebarOpen}
                aria-controls="ide-sidebar"
                onClick={() => onSelect(view.id)}
              >
                <MaskIcon src={view.icon} width={22} height={22} />
                <span className="ide-activity__tip" aria-hidden>
                  {view.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
