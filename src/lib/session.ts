const TEAM_KEY = 'mm.teamId'

export function getSavedTeamId(): string | null {
  try {
    return localStorage.getItem(TEAM_KEY)
  } catch {
    return null
  }
}

export function saveTeamId(id: string): void {
  try {
    localStorage.setItem(TEAM_KEY, id)
  } catch {
    // ignore write errors (e.g., Safari private mode)
  }
}

export function clearTeamId(): void {
  try {
    localStorage.removeItem(TEAM_KEY)
  } catch {
    // ignore
  }
}

export const SessionKeys = { TEAM_KEY }
