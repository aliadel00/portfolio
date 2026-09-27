import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react'

type Item = { id: string; label: string }

type Props = {
  label: string
  items: Item[]
  activeId: string
  placement: 'up' | 'down'
  onSelect: (id: string) => void
  children: ReactNode
}

export function ShellPick({ label, items, activeId, placement, onSelect, children }: Props) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const menu = rootRef.current?.querySelector<HTMLElement>('[role="menu"]')
    const current = menu?.querySelector<HTMLElement>('[aria-checked="true"]')
    ;(current ?? menu?.querySelector<HTMLElement>('[role="menuitemradio"]'))?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      rootRef.current?.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')?.focus()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onMenuKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'))
    const index = buttons.findIndex((button) => button === document.activeElement)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next = event.key === 'ArrowDown' ? Math.min(index + 1, buttons.length - 1) : Math.max(index - 1, 0)
      buttons[Math.max(next, 0)]?.focus()
    }
    if (event.key === 'Home') {
      event.preventDefault()
      buttons[0]?.focus()
    }
    if (event.key === 'End') {
      event.preventDefault()
      buttons[buttons.length - 1]?.focus()
    }
  }

  return (
    <div ref={rootRef} className={`ide-pick ide-pick--${placement}`}>
      <button
        type="button"
        className="ide-pick__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
      >
        {children}
      </button>
      {open ? (
        <ul id={menuId} role="menu" className="ide-pick__menu" aria-label={label} onKeyDown={onMenuKeyDown}>
          {items.map((item) => {
            const selected = item.id === activeId
            return (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  className={selected ? 'ide-pick__item is-current' : 'ide-pick__item'}
                  onClick={() => {
                    onSelect(item.id)
                    setOpen(false)
                  }}
                >
                  <span className="ide-pick__mark" aria-hidden>
                    {selected ? '✓' : ''}
                  </span>
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
