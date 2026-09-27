import { useEffect, useState } from 'react'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import type { ShellTreeNode } from './shellModel'

type Props = {
  open: boolean
  label: string
  nodes: ShellTreeNode[]
  activeFileId: string
  activeSectionId: string
  sectionFocus: number
  onOpenFile: (id: string) => void
  onClose: () => void
  closeLabel: string
}

export function SidebarTree({
  open,
  label,
  nodes,
  activeFileId,
  activeSectionId,
  sectionFocus,
  onOpenFile,
  onClose,
  closeLabel,
}: Props) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set())

  useEffect(() => {
    if (!open || sectionFocus === 0) return
    const frame = requestAnimationFrame(() => {
      const row =
        document.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(activeFileId)}"]`) ??
        document.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(activeSectionId)}"]`)
      if (typeof row?.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' })
    })
    return () => cancelAnimationFrame(frame)
  }, [activeFileId, activeSectionId, open, sectionFocus])

  const toggle = (id: string) => {
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <aside
      id="ide-sidebar"
      className="ide-sidebar"
      aria-label={label}
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
    >
      <div className="ide-sidebar__head">
        <p className="ide-sidebar__title">{label}</p>
        <button type="button" className="ide-sidebar__close" aria-label={closeLabel} onClick={onClose}>
          <MaskIcon src="icons/close.svg" width={14} height={14} />
        </button>
      </div>
      <div role="tree" aria-label={label} className="ide-tree">
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            collapsed={collapsed}
            activeFileId={activeFileId}
            activeSectionId={activeSectionId}
            onToggle={toggle}
            onOpenFile={onOpenFile}
          />
        ))}
      </div>
    </aside>
  )
}

function TreeNode({
  node,
  depth,
  collapsed,
  activeFileId,
  activeSectionId,
  onToggle,
  onOpenFile,
}: {
  node: ShellTreeNode
  depth: number
  collapsed: ReadonlySet<string>
  activeFileId: string
  activeSectionId: string
  onToggle: (id: string) => void
  onOpenFile: (id: string) => void
}) {
  const isFolder = Boolean(node.children?.length)
  const isOpen = isFolder && !collapsed.has(node.id)
  const isCurrent = node.file?.id === activeFileId
  const isSection = node.id === activeSectionId
  const rowClass = [
    'ide-tree__row',
    isCurrent ? 'is-current' : '',
    isSection ? 'is-section' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="ide-tree__branch" role="none">
      <button
        type="button"
        role="treeitem"
        data-node-id={node.id}
        className={rowClass}
        style={{ paddingLeft: `${0.55 + depth * 0.85}rem` }}
        aria-expanded={isFolder ? isOpen : undefined}
        aria-current={isCurrent ? 'page' : undefined}
        onClick={() => {
          if (isFolder) onToggle(node.id)
          if (node.file) onOpenFile(node.file.id)
        }}
      >
        {isFolder ? (
          <MaskIcon
            src="icons/chevron-right.svg"
            className={isOpen ? 'ide-tree__chevron is-open' : 'ide-tree__chevron'}
            width={12}
            height={12}
          />
        ) : null}
        {node.icon ? (
          <MaskIcon src={node.icon} className="ide-tree__icon" width={14} height={14} />
        ) : isFolder ? null : (
          <span className="ide-tree__chevron ide-tree__chevron--file" aria-hidden />
        )}
        <span className="ide-tree__label">{node.label}</span>
      </button>
      {isFolder && isOpen ? (
        <div role="group" className="ide-tree__group">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              collapsed={collapsed}
              activeFileId={activeFileId}
              activeSectionId={activeSectionId}
              onToggle={onToggle}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
