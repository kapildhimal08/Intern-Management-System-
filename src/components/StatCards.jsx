const STATS = [
  {
    label: 'Total Interns',
    value: '248',
    trend: '+12%',
    up: true,
    accent: '#E3982F',
    accentSoft: '#FBEFDC',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Active Interns',
    value: '176',
    trend: '+5%',
    up: true,
    accent: '#2E7D5B',
    accentSoft: '#E2F2EA',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Completed Internships',
    value: '54',
    trend: '+8%',
    up: true,
    accent: '#3563AB',
    accentSoft: '#E7EEF9',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 15a6 6 0 100-12 6 6 0 000 12z" />
        <path d="M8.5 14L7 22l5-3 5 3-1.5-8" />
      </svg>
    ),
  },
  {
    label: 'Pending Applications',
    value: '18',
    trend: '-3%',
    up: false,
    accent: '#C2571B',
    accentSoft: '#FBEADF',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 3v4a1 1 0 001 1h4" />
        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" />
        <path d="M9 15h6M9 11h2" />
      </svg>
    ),
  },
]

export default function StatCards() {
  return (
    <div className="stat-grid">
      {STATS.map((s) => (
        <div key={s.label} className="stat-card" style={{ '--accent': s.accent, '--accent-soft': s.accentSoft }}>
          <div className="stat-top">
            <div className="stat-icon">{s.icon}</div>
            <span className={`stat-trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
          </div>
          <div className="stat-num">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
