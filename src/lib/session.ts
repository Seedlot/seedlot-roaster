import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'seedlot-roaster-session'

export function getSessionId(): string {
  if (typeof window === 'undefined') return uuidv4()

  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = uuidv4()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}
