"use client";
import { motion } from "framer-motion";

type BillingCardProps = {
  plan: string;
  price: number;
  onSelect: () => void;
};

export default function BillingCard({ plan, price, onSelect }: BillingCardProps) {
  const perks =
    plan === "Lite"
      ? ["Kuittiskannaus", "Perusraportit", "Email/WA-yhteenvedot"]
      : plan === "Pro"
      ? ["Täysi automaatio", "Viikkoraportit", "Slack/Signal", "Gamify-bonukset"]
      : ["AI-ennusteet", "Cost Guardrails", "PDF Executive"];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl p-6 bg-white shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-lg transition"
    >
      <div>
        <h2 className="text-xl font-semibold mb-1">{plan}</h2>
        <div className="text-3xl font-bold text-indigo-600 mb-4">{price} €/kk</div>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {perks.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onSelect}
        className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-white font-medium hover:bg-indigo-700 transition"
      >
        Tilaa
      </button>
    </motion.div>
  );
}

