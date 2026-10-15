import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'
   import DashboardStats from '../../components/time/DashboardStats.jsx'
// Shared shell for every /dashboard/* route: sidebar + topbar stay mounted,
// only the <Outlet /> content below changes as you navigate.
export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
