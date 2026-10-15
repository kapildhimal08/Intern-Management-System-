import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'


export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth()
  if (!ready) return null
  if (user) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
