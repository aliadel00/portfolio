import { siteContent } from '@/content/site'
import { parseStoredTheme, type StoredTheme } from '@/features/theme/themeStorage'
import { useTheme } from '@/features/theme/ThemeProvider'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { ShellPick } from './ShellPick'

export function TitleBar() {
  const { theme, setTheme } = useTheme()
  const shell = siteContent.shell
  const active = shell.themes.find((item) => item.id === theme)

  return (
    <header className="ide-titlebar dynamic-island-header">
      <div className="ide-titlebar__brand">
        <span className="dynamic-island-bar__gem ide-titlebar__gem shrink-0" aria-hidden>
          <span className="dynamic-island-bar__sensor">
            <span className="dynamic-island-bar__gem-silk" aria-hidden />
            <span className="dynamic-island-bar__gem-star" aria-hidden />
          </span>
        </span>
        <span className="ide-titlebar__repo">{shell.repoName}</span>
      </div>
      <ShellPick
        label={active ? `${shell.themeMenuLabel}, ${active.label}` : shell.themeMenuLabel}
        items={shell.themes}
        activeId={theme}
        placement="down"
        onSelect={(id) => {
          const next = parseStoredTheme(id)
          if (next) setTheme(next satisfies StoredTheme)
        }}
      >
        <span className="ide-titlebar__theme-label">{shell.themeMenuLabel}</span>
        {active ? <span className="ide-titlebar__theme">{active.label}</span> : null}
        <MaskIcon src="icons/chevron-right.svg" className="ide-titlebar__chevron" width={12} height={12} />
      </ShellPick>
    </header>
  )
}
