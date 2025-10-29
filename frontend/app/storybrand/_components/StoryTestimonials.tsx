"use client"
import { motion } from 'framer-motion'

const items = [
  { quote: 'Ensimmäinen kuukausi palautti 40 h manuaalia ja nopeutti kassaa 9 päivää.', author: 'Toimitusjohtaja', company: 'Helsinki' },
  { quote: 'Laskuautomaatio ja näkymä yhdelle sivulle – turha säätö väheni heti.', author: 'Operatiivinen johtaja', company: 'Kotimainen SaaS' },
  { quote: 'Nopea käyttöönotto ja selkeä hinnoittelu. Tiimi sitoutui, kun tulokset näkyivät.', author: 'Perustaja', company: 'PK-yritys' },
]

export default function StoryTestimonials(): JSX.Element {
  return (
    <section id="testimonials" className="sb-section">
      <h2 className="sb-h2">What customers say</h2>
      <div className="sb-grid">
        {items.map((t, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="sb-card"
          >
            <p className="sb-card-text">“{t.quote}”</p>
            <footer className="sb-card-foot">— {t.author}, {t.company}</footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}
