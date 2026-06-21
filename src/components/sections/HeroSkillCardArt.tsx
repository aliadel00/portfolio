import type { ReactElement } from 'react'

type Props = {
  categoryId: string
  isActive?: boolean
}

const STROKE = 1.5

function ArtDefs({ accent }: { accent: string }) {
  return (
    <defs>
      <linearGradient id={`skill-art-glow-${accent}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--color-system-blue)" stopOpacity="0.55" />
        <stop offset="100%" stopColor="var(--color-accent-2)" stopOpacity="0.35" />
      </linearGradient>
      <radialGradient id={`skill-art-radial-${accent}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="var(--color-system-blue)" stopOpacity="0.22" />
        <stop offset="100%" stopColor="var(--color-system-blue)" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

function FrontendArt() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ArtDefs accent="frontend" />
      <circle cx="248" cy="52" r="72" fill="url(#skill-art-radial-frontend)" />
      <rect x="36" y="28" width="248" height="184" rx="14" stroke="currentColor" strokeWidth={STROKE} opacity="0.35" />
      <rect x="52" y="44" width="120" height="10" rx="5" fill="currentColor" opacity="0.12" />
      <circle cx="64" cy="49" r="3" fill="currentColor" opacity="0.25" />
      <circle cx="76" cy="49" r="3" fill="currentColor" opacity="0.18" />
      <circle cx="88" cy="49" r="3" fill="currentColor" opacity="0.12" />
      <rect x="52" y="68" width="216" height="128" rx="10" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" />
      <rect x="68" y="84" width="184" height="28" rx="8" stroke="url(#skill-art-glow-frontend)" strokeWidth={STROKE} />
      <line x1="148" y1="112" x2="148" y2="180" stroke="currentColor" strokeWidth={STROKE} opacity="0.2" strokeDasharray="4 5" />
      <rect x="68" y="124" width="68" height="40" rx="8" stroke="currentColor" strokeWidth={STROKE} opacity="0.45" />
      <rect x="160" y="124" width="92" height="18" rx="6" stroke="currentColor" strokeWidth={STROKE} opacity="0.32" />
      <rect x="160" y="150" width="72" height="14" rx="5" fill="currentColor" opacity="0.08" />
      <rect x="68" y="172" width="44" height="10" rx="4" fill="currentColor" opacity="0.1" />
      <rect x="120" y="172" width="56" height="10" rx="4" fill="currentColor" opacity="0.08" />
      <rect x="184" y="172" width="68" height="10" rx="4" fill="currentColor" opacity="0.06" />
      <path
        d="M228 88 L252 100 L228 112 Z"
        stroke="currentColor"
        strokeWidth={STROKE}
        opacity="0.35"
        strokeLinejoin="round"
      />
      <path d="M252 100 L268 100" stroke="currentColor" strokeWidth={STROKE} opacity="0.25" />
    </svg>
  )
}

function BackendArt() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ArtDefs accent="backend" />
      <circle cx="72" cy="120" r="80" fill="url(#skill-art-radial-backend)" />
      <rect x="40" y="52" width="56" height="56" rx="28" stroke="currentColor" strokeWidth={STROKE} opacity="0.35" />
      <path d="M68 68 L68 92 M56 80 L80 80" stroke="currentColor" strokeWidth={STROKE} opacity="0.4" strokeLinecap="round" />
      <rect x="132" y="96" width="56" height="48" rx="12" stroke="url(#skill-art-glow-backend)" strokeWidth={STROKE} />
      <text x="148" y="126" fill="currentColor" opacity="0.45" fontSize="13" fontFamily="ui-monospace, monospace">
        API
      </text>
      <path d="M96 80 C118 80 118 96 132 108" stroke="currentColor" strokeWidth={STROKE} opacity="0.3" />
      <path d="M96 80 C118 88 118 112 132 132" stroke="currentColor" strokeWidth={STROKE} opacity="0.22" />
      <rect x="216" y="44" width="64" height="20" rx="6" stroke="currentColor" strokeWidth={STROKE} opacity="0.35" />
      <rect x="216" y="72" width="64" height="20" rx="6" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" />
      <rect x="216" y="100" width="64" height="20" rx="6" stroke="currentColor" strokeWidth={STROKE} opacity="0.22" />
      <path d="M188 120 L216 120" stroke="currentColor" strokeWidth={STROKE} opacity="0.35" />
      <ellipse cx="248" cy="168" rx="36" ry="14" stroke="currentColor" strokeWidth={STROKE} opacity="0.35" />
      <path d="M212 168 L212 132 C212 120 228 112 248 112 C268 112 284 120 284 132 L284 168" stroke="currentColor" strokeWidth={STROKE} opacity="0.4" />
      <ellipse cx="248" cy="132" rx="36" ry="14" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" />
      <path d="M52 168 L92 168" stroke="currentColor" strokeWidth={STROKE} opacity="0.2" strokeDasharray="3 4" />
      <path d="M52 184 L108 184" stroke="currentColor" strokeWidth={STROKE} opacity="0.16" strokeDasharray="3 4" />
      <text x="44" y="164" fill="currentColor" opacity="0.28" fontSize="11" fontFamily="ui-monospace, monospace">
        {'{ }'}
      </text>
    </svg>
  )
}

