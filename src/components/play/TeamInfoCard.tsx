import type { Team } from '../../services/firestore'
import type { ReactNode } from 'react'

interface Props {
  team: (Team & { id: string }) | null
  activeChallengeMeta: { id: number; description: string } | null
  claimingLocationName: string | null
  loading: boolean
  footer?: ReactNode
}

export function TeamInfoCard({ team, activeChallengeMeta, claimingLocationName, loading, footer }: Props) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left">
      <div>
        <div className="text-slate-300 text-sm">Team</div>
        <div className="text-2xl font-semibold text-primary-200">{team?.name ?? 'Unknown'}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
          <div className="text-xs text-slate-400">Points</div>
          <div className="text-xl font-bold text-secondary-200">{team?.totalPoints ?? 0}</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
          <div className="text-xs text-slate-400">Challenges since claim</div>
          <div className="flex items-baseline gap-1">
            <div className="text-lg font-semibold text-slate-200">{team?.challengesAttemptedSinceLastClaim ?? 0}</div>
            <div className="text-xs text-slate-500">/ 2</div>
          </div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
          <div className="text-xs text-slate-400">Claiming Location</div>
          <div className="text-sm font-medium text-slate-200 truncate">{claimingLocationName ?? <div className="text-sm font-medium text-slate-500">None</div>}</div>
        </div>
        <div className="rounded-md border border-slate-800 bg-slate-950 p-3">
          <div className="text-xs text-slate-400">Active Challenge</div>
          {activeChallengeMeta ? (
            <div className="text-sm font-medium text-slate-200">
              #{activeChallengeMeta.id}
              <span className="block text-xs text-slate-400 line-clamp-2">{activeChallengeMeta.description}</span>
            </div>
          ) : (
            <div className="text-sm font-medium text-slate-500">None</div>
          )}
        </div>
      </div>
      {footer}
      {loading && <div className="mt-3 text-xs text-slate-400">Syncing team…</div>}
    </div>
  )
}
