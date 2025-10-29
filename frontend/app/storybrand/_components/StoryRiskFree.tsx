"use client"

export default function StoryRiskFree(): JSX.Element {
  const click = (where: string) =>
    fetch('/api/event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'cta_click', where }),
    }).catch(() => {})

  return (
    <section className="section">
      <div className="riskfree">
        <div className="riskcopy">
          <span className="badge-soft">Riskitön pilotti</span>
          <h3>Mitattava hyöty ennen sitoutumista</h3>
          <p>
            Aloitamme pienestä ja todennamme säästöt. Jos hyötyä ei synny, et maksa pilottia.
            Selkeä raportti ja suositus jatkoon.
          </p>
        </div>
        <div className="riskcta">
          <a
            href="#pilot"
            className="btn btn-primary"
            onClick={() => click('riskfree_primary')}
          >
            Ilmoittaudu pilottiin
          </a>
          <a
            href="https://cal.com/converto/clarity?utm_source=site&utm_medium=cta&utm_campaign=hero"
            className="btn btn-secondary"
            onClick={() => click('riskfree_secondary')}
          >
            Varaa 20 min demo
          </a>
        </div>
      </div>
    </section>
  )
}
