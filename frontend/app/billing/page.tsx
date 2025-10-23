"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UnifiedHeader } from "@/components/UnifiedHeader";
import ROICalculator from "@/components/pricing/ROICalculator";
import TrustBadges from "@/components/marketing/TrustBadges";
import { toast } from "sonner";

type Plan = {
  id: string;
  name: string;
  price: string;
  features: string[];
  current?: boolean;
};

const plans: Plan[] = [
  { id: "lite", name: "Lite", price: "29 €/kk", features: ["Kuittiskannaus", "Perusraportit"] },
  { id: "pro", name: "Pro", price: "99 €/kk", features: ["Myynnin seuranta", "AI-ehdotukset", "Viikkoraportit"], current: true },
  { id: "insights", name: "Insights", price: "199 €/kk", features: ["Ennusteet", "Kustannusvahti", "PDF-raportit johdolle"] },
];

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout(planId: string) {
    setLoading(true);
    toast.loading("Avataan maksusivu...");
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/stripe/checkout?plan=${planId}`);
      const { url } = await r.json();
      toast.success("Ohjataan Stripeen...");
      window.location.href = url;
    } catch (e) {
      toast.error("❌ Virhe kassan avaamisessa");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <UnifiedHeader
        title="💳 Laskutus"
        confidence={1.0}
        showQuickReplies={true}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Laskutus ja tilaukset</h1>
          <p className="text-lg text-gray-600">Valitse sinulle sopiva paketti</p>
        </div>

        {/* ROI Calculator */}
        <div className="mb-12">
          <ROICalculator />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 mb-12">
          {(Array.isArray(plans) ? plans : []).map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`rounded-2xl border bg-white p-6 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between ${
                p.current ? "ring-2 ring-indigo-600 border-indigo-600" : "border-gray-200"
              }`}
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{p.name}</h2>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{p.price}</p>
                <ul className="mt-6 space-y-3 text-gray-700">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {p.current ? (
                  <button className="w-full rounded-xl bg-gray-100 py-3 text-gray-600 font-medium">
                    Nykyinen suunnitelma
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckout(p.id)}
                    disabled={loading}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? "..." : "Valitse"}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <section className="rounded-2xl bg-white border border-gray-200 p-8 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6">Laskutushistoria</h3>
          <table className="w-full text-sm">
            <thead className="text-gray-600 border-b border-gray-200">
              <tr>
                <th className="text-left py-3">Päivämäärä</th>
                <th className="text-left">Summa</th>
                <th className="text-left">Tila</th>
                <th className="text-left">Lasku</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3">01.09.2025</td>
                <td>99 €</td>
                <td><span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Maksettu</span></td>
                <td>
                  <a href="#" className="text-indigo-600 hover:underline">PDF</a>
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3">01.10.2025</td>
                <td>99 €</td>
                <td><span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Maksettu</span></td>
                <td>
                  <a href="#" className="text-indigo-600 hover:underline">PDF</a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Trust Badges */}
        <div className="mt-12">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
