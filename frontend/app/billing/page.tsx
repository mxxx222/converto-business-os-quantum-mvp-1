"use client";
import { useBilling } from "./hooks/useBilling";
import BillingCard from "./components/BillingCard";
import BillingHistory from "./components/BillingHistory";
import BillingStatus from "./components/BillingStatus";
import GamifyWidget from "./components/GamifyWidget";
import dynamic from "next/dynamic";

const RewardsList = dynamic(() => import("@/components/RewardsList"), { ssr: false });
const WalletWidget = dynamic(() => import("@/components/WalletWidget"), { ssr: false });

export default function BillingPage() {
  const customerId = "cus_demo123";
  const { invoices, subscription, loading } = useBilling(customerId);

  async function startCheckout(plan: string) {
    const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
    try {
      const res = await fetch(`${base}/api/v1/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: "demo@converto.fi" }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch (e) {
      alert("Virhe kassan avaamisessa. Tarkista backend.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* HERO */}
      <header className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-cyan-500 text-white shadow-2xl">
        <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Laskutus & Palkinnot</h1>
          <p className="text-white/90 text-lg">Päivitä suunnitelma, katso laskut ja lunasta palkintoja Gamify-pisteillä.</p>
        </div>
      </header>

      {/* STATUS */}
      {loading ? (
        <div className="text-sm text-gray-500">Ladataan…</div>
      ) : (
        <BillingStatus subscription={subscription} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Plans + History */}
        <section className="lg:col-span-2 space-y-6">
          {/* PLANS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BillingCard plan="Lite" price={19} onSelect={() => startCheckout("lite")} />
            <BillingCard plan="Pro" price={49} onSelect={() => startCheckout("pro")} />
            <BillingCard plan="Insights" price={99} onSelect={() => startCheckout("insights")} />
          </div>

          {/* HISTORY */}
          <BillingHistory invoices={invoices} />
        </section>

        {/* Right: Gamify + Wallet + Rewards */}
        <aside className="space-y-6">
          <GamifyWidget tenant="demo" />
          <WalletWidget tenant="demo" user="user_demo" />
          <RewardsList tenant="demo" />
        </aside>
      </div>
    </div>
  );
}
