"use client"

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    const register = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js')
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('SW registration failed', e)
      }
    }
    register()
  }, [])
  return null
}


