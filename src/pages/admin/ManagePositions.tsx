import { useState } from 'react'
import { PositionForm } from '../../components/positions/PositionForm'
import { PositionsGrid } from '../../components/positions/PositionsGrid'
import { Page } from '../../components/ui/Page'
import type { Position } from '../../types/index'


export function ManagePositions() {
  const [editing, setEditing] = useState<Position | null>(null)
  return (
    <Page>
      <p className="muted">Add, edit or delete internships, and switch each one between <b>Available</b> and <b>Not available</b>. Applicants can only apply to available internships.</p>
      <PositionForm key={editing?.id || 'new'} editing={editing} onDone={() => setEditing(null)} />
      <PositionsGrid editable onApply={() => undefined} onEdit={(p) => { setEditing(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
    </Page>
  )
}
