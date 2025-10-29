"use client"
import { useEffect } from 'react'
import StoryHero from './_components/StoryHero'
import StoryLogos from './_components/StoryLogos'
import StoryProblem from './_components/StoryProblem'
import StorySolution from './_components/StorySolution'
import StoryTestimonials from './_components/StoryTestimonials'
import StoryPlan from './_components/StoryPlan'
import StoryCTA from './_components/StoryCTA'
import StoryFAQ from './_components/StoryFAQ'
import StoryRiskFree from './_components/StoryRiskFree'
import { abVariant } from './_components/ab'

export default function Page(): JSX.Element {
  const v = abVariant()

  useEffect(() => {
    fetch('/api/event', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'page_view', where: `storybrand_${v}` })
    }).catch(() => {})

    fetch('/api/event', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'ab_expose', where: `riskfree_${v}` })
    }).catch(() => {})

    const onUnload = () => {
      const data = JSON.stringify({ name: 'page_close', where: `storybrand_${v}` })
      navigator.sendBeacon?.('/api/event', new Blob([data], { type: 'application/json' }))
    }
    window.addEventListener('pagehide', onUnload)
    return () => window.removeEventListener('pagehide', onUnload)
  }, [v])

  return (
    <>
      <StoryHero />
      {v === 'B' && <StoryRiskFree />}
      <StoryLogos />
      <StoryProblem />
      <StorySolution />
      <StoryTestimonials />
      <StoryPlan />
      <StoryRiskFree />
      <StoryFAQ />
      <StoryCTA />
      <div className="sticky-cta">
        <a href="#pilot" className="btn btn-primary">Ilmoittaudu pilottiin</a>
      </div>
    </>
  )
}
