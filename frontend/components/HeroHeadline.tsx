'use client'
import { useEffect, useMemo, useState } from 'react'
import { track } from '@/lib/analytics'

const variants = [
  'Automaatio, joka maksaa itsensä takaisin.',
  'Automate finance ops in one day.',
] as const

export default function HeroHeadline(): JSX.Element {
  const [v] = useState<0 | 1>(() => (Math.random() < 0.5 ? 0 : 1))
  const text = useMemo(() => variants[v], [v])

  useEffect(() => {
    track('hero_ab_variant', { variant: v === 0 ? 'A' : 'B' })
  }, [v])

  return <>{text}</>
}
