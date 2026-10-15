import { useEffect, useState } from 'react'
import { EVT } from './constants'

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)


export function readList<T>(key: string): T[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(v) ? (v as T[]) : []
  } catch { return [] }
}

export function writeList<T>(key: string, list: T[]) {
  localStorage.setItem(key, JSON.stringify(list))
  window.dispatchEvent(new Event(EVT))
}

// Live list: refreshes on same-tab changes, other tabs, and every 1.5s.
export function useList<T>(key: string): T[] {
  const [list, setList] = useState<T[]>(() => readList<T>(key))
  useEffect(() => {
    const update = () => {
      const next = readList<T>(key)
      setList((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    update()
    window.addEventListener(EVT, update)
    window.addEventListener('storage', update)
    const t = setInterval(update, 1500)
    return () => {
      window.removeEventListener(EVT, update)
      window.removeEventListener('storage', update)
      clearInterval(t)
    }
  }, [key])
  return list
}
