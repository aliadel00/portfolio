import { useState } from 'react'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import type { ShellTreeNode } from './shellModel'

type Props = {
  open: boolean
  label: string
  nodes: ShellTreeNode[]
  activeFileId: string
  onOpenFile: (id: string) => void
  onClose: () => void
  closeLabel: string
}

export function SidebarTree({ open, label, nodes, activeFileId, onOpenFile, onClose, closeLabel }: Props) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set())

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
  onToggle,
  onOpenFile,
}: {
  node: ShellTreeNode
  depth: number
  collapsed: ReadonlySet<string>
  activeFileId: string
  onToggle: (id: string) => void
  onOpenFile: (id: string) => void
}) {
  const isFolder = Boolean(node.children?.length)
  const isOpen = isFolder && !collapsed.has(node.id)
  const isCurrent = node.file?.id === activeFileId

  return (
    <div className="ide-tree__branch" role="none">
      <button
        type="button"
        role="treeitem"
        className={isCurrent ? 'ide-tree__row is-current' : 'ide-tree__row'}
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
              onToggle={onToggle}
              onOpenFile={onOpenFile}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
