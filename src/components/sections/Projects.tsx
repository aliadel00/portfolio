import type { ReactNode } from 'react'
import { siteContent } from '../../data/site'
import { projectsByType } from '../../data/projects'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { SegmentedLead } from '../ui/SegmentedLead'
import type { Project } from '../../data/projects'
import { useGlassPointerTrackHandlers } from '../../hooks/useGlassPointerTrack'
import { useGlassCardReflectHandlers } from '../../hooks/useGlassCardReflectHandlers'
import { MaskIcon } from '../ui/MaskIcon'

function TrackedProjectLink({
  href,
  variant,
  children,
}: {
  href: string
  variant: 'live' | 'code'
  children: ReactNode
}) {
  const ptr = useGlassPointerTrackHandlers()
  const variantClass =
    variant === 'live' ? 'project-card-link project-card-link--live' : 'project-card-link project-card-link--code'
  return (
    <a
      href={href}
      className={`${variantClass} glass-pointer-track glass-pointer-track--clip`}
      target="_blank"
      rel="noreferrer noopener"
      {...ptr}
    >
      <span className="glass-pointer-track-fg">{children}</span>
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const cardReflect = useGlassCardReflectHandlers()
  const hasAnyLink =
    Boolean(project.links.live || project.links.repo) || (project.links.more?.length ?? 0) > 0

  return (
    <article
      className="work-project-card portfolio-card-surface glass-card-reflect glass-panel project-card-hover flex h-full flex-col overflow-hidden"
      {...cardReflect}
    >
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="work-project-card__title font-display m-0 text-xl font-semibold tracking-tight text-[var(--color-fg)]">
          {project.title}
        </h3>
        <p className="work-project-card__role mt-1.5 text-sm font-medium text-[color-mix(in_oklab,var(--color-accent-2)_90%,white)]">
          {project.role}
        </p>
        <p className="work-project-card__summary mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {project.summary}
        </p>
        <ul className="work-project-card__tags mt-4 flex flex-wrap gap-2 p-0" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="work-project-card__tag glass-chip m-0 list-none px-2.5 py-1 text-xs text-[var(--color-fg)]">
              {tag}
            </li>
          ))}
        </ul>
        <div className="work-project-card__links mt-5 flex flex-wrap gap-2 sm:gap-2.5">
          {project.links.live ? (
            <TrackedProjectLink href={project.links.live} variant="live">
              <MaskIcon src="icons/external-link.svg" className="project-card-link__icon" width={14} height={14} />
              {project.links.liveLabel ?? 'Live site'}
            </TrackedProjectLink>
          ) : null}
          {project.links.more?.map(({ href, label }) => (
            <TrackedProjectLink key={href} href={href} variant="live">
              <MaskIcon src="icons/external-link.svg" className="project-card-link__icon" width={14} height={14} />
              {label}
            </TrackedProjectLink>
          ))}
          {project.links.repo ? (
            <TrackedProjectLink href={project.links.repo} variant="code">
              <MaskIcon src="icons/external-link.svg" className="project-card-link__icon" width={14} height={14} />
              GitHub
            </TrackedProjectLink>
          ) : null}
          {!hasAnyLink ? (
            <span className="work-project-card__nda text-sm text-[var(--color-fg-muted)]">Internal / NDA — no public link</span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function ProjectGroup({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: ReturnType<typeof projectsByType>
}) {
  if (items.length === 0) return null
  return (
    <div>
      <Reveal className="min-w-0">
        <h3 className="font-display m-0 border-l-2 border-[color-mix(in_oklab,var(--color-accent-2)_55%,transparent)] pl-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-fg-muted)] sm:text-base">{description}</p>
      </Reveal>
      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Reveal key={p.id} className="min-w-0 h-full" delayMs={i * 48}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const w = siteContent.work
  const career = projectsByType('career')
  const freelance = projectsByType('freelance')

  return (
    <section
      id="work"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="work-heading"
    >
      <Reveal className="min-w-0">
        <SectionHeading id="work-heading" eyebrow={w.eyebrow} title={w.title}>
          <SegmentedLead segments={w.lead} className="section-lead m-0 max-w-2xl" />
        </SectionHeading>
      </Reveal>

      <div className="mt-16 flex flex-col gap-20 sm:gap-24">
        <ProjectGroup title={w.careerTitle} description={w.careerDescription} items={career} />
        <ProjectGroup title={w.freelanceTitle} description={w.freelanceDescription} items={freelance} />
      </div>
    </section>
  )
}
