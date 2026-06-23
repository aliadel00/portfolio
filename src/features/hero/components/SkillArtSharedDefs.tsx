import { HERO_SKILL_IDS } from '@/features/hero/lib/heroShowcaseSlides'

/** Document-level gradient ids for hero skill art SVGs (`url(#skill-art-glow-*)`). */
export function SkillArtSharedDefs() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden" width={0} height={0}>
      <defs>
        {HERO_SKILL_IDS.map((id) => (
          <g key={id}>
            <linearGradient id={`skill-art-glow-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-system-blue)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-accent-2)" stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id={`skill-art-radial-${id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-system-blue)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-system-blue)" stopOpacity="0" />
            </radialGradient>
          </g>
        ))}
      </defs>
    </svg>
  )
}
