import { useEffect, useRef, useState } from 'react'

export function TeamAccessModal({
  open,
  onClose,
  onCreated,
  onJoined,
}: {
  open: boolean
  onClose: () => void
  onCreated?: (teamId: string) => void
  onJoined?: (teamId: string) => void
}) {
  const [tab, setTab] = useState<'create' | 'join'>('create')
  const [error, setError] = useState<string | null>(null)

  // Create form state
  const [name, setName] = useState('')
  const [passCreate, setPassCreate] = useState('')
  const [creating, setCreating] = useState(false)
  const createNameRef = useRef<HTMLInputElement | null>(null)

  // Join form state
  const [teams, setTeams] = useState<Array<{ id: string; name: string }>>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>('')
  const [passJoin, setPassJoin] = useState('')
  const [joining, setJoining] = useState(false)
  const joinPassRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      if (tab === 'create') {
        setTimeout(() => createNameRef.current?.focus(), 0)
      } else {
        setTimeout(() => joinPassRef.current?.focus(), 0)
      }
    } else {
      // reset when closing
      setName('')
      setPassCreate('')
      setPassJoin('')
    }
  }, [open, tab])

  useEffect(() => {
    if (!open) return
    if (tab !== 'join') return
    let cleanup: (() => void) | undefined
    ;(async () => {
      try {
        const { observeTeams } = await import('../services/firestore')
        const unsub = observeTeams((rows) => {
          setTeams(rows)
          if (!selectedTeamId && rows.length) {
            setSelectedTeamId(rows[0].id)
          }
        })
        cleanup = unsub
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load teams')
      }
    })()
    return () => {
      if (cleanup) cleanup()
    }
  }, [open, tab])

  const JoinDisabled = teams.length === 0

  if (!open) return null

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !passCreate.trim()) {
      setError('Please enter a team name and passcode.')
      return
    }
    try {
      setCreating(true)
      const { createTeam } = await import('../services/firestore')
      const id = await createTeam(name.trim(), passCreate.trim())
      onCreated?.(id)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create team')
    } finally {
      setCreating(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!selectedTeamId) {
      setError('Please select a team to join.')
      return
    }
    if (!passJoin.trim()) {
      setError('Please enter the team passcode.')
      return
    }
    try {
      setJoining(true)
      const { verifyTeamPasscode } = await import('../services/firestore')
      const ok = await verifyTeamPasscode(selectedTeamId, passJoin.trim())
      if (!ok) {
        setError('Invalid passcode.')
        return
      }
      onJoined?.(selectedTeamId)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to join team')
    } finally {
      setJoining(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        padding: 'max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right)) max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left))',
      }}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-2xl sm:p-5"
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: 'calc(100dvh - 2rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary-200">Team Access</h3>
          <button className="text-slate-400 hover:text-slate-200" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            className={[
              'rounded-md py-2 text-center font-medium',
              tab === 'create' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700',
            ].join(' ')}
            onClick={() => setTab('create')}
          >
            Create
          </button>
          <button
            className={[
              'rounded-md py-2 text-center font-medium',
              tab === 'join' ? 'bg-secondary-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700',
            ].join(' ')}
            onClick={() => setTab('join')}
          >
            Join
          </button>
        </div>

        {error && (
          <div className="mb-3 rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-red-300 text-sm">
            {error}
          </div>
        )}

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="team-name">
                Team Name
              </label>
              <input
                id="team-name"
                ref={createNameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                placeholder="Team Name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="team-pass-create">
                Passcode
              </label>
              <input
                id="team-pass-create"
                type="text"
                value={passCreate}
                onChange={(e) => setPassCreate(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
                placeholder="Passcode"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={creating}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? 'Creating…' : 'Create Team'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="team-select">
                Team
              </label>
              <select
                id="team-select"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-secondary-500"
                disabled={JoinDisabled}
              >
                {teams.length === 0 ? (
                  <option value="">No teams yet</option>
                ) : (
                  teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm text-slate-300" htmlFor="team-pass-join">
                Passcode
              </label>
              <input
                id="team-pass-join"
                ref={joinPassRef}
                type="text"
                value={passJoin}
                onChange={(e) => setPassJoin(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-secondary-500"
                placeholder="Enter team passcode"
                disabled={JoinDisabled}
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={joining}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={joining || JoinDisabled}>
                {joining ? 'Joining…' : 'Join Team'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
