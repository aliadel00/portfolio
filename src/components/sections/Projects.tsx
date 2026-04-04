import { projectsByType } from '../../data/projects'
import type { Project } from '../../data/projects'

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass-panel flex h-full flex-col p-5 sm:p-6">
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
            Repository
          </a>
        ) : null}
        {!project.links.live && !project.links.repo ? (
          <span className="text-sm text-[var(--color-fg-muted)]">Links coming soon</span>
        ) : null}
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
        Replace sample entries in <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm">src/data/projects.ts</code>.
      </p>

      <div className="mt-14 flex flex-col gap-16">
        <ProjectGroup
          title="Career"
          description="Longer-term product and platform work as part of a team or org."
          items={career}
        />
        <ProjectGroup
          title="Freelance"
          description="Client and independent projects with clear scopes and outcomes."
          items={freelance}
        />
      </div>
    </section>
  )
}
