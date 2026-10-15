import { useState } from 'react'

const FAQ = [
  ['How do I apply for leave?', 'Open Teams → Leave, fill in the form and submit. Your admin will review it.'],
  ['How do I clock in?', 'Open Teams → Time Card and press Clock in. Press Clock out when you finish.'],
  ['Why is my login waiting?', 'Logins need admin approval. You are signed in automatically once approved.'],
]

export default function Help() {
  const [sent, setSent] = useState(false)
  return (
    <div className="content">
      <div className="page-head"><h2>Help &amp; Support</h2><p>Find answers or contact the admin.</p></div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-head"><h3>FAQ</h3></div>
          {FAQ.map(([q, a]) => (
            <details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
        <form className="panel" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          <div className="panel-head"><h3>Contact support</h3></div>
          <div className="field"><label>Subject</label><input type="text" required /></div>
          <div className="field"><label>Describe your issue</label><textarea rows="4" required /></div>
          <button className="btn-primary" type="submit">Send</button>
          {sent && <div className="muted" style={{ marginTop: 12 }}>✓ Sent. We will get back to you soon.</div>}
        </form>
      </div>
    </div>
  )
}
