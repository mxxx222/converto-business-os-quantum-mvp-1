import data from '../../content/mapping.json';

export default function ValueProps(): JSX.Element {
  return (
    <section>
      <ul>
        {data.valueProps.map((v: { title: string; desc: string }) => (
          <li key={v.title}>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
