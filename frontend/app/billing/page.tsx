"use client";
import { useBilling } from "./hooks/useBilling";
import BillingCard from "./components/BillingCard";
import BillingHistory from "./components/BillingHistory";
import BillingStatus from "./components/BillingStatus";
import GamifyWidget from "./components/GamifyWidget";

const plans = [
  { id: "lite", name: "Lite", price: 29, features: ["Kuittiskannaus", "Perusraportit"] },
  { id: "pro", name: "Pro", price: 99, features: ["Myynnin seuranta", "AI-ehdotukset", "Viikkoraportit"] },
  { id: "insights", name: "Insights", price: 199, features: ["Ennusteet", "Kustannusvahti", "PDF-raportit johdolle"] },
];

export default function BillingPage() {
  const customerId = "cus_demo123"; // TODO: hae käyttäjän customer_id
  const { invoices, subscription, loading } = useBilling(customerId);

  async function startCheckout(planId: string) {
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
    try {
      const res = await fetch(`${base}/api/v1/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, email: "demo@converto.fi" }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch (e) {
      alert("Virhe kassan avaamisessa. Tarkista backend.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-gray-500">Ladataan laskutustietoja...</p>
      </div>
    );
  }

  const currentPlan = subscription?.plan?.toLowerCase();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold mb-4">Laskutus & Palkinnot</h1>

      <BillingStatus subscription={subscription} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <BillingCard
            key={p.id}
            plan={p.name}
            price={p.price}
            features={p.features}
            current={currentPlan === p.id}
            onSelect={() => startCheckout(p.id)}
          />
        ))}
      </div>

      <BillingHistory invoices={invoices} />

      <GamifyWidget tenant="demo" />
    </div>
  );
}
