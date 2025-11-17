import type { Team } from '../../services/firestore'
import { ActionFooter } from './ActionFooter'
import { PhotoCapture } from './PhotoCapture'
import { useState } from 'react'

type ChallengeMeta = { id: number; description: string; points: number }

interface Props {
  team: (Team & { id: string })
  mode: 'travel' | 'claim'
  challenge: ChallengeMeta
  locationName?: string
  onComplete: (photo: File) => void
  onVeto: () => void
  busy?: boolean
}

export function ChallengeCard({ team, mode, challenge, locationName, onComplete, onVeto, busy }: Props) {
  const [photo, setPhoto] = useState<File | null>(null)

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
        {mode === 'claim' ? 'Location Challenge' : 'Travel Challenge'}
      </div>
      {mode === 'claim' && locationName && (
        <div className="mb-2 text-sm text-slate-300">Claiming: <span className="font-medium text-slate-100">{locationName}</span></div>
      )}
      <div className="mb-3 text-lg font-semibold text-primary-100">Challenge #{challenge.id}</div>
      <p className="mb-4 text-slate-200">{challenge.description}</p>
      <div className="mb-3 text-sm text-slate-400">
        {mode === 'claim' ? (
          <span>Complete with photo to claim the location.</span>
        ) : (
          <span>Complete with photo to earn +{challenge.points} points, or veto for -{challenge.points} points.</span>
        )}
      </div>

      <PhotoCapture onChange={setPhoto} />

      <ActionFooter
        primaryLabel={mode === 'claim' ? 'Complete & Claim' : 'Complete'}
        secondaryLabel={`Veto (-${challenge.points})`}
        onPrimary={() => {
          if (!photo) return
          onComplete(photo)
        }}
        onSecondary={() => onVeto()}
        loading={!!busy}
      />
    </div>
  )
}
