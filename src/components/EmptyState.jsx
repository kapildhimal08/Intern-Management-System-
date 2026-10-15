// Shared, responsive placeholder for any dashboard section that doesn't
// have its content built yet. Swap this out for real content whenever
// you're ready to build that section.
export default function EmptyState({ title, description, icon }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-desc">{description}</p>
    </div>
  )
}
