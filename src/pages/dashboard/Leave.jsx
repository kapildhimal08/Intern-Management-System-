import { useState } from 'react'

const EMPTY = { type: 'Casual', from: '', to: '', reason: '' }

export default function Leave() {
  const [rows, setRows] = useState([{ id: 1, type: 'Sick', from: '2026-09-10', to: '2026-09-11', status: 'completed', label: 'Approved' }])
  const [f, setF] = useState(EMPTY)
  const submit = (e) => {
    e.preventDefault()
    if (!f.from || !f.to) return
    setRows([{ id: Date.now(), ...f, status: 'pending', label: 'Pending' }, ...rows])
    setF(EMPTY)
  }
  return (
    <div className="content">
      <div className="page-head"><h2>Leave</h2><p>Apply for time off and follow your requests.</p></div>
      <div className="two-col">
        <form className="panel" onSubmit={submit}>
          <div className="panel-head"><h3>Apply for leave</h3></div>
          <div className="field"><label>Type</label>
            <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}><option>Casual</option><option>Sick</option><option>Annual</option></select></div>
          <div className="field"><label>From</label><input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></div>
          <div className="field"><label>To</label><input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></div>
          <div className="field"><label>Reason</label><textarea rows="3" value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div>
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
    </div>
  )
}
