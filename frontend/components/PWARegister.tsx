"use client"

import { useEffect } from 'react'

export default function PWARegister(): null {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    const register = async (): Promise<void> => {
      try {
        await navigator.serviceWorker.register('/sw.js')
      } catch (e) {
        console.warn('SW registration failed', e)
      }
    }
    register()
  }, [])
  return null
}
