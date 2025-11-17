import { useState } from 'react'
import { LeaderboardProbe } from '../components/leaderboard/LeaderboardProbe'
import { CreateTeamModal } from '../components/leaderboard/CreateTeamModal'

export default function LeaderboardPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [createdTeamId, setCreatedTeamId] = useState<string | null>(null)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leaderboard</h1>
        {/* <button className="btn-primary" onClick={() => setCreateOpen(true)}>Create Team</button> */}
      </div>

      {createdTeamId && (
        <div className="rounded-md border border-green-800 bg-green-900/30 px-3 py-2 text-green-300 text-sm">
          Team created: <span className="font-mono">{createdTeamId}</span>
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <LeaderboardProbe />
      </div>

      <CreateTeamModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(id) => {
          setCreatedTeamId(id)
          setCreateOpen(false)
        }}
      />
    </section>
  )
}
