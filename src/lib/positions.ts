import { isAdmin } from './auth'
import { POSITIONS_KEY } from './constants'
import { slug, readList, writeList, useList } from './storage'
import type { AppUser, Position } from '../types/index'


/* ---------------------------------------------------------------------
   6. FIRST PAGE (public) + USER VIEW (browse & apply)
   --------------------------------------------------------------------- */
/* Internships: the admin adds / edits / removes them and marks them Available or Not available (demo: localStorage) */
export function usePositionAvailability() {
  const positions = useList<Position>(POSITIONS_KEY)
  const isOpen = (name: string) => positions.some((p) => p.name === name && p.open)
  const setOpen = (id: string, open: boolean) =>
    writeList(POSITIONS_KEY, readList<Position>(POSITIONS_KEY).map((p) => (p.id === id ? { ...p, open } : p)))
  const remove = (id: string) =>
    writeList(POSITIONS_KEY, readList<Position>(POSITIONS_KEY).filter((p) => p.id !== id))
  return { positions, isOpen, setOpen, remove }
}


export const splitLines = (t?: string) => String(t || '').split(/[\n,]+/).map((x) => x.trim()).filter(Boolean)


// Apply: logged-in users go straight to their form; visitors fill the public application form (login only works after admin approval).
export function startApply(p: Position, user: AppUser | null, navigate: (to: string) => void) {
  const target = `/dashboard/apply?role=${slug(p.name)}`
  if (isAdmin(user)) { navigate('/dashboard'); return }
  if (user) { navigate(target); return }
  navigate(`/apply?role=${slug(p.name)}`)
}
