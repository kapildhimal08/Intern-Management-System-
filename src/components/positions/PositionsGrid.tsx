import { Link } from 'react-router-dom'
import { usePositionAvailability } from '../../lib/positions'
import type { Position } from '../../types/index'


export function PositionsGrid({ onApply, label = 'Apply', editable = false, onEdit, query = '' }: {
  onApply: (p: Position) => void; label?: string; editable?: boolean; onEdit?: (p: Position) => void; query?: string
}) {
  const { positions, setOpen, remove } = usePositionAvailability()
  const q = query.trim().toLowerCase()
  const list = positions.filter((p) => !q || `${p.name} ${p.company || ''} ${p.location || ''}`.toLowerCase().includes(q))
  if (positions.length === 0) {
    return <p className="muted">{editable ? 'No internships yet. Add the first one above.' : 'No open internships right now. Please check back soon.'}</p>
  }
  if (list.length === 0) return <p className="muted">No internships match your search.</p>
  return (
    <div className="pos-grid">
      {list.map((p) => {
        const open = p.open
        return (
          <div className={'pos-card' + (open ? '' : ' closed')} key={p.id}>
            <div className="pos-top">
              <span className="pos-ico">{p.icon}</span>
              <span className={'pos-badge ' + (open ? 'open' : 'shut')}>{open ? 'Available' : 'Not available'}</span>
            </div>
            <h3>{p.name}</h3>
            {(p.company || p.location || p.duration) && (
              <p className="muted" style={{ fontSize: 13, margin: '2px 0 6px' }}>
                {[p.company && `🏢 ${p.company}`, p.location && `📍 ${p.location}`, p.duration && `⏱ ${p.duration}`].filter(Boolean).join(' · ')}
              </p>
            )}
            <p>{p.desc}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link to={`/internship/${p.id}`} className="btn-secondary inline-btn link-btn">View Details</Link>
              {editable ? (
                <>
                  <button type="button" className="btn-secondary inline-btn" onClick={() => setOpen(p.id, !open)}>
                    {open ? 'Mark as Not available' : 'Mark as Available'}
                  </button>
                  <button type="button" className="btn-secondary inline-btn" onClick={() => onEdit?.(p)}>Edit</button>
                  <button type="button" className="btn-secondary inline-btn" onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) remove(p.id) }}>Delete</button>
                </>
              ) : (
                <button type="button" className="btn-primary inline-btn" disabled={!open} onClick={() => onApply(p)} aria-label={`${label}: ${p.name}`}>
                  {open ? label : 'Not available'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
