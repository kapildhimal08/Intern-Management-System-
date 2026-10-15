import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Field } from '../../components/ui/Field'
import { Page } from '../../components/ui/Page'
import { parseCsv } from '../../lib/applications'
import { INTERNS_KEY, POSITIONS_KEY, EMAIL_RE } from '../../lib/constants'
import { uid, readList, writeList, useList } from '../../lib/storage'
import type { Position, InternRecord } from '../../types/index'


export const readFile = (f: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsText(f)
  })


export function UploadInterns() {
  const interns = useList<InternRecord>(INTERNS_KEY)
  const positions = useList<Position>(POSITIONS_KEY)
  const EMPTY = { name: '', email: '', phone: '', college: '', degree: '', position: '' }
  const [f, setF] = useState(EMPTY)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')

  const add = (e: FormEvent) => {
    e.preventDefault()
    setMsg('')
    const all = readList<InternRecord>(INTERNS_KEY)
    if (f.name.trim().length < 2) return setErr('Enter the intern\u2019s name.')
    if (!EMAIL_RE.test(f.email.trim())) return setErr('Enter a valid email address.')
    if (all.some((i) => i.email.toLowerCase() === f.email.trim().toLowerCase())) return setErr('An intern with this email already exists.')
    writeList(INTERNS_KEY, [{ id: uid(), ...f, name: f.name.trim(), email: f.email.trim(), source: 'manual', createdAt: Date.now() } as InternRecord, ...all])
    setF(EMPTY); setErr(''); setMsg('Intern added.')
  }

  const importCsv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setErr(''); setMsg('')
    const rows = parseCsv(await readFile(file))
    if (rows.length < 2) return setErr('The file has no data rows.')
    const head = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z]/g, ''))
    const col = (names: string[]) => head.findIndex((h) => names.includes(h))
    const c = {
      name: col(['name', 'fullname']), email: col(['email', 'emailaddress']), phone: col(['phone', 'phonenumber']),
      college: col(['college', 'university', 'collegeuniversity']), degree: col(['degree', 'program', 'degreeprogram']),
      position: col(['position', 'role', 'internshipposition']),
    }
    if (c.name < 0 || c.email < 0) return setErr('The CSV needs at least "name" and "email" columns.')
    const all = readList<InternRecord>(INTERNS_KEY)
    const seen = new Set(all.map((i) => i.email.toLowerCase()))
    const added: InternRecord[] = []
    let skipped = 0
    const cell = (r: string[], i: number) => (i >= 0 ? (r[i] || '').trim() : '')
    for (const r of rows.slice(1)) {
      const email = cell(r, c.email)
      const name = cell(r, c.name)
      if (name.length < 2 || !EMAIL_RE.test(email) || seen.has(email.toLowerCase())) { skipped++; continue }
      seen.add(email.toLowerCase())
      added.push({
        id: uid(), name, email, phone: cell(r, c.phone), college: cell(r, c.college), degree: cell(r, c.degree),
        position: cell(r, c.position), source: 'csv', createdAt: Date.now(),
      })
    }
    if (added.length) writeList(INTERNS_KEY, [...added, ...all])
    setMsg(`Imported ${added.length} intern${added.length === 1 ? '' : 's'}${skipped ? `, skipped ${skipped} (invalid or duplicate)` : ''}.`)
  }

  const template = () => {
    const csv = 'name,email,phone,college,degree,position\nJane Doe,jane@example.com,9800000000,ABC College,BSc CSIT,Web Developer Intern\n'
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'interns-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }
  const list = interns.filter((i) => (i.name + i.email + i.position).toLowerCase().includes(q.toLowerCase()))
  const setField = (k: keyof typeof EMPTY) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value })

  return (
    <Page>
      <div className="two-col stack-gap">
        <form className="panel" onSubmit={add} noValidate>
          <div className="panel-head"><h3>Add an intern</h3></div>
          <Field id="ui-name" label="Full name" req><input id="ui-name" type="text" value={f.name} onChange={setField('name')} /></Field>
          <Field id="ui-email" label="Email" req><input id="ui-email" type="email" value={f.email} onChange={setField('email')} /></Field>
          <Field id="ui-phone" label="Phone"><input id="ui-phone" type="tel" value={f.phone} onChange={setField('phone')} /></Field>
          <Field id="ui-college" label="College/University"><input id="ui-college" type="text" value={f.college} onChange={setField('college')} /></Field>
          <Field id="ui-degree" label="Degree/Program"><input id="ui-degree" type="text" value={f.degree} onChange={setField('degree')} /></Field>
          <Field id="ui-pos" label="Position">
            <select id="ui-pos" value={f.position} onChange={setField('position')}>
              <option value="">Select…</option>
              {positions.map((p) => <option key={p.id}>{p.name}</option>)}
            </select>
          </Field>
          <button type="submit" className="btn-primary">Add intern</button>
        </form>
        <div className="panel">
          <div className="panel-head"><h3>Upload from CSV</h3></div>
          <div className="upload-zone">
            <p className="muted">Upload a .csv file with the columns: name, email, phone, college, degree, position. Only name and email are required.</p>
            <input type="file" accept=".csv,text/csv" aria-label="Upload CSV file" onChange={importCsv} />
            <button type="button" className="btn-secondary inline-btn" onClick={template}>Download CSV template</button>
          </div>
          {err && <div className="field-error login-error" role="alert">{err}</div>}
          {msg && <div className="notice" role="status">{msg}</div>}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>Intern records ({interns.length})</h3>
          <div className="field inline-field"><input type="text" placeholder="Search interns…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
        {list.length === 0 ? <p className="muted">No intern records yet.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Intern</th><th>Position</th><th>College / Degree</th><th>Source</th><th /></tr></thead>
            <tbody>{list.map((i) => (
              <tr key={i.id}>
                <td><div className="cell-intern"><span className="mini-avatar">{i.name[0]}</span><div>{i.name}<div className="muted">{i.email}</div></div></div></td>
                <td>{i.position || '—'}</td><td>{[i.college, i.degree].filter(Boolean).join(' · ') || '—'}</td>
                <td><span className={'badge ' + (i.source === 'application' ? 'completed' : 'progress')}>{i.source}</span></td>
                <td><button type="button" className="btn-sm no" onClick={() => writeList(INTERNS_KEY, readList<InternRecord>(INTERNS_KEY).filter((x) => x.id !== i.id))}>Remove</button></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </Page>
  )
}
