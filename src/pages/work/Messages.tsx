import { useState } from 'react'
import type { FormEvent } from 'react'
import { Page } from '../../components/ui/Page'


export function Messages() {
  const CONTACTS = ['Anita S.', 'Rohan K.', 'Priya M.']
  const [active, setActive] = useState(CONTACTS[0])
  const [threads, setThreads] = useState<Record<string, { me: boolean; text: string }[]>>({ 'Anita S.': [{ me: false, text: 'Hi! Did you finish the report?' }] })
  const [text, setText] = useState('')
  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setThreads({ ...threads, [active]: [...(threads[active] || []), { me: true, text }] })
    setText('')
  }
  const msgs = threads[active] || []
  return (
    <Page>
      <div className="panel chat">
        <div className="chat-list">
          {CONTACTS.map((c) => (
            <button key={c} className={'chat-contact' + (c === active ? ' on' : '')} onClick={() => setActive(c)}>
              <span className="mini-avatar">{c[0]}</span>{c}
            </button>
          ))}
        </div>
        <div className="chat-main">
          <div className="chat-msgs">
            {msgs.length === 0 && <div className="muted">No messages yet. Say hi!</div>}
            {msgs.map((m, i) => <div key={i} className={'chat-msg' + (m.me ? ' me' : '')}>{m.text}</div>)}
          </div>
          <form className="chat-send" onSubmit={send}>
            <div className="field"><input type="text" placeholder={'Message ' + active} value={text} onChange={(e) => setText(e.target.value)} /></div>
            <button className="btn-primary inline-btn" type="submit">Send</button>
          </form>
        </div>
      </div>
    </Page>
  )
}