function DeliveryArt() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ArtDefs accent="delivery" />
      <circle cx="260" cy="176" r="68" fill="url(#skill-art-radial-delivery)" />
      <path
        d="M48 148 H272"
        stroke="currentColor"
        strokeWidth={STROKE}
        opacity="0.22"
        strokeDasharray="6 6"
      />
      {[72, 136, 200, 264].map((cx, i) => (
        <g key={cx}>
          <circle cx={cx} cy="148" r="22" stroke={i === 3 ? 'url(#skill-art-glow-delivery)' : 'currentColor'} strokeWidth={STROKE} opacity={i === 3 ? 1 : 0.35} />
          {i < 3 ? (
            <path d={`M${cx - 5} 148 L${cx - 1} 152 L${cx + 6} 145`} stroke="currentColor" strokeWidth={STROKE} opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d={`M${cx} 136 L${cx} 128 L${cx + 8} 132 Z`} fill="currentColor" opacity="0.35" />
          )}
        </g>
      ))}
      <path d="M94 148 H114 M158 148 H178 M222 148 H242" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" markerEnd="url(#none)" />
      <path d="M52 56 C92 40 132 72 172 56 S252 40 288 64" stroke="currentColor" strokeWidth={STROKE} opacity="0.25" />
      <circle cx="52" cy="56" r="5" fill="currentColor" opacity="0.3" />
      <circle cx="172" cy="56" r="5" fill="currentColor" opacity="0.22" />
      <circle cx="288" cy="64" r="5" fill="currentColor" opacity="0.18" />
      <path d="M52 56 V80 M52 68 H76" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" strokeLinecap="round" />
      <path d="M172 56 V72 M172 64 H196" stroke="currentColor" strokeWidth={STROKE} opacity="0.22" strokeLinecap="round" />
      <rect x="48" y="188" width="88" height="28" rx="8" stroke="currentColor" strokeWidth={STROKE} opacity="0.25" />
      <rect x="56" y="196" width="36" height="6" rx="3" fill="currentColor" opacity="0.12" />
      <rect x="56" y="206" width="56" height="6" rx="3" fill="currentColor" opacity="0.08" />
    </svg>
  )
}

function CreativeArt() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <ArtDefs accent="creative" />
      <ellipse cx="160" cy="188" rx="112" ry="28" stroke="currentColor" strokeWidth={STROKE} opacity="0.18" />
      <ellipse cx="160" cy="120" rx="92" ry="36" stroke="currentColor" strokeWidth={STROKE} opacity="0.22" transform="rotate(-18 160 120)" />
      <ellipse cx="160" cy="120" rx="92" ry="36" stroke="currentColor" strokeWidth={STROKE} opacity="0.16" transform="rotate(24 160 120)" />
      <path
        d="M160 56 L228 92 L228 164 L160 200 L92 164 L92 92 Z"
        stroke="url(#skill-art-glow-creative)"
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path d="M160 56 L160 200 M92 92 L228 164 M228 92 L92 164" stroke="currentColor" strokeWidth={STROKE} opacity="0.28" />
      <circle cx="160" cy="120" r="6" fill="currentColor" opacity="0.35" />
      {[
        [248, 48],
        [72, 64],
        [280, 128],
        [48, 140],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.22" />
      ))}
      <path d="M236 72 L252 64 L268 72" stroke="currentColor" strokeWidth={STROKE} opacity="0.25" strokeLinecap="round" />
    </svg>
  )
}

const ART_BY_ID: Record<string, () => ReactElement> = {
  frontend: FrontendArt,
  backend: BackendArt,
  delivery: DeliveryArt,
  creative: CreativeArt,
}

export function HeroSkillCardArt({ categoryId, isActive = true }: Props) {
  const Art = ART_BY_ID[categoryId]
  if (!Art) return null

  return (
    <aside
      className={[
        'hero-skill-card-visual',
        isActive ? 'hero-skill-card-visual--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-skill-art={categoryId}
      aria-hidden
    >
      <div className="hero-skill-card-visual__panel">
        <Art />
      </div>
    </aside>
  )
}
