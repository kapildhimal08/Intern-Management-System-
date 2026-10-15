import EmptyState from '../../components/EmptyState.jsx'

export default function Supervisors() {
  return (
    <EmptyState
      title="Supervisors"
      description="Manage supervisors and their assigned interns here. This section hasn't been built yet."
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="8" r="3.2" />
          <path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5" />
          <circle cx="18" cy="8.5" r="2.4" />
          <path d="M15.5 14.6c2.5.4 4.3 2.3 4.8 5" />
        </svg>
      }
    />
  )
}
