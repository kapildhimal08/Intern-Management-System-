import DashboardHome from '../../pages/dashboard/DashboardHome.jsx'
import { useAuth, isAdmin } from '../../lib/auth'
import { UserHome } from '../../pages/user/UserHome'

export function HomeSwitch() {
  const { user } = useAuth()
  return isAdmin(user) ? <DashboardHome /> : <UserHome />
}
