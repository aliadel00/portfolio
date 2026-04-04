import { heroFeaturedProjects } from '../../data/projects'

export function HeroFeatured() {
  const items = heroFeaturedProjects()
  if (items.length === 0) return null

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <p className="m-0 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
        Live previews
      </p>
      <ul className="mt-4 flex list-none flex-wrap gap-4 p-0">
        {items.map((p) => (
          <li key={p.id} className="m-0 max-w-[200px] flex-1 min-w-[140px]">
            <a
              href="#work"
              className="glass-panel block overflow-hidden no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="sr-only">{p.title}</span>
              {p.imageSrc ? (
                <img
                  src={p.imageSrc}
                  alt={p.imageAlt ?? ''}
                  width={400}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[8/5] h-auto w-full object-cover object-top"
                />
              ) : null}
              <span className="block px-3 py-2 text-xs font-medium leading-snug text-[var(--color-fg)]">
                {p.title.length > 46 ? `${p.title.slice(0, 43)}…` : p.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
