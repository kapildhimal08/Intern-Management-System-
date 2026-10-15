import EmptyState from '../../components/EmptyState.jsx'

export default function Reports() {
  return (
    <EmptyState
      title="Reports"
      description="Generate and review internship reports here. This section hasn't been built yet."
      icon={
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 3h8l4 4v14H7z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      }
    />
  )
}
