import { memo } from 'react'
import { siteContent } from '@/content/site'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { heroFile, type ShellFile } from './shellModel'

type Props = {
  file: ShellFile
  onShowHero: () => void
  onCloseFile: () => void
}

export const EditorTabs = memo(function EditorTabs({ file, onShowHero, onCloseFile }: Props) {
  const shell = siteContent.shell
  const hero = heroFile()
  const heroOpen = file.id === hero.id

  return (
    <div className="ide-tabs" role="toolbar" aria-label={shell.editorTabsLabel}>
      <button
        type="button"
        className={heroOpen ? 'ide-tabs__tab is-active' : 'ide-tabs__tab'}
        aria-current={heroOpen ? 'page' : undefined}
        onClick={onShowHero}
      >
        {hero.label}
      </button>
      {heroOpen ? null : (
        <span className="ide-tabs__file">
          <span className="ide-tabs__tab is-active" aria-current="page">
            {file.label}
          </span>
          <button type="button" className="ide-tabs__close" aria-label={shell.closeFile} onClick={onCloseFile}>
            <MaskIcon src="icons/close.svg" width={12} height={12} />
          </button>
        </span>
      )}
    </div>
  )
})
