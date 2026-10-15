import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, isAdmin, gateOk } from '../../lib/auth'
import { REQUIRE_LOGIN_APPROVAL } from '../../lib/constants'


/* ---------------------------------------------------------------------
   5. ROUTE GUARDS + APP
   --------------------------------------------------------------------- */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  const { pathname, search } = useLocation()
  if (!ready) return null
  if (!user) {
    // a visitor who opens the logged-in apply form is sent to the public application form
    if (pathname.startsWith('/dashboard/apply')) return <Navigate to={`/apply${search}`} replace />
    return <Navigate to="/" replace />
  }
  if (isAdmin(user) || !REQUIRE_LOGIN_APPROVAL || gateOk(user.email)) return <>{children}</>
  return <Navigate to="/login/waiting" replace /> // signed in but not approved yet
}
