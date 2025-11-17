import { collection, addDoc, serverTimestamp, doc, getDoc, onSnapshot, orderBy, query, updateDoc, runTransaction, type Unsubscribe } from 'firebase/firestore'
import { getDb, ensureAnonymousAuth, getAuthInstance } from '../lib/firebase'
import challenges from '../data/challenges.json'
import locations from '../data/locations.json'

export type TeamState = 'traveling' | 'completing_challenge' | 'claiming_location'

export interface Team {
  id?: string
  name: string
  passcode: string
  createdAt: any
  totalPoints: number
  claimedLocations: number[]
  lastClaimedLocation: string | null
  lastClaimedPhotoUrl?: string | null
  lastClaimedAt: any
  challengesAttemptedSinceLastClaim: number
  currentState: TeamState
  activeChallenge?: {
    challengeId: number
    isForLocationClaim: boolean
    locationId?: number | null
  } | null
}

const TEAMS = 'teams'
const SUBMISSIONS = 'challengeSubmissions'

export interface ChallengeSubmission {
  id?: string
  teamId: string
  challengeId: number
  locationId?: number | null
  photoUrl?: string
  timestamp: any
  action: 'completed' | 'vetoed'
  pointsAwarded: number
}

export async function createTeam(name: string, passcode: string): Promise<string> {
  const db = getDb()
  const ref = await addDoc(collection(db, TEAMS), {
    name,
    passcode,
    createdAt: serverTimestamp(),
    totalPoints: 0,
    claimedLocations: [],
    lastClaimedLocation: null,
    lastClaimedPhotoUrl: null,
    lastClaimedAt: null,
    challengesAttemptedSinceLastClaim: 0,
    currentState: 'traveling',
    activeChallenge: null,
  } satisfies Omit<Team, 'id'>)
  return ref.id
}

export async function verifyTeamPasscode(teamId: string, passcode: string): Promise<boolean> {
  const db = getDb()
  const snap = await getDoc(doc(db, TEAMS, teamId))
  if (!snap.exists()) return false
  const admin = import.meta.env.VITE_ADMIN_PASSCODE
  const data = snap.data() as Team
  return passcode === data.passcode || (!!admin && passcode === admin)
}

export function observeLeaderboard(onChange: (teams: Array<{ id: string; name: string; totalPoints: number; lastClaimedLocation: string | null; lastClaimedPhotoUrl?: string | null }>) => void): Unsubscribe {
  const db = getDb()
  const q = query(collection(db, TEAMS), orderBy('totalPoints', 'desc'))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => {
      const t = d.data() as Team
      return { id: d.id, name: t.name, totalPoints: t.totalPoints, lastClaimedLocation: t.lastClaimedLocation ?? null, lastClaimedPhotoUrl: t.lastClaimedPhotoUrl ?? null }
    })
    onChange(rows)
  })
}

export async function updateTeamState(teamId: string, patch: Partial<Team>): Promise<void> {
  const db = getDb()
  await updateDoc(doc(db, TEAMS, teamId), patch as any)
}

export function observeTeams(onChange: (teams: Array<{ id: string; name: string }>) => void): Unsubscribe {
  const db = getDb()
  const q = query(collection(db, TEAMS), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => {
    const rows = snap.docs.map((d) => {
      const t = d.data() as Team
      return { id: d.id, name: t.name }
    })
    onChange(rows)
  })
}

function pickRandomChallengeId(): number {
  const list = challenges as Array<{ id: number }>
  const idx = Math.floor(Math.random() * list.length)
  return list[idx].id
}

function getChallengeMeta(id: number) {
  return (challenges as Array<{ id: number; description: string; points: number }>).find((c) => c.id === id)!
}

function getLocationMeta(id: number) {
  return (locations as Array<{ id: number; name: string; points: number }>).find((l) => l.id === id)!
}

