import { useEffect, useState } from 'react'
import { useAuth as useAuthContext } from '../context/AuthContext.jsx'
import { REQ_KEY, EVT, ADMIN_EMAIL, GATE_REQ, GATE_OK, NEXT_KEY, USERS_KEY, APPS_KEY } from './constants'
import { readList } from './storage'
import type { RequestStatus, AppUser, AuthShape, LoginRequest, LoginResult, UserAccount, LoginCheck, Application } from '../types/index'


export const useAuth = (): AuthShape => useAuthContext() as unknown as AuthShape


export const isAdmin = (u: AppUser | null | undefined): boolean =>
  !!u && (String(u.role || '').toLowerCase() === 'admin' || String(u.email || '').toLowerCase() === ADMIN_EMAIL)


export const readReqs = (): LoginRequest[] => {
  try { return JSON.parse(localStorage.getItem(REQ_KEY) || '[]') || [] } catch { return [] }
}

export const writeReqs = (list: LoginRequest[]) => {
  localStorage.setItem(REQ_KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVT))
}

export function createLoginRequest(user: AppUser): LoginRequest {
  const list = readReqs()
  const email = String(user.email || '').toLowerCase()
  const existing = list.find((r) => r.email === email && r.status === 'pending')
  if (existing) return existing
  const req: LoginRequest = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: user.name || email, email, status: 'pending', createdAt: Date.now(),
  }
  writeReqs([req, ...list])
  return req
}

export const setRequestStatus = (id: string, status: RequestStatus) =>
  writeReqs(readReqs().map((r) => (r.id === id ? { ...r, status, decidedAt: Date.now() } : r)))


export const gateOk = (email?: string) => sessionStorage.getItem(GATE_OK) === String(email || '').toLowerCase()

export const clearGate = () => { sessionStorage.removeItem(GATE_OK); sessionStorage.removeItem(GATE_REQ) }


export function useStore<T>(selector: (l: LoginRequest[]) => T, deps: unknown[]): T {
  const [value, setValue] = useState(() => selector(readReqs()))
  useEffect(() => {
    const update = () => {
      const next = selector(readReqs())
      setValue((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    update()
    window.addEventListener(EVT, update)
    window.addEventListener('storage', update)
    const t = setInterval(update, 1500)
    return () => {
      window.removeEventListener(EVT, update)
      window.removeEventListener('storage', update)
      clearInterval(t)
    }
    // eslint-disable-next-line
  }, deps)
  return value
}

export const useLoginRequests = () => useStore((l) => l, [])

export const useRequest = (id: string | null) => useStore((l) => l.find((r) => r.id === id) ?? null, [id])


// Calls YOUR existing login() and copes with the usual ways it can report errors.
export async function tryLogin(login: AuthShape['login'], email: string, password: string, remember: boolean): Promise<LoginResult> {
  const fallback = 'Invalid email or password.'
  try {
    const res = await login(email, password, remember)
    if (res === false) return { ok: false, error: fallback }
    if (typeof res === 'string' && res) return { ok: false, error: res }
    if (res && typeof res === 'object') {
      const r = res as Record<string, unknown>
      if (r.ok === false || r.success === false || r.error)
        return { ok: false, error: String(r.error || r.message || fallback) }
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error && e.message ? e.message : fallback }
  }
}

export async function sha256(text: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch { return 'plain:' + text }
}

export const findAccount = (email?: string) =>
  readList<UserAccount>(USERS_KEY).find((a) => a.email === String(email || '').trim().toLowerCase())

export async function checkLogin(emailRaw: string, password: string): Promise<LoginCheck> {
  const acc = findAccount(emailRaw)
  if (!acc || acc.hash !== (await sha256(password))) return { ok: false, error: 'Incorrect email or password.' }
  // Login only works once the admin has approved an application from this email.
  const mine = readList<Application>(APPS_KEY).filter((a) => a.userEmail === acc.email)
  if (mine.some((a) => a.status === 'Approved')) return { ok: true, name: acc.name }
  if (mine.some((a) => a.status === 'Pending'))
    return { ok: false, error: 'Your application is still waiting for admin approval. You can log in once it is approved.' }
  if (mine.length > 0) return { ok: false, error: 'Your application was not approved.' }
  return { ok: false, error: 'No application found for this email. Please apply for an internship first.' }
}


// After login: normal users who came from an "Apply" button go back to that form.
export function destination(admin: boolean): string {
  const next = sessionStorage.getItem(NEXT_KEY)
  return !admin && next && next.startsWith('/dashboard/apply') ? next : '/dashboard'
}
