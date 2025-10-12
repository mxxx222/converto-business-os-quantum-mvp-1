"use client";
import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

export default function TrendChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Stub data – replace with /api/v1/gamify/admin/trend
    setData([
      { d: "Ma", mint: 120, burn: 40 },
      { d: "Ti", mint: 140, burn: 60 },
      { d: "Ke", mint: 150, burn: 50 },
      { d: "To", mint: 160, burn: 70 },
      { d: "Pe", mint: 200, burn: 110 },
      { d: "La", mint: 130, burn: 40 },
      { d: "Su", mint: 90, burn: 30 },
    ]);
  }, []);

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="d" stroke="#9ca3af" style={{ fontSize: 12 }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}
            labelStyle={{ color: "#374151", fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="mint" stroke="#6366f1" fill="url(#mintGradient)" strokeWidth={2} />
          <Area type="monotone" dataKey="burn" stroke="#06b6d4" fill="url(#burnGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

