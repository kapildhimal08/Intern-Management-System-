import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Ico, P } from '../ui/icons'
import { WORK_NAV } from '../../lib/nav'


export function NavMenu() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const cls = ({ isActive }: { isActive: boolean }) => 'nav-item' + (isActive ? ' active' : '')
  return (
    <>
      <div className="nav-group-label">Workspace</div>
      {WORK_NAV.map((item) => {
        if (!('children' in item))
          return (
            <NavLink key={item.to} to={item.to} className={cls}><Ico d={item.d} /> {item.label}</NavLink>
          )
        const expanded = open || item.children.some((c) => pathname.startsWith(c.to))
        return (
          <div key={item.label}>
            <button type="button" className="nav-item" onClick={() => setOpen((o) => !o)}>
              <Ico d={item.d} /> {item.label}
              <span className={'nav-chevron' + (expanded ? ' open' : '')}><Ico d={P.chevron} /></span>
            </button>
            {expanded && item.children.map((c) => (
              <NavLink key={c.to} to={c.to} className={(s) => cls(s) + ' nav-sub-item'}>{c.label}</NavLink>
            ))}
          </div>
        )
      })}
    </>
  )
}
