import { useCallback, useEffect, useRef, useState } from 'react'
import { doc, getDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { getDb, ensureAnonymousAuth } from '../lib/firebase'
import type { Team } from '../services/firestore'
import { clearTeamId, getSavedTeamId, saveTeamId } from '../lib/session'

export type TeamSession = {
  teamId: string | null
  team: (Team & { id: string }) | null
  loading: boolean
  signIn: (id: string) => Promise<void>
  signOut: () => void
}

const TEAMS = 'teams'

export function useTeamSession(): TeamSession {
  const [teamId, setTeamId] = useState<string | null>(() => getSavedTeamId())
  const [team, setTeam] = useState<(Team & { id: string }) | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const unsubRef = useRef<Unsubscribe | null>(null)

  // subscribe to team doc whenever teamId is set
  useEffect(() => {
    async function attach(id: string) {
      setLoading(true)
      await ensureAnonymousAuth()
      const db = getDb()

      // Verify document exists once before subscribing
      const snap = await getDoc(doc(db, TEAMS, id))
      if (!snap.exists()) {
        // clear invalid session
        setTeam(null)
        setTeamId(null)
        clearTeamId()
        setLoading(false)
        return
      }

      // set initial
      setTeam({ id: snap.id, ...(snap.data() as Team) })

      // subscribe
      unsubRef.current?.()
      unsubRef.current = onSnapshot(doc(db, TEAMS, id), (ds) => {
        if (!ds.exists()) {
          setTeam(null)
          return
        }
        setTeam({ id: ds.id, ...(ds.data() as Team) })
      })
      setLoading(false)
    }

    if (teamId) {
      attach(teamId).catch(() => setLoading(false))
      return () => {
        unsubRef.current?.()
        unsubRef.current = null
      }
    } else {
      // when signed out
      unsubRef.current?.()
      unsubRef.current = null
      setTeam(null)
    }
  }, [teamId])

  const signIn = useCallback(async (id: string) => {
    saveTeamId(id)
    setTeamId(id)
  }, [])

  const signOut = useCallback(() => {
    unsubRef.current?.()
    unsubRef.current = null
    clearTeamId()
    setTeamId(null)
    setTeam(null)
  }, [])

  return { teamId, team, loading, signIn, signOut }
}
