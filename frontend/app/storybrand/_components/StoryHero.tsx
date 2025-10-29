"use client"
import { motion } from 'framer-motion'

export default function StoryHero(): JSX.Element {
  return (
    <section className="sb-hero" aria-labelledby="hero-title">
      <div className="sb-hero-bg" aria-hidden></div>
      <div className="sb-badge">Aloita pilotti tänään • EU‑hosting • Kotimainen tuki</div>
      <motion.h1
        id="hero-title"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="sb-hero-title gradient-text"
      >
        Selkeä automaatio. Vähemmän manuaalia. Enemmän kassavirtaa.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="sb-hero-sub"
      >
        Yhdistä kuitit, laskutus, raportointi ja hyväksynnät yhteen näkymään. Näet hyödyt tunneissa, et kuukausissa.
      </motion.p>
      <div className="sb-cta-row">
        <a
          href="#pilot"
          className="btn btn-primary"
          onClick={() => {
            fetch('/api/event', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ name: 'cta_click', where: 'hero_primary' })
            }).catch(() => {})
          }}
        >
          Ilmoittaudu pilottiin
        </a>
        <a
          href="https://cal.com/converto/clarity?utm_source=site&utm_medium=cta&utm_campaign=hero"
          className="btn btn-secondary"
          onClick={() => {
            fetch('/api/event', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ name: 'cta_click', where: 'hero_secondary' })
            }).catch(() => {})
          }}
        >
          Varaa 20 min demo
        </a>
      </div>
    </section>
  )
}
