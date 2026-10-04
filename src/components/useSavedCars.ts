'use client'
import { useEffect, useState } from 'react'

const KEY = 'edalkaup:saved-cars:v1'
export function useSavedCars() {
  const [saved, setSaved] = useState<string[]>([])
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const read = () => {
      try {
        const value: unknown = JSON.parse(localStorage.getItem(KEY) || '[]')
        setSaved(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string').slice(0, 100) : [])
      } catch { setSaved([]) }
      setReady(true)
    }
    read()
    window.addEventListener('storage', read)
    window.addEventListener('edalkaup:saved-cars', read)
    return () => { window.removeEventListener('storage', read); window.removeEventListener('edalkaup:saved-cars', read) }
  }, [])
  const toggle = (id: string) => {
    const next = saved.includes(id) ? saved.filter((value) => value !== id) : [...saved, id].slice(-100)
    setSaved(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)); window.dispatchEvent(new Event('edalkaup:saved-cars')) } catch { /* Still works for this session when storage is unavailable. */ }
  }
  return { saved, ready, toggle }
}