export async function generateChallengeForTravel(teamId: string): Promise<void> {
  const db = getDb()
  await ensureAnonymousAuth()
  try {
    const uid = getAuthInstance().currentUser?.uid
    console.debug('[MM] generateChallengeForTravel -> start', { teamId, uid })
  } catch {}
  await runTransaction(db, async (tx) => {
    const ref = doc(db, TEAMS, teamId)
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Team not found')
    const team = snap.data() as Team
    console.debug('[MM] generateChallengeForTravel -> pre', { team })

    if (team.currentState !== 'traveling') throw new Error('Team is busy')
    if (team.activeChallenge) throw new Error('Active challenge already exists')
    if ((team.challengesAttemptedSinceLastClaim ?? 0) >= 2) throw new Error('Maximum challenges reached')

    const challengeId = pickRandomChallengeId()
    const patch: Partial<Team> = {
      currentState: 'completing_challenge',
      activeChallenge: { challengeId, isForLocationClaim: false, locationId: null },
    }
    console.debug('[MM] generateChallengeForTravel -> patch', patch)
    tx.update(ref, patch as any)
  })
}

export async function startClaimLocation(teamId: string, locationId: number): Promise<void> {
  const db = getDb()
  await ensureAnonymousAuth()
  try {
    const uid = getAuthInstance().currentUser?.uid
    console.debug('[MM] startClaimLocation -> start', { teamId, locationId, uid })
  } catch {}
  await runTransaction(db, async (tx) => {
    const ref = doc(db, TEAMS, teamId)
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('Team not found')
    const team = snap.data() as Team
    console.debug('[MM] startClaimLocation -> pre', { team })

    if (team.currentState !== 'traveling') throw new Error('Team is busy')
    if (team.activeChallenge) throw new Error('Active challenge already exists')
    if ((team.claimedLocations || []).includes(locationId)) throw new Error('Location already claimed')

    const challengeId = pickRandomChallengeId()
    const patch: Partial<Team> = {
      currentState: 'claiming_location',
      activeChallenge: { challengeId, isForLocationClaim: true, locationId },
    }
    console.debug('[MM] startClaimLocation -> patch', patch)
    tx.update(ref, patch as any)
  })
}

export async function completeActiveChallenge(teamId: string, opts: { photoUrl?: string }): Promise<void> {
  const db = getDb()
  await ensureAnonymousAuth()
  try {
    const uid = getAuthInstance().currentUser?.uid
    console.debug('[MM] completeActiveChallenge -> start', { teamId, hasPhoto: !!opts.photoUrl, uid })
  } catch {}
  await runTransaction(db, async (tx) => {
    const teamRef = doc(db, TEAMS, teamId)
    const snap = await tx.get(teamRef)
    if (!snap.exists()) throw new Error('Team not found')
    const team = snap.data() as Team
    const active = team.activeChallenge
    if (!active) throw new Error('No active challenge')

    if (active.isForLocationClaim) {
      if (active.locationId == null) throw new Error('Missing location for claim')
      const loc = getLocationMeta(active.locationId)
      const newPoints = (team.totalPoints ?? 0) + (loc.points ?? 0)
      const claimed = Array.from(new Set([...(team.claimedLocations || []), active.locationId]))
      const patch: Partial<Team> = {
        totalPoints: newPoints,
        claimedLocations: claimed,
        lastClaimedLocation: loc.name,
        lastClaimedPhotoUrl: opts.photoUrl,
        lastClaimedAt: serverTimestamp(),
        challengesAttemptedSinceLastClaim: 0,
        currentState: 'traveling',
        activeChallenge: null,
      }
      console.debug('[MM] completeActiveChallenge -> patch', patch)
      tx.update(teamRef, patch as any)

      const submission: Omit<ChallengeSubmission, 'id' | 'timestamp'> = {
        teamId,
        challengeId: active.challengeId,
        locationId: active.locationId,
        photoUrl: opts.photoUrl,
        action: 'completed',
        pointsAwarded: loc.points,
      }
      const subRef = doc(collection(db, SUBMISSIONS))
      tx.set(subRef, { ...submission, timestamp: serverTimestamp() })
    } else {
      const meta = getChallengeMeta(active.challengeId)
      const newPoints = (team.totalPoints ?? 0) + (meta.points ?? 0)
      const newCount = (team.challengesAttemptedSinceLastClaim ?? 0) + 1
      const patch2: Partial<Team> = {
        totalPoints: newPoints,
        challengesAttemptedSinceLastClaim: newCount,
        currentState: 'traveling',
        activeChallenge: null,
      }
      console.debug('[MM] completeActiveChallenge -> patch', patch2)
      tx.update(teamRef, patch2 as any)

      const submission: Omit<ChallengeSubmission, 'id' | 'timestamp'> = {
        teamId,
        challengeId: active.challengeId,
        locationId: null,
        photoUrl: opts.photoUrl,
        action: 'completed',
        pointsAwarded: meta.points,
      }
      const subRef = doc(collection(db, SUBMISSIONS))
      tx.set(subRef, { ...submission, timestamp: serverTimestamp() })
    }
  })
}

