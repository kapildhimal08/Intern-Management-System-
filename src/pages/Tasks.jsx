import { useState } from 'react'
import { AddTaskModal } from '../../components/tasks/AddTaskModal'
import { Page } from '../../components/ui/Page'
import { useAuth } from '../../lib/auth'
import { TASKS_KEY } from '../../lib/constants'

export default function Tasks() {
  const { user } = useAuth()
  const email = (user?.email || '').toLowerCase()
  const [open, setOpen] = useState(false)

  const [all, setAll] = useState(() =>
    JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'),
  )
  const mine = all.filter((t) => (t.assignedTo || '').toLowerCase() === email)

  const saveTask = (task) => {
    const next = [task, ...all]
    localStorage.setItem(TASKS_KEY, JSON.stringify(next))
    setAll(next)
    setOpen(false)
  }

  return (
    <Page>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto',
            padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#fff',
            background: '#142347', border: 0, borderRadius: 8, cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
          </svg>
          Add task
        </button>
      </div>

      <div className="panel">
        {mine.length === 0 ? (
          <p className="muted">No tasks yet. Click “Add task” to create one.</p>
        ) : (
          <table style={{ width: '100%' }}>
            <thead>
              <tr><th>Title</th><th>Project</th><th>Points</th><th>Deadline</th><th>Status</th></tr>
            </thead>
            <tbody>
              {mine.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.project || '-'}</td>
                  <td>{t.points}</td>
                  <td>{t.deadline || '-'}</td>
                  <td>{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open && <AddTaskModal assignedTo={email} onSave={saveTask} onClose={() => setOpen(false)} />}
    </Page>
  )
}