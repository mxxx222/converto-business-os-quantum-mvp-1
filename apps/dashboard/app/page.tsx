import Link from 'next/link';

export default function DashboardHome(): JSX.Element {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Converto Dashboard</h1>
      <p className="text-gray-600 mb-4">Business OS Dashboard - Coming Soon</p>
      <div className="space-x-4">
        <Link className="underline" href="/coming-soon">Coming Soon</Link>
        <Link className="underline" href="/contact">Contact</Link>
      </div>
    </div>
  );
}
