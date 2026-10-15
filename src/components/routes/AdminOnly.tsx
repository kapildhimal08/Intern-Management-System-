import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, isAdmin } from '../../lib/auth'


// Admin-only pages: normal users are sent back to their own home.
export function AdminOnly() {
  const { user } = useAuth()
  return isAdmin(user) ? <Outlet /> : <Navigate to="/dashboard" replace />
}
