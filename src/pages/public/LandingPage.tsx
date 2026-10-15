import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PositionsGrid } from '../../components/positions/PositionsGrid'
import { Field } from '../../components/ui/Field'
import { useAuth } from '../../lib/auth'
import { startApply } from '../../lib/positions'


export function LandingPage() {
  const { user, ready, enterAsAdmin } = useAuth()
  const navigate = useNavigate()
  const [adminPanel, setAdminPanel] = useState(false)
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')

  // Already logged in: go straight to the dashboard, never show the main page again.
  if (ready && user) return <Navigate to="/dashboard" replace />

  const goAdmin = (e: FormEvent) => {
    e.preventDefault()
    if (enterAsAdmin(pass)) navigate('/dashboard', { replace: true })
    else setErr('Incorrect admin passcode.')
  }
  return (
    <div className="land">
      <header className="land-nav">
        <div className="brand-mark">
          <span className="brand-badge">🎓</span>
          <div><div className="brand-name" style={{ color: '#eaf0ff' }}>InternSys</div><div className="brand-sub">Internship Program</div></div>
        </div>
        <div className="land-actions">
          <Link to="/account" className="land-link">Login / Register</Link>
          <button type="button" className="land-link solid" onClick={() => { setAdminPanel(true); setErr('') }}>Admin</button>
        </div>
      </header>
      <section className="land-hero">
        <h1>Start your career with an <span>internship</span></h1>
        <p>Browse internships, view the details, apply, and track your application, all in one place.</p>
        <a href="#positions" className="land-link solid">Browse internships</a>
      </section>
      {adminPanel && (
        <section className="land-section" id="entry">
          <form className="panel stack-gap" style={{ maxWidth: 420, margin: '0 auto' }} onSubmit={goAdmin}>
            <div className="panel-head"><h3>Admin access</h3></div>
            <Field id="en-pass" label="Admin passcode" req><input id="en-pass" type="password" autoFocus value={pass} onChange={(e) => { setPass(e.target.value); setErr('') }} /></Field>
            {err && <div className="field-error">{err}</div>}
            <button type="submit" className="btn-primary inline-btn">Continue</button>
          </form>
        </section>
      )}
      <section className="land-section" id="positions">
        <h2>Available internships</h2>
        <p>Choose a role, view its details and apply. You will be asked to log in or register when you apply.</p>
        <div className="field" style={{ maxWidth: 420, marginBottom: 16 }}>
          <input type="text" placeholder="Search by title, company or location…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search internships" />
        </div>
        <PositionsGrid query={q} onApply={(p) => startApply(p, user, navigate)} />
      </section>
      <footer className="land-foot">© {new Date().getFullYear()} Intern Management System</footer>
    </div>
  )
}
