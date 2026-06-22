type Props = {
  /** Accessible loading label. */
  label?: string
  className?: string
}

/** Portfolio ring spinner — matches the static boot loader in index.html. */
export function AppSpinner({ label = 'Loading', className = '' }: Props) {
  return (
    <div
      className={`app-spinner ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <span className="app-spinner__ring" aria-hidden />
    </div>
  )
}
