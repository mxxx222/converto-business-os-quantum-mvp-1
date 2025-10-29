"use client"
import { useState } from 'react'

const faqs = [
  { q: 'Mitä tarvitsen aloitukseen?', a: 'Sähköpostin ja pankkiyhteyden luvitukset. Autamme luvituksissa ja dokumentoimme vaiheet.' },
  { q: 'Kuinka nopeasti näen hyödyt?', a: 'Tyypillisesti tunneissa–päivissä: kuittien poiminta ja laskutuksen yhtenäistäminen näkyvät heti arjessa.' },
  { q: 'Mitä pilotti sisältää?', a: 'Perusprosessin käyttöönotto (kuitit, laskutus, hyväksynnät) ja selkeä raportti jatkosta. Ei piilokuluja.' },
  { q: 'Säilyvätkö nykyiset työkalut?', a: 'Kyllä. Integroimme olemassa oleviin järjestelmiin (sähköposti, pankki/SEPA, kirjanpito, verkkokauppa).' },
]

export default function StoryFAQ(): JSX.Element {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="section">
      <h2 className="h2 center">Usein kysytyt kysymykset</h2>
      <div className="faq">
        {faqs.map((f, i) => {
          const isOpen = open === i
          return (
            <div key={f.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
              <button
                className="faq-q"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span>{f.q}</span>
                <span className="faq-icon" aria-hidden>{isOpen ? '–' : '+'}</span>
              </button>
              <div className="faq-a">
                <p>{f.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
