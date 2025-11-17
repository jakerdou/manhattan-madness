import { useTeamSession } from '../hooks/useTeamSession'

export default function SettingsPage() {
  const { teamId, team, loading, signOut } = useTeamSession()

  function handleLeaveTeam() {
    if (confirm('Are you sure you want to leave your team?')) {
      signOut()
    }
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold text-primary-300">Settings</h1>

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : !teamId ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-slate-300">You are not currently on a team.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
            <h2 className="mb-2 text-lg font-semibold text-slate-200">Current Team</h2>
            {team ? (
              <div className="space-y-1">
                <div className="text-slate-300">
                  <span className="font-medium">Team Name:</span> {team.name}
                </div>
                <div className="text-slate-300">
                  <span className="font-medium">Total Points:</span> {team.totalPoints}
                </div>
                <div className="text-slate-300">
                  <span className="font-medium">Locations Claimed:</span> {team.claimedLocations?.length || 0}
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Team information unavailable</div>
            )}
          </div>

          <div className="rounded-lg border border-red-800 bg-red-950/20 p-4">
            <h2 className="mb-2 text-lg font-semibold text-red-300">Danger Zone</h2>
            <p className="mb-3 text-sm text-slate-300">
              Leaving your team will remove your session. You'll need to rejoin with the team passcode.
            </p>
            <button
              className="btn-secondary bg-red-600 hover:bg-red-500 active:bg-red-700"
              onClick={handleLeaveTeam}
            >
              Leave Team
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