export async function vetoActiveChallenge(teamId: string): Promise<void> {
  const db = getDb()
  await ensureAnonymousAuth()
  try {
    const uid = getAuthInstance().currentUser?.uid
    console.debug('[MM] vetoActiveChallenge -> start', { teamId, uid })
  } catch {}
  await runTransaction(db, async (tx) => {
    const teamRef = doc(db, TEAMS, teamId)
    const snap = await tx.get(teamRef)
    if (!snap.exists()) throw new Error('Team not found')
    const team = snap.data() as Team
    const active = team.activeChallenge
    if (!active) throw new Error('No active challenge')
    console.debug('[MM] vetoActiveChallenge -> pre', { team, active })

    const meta = getChallengeMeta(active.challengeId)
    const penalty = -(meta.points ?? 0)

    if (active.isForLocationClaim) {
      // stay in claiming; regenerate a new challenge for same location
      const newChallengeId = pickRandomChallengeId()
      const newPoints = (team.totalPoints ?? 0) + penalty
      const patch: Partial<Team> = {
        totalPoints: newPoints,
        currentState: 'claiming_location',
        activeChallenge: { challengeId: newChallengeId, isForLocationClaim: true, locationId: active.locationId },
      }
      console.debug('[MM] vetoActiveChallenge -> patch', patch)
      tx.update(teamRef, patch as any)

      const submission: Omit<ChallengeSubmission, 'id' | 'timestamp' | 'photoUrl'> = {
        teamId,
        challengeId: active.challengeId,
        locationId: active.locationId,
        action: 'vetoed',
        pointsAwarded: penalty,
      }
      const subRef = doc(collection(db, SUBMISSIONS))
      tx.set(subRef, { ...submission, timestamp: serverTimestamp() })
    } else {
      // travel mode: increment counter and return to traveling
      const newPoints = (team.totalPoints ?? 0) + penalty
      const newCount = (team.challengesAttemptedSinceLastClaim ?? 0) + 1
      const patch2: Partial<Team> = {
        totalPoints: newPoints,
        challengesAttemptedSinceLastClaim: newCount,
        currentState: 'traveling',
        activeChallenge: null,
      }
      console.debug('[MM] vetoActiveChallenge -> patch', patch2)
      tx.update(teamRef, patch2 as any)

      const submission: Omit<ChallengeSubmission, 'id' | 'timestamp' | 'photoUrl'> = {
        teamId,
        challengeId: active.challengeId,
        locationId: null,
        action: 'vetoed',
        pointsAwarded: penalty,
      }
      const subRef = doc(collection(db, SUBMISSIONS))
      tx.set(subRef, { ...submission, timestamp: serverTimestamp() })
    }
  })
}
