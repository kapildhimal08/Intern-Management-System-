import { useEffect, useState } from 'react'
import './DashboardStats.css'

const hhmm = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

const hms = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  const p = (n) => String(n).padStart(2, '0')
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
}

export function ClockCard({ userKey = 'user' }) {
  const storageKey = `ims_clock_${String(userKey).toLowerCase()}`
  const [start, setStart] = useState(() => {
    try {
      const v = localStorage.getItem(storageKey)
      return v ? Number(v) : null
    } catch {
      return null
    }
  })
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!start) return undefined
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [start])

  const toggle = () => {
    const next = start ? null : Date.now()
    try {
      if (next) localStorage.setItem(storageKey, String(next))
      else localStorage.removeItem(storageKey)
    } catch { /* storage unavailable */ }
    setStart(next)
    setNow(Date.now())
  }

  return (
    <div className="ds-card">
      <span className="ds-icon ds-cyan" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
        </svg>
      </span>
      <div className="ds-clock-body">
                <button type="button" className="ds-clock-btn" onClick={toggle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={start ? 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' : 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M3 12h12'} />
          </svg>
          {start ? 'Clock Out' : 'Clock In'}
        </button>
        <div className="ds-clock-text">
          {start ? (
            <>
              <div>Clock started at : {hhmm(start)}</div>
              <div className="ds-timer">{hms(now - start)}</div>
            </>
          ) : (
            <div>You are clocked out</div>
          )}
        </div>
      </div>
    </div>
  )
}

function NumberCard({ value, label, color, children }) {
  return (
    <div className="ds-card">
      <span className={'ds-icon ' + color} aria-hidden="true">{children}</span>
      <div className="ds-num">
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  )
}

export default function DashboardStats({ userKey = 'user', openTasks = 0, eventsToday = 0, newPosts = 0 }) {
  const svg = { width: 30, height: 30, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <div className="ds-row">
      <ClockCard userKey={userKey} />
      <NumberCard value={openTasks} label="My open tasks" color="ds-cyan">
        <svg {...svg}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
      </NumberCard>
      <NumberCard value={eventsToday} label="Events today" color="ds-indigo">
        <svg {...svg}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
      </NumberCard>
      <NumberCard value={newPosts} label="New posts" color="ds-blue">
        <svg {...svg}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
      </NumberCard>
    </div>
  )
}