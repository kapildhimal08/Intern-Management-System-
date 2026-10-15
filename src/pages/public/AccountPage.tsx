import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PublicShell } from '../../components/layout/PublicShell'
import { Field } from '../../components/ui/Field'
import { useAuth, sha256, findAccount, checkLogin, destination } from '../../lib/auth'
import { ADMIN_EMAIL, NEXT_KEY, USERS_KEY, EMAIL_RE } from '../../lib/constants'
import { readList, writeList } from '../../lib/storage'
import type { UserAccount } from '../../types/index'


// Public page: Login or Register (shown when a visitor tries to apply)
export function AccountPage() {
  const { enterAsUser } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>(params.get('mode') === 'register' ? 'register' : 'login')
  const [f, setF] = useState({ name: '', email: '', phone: '', education: '', skills: '', password: '', confirm: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErr('') }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const email = f.email.trim().toLowerCase()
    if (!EMAIL_RE.test(email)) { setErr('Please enter a valid email.'); return }
    if (mode === 'login') {
      if (!f.password) { setErr('Please enter your password.'); return }
      setBusy(true)
      const res = await checkLogin(email, f.password)
      setBusy(false)
      if (!res.ok) { setErr(res.error); return }
      enterAsUser(res.name, email)
      const next = destination(false)
      sessionStorage.removeItem(NEXT_KEY)
      navigate(next, { replace: true })
      return
    }
    if (f.name.trim().length < 2) { setErr('Please enter your full name.'); return }
    if (email === ADMIN_EMAIL) { setErr('This email cannot be used.'); return }
    if (f.password.length < 6) { setErr('Password must be at least 6 characters.'); return }
    if (f.password !== f.confirm) { setErr('Passwords do not match.'); return }
    if (findAccount(email)) { setErr('An account with this email already exists. Please log in.'); return }
    setBusy(true)
    const hash = await sha256(f.password)
    writeList(USERS_KEY, [...readList<UserAccount>(USERS_KEY), {
      email, name: f.name.trim(), hash, phone: f.phone.trim(), education: f.education.trim(), skills: f.skills.trim(), createdAt: Date.now(),
    }])
    setBusy(false)
    enterAsUser(f.name.trim(), email)
    navigate('/dashboard/profile', { replace: true }) // complete profile next
  }

  return (
    <PublicShell title={mode === 'login' ? 'Log in' : 'Create your account'} back="/">
      <form className="panel stack-gap" style={{ maxWidth: 520 }} onSubmit={submit} noValidate>
        <div className="chip-row nomargin">
          <button type="button" className={'chip' + (mode === 'login' ? ' on' : '')} onClick={() => { setMode('login'); setErr('') }}>Login</button>
          <button type="button" className={'chip' + (mode === 'register' ? ' on' : '')} onClick={() => { setMode('register'); setErr('') }}>Register</button>
        </div>
        {mode === 'register' && <Field id="ac-name" label="Full name" req><input id="ac-name" value={f.name} onChange={set('name')} autoComplete="name" /></Field>}
        <Field id="ac-email" label="Email" req><input id="ac-email" type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field>
        {mode === 'register' && (
          <>
            <Field id="ac-phone" label="Phone"><input id="ac-phone" type="tel" value={f.phone} onChange={set('phone')} /></Field>
            <Field id="ac-edu" label="Education"><input id="ac-edu" value={f.education} onChange={set('education')} placeholder="e.g. BSc CSIT" /></Field>
            <Field id="ac-skills" label="Skills"><input id="ac-skills" value={f.skills} onChange={set('skills')} placeholder="e.g. React, JavaScript, CSS" /></Field>
          </>
        )}
        <Field id="ac-pw" label="Password" req><input id="ac-pw" type="password" value={f.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></Field>
        {mode === 'register' && <Field id="ac-pw2" label="Confirm password" req><input id="ac-pw2" type="password" value={f.confirm} onChange={set('confirm')} autoComplete="new-password" /></Field>}
        {err && <div className="field-error" role="alert">{err}</div>}
        <button type="submit" className="btn-primary inline-btn" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
    </PublicShell>
  )
}
