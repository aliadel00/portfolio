import { Link } from 'caustica-design/core'
import { siteContent } from '@/content/site'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { ShellPick } from './ShellPick'
import { parsePortfolioVersion, type PortfolioVersion } from './versionStorage'

type Props = {
  version: PortfolioVersion
  onVersion: (version: PortfolioVersion) => void
}

export function StatusBar({ version, onVersion }: Props) {
  const { meta, shell } = siteContent
  const year = new Date().getFullYear()
  const active = shell.versions.find((item) => item.id === version)

  return (
    <footer className="ide-statusbar">
      <ShellPick
        label={active ? `${shell.versionMenuLabel}, ${active.label}` : shell.versionMenuLabel}
        items={shell.versions}
        activeId={version}
        placement="up"
        onSelect={(id) => {
          const next = parsePortfolioVersion(id)
          if (next) onVersion(next)
        }}
      >
        <MaskIcon src="icons/git-branch.svg" width={14} height={14} />
        <span>{active?.label ?? version}</span>
        <MaskIcon src="icons/chevron-right.svg" className="ide-statusbar__chevron" width={12} height={12} />
      </ShellPick>
      <p className="ide-statusbar__legal">
        <span className="ide-statusbar__copy">
          © {year} {meta.personName}
        </span>
        <span className="ide-statusbar__meta">
          <span>{shell.rights}</span>
          <Link
            className="ide-statusbar__credit"
            href={shell.poweredByHref}
            target="_blank"
            rel="noreferrer noopener"
          >
            {shell.poweredBy}
          </Link>
        </span>
      </p>
    </footer>
  )
}
