import { useState } from 'react'
import { Page } from '../../components/ui/Page'


export interface Project { id: number; name: string; lead: string; progress: number; status: string; due: string }


export function Projects() {
  const DATA: Project[] = [
    { id: 1, name: 'Website Redesign', lead: 'Anita S.', progress: 72, status: 'In Progress', due: 'Nov 02' },
    { id: 2, name: 'Mobile App MVP', lead: 'Rohan K.', progress: 35, status: 'In Progress', due: 'Dec 15' },
    { id: 3, name: 'Onboarding Portal', lead: 'Priya M.', progress: 100, status: 'Completed', due: 'Sep 20' },
    { id: 4, name: 'Data Migration', lead: 'Sam T.', progress: 18, status: 'Pending', due: 'Dec 01' },
  ]
  const BADGE: Record<string, string> = { 'In Progress': 'progress', Completed: 'completed', Pending: 'pending' }
  const [f, setF] = useState('All')
  const list = DATA.filter((p) => f === 'All' || p.status === f)
  return (
    <Page>
      <div className="chip-row">
        {['All', 'In Progress', 'Completed', 'Pending'].map((s) => (
          <button key={s} className={'chip' + (f === s ? ' on' : '')} onClick={() => setF(s)}>{s}</button>
        ))}
      </div>
      <div className="card-grid">
        {list.map((p) => (
          <div className="panel" key={p.id}>
            <div className="panel-head"><h3>{p.name}</h3><span className={'badge ' + BADGE[p.status]}>{p.status}</span></div>
            <div className="muted">Lead: {p.lead} · Due {p.due}</div>
            <div className="progress"><div style={{ width: p.progress + '%' }} /></div>
            <div className="muted">{p.progress}% complete</div>
          </div>
        ))}
      </div>
    </Page>
  )
}
