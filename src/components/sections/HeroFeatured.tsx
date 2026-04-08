import { siteContent } from '../../data/site'
import type { HeroStripItem } from '../../data/projects'
import { heroFeaturedItems } from '../../data/projects'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { BrandLogoImg } from '../BrandLogoImg'
import { MaskIcon } from '../ui/MaskIcon'

function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}

type ThumbProps = {
  imageAlt: string
  brandLogoCandidates: string[]
  external: boolean
}

function HeroThumb({ imageAlt, brandLogoCandidates, external }: ThumbProps) {
  const logoCandidates = brandLogoCandidates
  const showLogo = logoCandidates.length > 0

  return (
    <div className="hero-preview-thumb relative aspect-[8/5] w-full overflow-hidden bg-[color-mix(in_oklab,white_6%,transparent)]">
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[color-mix(in_oklab,var(--color-bg-deep)_55%,transparent)] via-transparent to-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] opacity-80 motion-safe:transition-opacity motion-safe:duration-300 group-hover/hero-card:opacity-100"
        aria-hidden
      />
      {showLogo ? (
        <div
          className="hero-preview-media project-card-media relative z-0 flex h-full w-full items-center justify-center bg-[color-mix(in_oklab,white_4%,transparent)] p-6"
          aria-hidden={!imageAlt}
        >
          <BrandLogoImg
            candidates={logoCandidates}
            alt={imageAlt}
            width={128}
            height={128}
            loading="eager"
            className="max-h-[4.5rem] w-auto max-w-[min(82%,150px)] object-contain"
          />
        </div>
      ) : null}
      {!showLogo ? (
        <div
          className="hero-preview-thumb-placeholder project-card-media relative z-0 h-full min-h-0 w-full"
          aria-hidden
        >
          <span className="hero-preview-thumb-placeholder__bg" aria-hidden />
          <span className="hero-preview-thumb-placeholder__grain" aria-hidden />
          <div className="relative z-[1] flex h-full min-h-0 items-center justify-center p-[9%]">
            <div className="hero-preview-thumb-placeholder__window">
              <div className="hero-preview-thumb-placeholder__chrome">
                <span className="hero-preview-thumb-placeholder__dot hero-preview-thumb-placeholder__dot--a" />
                <span className="hero-preview-thumb-placeholder__dot hero-preview-thumb-placeholder__dot--b" />
                <span className="hero-preview-thumb-placeholder__dot hero-preview-thumb-placeholder__dot--c" />
                <span className="hero-preview-thumb-placeholder__chrome-bar" />
              </div>
              <div className="hero-preview-thumb-placeholder__canvas">
                <div className="hero-preview-thumb-placeholder__blocks">
                  <div className="hero-preview-thumb-placeholder__block hero-preview-thumb-placeholder__block--tall" />
                  <div className="hero-preview-thumb-placeholder__block" />
                  <div className="hero-preview-thumb-placeholder__block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {external ? (
        <div
          className="pointer-events-none absolute left-2.5 top-2.5 z-[3] flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,white_22%,transparent)] bg-[color-mix(in_oklab,var(--color-bg-deep)_72%,transparent)] px-2 py-0.5 backdrop-blur-sm sm:left-3 sm:top-3"
          aria-hidden
        >
          <span className="hero-preview-live-dot hero-preview-live-dot--pulse" />
          <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--color-fg)]">
            {siteContent.heroFeatured.liveBadge}
          </span>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-2 p-3 sm:p-3.5"
        aria-hidden
      >
        <span className="hero-preview-cta-pill max-w-[min(100%,220px)] translate-y-1 opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-300 group-hover/hero-card:translate-y-0 group-hover/hero-card:opacity-100 inline-flex items-center gap-2">
          {external ? (
            <>
              <span className="hero-preview-live-dot hero-preview-live-dot--pulse shrink-0" aria-hidden />
              <span className="min-w-0 truncate">{siteContent.heroFeatured.openLive}</span>
            </>
          ) : (
            siteContent.heroFeatured.goToWork
          )}
        </span>
      </div>
    </div>
  )
}

function HeroFeaturedTile({ item }: { item: HeroStripItem }) {
  const hf = siteContent.heroFeatured
  const cardReflect = useGlassCardReflectHandlers()
  const external = isExternalHref(item.href)
  const displayLabel = item.label.length > 52 ? `${item.label.slice(0, 49)}…` : item.label

  return (
    <li className="m-0 min-w-0">
      <a
        href={item.href}
        className="hero-live-preview-card glass-card-reflect group/hero-card glass-panel project-card-hover flex h-full min-h-[280px] flex-col overflow-hidden no-underline ring-[var(--color-accent-2)] ring-offset-2 ring-offset-[var(--color-bg-deep)] focus-visible:outline-none focus-visible:ring-2"
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        aria-label={
          external
            ? hf.ariaExternalTab.replace('{label}', item.label)
            : hf.ariaInternalWork.replace('{label}', item.label)
        }
        {...cardReflect}
      >
        <HeroThumb
          imageAlt={item.imageAlt}
          brandLogoCandidates={item.brandLogoCandidates}
          external={external}
        />

        <div className="hero-preview-card-body flex flex-1 flex-col justify-between gap-3 border-t border-[color-mix(in_oklab,white_10%,transparent)] px-3 py-3.5 sm:px-4 sm:py-4">
          <span className="hero-preview-card-title line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug tracking-tight text-[var(--color-fg)] sm:min-h-[2.75rem] sm:text-[0.9375rem]">
            {displayLabel}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                external
                  ? 'hero-preview-chip hero-preview-chip--external inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--color-accent-2)_35%,transparent)] bg-[color-mix(in_oklab,var(--color-accent-2)_12%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[color-mix(in_oklab,var(--color-accent-2)_92%,white)]'
                  : 'hero-preview-chip hero-preview-chip--internal inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,white_14%,transparent)] bg-[color-mix(in_oklab,white_6%,transparent)] px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-fg-muted)]'
              }
            >
              {external ? (
                <>
                  <MaskIcon src="icons/external-link.svg" className="opacity-90" width={14} height={14} />
                  {hf.chipNewTab}
                </>
              ) : (
                hf.chipOnPage
              )}
            </span>
          </div>
        </div>
      </a>
    </li>
  )
}

export function HeroFeatured() {
  const items = heroFeaturedItems()
  if (items.length === 0) return null

  return (
    <div className="hero-featured-enter mt-10 w-full border-t border-[color-mix(in_oklab,white_12%,transparent)] pt-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <p className="hero-live-previews-label m-0 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklab,var(--color-accent-2)_88%,white)]">
          <span
            className="inline-block h-px w-6 bg-[color-mix(in_oklab,var(--color-accent-2)_50%,transparent)]"
            aria-hidden
          />
          <span className="hero-preview-live-dot hero-preview-live-dot--pulse" aria-hidden />
          {siteContent.heroFeatured.sectionLabel}
        </p>

      </div>

      <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:mt-7 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
        {items.map((item) => (
          <HeroFeaturedTile key={item.key} item={item} />
        ))}
      </ul>
    </div>
  )
}
