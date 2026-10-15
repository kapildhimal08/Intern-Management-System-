import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { NavList } from './NavList'
import { NavMenu } from './NavMenu'
import { NotificationBell } from './NotificationBell'
import { Ico, P } from '../ui/icons'
import { useAuth, isAdmin, clearGate } from '../../lib/auth'
import { NEXT_KEY } from '../../lib/constants'
import { MAIN_NAV, RECRUIT_NAV, USER_RECRUIT_NAV, TITLES } from '../../lib/nav'


/* Dashboard shell: sidebar + topbar + page outlet */
export function Shell() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const [menu, setMenu] = useState(false)
  const [profile, setProfile] = useState(false)
  const profRef = useRef<HTMLDivElement>(null)
  const admin = isAdmin(user)
  const name = user?.name || user?.email || 'User'
  const initials = name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase()
  const first = name.split(' ')[0]
  const home: [string, string] = admin ? ['Dashboard', `Welcome back, ${first}!`] : ['Internships', `Welcome, ${first}! Browse open positions and apply.`]
  const [title, sub] = TITLES[pathname] || home

  useEffect(() => { setMenu(false); setProfile(false) }, [pathname])
  useEffect(() => { sessionStorage.removeItem(NEXT_KEY) }, [])
  useEffect(() => {
    const close = (e: MouseEvent) => { if (profRef.current && !profRef.current.contains(e.target as Node)) setProfile(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const signOut = () => { clearGate(); logout() }

  return (
    <div className="app-shell">
      <div className={'sidebar-scrim' + (menu ? ' show' : '')} onClick={() => setMenu(false)} />
      <aside className={'sidebar' + (menu ? ' open' : '')}>
        <div className="brand-mark">
          <span className="brand-badge">🎓</span>
          <div><div className="brand-name">InternSys</div><div className="brand-sub">Management</div></div>
        </div>
        <div className="nav-group-label">Main</div>
        <NavList items={MAIN_NAV} />
        <div className="nav-group-label">Recruitment</div>
        <NavList items={admin ? RECRUIT_NAV : USER_RECRUIT_NAV} />
        <NavMenu />
        <button type="button" className="nav-item logout" onClick={signOut}><Ico d={P.logout} /> Logout</button>
      </aside>

      <div className="main-col">
        <header className="topbar">
          <div className="topbar-left-wrap">
            <button type="button" className="hamburger" aria-label="Menu" onClick={() => setMenu(true)}><Ico d={P.menu} /></button>
            <div className="topbar-left"><h1>{title}</h1><p>{sub}</p></div>
          </div>
          <div className="topbar-right">
            <NotificationBell admin={admin} />
            <div className="dropdown-wrap" ref={profRef}>
              <button type="button" className="profile-chip" onClick={() => setProfile((o) => !o)}>
                <span className="avatar">{initials}</span>
                <span><span className="pname">{name}</span><br /><span className="prole">{admin ? 'Administrator' : 'Intern'}</span></span>
              </button>
              {profile && (
                <div className="dropdown-panel profile-panel">
                  <div className="profile-panel-head">
                    <span className="avatar">{initials}</span>
                    <div><div className="pname">{name}</div><div className="prole">{user?.email}</div></div>
                  </div>
                  <button type="button" className="dropdown-item danger" onClick={signOut}><Ico d={P.logout} size={16} /> Log out</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}
