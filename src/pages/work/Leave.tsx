import { useState } from 'react'
import type { FormEvent } from 'react'
import { Page } from '../../components/ui/Page'


export interface LeaveRow { id: number; type: string; from: string; to: string; reason?: string; status: string; label: string }


export function Leave() {
  const EMPTY = { type: 'Casual', from: '', to: '', reason: '' }
  const [rows, setRows] = useState<LeaveRow[]>([{ id: 1, type: 'Sick', from: '2026-09-10', to: '2026-09-11', status: 'completed', label: 'Approved' }])
  const [f, setF] = useState(EMPTY)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!f.from || !f.to) return
    setRows([{ id: Date.now(), ...f, status: 'pending', label: 'Pending' }, ...rows])
    setF(EMPTY)
  }
  return (
    <Page>
      <div className="two-col">
        <form className="panel" onSubmit={submit}>
          <div className="panel-head"><h3>Apply for leave</h3></div>
          <div className="field"><label>Type</label>
            <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option>Casual</option><option>Sick</option><option>Annual</option></select></div>
          <div className="field"><label>From</label><input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div>
          <div className="field"><label>To</label><input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
          <div className="field"><label>Reason</label><textarea rows={3} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div>
          <button className="btn-primary" type="submit">Submit request</button>
        </form>
        <div className="panel">
          <div className="panel-head"><h3>My requests</h3></div>
          <div className="table-wrap"><table>
            <thead><tr><th>Type</th><th>From</th><th>To</th><th>Status</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.id}><td>{r.type}</td><td>{r.from}</td><td>{r.to}</td><td><span className={'badge ' + r.status}>{r.label}</span></td></tr>
            ))}</tbody>
          </table></div>
        </div>
      </div>
    </Page>
  )
}
