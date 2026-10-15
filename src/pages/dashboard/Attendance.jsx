import EmptyState from '../../components/EmptyState.jsx'

export default function Attendance() {
  return (
    <EmptyState
      title="Attendance"
      description="Track daily attendance, leave, and absences here. This section hasn't been built yet."
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      }
    />
  )
}
