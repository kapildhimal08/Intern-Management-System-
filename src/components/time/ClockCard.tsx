import { useState } from 'react'
import { useAuth } from '../../lib/auth'

export function ClockCard() {
  const { user } = useAuth()
  const key = `ims_clock_${(user?.email || 'guest').toLowerCase()}`
  const [start, setStart] = useState<number | null>(() => {
    try { const v = localStorage.getItem(key); return v ? Number(v) : null } catch { return null }
  })
  const toggle = () => {
    const next = start ? null : Date.now()
    try { next ? localStorage.setItem(key, String(next)) : localStorage.removeItem(key) } catch { /* storage unavailable */ }
    setStart(next)
  }
  const at = start ? new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ''
  return (
    <div className="clock-card">
      <span className="clock-ico" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      </span>
      <div className="clock-body">
        <button type="button" className={start ? 'btn-secondary inline-btn' : 'btn-primary inline-btn'} onClick={toggle}>
          {start ? 'Clock Out' : 'Clock In'}
        </button>
        <div className="muted">{start ? `Clock started at : ${at}` : 'You are clocked out'}</div>
      </div>
    </div>
  )
}
