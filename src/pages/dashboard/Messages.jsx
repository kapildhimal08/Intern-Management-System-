import { useState } from 'react'

const CONTACTS = ['Anita S.', 'Rohan K.', 'Priya M.']

export default function Messages() {
  const [active, setActive] = useState(CONTACTS[0])
  const [threads, setThreads] = useState({ 'Anita S.': [{ me: false, text: 'Hi! Did you finish the report?' }] })
  const [text, setText] = useState('')
  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setThreads({ ...threads, [active]: [...(threads[active] || []), { me: true, text }] })
    setText('')
  }
  return (
    <div className="content">
      <div className="page-head"><h2>Messages</h2><p>Chat with your team.</p></div>
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
            {(threads[active] || []).length === 0 && <div className="muted">No messages yet. Say hi!</div>}
            {(threads[active] || []).map((m, i) => <div key={i} className={'chat-msg' + (m.me ? ' me' : '')}>{m.text}</div>)}
          </div>
          <form className="chat-send" onSubmit={send}>
            <div className="field"><input type="text" placeholder={'Message ' + active} value={text} onChange={(e) => setText(e.target.value)} /></div>
            <button className="btn-primary inline-btn" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}
