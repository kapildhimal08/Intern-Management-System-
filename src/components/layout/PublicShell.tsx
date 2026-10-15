import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'


export function PublicShell({ children, title, back = '/' }: { children: ReactNode; title: string; back?: string }) {
  return (
    <div className="land">
      <header className="land-nav">
        <div className="brand-mark">
          <span className="brand-badge">🎓</span>
          <div><div className="brand-name" style={{ color: '#eaf0ff' }}>InternSys</div><div className="brand-sub">Internship Program</div></div>
        </div>
        <div className="land-actions"><Link to={back} className="land-link">← Back</Link></div>
      </header>
      <section className="land-section"><h2>{title}</h2>{children}</section>
    </div>
  )
}
