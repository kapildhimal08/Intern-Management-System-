import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function initials(name) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0] || '')[0] || '') + ((parts[1] || '')[0] || '')
}

const TITLES = {
  '/dashboard': 'Dashboard',
  '/dashboard/interns': 'Interns',
  '/dashboard/attendance': 'Attendance',
  '/dashboard/tasks': 'Tasks',
  '/dashboard/supervisors': 'Supervisors',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
}

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const firstName = user?.name?.split(' ')[0] || 'there'
  const title = TITLES[pathname] || 'Dashboard'

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleNotif() {
    setProfileOpen(false)
    setNotifOpen((s) => !s)
  }
  function toggleProfile() {
    setNotifOpen(false)
    setProfileOpen((s) => !s)
  }

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="hamburger" aria-label="Open menu" onClick={onMenuClick}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <div className="topbar-left">
          <h1>{title}</h1>
          <p>Welcome back, {firstName}!</p>
        </div>
      </div>
      <div className="topbar-right">
        <div className="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input type="text" placeholder="Search interns, tasks..." />
        </div>

        <div className="dropdown-wrap" ref={notifRef}>
          <button
            className="icon-btn"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={toggleNotif}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.7 21a2 2 0 01-3.4 0" />
            </svg>
            <span className="dot" />
          </button>
          {notifOpen && (
            <div className="dropdown-panel notif-panel">
              <div className="dropdown-head">Notifications</div>
              <div className="dropdown-empty">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.7 21a2 2 0 01-3.4 0" />
                </svg>
                <p>You're all caught up. Nothing here yet.</p>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-wrap" ref={profileRef}>
          <button className="profile-chip" aria-expanded={profileOpen} onClick={toggleProfile} type="button">
            <div className="avatar">{(initials(user?.name || 'User') || 'U').toUpperCase()}</div>
            <div>
              <div className="pname">{user?.name || 'User'}</div>
              <div className="prole">Supervisor</div>
            </div>
          </button>
          {profileOpen && (
            <div className="dropdown-panel profile-panel">
              <div className="profile-panel-head">
                <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>
                  {(initials(user?.name || 'User') || 'U').toUpperCase()}
                </div>
                <div>
                  <div className="pname">{user?.name || 'User'}</div>
                  <div className="prole">{user?.email}</div>
                </div>
              </div>
              <button className="dropdown-item danger" onClick={logout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <path d="M16 17l5-5-5-5M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
