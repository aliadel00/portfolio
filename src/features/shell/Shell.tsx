import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SkipLinks } from '@/features/navigation'
import { siteContent } from '@/content/site'
import { useMatchMedia } from '@/shared/hooks/useMatchMedia'
import { getScrollport, isNavigationScrollActive, subscribePageScroll } from '@/shared/lib/pageScroll'
import { ActivityBar } from './ActivityBar'
import { EditorDocument } from './EditorDocument'
import { EditorTabs } from './EditorTabs'
import { SidebarTree } from './SidebarTree'
import { ShellSelectionProvider } from './shellSelection'
import { StatusBar } from './StatusBar'
import { TitleBar } from './TitleBar'
import {
  activityIdForFile,
  activityViews,
  findShellFile,
  heroFile,
  listShellFiles,
  type ActivityId,
  type ShellFile,
} from './shellModel'
import { resolveShellFileFromViewport } from './shellScrollSpy'
import { useIdeChrome } from './useIdeChrome'
import { readStoredVersion, storeVersion, type PortfolioVersion } from './versionStorage'

const DESKTOP_SIDEBAR = '(min-width: 768px)'

export function Shell() {
  const views = useMemo(() => activityViews(), [])
  const [activityId, setActivityId] = useState<ActivityId>('home')
  const [file, setFile] = useState<ShellFile>(() => heroFile())
  const [scrollToken, setScrollToken] = useState(0)
  const ignoreSpyUntil = useRef(0)
  const fileRef = useRef(file)
  useEffect(() => {
    fileRef.current = file
  }, [file])
  const [version, setVersion] = useState<PortfolioVersion>(() => readStoredVersion())
  const [sidebarPref, setSidebarPref] = useState<boolean | null>(null)
  const [sidebarMotionReady, setSidebarMotionReady] = useState(false)
  const isDesktop = useMatchMedia(DESKTOP_SIDEBAR)
  const sidebarOpen = sidebarPref ?? isDesktop

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSidebarMotionReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  const activity = views.find((view) => view.id === activityId) ?? views[0]

  useIdeChrome()

  const selectFile = useCallback(
    (id: string) => {
      const next = findShellFile(id)
      if (!next) return
      ignoreSpyUntil.current = performance.now() + 1100
      setFile(next)
      setActivityId(activityIdForFile(next))
      setScrollToken((token) => token + 1)
      if (!isDesktop) setSidebarPref(false)
    },
    [isDesktop],
  )

  useEffect(() => {
    if (version !== 'v3') return
    const files = listShellFiles()
    let raf = 0

    const tick = () => {
      if (performance.now() < ignoreSpyUntil.current) return
      if (isNavigationScrollActive()) return
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-total').trim()
      const header = Number.parseFloat(raw)
      const headerPx = Number.isFinite(header) ? header : 72
      const port = document.querySelector('.ide-editor')
      const portRect = port?.getBoundingClientRect()
      const viewTop = (portRect?.top ?? 0) + headerPx
      const viewBottom = portRect?.bottom ?? window.innerHeight
      const scrollport = getScrollport()
      const scrollRoom = scrollport
        ? scrollport.scrollHeight - scrollport.clientHeight - scrollport.scrollTop
        : document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      const next = resolveShellFileFromViewport(
        files,
        (targetId) => {
          const el = document.getElementById(targetId)
          if (!el) return null
          const rect = el.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom }
        },
        viewTop,
        viewBottom,
        fileRef.current.id,
        { scrollRoom },
      )
      if (!next) return
      setFile((current) => (current.id === next.id ? current : next))
      setActivityId((current) => {
        const activity = activityIdForFile(next)
        return current === activity ? current : activity
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }

    onScroll()
    const unsubscribe = subscribePageScroll(onScroll)
    window.addEventListener('resize', onScroll)
    const main = document.getElementById('main-content')
    const observer = new ResizeObserver(onScroll)
    if (main) observer.observe(main)

    return () => {
      unsubscribe()
      window.removeEventListener('resize', onScroll)
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [version])

  const openFile = selectFile

  const onActivity = (id: ActivityId) => {
    if (id === activityId && sidebarOpen) {
      setSidebarPref(false)
      return
    }
    setActivityId(id)
    setSidebarPref(true)
  }

  const selection = useMemo(
    () => ({ activeId: file.id, selectFile }),
    [file.id, selectFile],
  )
  const showHero = useCallback(() => {
    selectFile(heroFile().id)
  }, [selectFile])
  const archived = version !== 'v3'
  const versionLabel = siteContent.shell.versions.find((item) => item.id === version)?.label ?? version

  return (
    <div
      className={sidebarMotionReady ? 'ca-root ide-app is-sidebar-ready' : 'ca-root ide-app'}
      data-version={version}
      data-sidebar={sidebarOpen ? 'open' : 'closed'}
    >
      <SkipLinks />
      <TitleBar />
      {archived ? null : (
        <ActivityBar
          label={siteContent.header.navAriaPrimary}
          views={views}
          activeId={activity.id}
          sidebarOpen={sidebarOpen}
          onSelect={onActivity}
        />
      )}
      {archived || isDesktop ? null : (
        <button
          type="button"
          className="ide-sidebar-scrim"
          aria-label={siteContent.shell.closeSidebar}
          aria-hidden={sidebarOpen ? undefined : true}
          inert={sidebarOpen ? undefined : true}
          tabIndex={sidebarOpen ? 0 : -1}
          onClick={() => setSidebarPref(false)}
        />
      )}
      {archived ? null : (
        <SidebarTree
          key={activity.id}
          open={sidebarOpen}
          label={activity.label}
          nodes={activity.tree}
          activeFileId={file.id}
          closeLabel={siteContent.shell.closeSidebar}
          onClose={() => setSidebarPref(false)}
          onOpenFile={openFile}
        />
      )}
      <ShellSelectionProvider value={selection}>
        <main id="main-content" className="ide-editor">
          {archived ? (
            <iframe
              className="ide-version-frame"
              title={`${siteContent.shell.versionMenuLabel}, ${versionLabel}`}
              src={`${import.meta.env.BASE_URL}versions/${version}/index.html`}
            />
          ) : (
            <>
              <EditorTabs file={file} onShowHero={showHero} onCloseFile={showHero} />
              <EditorDocument file={file} scrollToken={scrollToken} />
            </>
          )}
        </main>
      </ShellSelectionProvider>
      <StatusBar
        version={version}
        onVersion={(next) => {
          setVersion(next)
          storeVersion(next)
        }}
      />
    </div>
  )
}
