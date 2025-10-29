export default function StoryLogos(): JSX.Element {
  const logos = ['Nordic Retail', 'FinBuild', 'SaaSCo', 'Meridian', 'PolarWorks']
  return (
    <section className="section">
      <p className="muted center small mb-8">Luottavat meihin</p>
      <ul className="logos">
        {logos.map((n) => (
          <li key={n} className="logo">{n}</li>
        ))}
      </ul>
    </section>
  )
}
