import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { EyeIcon, EyeOffIcon, AlertIcon } from '../components/icons.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})
  const [banner, setBanner] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}

    if (!name.trim()) nextErrors.name = 'Full name is required.'

    if (!email.trim()) nextErrors.email = 'Email is required.'
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = 'Enter a valid email address.'

    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 6) nextErrors.password = 'Use at least 6 characters.'

    if (!confirm) nextErrors.confirm = 'Please confirm your password.'
    else if (confirm !== password) nextErrors.confirm = 'Passwords do not match.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const result = register(name.trim(), email.trim(), password)
    if (!result.ok) {
      setBanner({ type: 'error', message: result.error })
      return
    }

    navigate('/login', { replace: true, state: { registeredEmail: email.trim() } })
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
          <div className="auth-subline">Create an account to start managing interns today.</div>
        </div>

        <div className="auth-card">
          <div className="auth-eyebrow">Get started</div>
          <h1>Create your account</h1>
          <p className="lede">Register to manage interns, attendance, and tasks.</p>

          {banner && (
            <div className={`banner ${banner.type}`}>
              <AlertIcon />
              <div>{banner.message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="regName">Full name</label>
              <input
                id="regName"
                type="text"
                placeholder="Jordan Alvarez"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? 'err' : ''}
              />
              <div className="field-error">{errors.name}</div>
            </div>

            <div className="field">
              <label htmlFor="regEmail">Email</label>
              <input
                id="regEmail"
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
              <label htmlFor="regPassword">Password</label>
              <div className="field-input-wrap">
                <input
                  id="regPassword"
                  type={showPw ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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

            <div className="field">
              <label htmlFor="regConfirm">Confirm password</label>
              <div className="field-input-wrap">
                <input
                  id="regConfirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={errors.confirm ? 'err' : ''}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="field-error">{errors.confirm}</div>
            </div>

            <button type="submit" className="btn-primary">
              Create account
            </button>
          </form>

          <div className="auth-foot">
            Already have an account? <Link to="/login" className="link-muted">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
