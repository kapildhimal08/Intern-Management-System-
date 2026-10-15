import { Link } from 'react-router-dom'
import { Page } from '../../components/ui/Page'
import { STATUS_BADGE } from '../../lib/applications'
import { useAuth } from '../../lib/auth'
import { APPS_KEY } from '../../lib/constants'
import { useList } from '../../lib/storage'
import type { Application } from '../../types/index'


export function MyApplications() {
  const { user } = useAuth()
  const email = (user?.email || '').toLowerCase()
  const mine = useList<Application>(APPS_KEY).filter((a) => a.userEmail === email)
  return (
    <Page>
      <div className="panel">
        <div className="panel-head"><h3>My applications</h3><Link to="/dashboard/apply" className="btn-primary inline-btn link-btn">New application</Link></div>
        {mine.length === 0 ? (
          <p className="muted">You haven&apos;t applied yet. Pick a position from the Internships page to get started.</p>
        ) : (
          <div className="table-wrap"><table>
            <thead><tr><th>Position</th><th>College</th><th>Applied on</th><th>Status</th></tr></thead>
            <tbody>{mine.map((a) => (
              <tr key={a.id}><td>{a.position}</td><td>{a.college}</td><td>{new Date(a.createdAt).toLocaleDateString()}</td>
                <td><span className={'badge ' + STATUS_BADGE[a.status]}>{a.status}</span></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </Page>
  )
}
