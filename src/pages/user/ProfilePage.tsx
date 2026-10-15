import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Field } from '../../components/ui/Field'
import { Page } from '../../components/ui/Page'
import { useAuth, findAccount } from '../../lib/auth'
import { NEXT_KEY, USERS_KEY } from '../../lib/constants'
import { readList, writeList } from '../../lib/storage'
import type { UserAccount } from '../../types/index'


// User: complete / edit the internship profile (used to pre-fill applications)
export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const email = (user?.email || '').toLowerCase()
  const acc = findAccount(email)
  const [f, setF] = useState({
    name: acc?.name || user?.name || '', phone: acc?.phone || '', education: acc?.education || '',
    college: acc?.college || '', skills: acc?.skills || '', experience: acc?.experience || '',
  })
  const [saved, setSaved] = useState(false)
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); setSaved(false) }
  const next = () => {
    const n = sessionStorage.getItem(NEXT_KEY)
    if (n && n.startsWith('/dashboard/apply')) { sessionStorage.removeItem(NEXT_KEY); navigate(n) } else navigate('/dashboard')
  }
  const save = (e: FormEvent) => {
    e.preventDefault()
    writeList(USERS_KEY, readList<UserAccount>(USERS_KEY).map((a) => (a.email === email ? { ...a, ...f, name: f.name.trim() || a.name } : a)))
    setSaved(true)
  }
  return (
    <Page>
      <form className="panel stack-gap" onSubmit={save} noValidate style={{ maxWidth: 680 }}>
        <div className="panel-head"><h3>My profile</h3></div>
        <p className="muted">Complete your profile once. It is used to pre-fill your internship applications.</p>
        <div className="form-grid">
          <Field id="pf-name" label="Full name"><input id="pf-name" value={f.name} onChange={set('name')} /></Field>
          <Field id="pf-email" label="Email"><input id="pf-email" value={user?.email || ''} readOnly /></Field>
          <Field id="pf-phone" label="Phone"><input id="pf-phone" type="tel" value={f.phone} onChange={set('phone')} /></Field>
          <Field id="pf-edu" label="Education"><input id="pf-edu" value={f.education} onChange={set('education')} placeholder="e.g. BSc CSIT" /></Field>
          <Field id="pf-college" label="College / University"><input id="pf-college" value={f.college} onChange={set('college')} /></Field>
          <Field id="pf-skills" label="Skills"><input id="pf-skills" value={f.skills} onChange={set('skills')} /></Field>
        </div>
        <Field id="pf-exp" label="Experience"><textarea id="pf-exp" rows={3} value={f.experience} onChange={set('experience')} /></Field>
        {saved && <div className="muted" role="status">Profile saved.</div>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="submit" className="btn-primary inline-btn">Save profile</button>
          <button type="button" className="btn-secondary inline-btn" onClick={next}>{sessionStorage.getItem(NEXT_KEY) ? 'Continue to application' : 'Go to dashboard'}</button>
        </div>
      </form>
    </Page>
  )
}
