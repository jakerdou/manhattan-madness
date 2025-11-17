type Location = { id: number; name: string; points: number; tier?: string }

interface Props {
  locations: Location[]
  claimedIds: number[]
  onSelect: (locationId: number) => void
}

export function LocationPicker({ locations, claimedIds, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-400">Select a location to claim</div>
      <div className="max-h-80 overflow-y-auto rounded-md border border-slate-800">
        <ul className="divide-y divide-slate-800">
          {locations.map((l) => {
            const disabled = claimedIds.includes(l.id)
            return (
              <li key={l.id} className="flex items-center justify-between gap-3 p-3">
                <div>
                  <div className="font-medium text-slate-200">{l.name}</div>
                  <div className="text-xs text-slate-500">{l.points} pts{l.tier ? ` · ${l.tier}` : ''}</div>
                </div>
                <button className="btn-secondary" onClick={() => onSelect(l.id)} disabled={disabled}>
                  {disabled ? 'Claimed' : 'Claim'}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
