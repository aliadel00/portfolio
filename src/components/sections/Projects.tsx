import { useState } from 'react'
import { projectsByType } from '../../data/projects'
import type { Project } from '../../data/projects'

function ProjectCard({ project }: { project: Project }) {
  const [imgHidden, setImgHidden] = useState(false)

  return (
    <article className="glass-panel flex h-full flex-col overflow-hidden">
      {project.imageSrc && !imgHidden ? (
        <a
          href={project.links.live ?? project.links.repo ?? '#work'}
          className="relative block shrink-0 overflow-hidden no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          target={project.links.live || project.links.repo ? '_blank' : undefined}
          rel={project.links.live || project.links.repo ? 'noreferrer noopener' : undefined}
          aria-label={`Open preview for ${project.title}`}
        >
          <img
            src={project.imageSrc}
            alt={project.imageAlt ?? ''}
            width={800}
            height={500}
            loading="lazy"
            decoding="async"
            className="aspect-[8/5] h-auto w-full object-cover object-top"
            onError={() => setImgHidden(true)}
          />
        </a>
      ) : null}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display m-0 text-xl font-semibold text-[var(--color-fg)]">{project.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-accent-2)]">{project.role}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-fg-muted)]">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2 p-0" aria-label="Technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="glass-chip m-0 list-none px-2.5 py-1 text-xs text-[var(--color-fg)]">
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          {project.links.live ? (
            <a
              href={project.links.live}
              className="text-sm font-semibold text-[var(--color-accent-2)] no-underline underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              Live site
            </a>
          ) : null}
          {project.links.repo ? (
            <a
              href={project.links.repo}
              className="text-sm font-semibold text-[var(--color-accent)] no-underline underline-offset-4 hover:underline"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
          ) : null}
          {!project.links.live && !project.links.repo ? (
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
      <h3 className="font-display m-0 text-xl font-semibold text-[var(--color-fg)] sm:text-2xl">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-muted)] sm:text-base">{description}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProjectCard key={p.id} project={p} />
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
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
      aria-labelledby="work-heading"
    >
      <h2
        id="work-heading"
        className="font-display m-0 text-2xl font-semibold text-[var(--color-fg)] sm:text-3xl"
      >
        Selected work
      </h2>
      <p className="mt-3 max-w-2xl text-[var(--color-fg-muted)]">
        Career highlights from banking and insurance platforms, plus freelance work including{' '}
        <strong className="font-medium text-[var(--color-fg)]">The Federation TCC</strong> (public site and admin CRM).
        Screenshots are used where live sites were reachable; internal products list without public URLs.
      </p>

      <div className="mt-14 flex flex-col gap-16">
        <ProjectGroup
          title="Career"
          description="Longer-term roles delivering Angular and React platforms for regulated industries."
          items={career}
        />
        <ProjectGroup
          title="Freelance"
          description="Client work and contracts — including the full Heritage / Federation event ecosystem."
          items={freelance}
        />
      </div>
    </section>
  )
}
