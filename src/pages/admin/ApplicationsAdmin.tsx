import { Fragment, useState } from 'react'
import { Page } from '../../components/ui/Page'
import { decideApplication, STATUS_BADGE } from '../../lib/applications'
import { APPS_KEY } from '../../lib/constants'
import { useList } from '../../lib/storage'
import type { ApplicationStatus, Application } from '../../types/index'


/* ---------------------------------------------------------------------
   7. ADMIN VIEW: review applications, upload intern details
   --------------------------------------------------------------------- */
export const DETAIL_FIELDS: [keyof Application, string][] = [
  ['dob', 'Date of birth'], ['gender', 'Gender'], ['phone', 'Phone'], ['email', 'Email'],
  ['address', 'Address'], ['city', 'City'], ['country', 'Country'],
  ['faculty', 'Faculty / Department'], ['semester', 'Semester / Year'],
]


export function ApplicationsAdmin() {
  const apps = useList<Application>(APPS_KEY)
  const [filter, setFilter] = useState<'All' | ApplicationStatus>('All')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const count = (s: ApplicationStatus) => apps.filter((a) => a.status === s).length
  const list = apps.filter((a) =>
    (filter === 'All' || a.status === filter) && (a.fullName + a.email + a.position).toLowerCase().includes(q.toLowerCase()))
  return (
    <Page>
      <div className="mini-stats">
        <div className="mini-stat"><b>{apps.length}</b><span>Total applications</span></div>
        <div className="mini-stat"><b>{count('Pending')}</b><span>Pending</span></div>
        <div className="mini-stat"><b>{count('Approved')}</b><span>Approved</span></div>
        <div className="mini-stat"><b>{count('Rejected')}</b><span>Rejected</span></div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div className="chip-row nomargin">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
              <button key={s} type="button" className={'chip' + (filter === s ? ' on' : '')} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
          <div className="field inline-field"><input type="text" placeholder="Search applicants…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        {list.length === 0 ? <p className="muted">No applications to show.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Applicant</th><th>Position</th><th>College</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((a) => (
                <Fragment key={a.id}>
                  <tr>
                    <td><div className="cell-intern"><span className="mini-avatar">{a.fullName[0]}</span><div>{a.fullName}<div className="muted">{a.email}</div></div></div></td>
                    <td>{a.position}</td><td>{a.college}</td><td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td><span className={'badge ' + STATUS_BADGE[a.status]}>{a.status}</span></td>
                    <td><div className="row-actions">
                      <button type="button" className="btn-sm ghost" onClick={() => setOpen(open === a.id ? null : a.id)}>{open === a.id ? 'Hide' : 'View'}</button>
                      {a.status === 'Pending' ? (
                        <>
                          <button type="button" className="btn-sm ok" onClick={() => decideApplication(a.id, 'Approved')}>Approve</button>
                          <button type="button" className="btn-sm no" onClick={() => decideApplication(a.id, 'Rejected')}>Reject</button>
                        </>
                      ) : (
                        <button type="button" className="btn-sm ghost" onClick={() => decideApplication(a.id, 'Pending')}>Reopen</button>
                      )}
                    </div></td>
                  </tr>
                  {open === a.id && (
                    <tr><td colSpan={6}><div className="detail-grid">
                      {DETAIL_FIELDS.map(([k, label]) => (<div key={k}><span>{label}</span>{String(a[k] || '—')}</div>))}
                    </div></td></tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </Page>
  )
}
