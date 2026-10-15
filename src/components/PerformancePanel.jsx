const WEEK_DATA = [
  { day: 'Mon', height: 62, completedShare: 80 },
  { day: 'Tue', height: 78, completedShare: 85 },
  { day: 'Wed', height: 45, completedShare: 65 },
  { day: 'Thu', height: 90, completedShare: 90 },
  { day: 'Fri', height: 70, completedShare: 75 },
  { day: 'Sat', height: 30, completedShare: 55 },
]

export default function PerformancePanel() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Intern performance</h3>
        <span className="muted-link">This month ▾</span>
      </div>
      <div className="perf-metrics">
        <div className="perf-metric">
          <div className="n">312</div>
          <div className="l">Tasks completed</div>
        </div>
        <div className="perf-metric">
          <div className="n">47</div>
          <div className="l">Tasks pending</div>
        </div>
        <div className="perf-metric">
          <div className="n">4.3 / 5</div>
          <div className="l">Average performance</div>
        </div>
        <div className="perf-metric">
          <div className="n">38</div>
          <div className="l">Evaluations this month</div>
        </div>
      </div>
      <div className="bar-chart">
        {WEEK_DATA.map((d) => (
          <div className="bar-col" key={d.day}>
            <div className="bar-stack" style={{ height: `${d.height}%` }}>
              <div className="bar-seg" style={{ height: `${d.completedShare}%`, background: '#2E7D5B' }} />
              <div className="bar-seg" style={{ height: `${100 - d.completedShare}%`, background: '#E3982F' }} />
            </div>
            <span className="bar-label">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
