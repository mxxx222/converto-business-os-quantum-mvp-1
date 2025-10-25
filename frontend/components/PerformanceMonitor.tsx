"use client";

import { useEffect, useState } from 'react';
import { Activity, Zap, Clock } from 'lucide-react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const newMetrics: Partial<PerformanceMetrics> = {};

      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          newMetrics.fcp = entry.startTime;
        }
        if (entry.name === 'largest-contentful-paint') {
          newMetrics.lcp = entry.startTime;
        }
        if (entry.name === 'first-input') {
          newMetrics.fid = entry.processingStart - entry.startTime;
        }
        if (entry.name === 'layout-shift') {
          newMetrics.cls = (newMetrics.cls || 0) + (entry as any).value;
        }
      });

      setMetrics((prev) => ({ ...prev, ...newMetrics } as PerformanceMetrics));
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    // TTFB measurement
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics((prev) => ({
        ...prev,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart
      } as PerformanceMetrics));
    }

    return () => observer.disconnect();
  }, []);

  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  const getScore = (value: number, thresholds: [number, number]): string => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  const fcpScore = getScore(metrics.fcp, [1800, 3000]);
  const lcpScore = getScore(metrics.lcp, [2500, 4000]);
  const fidScore = getScore(metrics.fid, [100, 300]);
  const clsScore = getScore(metrics.cls, [0.1, 0.25]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Activity className="w-5 h-5" />
      </button>

      {isVisible && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Performance Monitor
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">FCP</span>
              <span className={`text-sm font-medium ${
                fcpScore === 'good' ? 'text-green-600' :
                fcpScore === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.fcp.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">LCP</span>
              <span className={`text-sm font-medium ${
                lcpScore === 'good' ? 'text-green-600' :
                lcpScore === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.lcp.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">FID</span>
              <span className={`text-sm font-medium ${
                fidScore === 'good' ? 'text-green-600' :
                fidScore === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.fid.toFixed(0)}ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CLS</span>
              <span className={`text-sm font-medium ${
                clsScore === 'good' ? 'text-green-600' :
                clsScore === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.cls.toFixed(3)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">TTFB</span>
              <span className="text-sm font-medium text-blue-600">
                {metrics.ttfb.toFixed(0)}ms
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Development Mode
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
