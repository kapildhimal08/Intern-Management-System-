import { NavLink } from 'react-router-dom'
import { Ico } from '../ui/icons'
import type { NavLeaf } from '../../types/index'


export function NavList({ items }: { items: NavLeaf[] }) {
  return (
    <>
      {items.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
          <Ico d={n.d} /> {n.label}
        </NavLink>
      ))}
    </>
  )
}
