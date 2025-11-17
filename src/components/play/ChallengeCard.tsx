import type { Team } from '../../services/firestore'
import { ActionFooter } from './ActionFooter'
import { PhotoCapture } from './PhotoCapture'
import { useState } from 'react'

type ChallengeMeta = { id: number; description: string; points: number; type?: string }

interface Props {
  team: (Team & { id: string })
  mode: 'travel' | 'claim'
  challenge: ChallengeMeta
  locationName?: string
  onComplete: (photo: File) => void
  onVeto: () => void
  busy?: boolean
}

export function ChallengeCard({ mode, challenge, locationName, onComplete, onVeto, busy }: Props) {
  const [photo, setPhoto] = useState<File | null>(null)
  const isHandicap = challenge.type === 'handicap'

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 text-xs uppercase tracking-wider text-slate-400">
        {isHandicap ? 'Handicap' : mode === 'claim' ? 'Location Challenge' : 'Travel Challenge'}
      </div>
      {mode === 'claim' && locationName && (
        <div className="mb-2 text-sm text-slate-300">Claiming: <span className="font-medium text-slate-100">{locationName}</span></div>
      )}
      <div className="mb-3 text-lg font-semibold text-primary-100">
        Challenge #{challenge.id} <span className="text-slate-400">({challenge.points} pts)</span>
      </div>
      <p className="mb-4 text-slate-200">{challenge.description}</p>

      {!isHandicap && <PhotoCapture onChange={setPhoto} />}

      <ActionFooter
        primaryLabel={
          isHandicap 
            ? 'Accept Handicap' 
            : mode === 'claim' 
              ? `Complete & Claim${!photo ? ' (upload photo first)' : ''}` 
              : `Complete${!photo ? ' (upload photo first)' : ''}`
        }
        secondaryLabel={!isHandicap ? `Veto (-${challenge.points})` : undefined}
        onPrimary={() => {
          if (!isHandicap && !photo) return
          onComplete(isHandicap ? null as any : photo!)
        }}
        onSecondary={!isHandicap ? () => onVeto() : undefined}
        loading={!!busy}
        disabled={!isHandicap && !photo}
        secondaryDisabled={false}
      />
    </div>
  )
}
