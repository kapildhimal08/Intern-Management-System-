import { useNavigate, useParams } from 'react-router-dom'
import { PublicShell } from '../../components/layout/PublicShell'
import { useAuth, isAdmin } from '../../lib/auth'
import { POSITIONS_KEY } from '../../lib/constants'
import { splitLines, startApply } from '../../lib/positions'
import { useList } from '../../lib/storage'
import type { Position } from '../../types/index'


// Public page: full details of one internship, with an Apply Now button
export function InternshipDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const positions = useList<Position>(POSITIONS_KEY)
  const p = positions.find((x) => x.id === id)
  const back = user ? '/dashboard' : '/'
  if (!p) {
    return (
      <PublicShell title="Internship details" back={back}>
        <div className="panel"><p className="muted">This internship could not be found. It may have been removed.</p></div>
      </PublicShell>
    )
  }
  const skills = splitLines(p.requirements)
  const duties = String(p.responsibilities || '').split('\n').map((x) => x.trim()).filter(Boolean)
  const row = (label: string, value?: string) => value ? <div><span className="muted">{label}: </span><b>{value}</b></div> : null
  return (
    <PublicShell title={p.name} back={back}>
      <div className="panel stack-gap">
        <div className="panel-head">
          <h3>{p.icon} {p.name}</h3>
          <span className={'pos-badge ' + (p.open ? 'open' : 'shut')}>{p.open ? 'Available' : 'Not available'}</span>
        </div>
        {row('Company', p.company)}{row('Location', p.location)}{row('Duration', p.duration)}
        {row('Deadline', p.deadline ? new Date(p.deadline + 'T00:00').toLocaleDateString() : '')}
        {p.desc && <p>{p.desc}</p>}
        {skills.length > 0 && (<div><h4>Required skills</h4><ul>{skills.map((x) => <li key={x}>{x}</li>)}</ul></div>)}
        {duties.length > 0 && (<div><h4>Responsibilities</h4><ul>{duties.map((x) => <li key={x}>{x}</li>)}</ul></div>)}
        <div>
          <button type="button" className="btn-primary inline-btn" disabled={!p.open || isAdmin(user)} onClick={() => startApply(p, user, navigate)}>
            {p.open ? 'Apply Now' : 'Not available'}
          </button>
        </div>
      </div>
    </PublicShell>
  )
}
