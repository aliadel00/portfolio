import type { ReactNode } from 'react'
import { siteContent } from '@/content/site'
import { projectsByType } from '@/content/projects'
import { useGlassCardReflectHandlers } from '@/shared/hooks/useGlassCardReflectHandlers'
import { Reveal } from '@/shared/ui/Reveal'
import { SectionMotion } from '@/shared/ui/SectionMotion'
import { SectionEyebrow, SectionHeading, SECTION_LEAD_CLASS } from '@/shared/ui/SectionHeading'
import { SegmentedLead } from '@/shared/ui/SegmentedLead'
import type { Project, ProjectType } from '@/content/projects'
import { MaskIcon } from '@/shared/ui/MaskIcon'
import { PORTFOLIO_GLASS_CARD_STACKED_FOOTER } from '@/shared/ui/portfolioGlassCard'

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
  variant,
  children,
}: {
  href: string
  variant: 'live' | 'code'
  children: ReactNode
}) {
  return (
    <a
      href={href}
      className={`work-project-card__link hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium work-project-card__link--${variant}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const panelReflect = useGlassCardReflectHandlers()
  const hasAnyLink =
    Boolean(project.links.live || project.links.repo) || (project.links.more?.length ?? 0) > 0

  return (
    <article className={`work-project-card h-full ${PORTFOLIO_GLASS_CARD_STACKED_FOOTER}`} {...panelReflect}>
      <div className="hero-skill-card-copy min-w-0">
        <SectionEyebrow>{projectTypeLabel(project.type)}</SectionEyebrow>
        <h3 className="work-project-card__title font-display m-0 mt-3 text-xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[1.375rem]">
          {project.title}
        </h3>
        <ProjectRoleMeta role={project.role} />
        <p className="skill-category-blurb work-project-card__summary m-0 mt-3 text-[0.9375rem] leading-relaxed sm:text-base">
          {project.summary}
        </p>
      </div>

      <ul className="hero-skill-card-chips work-project-card__tags m-0 list-none p-0" aria-label="Technologies">
        {project.tags.map((tag) => (
          <li key={tag} className="m-0 min-w-0">
            <span className="hero-os-capability glass-chip inline-flex px-3.5 py-2 text-[0.8125rem] font-medium text-[var(--color-fg-muted)]">
              {tag}
            </span>
          </li>
        ))}
      </ul>

      <footer className="work-project-card__footer">
        {hasAnyLink ? (
          <div className="work-project-card__links flex flex-wrap gap-2">
            {project.links.live ? (
              <ProjectOutboundLink href={project.links.live} variant="live">
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                {project.links.liveLabel ?? 'Live site'}
              </ProjectOutboundLink>
            ) : null}
            {project.links.more?.map(({ href, label }) => (
              <ProjectOutboundLink key={href} href={href} variant="live">
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                {label}
              </ProjectOutboundLink>
            ))}
            {project.links.repo ? (
              <ProjectOutboundLink href={project.links.repo} variant="code">
                <MaskIcon src="icons/external-link.svg" className="work-project-card__link-icon" width={14} height={14} />
                GitHub
              </ProjectOutboundLink>
            ) : null}
          </div>
        ) : (
          <p className="work-project-card__nda m-0">Internal / NDA — no public link</p>
        )}
      </footer>
    </article>
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
      <div className="mt-9 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
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
