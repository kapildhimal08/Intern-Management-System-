import { useState } from 'react'
import { Page } from '../../components/ui/Page'


export interface Client { id: number; name: string; contact: string; email: string; projects: number }


export function Clients() {
  const DATA: Client[] = [
    { id: 1, name: 'Acme Corp', contact: 'Jane Doe', email: 'jane@acme.com', projects: 3 },
    { id: 2, name: 'Globex', contact: 'Hank Scorpio', email: 'hank@globex.com', projects: 1 },
    { id: 3, name: 'Initech', contact: 'Bill Lumbergh', email: 'bill@initech.com', projects: 2 },
  ]
  const [q, setQ] = useState('')
  const list = DATA.filter((c) => (c.name + c.contact).toLowerCase().includes(q.toLowerCase()))
  return (
    <Page>
      <div className="panel">
        <div className="panel-head"><h3>All clients</h3>
          <div className="field inline-field"><input type="text" placeholder="Search clients…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Client</th><th>Contact</th><th>Email</th><th>Projects</th></tr></thead>
          <tbody>{list.map((c) => (
            <tr key={c.id}><td><div className="cell-intern"><span className="mini-avatar">{c.name[0]}</span>{c.name}</div></td><td>{c.contact}</td><td>{c.email}</td><td>{c.projects}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
    </Page>
  )
}
