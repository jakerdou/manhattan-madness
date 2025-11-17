import { useMemo, useState } from 'react'
import { TeamAccessModal } from '../components/play/TeamAccessModal'
import { TeamInfoCard } from '../components/play/TeamInfoCard'
import { useTeamSession } from '../hooks/useTeamSession'
import challenges from '../data/challenges.json'
import locations from '../data/locations.json'
import { ChallengeCard } from '../components/play/ChallengeCard'
import { LocationPicker } from '../components/play/LocationPicker'
import { generateChallengeForTravel, startClaimLocation, completeActiveChallenge, vetoActiveChallenge } from '../services/firestore'
import { uploadTeamPhoto } from '../services/storage'

export default function PlayPage() {
  const [open, setOpen] = useState(false)
  const { teamId, team, loading, signIn } = useTeamSession()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  const activeChallenge = team?.activeChallenge
  const activeChallengeMeta = activeChallenge
    ? (challenges as Array<{ id: number; description: string; points: number }>).find((c) => c.id === activeChallenge.challengeId) || null
    : null
  const claimingLocation = activeChallenge?.isForLocationClaim && activeChallenge.locationId != null
    ? (locations as Array<{ id: number; name: string; points: number }>).find((l) => l.id === activeChallenge.locationId) || null
    : null
  const claimingLocationName = claimingLocation?.name ?? null

  const canGenerate = useMemo(() => {
    if (!team) return false
    if (team.currentState !== 'traveling') return false
    if (team.activeChallenge) return false
    return (team.challengesAttemptedSinceLastClaim ?? 0) < 2
  }, [team])

  const canClaim = useMemo(() => {
    if (!team) return false
    if (team.currentState !== 'traveling') return false
    if (team.activeChallenge) return false
    return true
  }, [team])

  async function handleGenerate() {
    if (!teamId) return
    setError(null)
    setBusy(true)
    try {
      console.debug('[MM] UI handleGenerate', { teamId, canGenerate })
      await generateChallengeForTravel(teamId)
    } catch (e: any) {
      console.error('[MM] handleGenerate error', e)
      setError(e?.message ?? 'Failed to generate challenge')
    } finally {
      setBusy(false)
    }
  }

  async function handlePickLocation(id: number) {
    if (!teamId) return
    setError(null)
    setBusy(true)
    try {
      console.debug('[MM] UI handlePickLocation', { teamId, id })
      await startClaimLocation(teamId, id)
      setShowPicker(false)
    } catch (e: any) {
      console.error('[MM] handlePickLocation error', e)
      setError(e?.message ?? 'Failed to start claim')
    } finally {
      setBusy(false)
    }
  }

  async function handleComplete(photo: File) {
    if (!teamId || !team) return
    setError(null)
    setBusy(true)
    try {
      console.debug('[MM] UI handleComplete upload start', { size: photo.size, type: photo.type })
      const url = await uploadTeamPhoto(teamId, photo, { 
        teamName: team.name,
        locationName: claimingLocationName || undefined,
        challengeId: activeChallenge?.challengeId
      })
      console.debug('[MM] UI handleComplete upload done', { url })
      await completeActiveChallenge(teamId, { photoUrl: url })
    } catch (e: any) {
      console.error('[MM] handleComplete error', e)
      setError(e?.message ?? 'Failed to complete challenge')
    } finally {
      setBusy(false)
    }
  }

  async function handleVeto() {
    if (!teamId) return
    setError(null)
    setBusy(true)
    try {
      console.debug('[MM] UI handleVeto', { teamId })
      await vetoActiveChallenge(teamId)
    } catch (e: any) {
      console.error('[MM] handleVeto error', e)
      setError(e?.message ?? 'Failed to veto challenge')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="max-w-lg">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-primary-300">Play Manhattan Madness</h1>
        {!teamId ? (
          <>
            <p className="mb-8 text-slate-300">Create or join your team to start the game.</p>
            <button className="btn-primary w-full sm:w-auto" onClick={() => setOpen(true)}>
              Create/Join Team
            </button>
          </>
        ) : (
          <>
            <TeamInfoCard
              team={team ? { ...team } : null}
              activeChallengeMeta={activeChallengeMeta as any}
              claimingLocationName={claimingLocationName}
              loading={loading}
              footer={
                !activeChallenge ? (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button className="btn-primary" onClick={handleGenerate} disabled={!canGenerate || busy}>
                      Generate Challenge
                    </button>
                    <button className="btn-secondary" onClick={() => setShowPicker(true)} disabled={!canClaim || busy}>
                      Claim Location
                    </button>
                  </div>
                ) : null
              }
            />

            {error && (
              <div className="mt-3 rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            {!activeChallenge && showPicker && team && (
              <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 p-4">
                <LocationPicker
                  locations={locations as any}
                  claimedIds={(team.claimedLocations || []) as number[]}
                  onSelect={handlePickLocation}
                />
                <div className="mt-3 text-right">
                  <button className="btn-secondary" onClick={() => setShowPicker(false)} disabled={busy}>Close</button>
                </div>
              </div>
            )}

            {activeChallenge && activeChallengeMeta && team && (
              <div className="mt-4">
                <ChallengeCard
                  team={{ ...team, id: teamId }}
                  mode={activeChallenge.isForLocationClaim ? 'claim' : 'travel'}
                  challenge={activeChallengeMeta}
                  locationName={claimingLocationName || undefined}
                  onComplete={handleComplete}
                  onVeto={handleVeto}
                  busy={busy}
                />
              </div>
            )}
          </>
        )}
      </div>

      <TeamAccessModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={(id) => {
          signIn(id)
          setOpen(false)
        }}
        onJoined={(id) => {
          signIn(id)
          setOpen(false)
        }}
      />
    </section>
  )
}
