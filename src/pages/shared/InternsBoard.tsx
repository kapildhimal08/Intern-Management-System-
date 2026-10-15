import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page } from '../../components/ui/Page'
import { useAuth, isAdmin } from '../../lib/auth'
import { INTERNS_KEY } from '../../lib/constants'
import { readList, writeList, useList } from '../../lib/storage'
import type { InternRecord } from '../../types/index'


/* Interns page shared by admin and user: whatever the admin posts shows up for everyone */
export function InternsBoard() {
  const { user } = useAuth()
  const admin = isAdmin(user)
  const interns = useList<InternRecord>(INTERNS_KEY)
  const [q, setQ] = useState('')
  const list = interns.filter((i) => (i.name + i.email + i.position + i.college).toLowerCase().includes(q.toLowerCase()))
  return (
    <Page>
      <div className="panel">
        <div className="panel-head">
          <h3>Interns ({interns.length})</h3>
          {admin && <Link to="/dashboard/upload-interns" className="btn-primary inline-btn link-btn">+ Add interns</Link>}
        </div>
        <input type="search" placeholder="Search by name, position or college…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12, width: '100%', maxWidth: 360 }} />
        {list.length === 0 ? (
          <p className="muted">{interns.length === 0 ? 'No interns have been posted yet.' : 'No interns match your search.'}</p>
        ) : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Intern</th><th>Position</th><th>College / Degree</th>{admin && <th />}</tr></thead>
            <tbody>{list.map((i) => (
              <tr key={i.id}>
                <td><div className="cell-intern"><span className="mini-avatar">{i.name[0]}</span><div>{i.name}<div className="muted">{i.email}</div></div></div></td>
                <td>{i.position || '—'}</td>
                <td>{[i.college, i.degree].filter(Boolean).join(' · ') || '—'}</td>
                {admin && <td><button type="button" className="btn-sm no" onClick={() => writeList(INTERNS_KEY, readList<InternRecord>(INTERNS_KEY).filter((x) => x.id !== i.id))}>Remove</button></td>}
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </Page>
  )
}
