import { useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'
 import DashboardStats from '../../components/time/DashboardStats.jsx'

// Content is intentionally blank for now — the sidebar, topbar, and
// login/logout flow are the working part. Add each dashboard feature
// (stats, attendance, tasks, etc.) here one at a time whenever you're ready.
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="content"></main>
      </div>
    </div>
  )
}
