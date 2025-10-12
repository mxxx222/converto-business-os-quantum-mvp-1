"use client";
import { motion } from "framer-motion";

type BillingCardProps = {
  plan: string;
  price: number;
  features: string[];
  current?: boolean;
  onSelect: () => void;
};

export default function BillingCard({ plan, price, features, current, onSelect }: BillingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`rounded-2xl p-6 bg-white/80 shadow-md border flex flex-col justify-between ${
        current ? "ring-2 ring-blue-500 border-blue-300" : "border-gray-200"
      }`}
    >
      <div>
        <h2 className="text-xl font-semibold mb-2">{plan}</h2>
        <p className="text-2xl font-bold mb-4">{price} €/kk</p>
        <ul className="space-y-1 text-sm text-gray-600">
          {features.map((f, i) => (
            <li key={i}>• {f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        {current ? (
          <button className="w-full rounded-xl bg-gray-100 py-2 text-gray-600 font-medium" disabled>
            Nykyinen suunnitelma
          </button>
        ) : (
          <button
            onClick={onSelect}
            className="w-full rounded-xl bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition"
          >
            Valitse
          </button>
        )}
      </div>
    </motion.div>
  );
}

