export const runtime = 'edge';
import { fetchUsage } from './actions';
import UsageChart from '../../components/UsageChart';

export default async function UsagePage(): Promise<JSX.Element> {
  const { usage, series, pricing } = await fetchUsage('tenant_demo');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Usage Dashboard</h1>
        <p className="text-sm text-gray-500">Real-time consumption and pricing insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Plan</div>
          <div className="text-xl font-semibold">{usage?.plan_type || 'Free'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Estimated Monthly</div>
          <div className="text-xl font-semibold">€{pricing?.estimated_monthly_total_eur?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-gray-500">Recommendation</div>
          <div className="text-xl font-semibold">{pricing?.plan_recommendation?.recommended_plan || 'Free'}</div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <UsageChart data={series?.series ?? []} />
      </div>
    </div>
  );
}
