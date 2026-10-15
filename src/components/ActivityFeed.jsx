const ACTIVITIES = [
  {
    text: (
      <>
        <b>Anika Tan</b> registered as a new intern
      </>
    ),
    time: '12 minutes ago',
    bg: '#E7EEF9',
    color: '#3563AB',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 00-3-3.87" />
      </svg>
    ),
  },
  {
    text: (
      <>
        <b>Riya Sharma</b> completed &ldquo;API integration testing&rdquo;
      </>
    ),
    time: '48 minutes ago',
    bg: '#E2F2EA',
    color: '#2E7D5B',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    text: (
      <>
        Attendance submitted for <b>Design Team</b>
      </>
    ),
    time: '2 hours ago',
    bg: '#FBEFDC',
    color: '#E3982F',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
  },
  {
    text: (
      <>
        <b>Miguel Cruz</b> submitted the Q3 evaluation report
      </>
    ),
    time: 'Yesterday, 5:42 PM',
    bg: '#FBEADF',
    color: '#C2571B',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 3v4a1 1 0 001 1h4" />
        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
      </svg>
    ),
  },
]

export default function ActivityFeed() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Recent activity</h3>
      </div>
      <div className="activity-list">
        {ACTIVITIES.map((a, i) => (
          <div className="activity-item" key={i}>
            <div className="activity-ico" style={{ background: a.bg, color: a.color }}>
              {a.icon}
            </div>
            <div>
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
