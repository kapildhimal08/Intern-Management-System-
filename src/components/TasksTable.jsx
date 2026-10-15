const TASKS = [
  { task: 'Landing page redesign', intern: 'Riya Sharma', initials: 'RS', deadline: 'Sep 24, 2026', status: 'progress', label: 'In Progress' },
  { task: 'Weekly attendance report', intern: 'Miguel Cruz', initials: 'MK', deadline: 'Sep 22, 2026', status: 'pending', label: 'Pending' },
  { task: 'API integration testing', intern: 'Anika Tan', initials: 'AT', deadline: 'Sep 20, 2026', status: 'completed', label: 'Completed' },
  { task: 'Onboarding deck update', intern: 'Jordan Diaz', initials: 'JD', deadline: 'Sep 27, 2026', status: 'pending', label: 'Pending' },
  { task: 'Client survey analysis', intern: 'Sofia Petrov', initials: 'SP', deadline: 'Sep 25, 2026', status: 'progress', label: 'In Progress' },
]

export default function TasksTable() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Recent tasks</h3>
        <span className="muted-link">View all</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Intern</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map((t) => (
              <tr key={t.task}>
                <td>{t.task}</td>
                <td>
                  <div className="cell-intern">
                    <span className="mini-avatar">{t.initials}</span>
                    {t.intern}
                  </div>
                </td>
                <td>{t.deadline}</td>
                <td>
                  <span className={`badge ${t.status}`}>{t.label}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
