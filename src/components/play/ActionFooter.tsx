interface Props {
  primaryLabel: string
  secondaryLabel?: string
  onPrimary: () => void
  onSecondary?: () => void
  loading?: boolean
  disabled?: boolean
  secondaryDisabled?: boolean
}

export function ActionFooter({ primaryLabel, secondaryLabel, onPrimary, onSecondary, loading, disabled, secondaryDisabled }: Props) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <button className="btn-primary" onClick={onPrimary} disabled={!!loading || !!disabled}>
        {loading ? 'Working…' : primaryLabel}
      </button>
      {secondaryLabel && onSecondary && (
        <button className="btn-secondary" onClick={onSecondary} disabled={!!loading || !!secondaryDisabled}>
          {secondaryLabel}
        </button>
      )}
    </div>
  )
}
