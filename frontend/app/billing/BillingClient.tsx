"use client";
import React from "react";

type Plan = {
  id: string;
  name: string;
  price?: string | number;
  features?: string[];
  current?: boolean;
};

export default function BillingClient({ plans }: { plans?: Plan[] }) {
  const safePlans = Array.isArray(plans) ? plans : [];
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing</h1>
      <div className="grid gap-4">
        {safePlans.map((p) => (
          <section key={p.id} className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">{p.name}</h2>
            <p className="text-sm opacity-80">Price: {p.price ?? "—"}</p>
            {Array.isArray(p.features) && p.features.length > 0 && (
              <ul className="list-disc ml-5 mt-2">
                {p.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
