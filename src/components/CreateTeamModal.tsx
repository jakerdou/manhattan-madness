import { useEffect, useRef, useState } from 'react'
import { createTeam } from '../services/firestore'

export function CreateTeamModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated?: (id: string) => void
}) {
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const firstInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
      setLoading(false)
      setTimeout(() => firstInputRef.current?.focus(), 0)
    } else {
      setName('')
      setPass('')
    }
  }, [open])

  if (!open) return null

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !pass.trim()) {
      setError('Please enter a team name and passcode.')
      return
    }
    try {
      setLoading(true)
      const id = await createTeam(name.trim(), pass.trim())
      onCreated?.(id)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-2xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-primary-200">Create Team</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300" htmlFor="team-name">
              Team Name
            </label>
            <input
              id="team-name"
              ref={firstInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
              placeholder="e.g. The Runners"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300" htmlFor="team-pass">
              Passcode
            </label>
            <input
              id="team-pass"
              type="text"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-primary-500"
              placeholder="Choose a passcode"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
