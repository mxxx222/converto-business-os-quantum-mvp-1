import data from '../../content/mapping.json';

export default function CTA(): JSX.Element {
  const cta = data.ctaBlock;
  return (
    <section>
      <div>
        <h2>{cta.title}</h2>
        <p>{cta.subtitle}</p>
        <a href={cta.cta.href}>{cta.cta.label}</a>
      </div>
    </section>
  );
}
