import { useState } from 'react'
import { Page } from '../../components/ui/Page'


export interface EventItem { id: number; title: string; day: string; mon: string; place: string }


export function Events() {
  const DATA: EventItem[] = [
    { id: 1, title: 'Intern Orientation', day: '12', mon: 'Oct', place: 'Main Hall' },
    { id: 2, title: 'Tech Talk: React 19', day: '20', mon: 'Oct', place: 'Online' },
    { id: 3, title: 'Team Outing', day: '05', mon: 'Nov', place: 'Nagarkot' },
  ]
  const [going, setGoing] = useState<Record<number, boolean>>({})
  return (
    <Page>
      <div className="panel">
        {DATA.map((e) => (
          <div className="event-row" key={e.id}>
            <div className="deadline-date"><b>{e.day}</b><span>{e.mon}</span></div>
            <div><div className="event-title">{e.title}</div><div className="muted">{e.place}</div></div>
            <button className={(going[e.id] ? 'btn-secondary' : 'btn-primary') + ' inline-btn'} style={{ marginLeft: 'auto' }}
              onClick={() => setGoing({ ...going, [e.id]: !going[e.id] })}>{going[e.id] ? 'Going ✓' : 'RSVP'}</button>
          </div>
        ))}
      </div>
    </Page>
  )
}
