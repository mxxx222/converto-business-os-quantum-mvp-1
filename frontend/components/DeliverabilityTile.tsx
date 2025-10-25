"use client";
import { useEffect, useState } from "react";
import { Mail, AlertTriangle } from "lucide-react";

interface HealthData {
  mail?: {
    bounces_24h?: number;
    sent_24h?: number;
  };
}

export default function DeliverabilityTile(): JSX.Element {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v2/health`, { cache: 'no-store' });
        setData(await response.json());
      } catch (err) {
        console.error('Failed to fetch deliverability data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const id = setInterval(fetchData, 30000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const sent: number = data?.mail?.sent_24h ?? 0;
  const bounces: number = data?.mail?.bounces_24h ?? 0;
  const rate: number = sent > 0 ? bounces / sent : 0;
  const danger: boolean = rate > 0.02;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Toimitettavuus</h3>
        <Mail className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Lähetetty 24h:</span>
          <span className="font-medium">{sent}</span>
        </div>
        <div className="flex justify-between">
          <span>Bounce 24h:</span>
          <span className="font-medium">{bounces}</span>
        </div>
      </div>

      {danger && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">
              Bounce-prosentti &gt; 2% — tarkista SPF/DKIM/DMARC
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
