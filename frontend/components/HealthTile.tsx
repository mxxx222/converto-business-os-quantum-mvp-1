"use client";

import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface HealthStatus {
  status: string;
  timestamp: string;
  version: string;
  uptime_seconds: number;
  error_rate_10m?: number;
  p95_ms?: number;
}

export default function HealthTile() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUnreachable, setLastUnreachable] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/v2/health');
        const data: HealthStatus = await response.json();

        if (response.ok) {
          setHealth(data);
          setLastUnreachable(null);
        } else {
          setHealth(data);
          if (data.status !== 'ok') {
            setLastUnreachable(new Date());
          }
        }
        setError(null);
      } catch {
        setError('Service unreachable');
        setLastUnreachable(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();

    // Check every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    if (error || !health) return 'text-red-600';
    if (health.status === 'ok') return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = (): JSX.Element => {
    if (error || !health) return <XCircle className="w-5 h-5" />;
    if (health.status === 'ok') return <CheckCircle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getErrorBadge = (): JSX.Element | null => {
    if (!health?.error_rate_10m) return null;

    const isHighErrorRate = health.error_rate_10m > 2;
    const isUnreachable = lastUnreachable && (Date.now() - lastUnreachable.getTime()) > 5 * 60 * 1000;

    if (isHighErrorRate || isUnreachable) {
      return (
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative">
      {getErrorBadge()}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Järjestelmän tila</h3>
        <Activity className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="flex items-center mb-4">
        {getStatusIcon()}
        <span className={`ml-2 font-medium ${getStatusColor()}`}>
          {error ? 'Ei yhteyttä' : health?.status === 'ok' ? 'Kaikki OK' : 'Huomioita'}
        </span>
      </div>

      {health && (
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Versio:</span>
            <span className="font-mono">{health.version}</span>
          </div>

          <div className="flex justify-between">
            <span>Uptime:</span>
            <span>{Math.floor(health.uptime_seconds / 3600)}h {Math.floor((health.uptime_seconds % 3600) / 60)}m</span>
          </div>

          {health.p95_ms && (
            <div className="flex justify-between">
              <span>P95 latenssi:</span>
              <span>{health.p95_ms}ms</span>
            </div>
          )}

          {health.error_rate_10m !== undefined && (
            <div className="flex justify-between">
              <span>Virheprosentti (10min):</span>
              <span className={health.error_rate_10m > 2 ? 'text-red-600 font-medium' : ''}>
                {health.error_rate_10m.toFixed(1)}%
              </span>
            </div>
          )}

          {lastUnreachable && (
            <div className="flex justify-between text-red-600">
              <span>Ei yhteyttä:</span>
              <span>{Math.floor((Date.now() - lastUnreachable.getTime()) / 1000 / 60)} min sitten</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
