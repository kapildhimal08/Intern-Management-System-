import { useState } from 'react'
import { Page } from '../../components/ui/Page'


export function Help() {
  const FAQ: [string, string][] = [
    ['How do I apply for leave?', 'Open Teams → Leave, fill in the form and submit. Your admin will review it.'],
    ['How do I clock in?', 'Press Clock In on your Dashboard home. Press Clock Out when you finish.'],
    ['Why is my login waiting?', 'Logins need admin approval. You are signed in automatically once approved.'],
  ]
  const [sent, setSent] = useState(false)
  return (
    <Page>
      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h3>FAQ</h3></div>
          {FAQ.map(([q, a]) => (<details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>))}
        </div>
        <form className="panel" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          <div className="panel-head"><h3>Contact support</h3></div>
          <div className="field"><label>Subject</label><input type="text" required /></div>
          <div className="field"><label>Describe your issue</label><textarea rows={4} required /></div>
          <button className="btn-primary" type="submit">Send</button>
          {sent && <div className="muted" style={{ marginTop: 12 }}>✓ Sent. We will get back to you soon.</div>}
        </form>
      </div>
    </Page>
  )
}
