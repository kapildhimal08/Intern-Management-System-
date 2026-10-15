import { useState } from 'react'
import type { FormEvent } from 'react'
import { Page } from '../../components/ui/Page'
import { useAuth, isAdmin } from '../../lib/auth'


export interface Announcement { id: number; title: string; body: string; date: string }


export function Announcements() {
  const { user } = useAuth()
  const [items, setItems] = useState<Announcement[]>([
    { id: 1, title: 'Office closed on Friday', body: 'Public holiday. Work from home if needed.', date: 'Oct 01' },
    { id: 2, title: 'Weekly sync moved', body: 'Monday sync is now at 11:00 AM.', date: 'Sep 28' },
  ])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const post = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setItems([{ id: Date.now(), title, body, date: 'Today' }, ...items])
    setTitle(''); setBody('')
  }
  return (
    <Page>
      {isAdmin(user) && (
        <form className="panel stack-gap" onSubmit={post}>
          <div className="panel-head"><h3>New announcement</h3></div>
          <div className="field"><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="field"><label>Message</label><textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} /></div>
          <button className="btn-primary" type="submit">Post</button>
        </form>
      )}
      {items.map((a) => (
        <div className="panel stack-gap" key={a.id}>
          <div className="panel-head"><h3>{a.title}</h3><span className="deadline-tag">{a.date}</span></div>
          <div className="muted">{a.body}</div>
        </div>
      ))}
    </Page>
  )
}
