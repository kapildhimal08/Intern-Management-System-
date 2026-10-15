import { createContext, useContext, useEffect, useState } from 'react'

// No-login version: visitors just pick "Applicant" or "Admin" on the first page.
// Keeps the same shape the rest of the app expects: { user, ready, login, logout }.
const AuthContext = createContext(null)
const KEY = 'ims_session'
export const ADMIN_PASSCODE = 'Admin123' // demo only – real security needs a backend
export const ADMIN_EMAIL = 'admin@internsys.com'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => { setUser(read()); setReady(true) }, [])

  const save = (u) => {
    if (u) localStorage.setItem(KEY, JSON.stringify(u))
    else localStorage.removeItem(KEY)
    setUser(u)
  }

  const enterAsUser = (name, email) =>
    save({ name: name.trim(), email: email.trim().toLowerCase(), role: 'user' })

  const enterAsAdmin = (passcode) => {
    if (passcode !== ADMIN_PASSCODE) return false
    save({ name: 'Admin', email: ADMIN_EMAIL, role: 'admin' })
    return true
  }

  const logout = () => save(null)
  // kept only so old files (Register.jsx / LoginPage) don't crash if still imported
  const login = async () => ({ ok: false, error: 'Login is disabled.' })
  const register = async () => ({ ok: false, error: 'Registration is disabled.' })

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, enterAsUser, enterAsAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
