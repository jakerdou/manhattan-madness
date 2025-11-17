import { useEffect, useState } from 'react'
import { observeLeaderboard } from '../services/firestore'

export function LeaderboardProbe() {
  const [rows, setRows] = useState<Array<{ id: string; name: string; totalPoints: number; lastClaimedLocation: string | null }>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsub = observeLeaderboard((data) => setRows(data))
      return () => unsub()
    } catch (e: any) {
      setError(e?.message ?? 'Failed to observe leaderboard')
    }
  }, [])

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  if (!rows.length) {
    return <div className="text-slate-400 text-sm">No teams yet. Create one to see data here.</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-300">
            <th className="px-2 py-1">Team</th>
            <th className="px-2 py-1">Points</th>
            <th className="px-2 py-1">Last Location</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((r) => (
            <tr key={r.id} className="border-t border-slate-800 hover:bg-slate-800/40">
              <td className="px-2 py-1 font-medium">{r.name}</td>
              <td className="px-2 py-1">{r.totalPoints}</td>
              <td className="px-2 py-1 text-slate-400">{r.lastClaimedLocation ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
