import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth, isAdmin, createLoginRequest, clearGate, tryLogin, destination } from '../../lib/auth'
import { ADMIN_EMAIL, GATE_REQ, REQUIRE_LOGIN_APPROVAL } from '../../lib/constants'
import type { Role } from '../../types/index'


/* ---------------------------------------------------------------------
   3. LOGIN (User / Admin tabs) + WAITING-FOR-APPROVAL SCREEN
   --------------------------------------------------------------------- */
export const TABS: [Role, string][] = [['user', 'User Login'], ['admin', 'Admin Login']]


export function RoleTabs({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  return (
    <div className="role-tabs" role="tablist" aria-label="Login type">
      {TABS.map(([k, label]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k}
          className={'role-tab' + (value === k ? ' on' : '')} onClick={() => onChange(k)}>{label}</button>
      ))}
    </div>
  )
}


export function LoginPage() {
  const { user, ready, login, logout } = useAuth()
  const navigate = useNavigate()
  const [role, setRole] = useState<Role>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const attempt = useRef<Role | null>(null) // role chosen when the form was submitted

  // Already signed in (e.g. page refresh): go on to the dashboard (the guard handles approval).
  useEffect(() => {
    if (ready && user && !attempt.current) navigate('/dashboard', { replace: true })
    // eslint-disable-next-line
  }, [ready])

  // A login just succeeded: enforce the chosen tab, then route.
  useEffect(() => {
    if (!attempt.current || !user) return
    const wanted = attempt.current
    attempt.current = null
    const admin = isAdmin(user)
    if (wanted === 'admin' && !admin) {
      logout(); setBusy(false); setError('This account does not have admin access.'); return
    }
    if (wanted === 'user' && admin) {
      logout(); setBusy(false); setError('Admin accounts must sign in from the Admin Login tab.'); return
    }
    clearGate()
    if (admin || !REQUIRE_LOGIN_APPROVAL) { navigate(destination(admin), { replace: true }); return }
    const req = createLoginRequest(user)
    sessionStorage.setItem(GATE_REQ, req.id)
    navigate('/login/waiting', { replace: true })
    // eslint-disable-next-line
  }, [user])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return }
    setBusy(true)
    attempt.current = role
    const res = await tryLogin(login, email.trim(), password, remember)
    if (!res.ok) { attempt.current = null; setBusy(false); setError(res.error); return }
    setTimeout(() => { // safety net if no session appears
      if (attempt.current) { attempt.current = null; setBusy(false); setError('Sign-in failed. Please try again.') }
    }, 4000)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-top-brand">
          <div className="brand-mark">
            <span className="brand-badge">🎓</span>
            <div><div className="brand-name" style={{ color: '#eaf0ff' }}>Intern Management</div><div className="brand-sub">System</div></div>
          </div>
        </div>
        <div className="auth-card">
          <h1>{role === 'admin' ? 'Admin sign in' : 'Welcome back'}</h1>
          <p className="lede">{role === 'admin' ? 'Sign in with your administrator account.' : 'Sign in to your intern account.'}</p>
          <RoleTabs value={role} onChange={(r) => { setRole(r); setError('') }} />
          {role === 'user' && <p className="role-note">New logins need admin approval before you can enter.</p>}
          {error && <div className="field-error login-error" role="alert">{error}</div>}
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="li-email">Email</label>
              <input id="li-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="li-pw">Password</label>
              <div className="field-input-wrap">
                <input id="li-pw" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="pw-toggle" onClick={() => setShow((s) => !s)}>{show ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="row-between">
              <label className="remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
            </div>
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Signing in…' : role === 'admin' ? 'Sign in as admin' : 'Sign in'}
            </button>
          </form>
          <div className="auth-foot"><Link to="/">← Back to home</Link></div>
          <div className="auth-foot">Don&apos;t have an account? <Link to="/register"><strong>Register</strong></Link></div>
          {role === 'admin' && <div className="hint-box">Demo admin — email: <b>{ADMIN_EMAIL}</b> · password: <b>Admin123</b></div>}
        </div>
      </div>
    </div>
  )
}
