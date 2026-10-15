const DEADLINES = [
  { day: '22', month: 'Sep', title: 'Weekly attendance report', subtitle: 'Task deadline · Miguel Cruz', tag: 'Task' },
  { day: '25', month: 'Sep', title: 'Mid-term evaluation', subtitle: 'Design & Engineering interns', tag: 'Evaluation' },
  { day: '30', month: 'Sep', title: 'Monthly progress report', subtitle: 'Due to program office', tag: 'Report' },
  { day: '05', month: 'Oct', title: 'Sofia Petrov — internship ends', subtitle: 'Marketing department', tag: 'Completion' },
]

export default function UpcomingDeadlines() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Upcoming deadlines</h3>
      </div>
      <div className="activity-list">
        {DEADLINES.map((d, i) => (
          <div className="deadline-item" key={i}>
            <div className="deadline-date">
              <b>{d.day}</b>
              <span>{d.month}</span>
            </div>
            <div className="deadline-info">
              <b>{d.title}</b>
              <span>{d.subtitle}</span>
            </div>
            <span className="deadline-tag">{d.tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
