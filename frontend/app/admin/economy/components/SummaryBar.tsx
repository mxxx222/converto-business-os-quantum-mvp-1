"use client";

export default function SummaryBar() {
  // Stub KPIs – wire to /api/v1/gamify/admin/kpis later
  const kpi = [
    { label: "Token-inflaatio", value: "+2.1% /vk", trend: "up" },
    { label: "Redeem-aste", value: "34%", trend: "neutral" },
    { label: "Streak ≥3d", value: "62%", trend: "up" },
    { label: "Avg. CT / käyttäjä", value: "128", trend: "up" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpi.map((x) => (
        <div key={x.label} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md transition">
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{x.label}</div>
          <div className="text-xl font-bold text-gray-800">{x.value}</div>
          {x.trend === "up" && <div className="text-xs text-green-600 mt-1">↑ Trending up</div>}
        </div>
      ))}
    </div>
  );
}

