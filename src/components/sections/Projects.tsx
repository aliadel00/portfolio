import { useMemo, useState } from 'react'
import { BrandLogoImg } from '../BrandLogoImg'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { projectsByType } from '../../data/projects'
import type { Project } from '../../data/projects'
import { brandLogoCandidatesForProject } from '../../lib/brandLogo'

function ProjectCard({ project }: { project: Project }) {
  const [shotFailed, setShotFailed] = useState(false)
  const primaryHref = project.links.live ?? project.links.repo
  const hasAnyLink =
    Boolean(project.links.live || project.links.repo) || (project.links.more?.length ?? 0) > 0

  const cardImageSrc = project.cardLogoOnly ? undefined : project.imageSrc

  const logoCandidates = useMemo(() => brandLogoCandidatesForProject(project), [project])

  const showScreenshot = Boolean(cardImageSrc) && !shotFailed
  const showLogoFallback = !showScreenshot && logoCandidates.length > 0

  const topVisual = showScreenshot || showLogoFallback

  const headerHref = showScreenshot
    ? (primaryHref ?? project.brandSiteForLogo ?? '#work')
    : (project.brandSiteForLogo ?? primaryHref ?? '#work')
  const headerExternal = headerHref.startsWith('http')

  return (
    <article className="glass-panel project-card-hover flex h-full flex-col overflow-hidden">
      {topVisual ? (
        <a
          href={headerHref}
          className="relative block shrink-0 overflow-hidden no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          target={headerExternal ? '_blank' : undefined}
          rel={headerExternal ? 'noreferrer noopener' : undefined}
          aria-label={`Open preview for ${project.title}`}
        >
          {showScreenshot ? (
            <img
              src={cardImageSrc}
              alt={project.imageAlt ?? ''}
              width={800}
              height={500}
              loading="lazy"
              decoding="async"
              className="project-card-media aspect-[8/5] h-auto w-full object-cover object-top"
              onError={() => setShotFailed(true)}
            />
          ) : null}
          {showLogoFallback ? (
            <div className="project-card-media flex min-h-[120px] aspect-[8/5] w-full items-center justify-center bg-white/5 p-8">
              <BrandLogoImg
                candidates={logoCandidates}
                alt={project.imageAlt ?? `${project.title} logo`}
                className="max-h-28 min-h-[48px] w-auto max-w-[85%] object-contain"
              />
            </div>
          ) : null}
        </a>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display m-0 text-xl font-semibold tracking-tight text-[var(--color-fg)]">{project.title}</h3>
        <p className="mt-1.5 text-sm font-medium text-[color-mix(in_oklab,var(--color-accent-2)_90%,white)]">
          {project.role}
        </p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2 p-0" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="glass-chip m-0 list-none px-2.5 py-1 text-xs text-[var(--color-fg)]">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {project.links.live ? (
            <a
              href={project.links.live}
              className="link-accent link-accent-cyan text-sm no-underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              {project.links.liveLabel ?? 'Live site'}
            </a>
          ) : null}
          {project.links.more?.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="link-accent link-accent-cyan text-sm no-underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              {label}
            </a>
          ))}
          {project.links.repo ? (
            <a
              href={project.links.repo}
              className="link-accent link-accent-violet text-sm no-underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
          ) : null}
          {!hasAnyLink ? (
            <span className="text-sm text-[var(--color-fg-muted)]">Internal / NDA — no public link</span>
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
  const career = projectsByType('career')
  const freelance = projectsByType('freelance')

  return (
    <section
      id="work"
      className="mx-auto min-h-dvh max-w-5xl px-4 py-20 sm:px-6 sm:py-24"
      aria-labelledby="work-heading"
    >
      <Reveal className="min-w-0">
        <SectionHeading id="work-heading" eyebrow="Portfolio" title="Selected work">
          <p className="section-lead m-0 max-w-2xl">
            Career and freelance projects as a <strong className="font-medium text-[var(--color-fg)]">software engineer</strong>{' '}
            with <strong className="font-medium text-[var(--color-fg)]">full-stack experience</strong> (APIs, databases, Node,
            Laravel) and deep work on <strong className="font-medium text-[var(--color-fg)]">Angular and React</strong> UIs —
            including <strong className="font-medium text-[var(--color-fg)]">The Federation TCC</strong>. Thumbnails use
            screenshots when available; otherwise the site’s brand icon.
          </p>
        </SectionHeading>
      </Reveal>

      <div className="mt-16 flex flex-col gap-20 sm:gap-24">
        <ProjectGroup
          title="Career"
          description="Long-term delivery for regulated industries — frontend-heavy with full-system ownership where needed."
          items={career}
        />
        <ProjectGroup
          title="Freelance"
          description="Contracts spanning public apps, admin tools, APIs, and the Heritage / Federation event stack."
          items={freelance}
        />
      </div>
    </section>
  )
}
