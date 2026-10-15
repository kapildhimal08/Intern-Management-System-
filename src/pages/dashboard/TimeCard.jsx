import { useState } from 'react'

const t = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export default function TimeCard() {
  const [entries, setEntries] = useState([])
  const running = entries[0] && !entries[0].out
  const toggle = () =>
    running
      ? setEntries(entries.map((e, i) => (i === 0 ? { ...e, out: new Date() } : e)))
      : setEntries([{ id: Date.now(), in: new Date(), out: null }, ...entries])
  return (
    <div className="content">
      <div className="page-head"><h2>Time Card</h2><p>Clock in and out to log your working hours.</p></div>
      <div className="panel">
        <div className="panel-head">
          <div><h3>{running ? 'Clocked in' : 'Clocked out'}</h3><div className="muted">{new Date().toDateString()}</div></div>
          <button className="btn-primary inline-btn" onClick={toggle}>{running ? 'Clock out' : 'Clock in'}</button>
        </div>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>In</th><th>Out</th><th>Hours</th></tr></thead>
          <tbody>
            {entries.length === 0 && <tr><td colSpan="4" className="muted">No entries yet</td></tr>}
            {entries.map((e) => (
              <tr key={e.id}><td>{e.in.toLocaleDateString()}</td><td>{t(e.in)}</td><td>{e.out ? t(e.out) : '—'}</td>
                <td>{e.out ? ((e.out - e.in) / 36e5).toFixed(2) + ' h' : '—'}</td></tr>
            ))}
          </tbody>
        </table></div>
      </div>
    </div>
  )
}
