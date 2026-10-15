import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Field } from '../ui/Field'
import { POSITIONS_KEY } from '../../lib/constants'
import { uid, readList, writeList } from '../../lib/storage'
import type { Position } from '../../types/index'


export function PositionForm({ editing, onDone }: { editing?: Position | null; onDone?: () => void }) {
  const [f, setF] = useState({
    name: editing?.name || '', company: editing?.company || '', location: editing?.location || '',
    duration: editing?.duration || '', deadline: editing?.deadline || '', requirements: editing?.requirements || '',
    responsibilities: editing?.responsibilities || '', desc: editing?.desc || '', icon: editing?.icon || '💼',
  })
  const [err, setErr] = useState('')
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); setErr('') }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = f.name.trim()
    if (!n) { setErr('Internship title is required.'); return }
    if (!f.company.trim()) { setErr('Company name is required.'); return }
    if (!f.duration.trim()) { setErr('Time duration is required.'); return }
    const list = readList<Position>(POSITIONS_KEY)
    if (list.some((p) => p.id !== editing?.id && p.name.toLowerCase() === n.toLowerCase())) { setErr('An internship with this title already exists. Use a different title.'); return }
    const data = {
      name: n, company: f.company.trim(), location: f.location.trim(), duration: f.duration.trim(), deadline: f.deadline,
      requirements: f.requirements.trim(), responsibilities: f.responsibilities.trim(), desc: f.desc.trim(), icon: f.icon.trim() || '💼',
    }
    if (editing) writeList(POSITIONS_KEY, list.map((p) => (p.id === editing.id ? { ...p, ...data } : p)))
    else writeList(POSITIONS_KEY, [...list, { id: uid(), ...data, open: true }])
    if (!editing) setF({ name: '', company: '', location: '', duration: '', deadline: '', requirements: '', responsibilities: '', desc: '', icon: '💼' })
    setErr(''); onDone?.()
  }
  return (
    <form className="panel stack-gap" onSubmit={submit} noValidate style={{ marginBottom: 20 }}>
      <div className="panel-head"><h3>{editing ? 'Edit internship' : 'Add an internship'}</h3></div>
      <div className="form-grid">
        <Field id="pos-name" label="Internship title" req><input id="pos-name" type="text" value={f.name} onChange={set('name')} placeholder="e.g. Frontend Developer Intern" /></Field>
        <Field id="pos-company" label="Company" req><input id="pos-company" type="text" value={f.company} onChange={set('company')} placeholder="e.g. ABC Technologies" /></Field>
        <Field id="pos-location" label="Location"><input id="pos-location" type="text" value={f.location} onChange={set('location')} placeholder="e.g. Kathmandu" /></Field>
        <Field id="pos-duration" label="Time duration" req><input id="pos-duration" type="text" value={f.duration} onChange={set('duration')} placeholder="e.g. 3 months" /></Field>
        <Field id="pos-deadline" label="Application deadline"><input id="pos-deadline" type="date" value={f.deadline} onChange={set('deadline')} /></Field>
        <Field id="pos-icon" label="Icon (emoji)"><input id="pos-icon" type="text" value={f.icon} onChange={set('icon')} maxLength={4} /></Field>
      </div>
      <Field id="pos-req" label="Required skills (comma or new line separated)"><textarea id="pos-req" rows={2} value={f.requirements} onChange={set('requirements')} placeholder="HTML, CSS, JavaScript, React" /></Field>
      <Field id="pos-resp" label="Responsibilities (one per line)"><textarea id="pos-resp" rows={3} value={f.responsibilities} onChange={set('responsibilities')} placeholder={'Develop frontend components\nFix UI bugs'} /></Field>
      <Field id="pos-desc" label="Short description"><input id="pos-desc" type="text" value={f.desc} onChange={set('desc')} placeholder="One line shown on the card" /></Field>
      {err && <div className="field-error">{err}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn-primary inline-btn">{editing ? 'Save changes' : 'Add internship'}</button>
        {editing && <button type="button" className="btn-secondary inline-btn" onClick={onDone}>Cancel</button>}
      </div>
    </form>
  )
}
