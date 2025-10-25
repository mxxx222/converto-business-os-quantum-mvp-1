"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  data?: Array<{
    date: string;
    usage: number;
    cost: number;
  }>;
}

export default function UsageChart({ data = [] }: UsageChartProps): JSX.Element {
  const defaultData: Array<{ date: string; usage: number; cost: number }> = [
    { date: '2025-01-01', usage: 100, cost: 25.50 },
    { date: '2025-01-02', usage: 150, cost: 38.25 },
    { date: '2025-01-03', usage: 200, cost: 51.00 },
    { date: '2025-01-04', usage: 180, cost: 45.90 },
    { date: '2025-01-05', usage: 220, cost: 56.10 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-semibold text-gray-900 mb-4">Usage Chart</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#0047FF"
              strokeWidth={2}
              name="Usage"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#059669"
              strokeWidth={2}
              name="Cost"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
