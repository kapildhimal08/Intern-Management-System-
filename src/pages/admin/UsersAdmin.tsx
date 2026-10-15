import { useState } from 'react'
import { Page } from '../../components/ui/Page'
import { APPS_KEY, USERS_KEY } from '../../lib/constants'
import { readList, writeList, useList } from '../../lib/storage'
import type { UserAccount, Application } from '../../types/index'


// Admin: registered users
export function UsersAdmin() {
  const users = useList<UserAccount>(USERS_KEY)
  const apps = useList<Application>(APPS_KEY)
  const [q, setQ] = useState('')
  const list = users.filter((u) => (u.name + u.email + (u.skills || '')).toLowerCase().includes(q.toLowerCase()))
  const remove = (u: UserAccount) => {
    if (window.confirm(`Delete the account of ${u.name}? Their applications are kept.`)) writeList(USERS_KEY, readList<UserAccount>(USERS_KEY).filter((x) => x.email !== u.email))
  }
  return (
    <Page>
      <div className="mini-stats"><div className="mini-stat"><b>{users.length}</b><span>Registered users</span></div></div>
      <div className="panel">
        <div className="panel-head">
          <h3>Users</h3>
          <div className="field inline-field"><input type="text" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        </div>
        {list.length === 0 ? <p className="muted">No users to show.</p> : (
          <div className="table-wrap"><table>
            <thead><tr><th>User</th><th>Phone</th><th>Education</th><th>Skills</th><th>Applications</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.email}>
                  <td><div className="cell-intern"><span className="mini-avatar">{u.name[0]}</span><div>{u.name}<div className="muted">{u.email}</div></div></div></td>
                  <td>{u.phone || '—'}</td><td>{u.education || '—'}</td><td>{u.skills || '—'}</td>
                  <td>{apps.filter((a) => a.userEmail === u.email).length}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td><button type="button" className="btn-sm no" onClick={() => remove(u)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>
    </Page>
  )
}
