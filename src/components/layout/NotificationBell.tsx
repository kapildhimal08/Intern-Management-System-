import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ico, P } from '../ui/icons'
import { setRequestStatus, useLoginRequests } from '../../lib/auth'
import { APPS_KEY } from '../../lib/constants'
import { useList } from '../../lib/storage'
import type { Application } from '../../types/index'


/* Admin notification bell: login requests with Approve / Reject */
export function NotificationBell({ admin }: { admin: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const all = useLoginRequests()
  const pendingApps = useList<Application>(APPS_KEY).filter((a) => admin && a.status === 'Pending')
  const pending = admin ? all.filter((r) => r.status === 'pending') : []
  const recent = admin ? all.filter((r) => r.status === 'approved' || r.status === 'rejected').slice(0, 3) : []

  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div className="dropdown-wrap" ref={ref}>
      <button type="button" className="icon-btn" aria-label="Notifications" onClick={() => setOpen((o) => !o)}>
        <Ico d={P.bell} />
        {(pending.length > 0 || pendingApps.length > 0) && <span className="dot" />}
      </button>
      {open && (
        <div className="dropdown-panel notif-panel approval-panel">
          <div className="dropdown-head">{admin ? `Login requests${pending.length ? ` (${pending.length})` : ''}` : 'Notifications'}</div>
          {pending.length === 0 && pendingApps.length === 0 && <div className="dropdown-empty"><p>{admin ? 'No pending login requests.' : 'You have no new notifications.'}</p></div>}
          {pending.map((r) => (
            <div className="approval-item" key={r.id}>
              <div className="approval-who">
                <strong>{r.name}</strong>
                <span>{r.email}</span>
                <span>wants to log in · {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="approval-actions">
                <button type="button" className="btn-approve" onClick={() => setRequestStatus(r.id, 'approved')}>Approve</button>
                <button type="button" className="btn-reject" onClick={() => setRequestStatus(r.id, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
          {pendingApps.length > 0 && (
            <>
              <div className="dropdown-head approval-sec">New applications ({pendingApps.length})</div>
              {pendingApps.slice(0, 3).map((a) => (
                <div className="approval-item" key={a.id}><div className="approval-who"><strong>{a.fullName}</strong><span>{a.position}</span></div></div>
              ))}
              <Link to="/dashboard/applications" className="approval-link" onClick={() => setOpen(false)}>Review applications →</Link>
            </>
          )}
          {recent.length > 0 && <div className="dropdown-head approval-sec">Recent</div>}
          {recent.map((r) => (
            <div className="approval-item" key={r.id}>
              <span>{r.name}</span>
              <span className={'badge ' + (r.status === 'approved' ? 'completed' : 'pending')}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
