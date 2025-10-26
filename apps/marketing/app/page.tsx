import Hero from '../components/marketing/Hero';
import ValueProps from '../components/marketing/ValueProps';
import FeaturesGrid from '../components/marketing/FeaturesGrid';
import CTA from '../components/marketing/CTA';

export const revalidate: number = 600;

export default function Page(): JSX.Element {
  return (
    <main>
      <Hero />
      <ValueProps />
      <FeaturesGrid />
      <CTA />
    </main>
  );
}
