const CIRC = 314.16

export default function AttendancePanel() {
  const present = 150
  const onLeave = 16
  const absent = 10
  const total = present + onLeave + absent
  const overallPct = Math.round((present / total) * 100)

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Attendance today</h3>
        <span className="muted-link">This week ▾</span>
      </div>
      <div className="attendance-body">
        <div className="donut-wrap">
          <svg width="128" height="128" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#EDEEEA" strokeWidth="14" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#2E7D5B"
              strokeWidth="14"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - present / total)}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#E3982F"
              strokeWidth="14"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - onLeave / total)}
              strokeLinecap="round"
              transform={`rotate(${-90 + (present / total) * 360} 60 60)`}
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#C1443C"
              strokeWidth="14"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - absent / total)}
              strokeLinecap="round"
              transform={`rotate(${-90 + ((present + onLeave) / total) * 360} 60 60)`}
            />
          </svg>
          <div className="donut-center">
            <b>{overallPct}%</b>
            <span>overall</span>
          </div>
        </div>
        <div className="legend">
          <div className="legend-item">
            <div className="legend-key">
              <span className="legend-dot" style={{ background: '#2E7D5B' }} />
              Present
            </div>
            <div className="legend-val">{present}</div>
          </div>
          <div className="legend-item">
            <div className="legend-key">
              <span className="legend-dot" style={{ background: '#E3982F' }} />
              On Leave
            </div>
            <div className="legend-val">{onLeave}</div>
          </div>
          <div className="legend-item">
            <div className="legend-key">
              <span className="legend-dot" style={{ background: '#C1443C' }} />
              Absent
            </div>
            <div className="legend-val">{absent}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
