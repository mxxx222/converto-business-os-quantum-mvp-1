import data from '../../content/mapping.json';

export default function Hero(): JSX.Element {
  const hero = data.hero;
  return (
    <section>
      <div>
        <h1>{hero.title}</h1>
        <p>{hero.subtitle}</p>
        <div>
          <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
          <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
        </div>
      </div>
    </section>
  );
}
