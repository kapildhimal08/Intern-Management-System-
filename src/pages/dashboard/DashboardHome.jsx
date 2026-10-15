import EmptyState from '../../components/EmptyState.jsx'
import { ClockCard } from '../../components/time/DashboardStats.jsx'

export default function DashboardHome() {
  return (
    <>
      <div className="ds-small">
        <ClockCard />
      </div>

      <EmptyState
        title="Dashboard"
        description="This is where your overview — stats, attendance, tasks, and activity — will live."
        icon={
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
        }
      />
    </>
  )
}