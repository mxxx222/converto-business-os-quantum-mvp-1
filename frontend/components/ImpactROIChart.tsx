/**
 * Impact ROI Chart
 * Line chart showing time & money saved over time
 */

"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ImpactROIChartProps {
  data?: Array<{ date: string; hours: number; euros: number }>;
}

export default function ImpactROIChart({ data }: ImpactROIChartProps) {
  // Sample data (replace with real data from API)
  const chartData = data || [
    { date: "Vko 1", hours: 2.5, euros: 62 },
    { date: "Vko 2", hours: 3.2, euros: 80 },
    { date: "Vko 3", hours: 2.8, euros: 70 },
    { date: "Vko 4", hours: 4.1, euros: 103 }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          📈 Säästetty aika & raha
        </h3>
        <p className="text-sm text-gray-600">
          Automaation tuoma hyöty viimeisen kuukauden ajalta
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            style={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            stroke="#6366f1"
            style={{ fontSize: 12 }}
            label={{ value: "Tunnit", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            style={{ fontSize: 12 }}
            label={{ value: "€", angle: 90, position: "insideRight", style: { fontSize: 12 } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: 12
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="hours"
            stroke="#6366f1"
            strokeWidth={2}
            name="Säästetty aika (h)"
            dot={{ fill: "#6366f1", r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="euros"
            stroke="#10b981"
            strokeWidth={2}
            name="Säästetty raha (€)"
            dot={{ fill: "#10b981", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
          <div className="text-xs text-indigo-600 font-medium">Yhteensä (aika)</div>
          <div className="text-2xl font-bold text-indigo-700">
            {chartData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} h
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <div className="text-xs text-green-600 font-medium">Yhteensä (raha)</div>
          <div className="text-2xl font-bold text-green-700">
            {chartData.reduce((sum, d) => sum + d.euros, 0)} €
          </div>
        </div>
      </div>
    </div>
  );
}
