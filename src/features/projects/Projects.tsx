import type { ReactNode } from 'react'
import { Card, Chip, Link } from 'caustica-design/core'
import { siteContent } from '@/content/site'
import { projectsByType } from '@/content/projects'
import { Reveal } from '@/shared/ui/Reveal'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { SectionEyebrow, SectionHeading, SECTION_LEAD_CLASS } from '@/shared/ui/SectionHeading'
import { SegmentedLead } from '@/shared/ui/SegmentedLead'
import type { Project, ProjectType } from '@/content/projects'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { useShellSelection } from '@/features/shell/useShellSelection'

function projectTypeLabel(type: ProjectType) {
  const w = siteContent.work
  return type === 'career' ? w.careerTitle : w.freelanceTitle
}

function ProjectRoleMeta({ role }: { role: string }) {
  const parts = role.split(' · ').map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p className="work-project-card__role m-0 mt-2 text-[0.8125rem] leading-relaxed">
      {parts.map((part, index) => (
        <span key={part}>
          {index > 0 ? (
            <span className="work-project-card__role-sep" aria-hidden>
              {' · '}
            </span>
          ) : null}
          <span className={index === 0 ? 'work-project-card__role-primary font-medium' : undefined}>{part}</span>
        </span>
      ))}
    </p>
  )
}

function ProjectOutboundLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link href={href} target="_blank" rel="noreferrer noopener">
      {children}
    </Link>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { activeId, selectFile } = useShellSelection()
  const fileId = `work-project-${project.id}`
  const selected = activeId === fileId
  const hasAnyLink =
    Boolean(project.links.live || project.links.repo) || (project.links.more?.length ?? 0) > 0

  return (
    <Card
      id={fileId}
      tabIndex={0}
      aria-current={selected ? 'true' : undefined}
      className={
        selected
          ? 'work-project-card ide-selected h-full hero-skill-card-shell hero-skill-card-shell--stacked hero-skill-card-shell--stacked-footer'
          : 'work-project-card h-full hero-skill-card-shell hero-skill-card-shell--stacked hero-skill-card-shell--stacked-footer'
      }
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('a')) return
        selectFile(fileId)
      }}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        selectFile(fileId)
      }}
    >
      <div className="hero-skill-card-copy min-w-0">
        <SectionEyebrow>{projectTypeLabel(project.type)}</SectionEyebrow>
        <h3 className="work-project-card__title font-display m-0 mt-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]">
          {project.title}
        </h3>
        <ProjectRoleMeta role={project.role} />
        <div className="work-project-card__summary-slot">
          <p className="skill-category-blurb work-project-card__summary m-0 text-[0.9375rem] leading-relaxed sm:text-base">
            {project.summary}
          </p>
        </div>
      </div>

      <ul className="hero-skill-card-chips work-project-card__tags m-0 list-none p-0" aria-label="Technologies">
        {project.tags.map((tag) => (
          <li key={tag} className="m-0">
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>

      <footer className="work-project-card__footer">
        {hasAnyLink ? (
          <div className="work-project-card__links flex flex-wrap gap-2">
            {project.links.live ? (
              <ProjectOutboundLink href={project.links.live}>
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                {project.links.liveLabel ?? 'Live site'}
              </ProjectOutboundLink>
            ) : null}
            {project.links.more?.map(({ href, label }) => (
              <ProjectOutboundLink key={href} href={href}>
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                {label}
              </ProjectOutboundLink>
            ))}
            {project.links.repo ? (
              <ProjectOutboundLink href={project.links.repo}>
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                GitHub
              </ProjectOutboundLink>
            ) : null}
          </div>
        ) : (
          <p className="work-project-card__nda m-0">{project.unlistedNote ?? 'Internal / NDA — no public link'}</p>
        )}
      </footer>
    </Card>
  )
}

function ProjectGroup({
  id,
  title,
  description,
  items,
}: {
  id: string
  title: string
  description: string
  items: ReturnType<typeof projectsByType>
}) {
  if (items.length === 0) return null
  return (
    <div id={id}>
      <Reveal className="min-w-0">
        <header className="work-group-head">
          <div className="work-group-head__title-row">
            <h3 className="work-group-head__title font-display m-0 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-2xl">
              {title}
            </h3>
            <span className="about-facts__header-rule" aria-hidden />
          </div>
          <p className="skill-category-blurb work-group-head__desc m-0 mt-3 max-w-2xl text-sm leading-relaxed sm:text-base">
            {description}
          </p>
        </header>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
        {items.map((p, i) => (
          <Reveal key={p.id} className="min-w-0 h-full" delayMs={i * 48} fadeOnly>
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
    <SectionMotion
      id="work"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="work-heading"
    >
      <Reveal className="min-w-0">
        <SectionHeading id="work-heading" eyebrow={w.eyebrow} title={w.title}>
          <SegmentedLead segments={w.lead} className={SECTION_LEAD_CLASS} />
        </SectionHeading>
      </Reveal>

      <div className="mt-16 flex flex-col gap-20 sm:gap-24">
        <ProjectGroup id="work-career" title={w.careerTitle} description={w.careerDescription} items={career} />
        <ProjectGroup id="work-freelance" title={w.freelanceTitle} description={w.freelanceDescription} items={freelance} />
      </div>
    </SectionMotion>
  )
}
