import data from '../../content/mapping.json';

export default function FeaturesGrid(): JSX.Element {
  const feats = data.features;
  return (
    <section>
      <div>
        <h2>Ominaisuudet</h2>
        <div>
          {feats.map((f: { title?: string }, index: number) => (
            <div key={f.title || `feature-${index}`}>
              {f.title || String(f)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
