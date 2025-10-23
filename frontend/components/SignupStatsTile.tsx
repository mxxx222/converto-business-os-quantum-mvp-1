"use client";

import { useEffect, useState } from "react";
import { Users, TrendingUp, Mail, AlertTriangle } from "lucide-react";

interface SignupStats {
  total: number;
  last_24h: number;
  confirmations_sent: number;
  bounce_count: number;
}

export default function SignupStatsTile(): JSX.Element | null {
  const [stats, setStats] = useState<SignupStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v2/stats/signups');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">Virhe tilastojen latauksessa</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Rekisteröitymiset</h3>
        <Users className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Yhteensä</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-green-600 flex items-center">
            {stats.last_24h}
            <TrendingUp className="w-4 h-4 ml-1" />
          </div>
          <div className="text-sm text-gray-600">Viime 24h</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-1" />
            Lähetetty: {stats.confirmations_sent}
          </div>
          {stats.bounce_count > 0 && (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Bounce: {stats.bounce_count}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => {
            const csvContent = `data:text/csv;charset=utf-8,Yhteensä,Viime 24h,Lähetetty,Bounce\n${stats.total},${stats.last_24h},${stats.confirmations_sent},${stats.bounce_count}`;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "signup_stats.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 px-3 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Lataa CSV
        </button>
      </div>
    </div>
  );
}
