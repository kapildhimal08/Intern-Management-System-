import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { EyeIcon, EyeOffIcon, AlertIcon, CheckIcon } from '../components/icons.jsx'

export default function Login() {
  const { login, rememberedEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const registeredEmail = location.state?.registeredEmail

  const [email, setEmail] = useState(registeredEmail || rememberedEmail || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(Boolean(rememberedEmail))
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState(
    registeredEmail ? { type: 'success', message: 'Account created! Log in with your new credentials.' } : null
  ) // { type: 'error' | 'success', message }
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMsg, setForgotMsg] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!email.trim()) nextErrors.email = 'Email is required.'
    if (!password) nextErrors.password = 'Password is required.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = login(email.trim(), password, remember)
    if (!result.ok) {
      setBanner({ type: 'error', message: result.error })
      return
    }
    navigate('/dashboard', { replace: true })
  }

  function openForgot() {
    setForgotEmail(email)
    setForgotMsg('')
    setShowForgot(true)
  }

  function sendForgot() {
    if (!forgotEmail.trim()) {
      setForgotMsg('error:Enter your email first.')
      return
    }
    setForgotMsg(`ok:If an account exists for ${forgotEmail}, a reset link has been sent.`)
    setTimeout(() => setShowForgot(false), 1600)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="auth-top-brand">
          <div className="brand-mark">
            <div className="brand-badge">IM</div>
            <div>
              <div className="brand-name">Intern Management System</div>
              <div className="brand-sub">Internship operations, in one place</div>
            </div>
          </div>
          <div className="auth-tagline">
            Find your <span>intern</span>
          </div>
          <div className="auth-subline">Log in to track interns, attendance, and tasks in one dashboard.</div>
        </div>

        <div className="auth-card">
          <div className="auth-eyebrow">Welcome back</div>
          <h1>Log in to your account</h1>
          <p className="lede">Enter your credentials to access the dashboard.</p>

          {banner && (
            <div className={`banner ${banner.type}`}>
              {banner.type === 'error' ? <AlertIcon /> : <CheckIcon />}
              <div>{banner.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="loginEmail">Email</label>
              <input
                id="loginEmail"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'err' : ''}
              />
              <div className="field-error">{errors.email}</div>
            </div>

            <div className="field">
              <label htmlFor="loginPassword">Password</label>
              <div className="field-input-wrap">
                <input
                  id="loginPassword"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'err' : ''}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPw((s) => !s)}
                >
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="field-error">{errors.password}</div>
            </div>

            <div className="row-between">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <a
                href="#forgot"
                className="link-muted"
                onClick={(e) => {
                  e.preventDefault()
                  openForgot()
                }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary">
              Log in
            </button>
          </form>

          <div className="auth-foot">
            Don&apos;t have an account? <Link to="/register" className="link-muted">Create one</Link>
          </div>
        </div>
      </div>

      {showForgot && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowForgot(false)}>
          <div className="modal-card">
            <h3>Reset your password</h3>
            <p>Enter the email on your account and we&apos;ll send a reset link. (Demo only &mdash; no email is actually sent.)</p>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="forgotEmail">Email</label>
              <input
                id="forgotEmail"
                type="email"
                placeholder="you@company.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>
            {forgotMsg && (
              <div style={{ fontSize: '12.5px', marginTop: 10, color: forgotMsg.startsWith('error:') ? 'var(--red)' : 'var(--teal)' }}>
                {forgotMsg.replace(/^(error:|ok:)/, '')}
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowForgot(false)}>
                Cancel
              </button>
              <button className="btn-primary" style={{ width: 'auto' }} onClick={sendForgot}>
                Send link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
