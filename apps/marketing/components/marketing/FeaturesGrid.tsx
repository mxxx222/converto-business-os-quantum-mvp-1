import data from '../../content/mapping.json';

export default function FeaturesGrid(): JSX.Element {
  const feats = data.features;
  return (
    <section>
      <div>
        <h2>Ominaisuudet</h2>
        <div>
          {feats.map((f: { title?: string }) => (
            <div key={f.title || f}>
              {f.title || f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
