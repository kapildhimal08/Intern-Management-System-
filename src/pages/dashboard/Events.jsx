import { useState } from 'react'

const DATA = [
  { id: 1, title: 'Intern Orientation', day: '12', mon: 'Oct', place: 'Main Hall' },
  { id: 2, title: 'Tech Talk: React 19', day: '20', mon: 'Oct', place: 'Online' },
  { id: 3, title: 'Team Outing', day: '05', mon: 'Nov', place: 'Nagarkot' },
]

export default function Events() {
  const [going, setGoing] = useState({})
  return (
    <div className="content">
      <div className="page-head"><h2>Events</h2><p>Upcoming company and team events.</p></div>
      <div className="panel">
        {DATA.map((e) => (
          <div className="deadline-item event-row" key={e.id}>
            <div className="deadline-date"><b>{e.day}</b><span>{e.mon}</span></div>
            <div><div className="event-title">{e.title}</div><div className="muted">{e.place}</div></div>
            <button className={going[e.id] ? 'btn-secondary inline-btn' : 'btn-primary inline-btn'} style={{ marginLeft: 'auto' }}
              onClick={() => setGoing({ ...going, [e.id]: !going[e.id] })}>{going[e.id] ? 'Going ✓' : 'RSVP'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
