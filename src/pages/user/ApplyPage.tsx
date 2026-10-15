import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Field } from '../../components/ui/Field'
import { Page } from '../../components/ui/Page'
import { EMPTY_FORM, validateForm } from '../../lib/applications'
import { useAuth, findAccount } from '../../lib/auth'
import { APPS_KEY, GENDERS } from '../../lib/constants'
import { usePositionAvailability } from '../../lib/positions'
import { slug, uid, readList, writeList } from '../../lib/storage'
import type { ApplicationForm, Application, FormErrors } from '../../types/index'


export function ApplyPage() {
  const { user } = useAuth()
  const { isOpen, positions } = usePositionAvailability()
  const [params] = useSearchParams()
  const initialPos = positions.find((p) => slug(p.name) === params.get('role'))?.name ?? ''
  const initial = initialPos && isOpen(initialPos) ? initialPos : ''
  const profile = findAccount(user?.email)
  const [form, setForm] = useState<ApplicationForm>({
    ...EMPTY_FORM, fullName: user?.name || '', email: user?.email || '', position: initial,
    phone: profile?.phone || '', college: profile?.college || '', degree: profile?.education || '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [done, setDone] = useState<Application | null>(null)
  const userEmail = (user?.email || '').toLowerCase()
  const set = (k: keyof ApplicationForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = (ev: FormEvent) => {
    ev.preventDefault()
    const errs = validateForm(form)
    const all = readList<Application>(APPS_KEY)
    if (!errs.position && form.position &&
      all.some((a) => a.userEmail === userEmail && a.position === form.position && a.status === 'Pending'))
      errs.position = 'You already have a pending application for this position.'
    if (form.position && !isOpen(form.position)) errs.position = 'This position is currently not available.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('.has-error input, .has-error select')?.focus(), 0)
      return
    }
    const app: Application = {
      ...form, fullName: form.fullName.trim(), email: form.email.trim(),
      id: uid(), userEmail, status: 'Pending', createdAt: Date.now(),
    }
    writeList(APPS_KEY, [app, ...all])
    setDone(app)
  }

  if (done)
    return (
      <Page>
        <div className="panel success-box">
          <div className="success-tick">✓</div>
          <h3>Application submitted</h3>
          <p className="muted">Thanks, {done.fullName}. Your application for <b>{done.position}</b> is now pending. The admin will approve or reject it, and you can follow the status under My Applications.</p>
          <div className="form-actions">
            <Link to="/dashboard/my-applications" className="btn-primary inline-btn link-btn">View my applications</Link>
            <button type="button" className="btn-secondary inline-btn" onClick={() => { setDone(null); setForm({ ...EMPTY_FORM, fullName: user?.name || '', email: user?.email || '', phone: profile?.phone || '', college: profile?.college || '', degree: profile?.education || '' }) }}>Apply for another</button>
          </div>
        </div>
      </Page>
    )

  return (
    <Page>
      <form onSubmit={submit} noValidate>
        <div className="panel stack-gap">
          <div className="panel-head"><h3>1. Personal Information</h3></div>
          <div className="form-grid">
            <Field id="ap-name" label="Full Name" req error={errors.fullName}><input id="ap-name" type="text" value={form.fullName} onChange={set('fullName')} /></Field>
            <Field id="ap-dob" label="Date of Birth" error={errors.dob}><input id="ap-dob" type="date" value={form.dob} onChange={set('dob')} /></Field>
            <Field id="ap-gender" label="Gender">
              <select id="ap-gender" value={form.gender} onChange={set('gender')}>
                <option value="">Select…</option>
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field id="ap-phone" label="Phone Number" req error={errors.phone}><input id="ap-phone" type="tel" value={form.phone} onChange={set('phone')} /></Field>
            <Field id="ap-email" label="Email Address" req error={errors.email}><input id="ap-email" type="email" value={form.email} onChange={set('email')} /></Field>
            <Field id="ap-address" label="Address"><input id="ap-address" type="text" value={form.address} onChange={set('address')} /></Field>
            <Field id="ap-city" label="City"><input id="ap-city" type="text" value={form.city} onChange={set('city')} /></Field>
            <Field id="ap-country" label="Country"><input id="ap-country" type="text" value={form.country} onChange={set('country')} /></Field>
          </div>
        </div>

        <div className="panel stack-gap">
          <div className="panel-head"><h3>2. Academic Information</h3></div>
          <div className="form-grid">
            <Field id="ap-college" label="College/University" req error={errors.college}><input id="ap-college" type="text" value={form.college} onChange={set('college')} /></Field>
            <Field id="ap-degree" label="Degree/Program" req error={errors.degree}><input id="ap-degree" type="text" value={form.degree} onChange={set('degree')} /></Field>
            <Field id="ap-faculty" label="Faculty/Department"><input id="ap-faculty" type="text" value={form.faculty} onChange={set('faculty')} /></Field>
            <Field id="ap-sem" label="Current Semester/Year"><input id="ap-sem" type="text" value={form.semester} onChange={set('semester')} placeholder="e.g. 6th semester" /></Field>
          </div>
        </div>

        <div className="panel stack-gap">
          <div className="panel-head"><h3>3. Internship Position</h3></div>
          <Field id="ap-position" label="Position you are applying for" req error={errors.position}>
            <select id="ap-position" value={form.position} onChange={set('position')}>
              <option value="">Choose a position…</option>
              {positions.filter((p) => p.open).map((p) => <option key={p.name}>{p.name}</option>)}
            </select>
          </Field>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary inline-btn">Submit application</button>
        </div>
      </form>
    </Page>
  )
}
