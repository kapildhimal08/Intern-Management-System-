import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, isAdmin } from '../../lib/auth'

export function UserOnly() {
  const { user } = useAuth()
  return isAdmin(user) ? <Navigate to="/dashboard" replace /> : <Outlet />
}
