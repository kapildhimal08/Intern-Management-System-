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
        <button className="btn btn-primary" onClick={() => setOpen(true)}>⊕ Add task</button>
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