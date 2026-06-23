import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type ReactNode } from 'react'
import {
  chipRailDragOffset,
  chipRailMaxOffset,
  chipRailNextOffset,
  chipRailOffsets,
  chipRailPrevOffset,
  chipRailSwipeTargetOffset,
  CHIP_RAIL_DRAG_ACTIVATION_PX,
} from '@/shared/lib/chipRailMotion'
import { MaskIcon } from './MaskIcon'

const MOBILE_MEDIA = '(max-width: 639px)'

function subscribeMobileViewport(onStoreChange: () => void) {
  const mq = window.matchMedia(MOBILE_MEDIA)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getMobileViewportSnapshot() {
  return window.matchMedia(MOBILE_MEDIA).matches
}

function useMobileViewport() {
  return useSyncExternalStore(subscribeMobileViewport, getMobileViewportSnapshot, () => false)
}

type DragSession = {
  pointerId: number
  startX: number
  startY: number
  dragging: boolean
}

type Props = {
  ariaLabel: string
  className?: string
  wrapperClassName?: string
  /** Section highlight rails only — chips inside cards stay wrapped with no arrows. */
  navigable?: boolean
  children: ReactNode
}

export function ChipRail({
  ariaLabel,
  className = '',
  wrapperClassName = '',
  navigable = true,
  children,
}: Props) {
  const mobile = useMobileViewport()
  const viewportRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const [offset, setOffset] = useState(0)
  const [maxOffset, setMaxOffset] = useState(0)
  const [overflowing, setOverflowing] = useState(false)
  const [dragDeltaX, setDragDeltaX] = useState<number | null>(null)
  const [dragStartOffset, setDragStartOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const measure = useCallback(() => {
    const viewport = viewportRef.current
    const list = listRef.current
    if (!viewport || !list) return

    const nextMaxOffset = chipRailMaxOffset(list.scrollWidth, viewport.clientWidth)
    setMaxOffset(nextMaxOffset)
    setOverflowing(nextMaxOffset > 1)
    setOffset((current) => Math.min(current, nextMaxOffset))
  }, [])

  useLayoutEffect(() => {
    if (!navigable) return

    measure()
    const viewport = viewportRef.current
    const list = listRef.current
    if (!viewport || !list) return

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(list)
    return () => observer.disconnect()
  }, [measure, children, mobile, navigable])

  const showNav = navigable && mobile && overflowing
  const canPrev = offset > 1
  const canNext = offset < maxOffset - 1

  const clearDrag = useCallback(() => {
    dragRef.current = null
    setDragDeltaX(null)
    setDragStartOffset(0)
    setIsDragging(false)
  }, [])

  const slide = (direction: 'prev' | 'next') => {
    const list = listRef.current
    if (!list) return

    const offsets = chipRailOffsets(Array.from(list.children) as HTMLElement[])
    setOffset((current) =>
      direction === 'next'
        ? chipRailNextOffset(current, offsets, maxOffset)
        : chipRailPrevOffset(current, offsets),
    )
  }

  const finishDrag = useCallback(
    (deltaX: number) => {
      const list = listRef.current
      const session = dragRef.current
      if (!list || !session?.dragging) {
        clearDrag()
        return
      }

      const offsets = chipRailOffsets(Array.from(list.children) as HTMLElement[])
      setOffset(chipRailSwipeTargetOffset(dragStartOffset, deltaX, offsets, maxOffset))
      clearDrag()
    },
    [clearDrag, dragStartOffset, maxOffset],
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!showNav || event.button !== 0) return

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      dragging: false,
    }
    setDragStartOffset(offset)
    setDragDeltaX(0)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const session = dragRef.current
    if (!session || event.pointerId !== session.pointerId) return

    const deltaX = event.clientX - session.startX
    const deltaY = event.clientY - session.startY

    if (!session.dragging) {
      if (Math.abs(deltaX) < CHIP_RAIL_DRAG_ACTIVATION_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return

      session.dragging = true
      setIsDragging(true)
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    setDragDeltaX(deltaX)
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const session = dragRef.current
    if (!session || event.pointerId !== session.pointerId) return

    if (session.dragging) {
      finishDrag(event.clientX - session.startX)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
      return
    }

    clearDrag()
  }

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    const session = dragRef.current
    if (!session || event.pointerId !== session.pointerId) return

    if (session.dragging) {
      setOffset(dragStartOffset)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    }

    clearDrag()
  }

  const visualOffset =
    isDragging && dragDeltaX !== null
      ? chipRailDragOffset(dragStartOffset, dragDeltaX, maxOffset)
      : offset

  const listClassName = `chip-rail__list ${isDragging ? 'chip-rail__list--dragging' : ''} ${className}`.trim()
  const listStyle = showNav ? { transform: `translateX(-${visualOffset}px)` } : undefined

  if (!navigable || !mobile) {
    return (
      <div className={wrapperClassName || undefined}>
        <ul className={listClassName} aria-label={ariaLabel}>
          {children}
        </ul>
      </div>
    )
  }

  return (
    <div className={`chip-rail chip-rail--navigable ${wrapperClassName}`.trim()}>
      {showNav && canPrev ? (
        <button
          type="button"
          className="chip-rail__nav chip-rail__nav--prev"
          aria-label="Show previous items"
          onClick={() => slide('prev')}
        >
          <MaskIcon src="icons/chevron-left.svg" className="chip-rail__nav-icon" width={16} height={16} />
        </button>
      ) : null}
      <div
        ref={viewportRef}
        className="chip-rail__viewport"
        onPointerDown={showNav ? onPointerDown : undefined}
        onPointerMove={showNav ? onPointerMove : undefined}
        onPointerUp={showNav ? onPointerUp : undefined}
        onPointerCancel={showNav ? onPointerCancel : undefined}
      >
        <ul ref={listRef} className={listClassName} aria-label={ariaLabel} style={listStyle}>
          {children}
        </ul>
      </div>
      {showNav && canNext ? (
        <button
          type="button"
          className="chip-rail__nav chip-rail__nav--next"
          aria-label="Show next items"
          onClick={() => slide('next')}
        >
          <MaskIcon src="icons/chevron-right.svg" className="chip-rail__nav-icon" width={16} height={16} />
        </button>
      ) : null}
    </div>
  )
}
