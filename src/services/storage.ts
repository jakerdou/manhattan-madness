import { getStorageInstance } from '../lib/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export async function uploadTeamPhoto(teamId: string, file: File, opts?: { teamName?: string; locationName?: string; challengeId?: number }): Promise<string> {
  const storage = getStorageInstance()
  // const ts = Date.now()
  // const date = new Date(ts).toISOString().replace(/[:.]/g, '-').slice(0, -5)
  
  const safeTeamName = opts?.teamName?.replace(/[^a-zA-Z0-9_-]/g, '_') || 'team'
  const safeLocation = opts?.locationName?.replace(/[^a-zA-Z0-9_-]/g, '_') || ''
  const locationPart = safeLocation ? `_${safeLocation}` : ''
  const challengePart = opts?.challengeId ? `_ch${opts.challengeId}` : ''
  
  const filename = `${safeTeamName}${locationPart}${challengePart}.jpg`
  // const filename = `${date}_${safeTeamName}${locationPart}${challengePart}.jpg`
  const path = `submissions/${teamId}/${filename}`
  const r = ref(storage, path)
  await uploadBytes(r, file, { contentType: file.type || 'image/jpeg' })
  return await getDownloadURL(r)
}
