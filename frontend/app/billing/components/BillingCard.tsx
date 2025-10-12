"use client";
import { motion } from "framer-motion";
import { Check, Zap, Shield, Star } from "lucide-react";

type Props = {
  plan: string;
  price: number;
  features?: string[];
  popular?: boolean;
  onSelect: () => void;
};

const defaultFeatures: Record<string, string[]> = {
  Lite: [
    "Kuittiskannaus (50/kk)",
    "Perus ALV-laskelmat",
    "7 päivän historia",
    "Email-tuki"
  ],
  Pro: [
    "Rajaton kuittiskannaus",
    "Automaattinen ALV-raportointi",
    "30 päivän historia",
    "AI-suositukset",
    "Gamify-pisteet",
    "Priority-tuki"
  ],
  Insights: [
    "Kaikki Pro-ominaisuudet",
    "Ennustava analytiikka",
    "Quantum Shield -salaus",
    "Rajaton historia",
    "Export CSV/PDF",
    "P2E Token-bonus",
    "Dedicated account manager"
  ]
};

const icons: Record<string, any> = {
  Lite: Zap,
  Pro: Star,
  Insights: Shield
};

const colors: Record<string, string> = {
  Lite: "from-blue-500 to-cyan-500",
  Pro: "from-indigo-600 to-purple-600",
  Insights: "from-purple-600 to-pink-600"
};

export default function BillingCard({ plan, price, features, popular = false, onSelect }: Props) {
  const Icon = icons[plan] || Zap;
  const featureList = features || defaultFeatures[plan] || [];
  const gradient = colors[plan] || "from-gray-500 to-gray-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border-2 ${
        popular ? "border-indigo-500 shadow-2xl" : "border-gray-200 shadow-lg"
      } bg-white p-6 transition-all duration-300`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
            SUOSITUIN
          </div>
        </div>
      )}

      {/* Gradient Background Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 hover:opacity-5 transition-opacity`} />

      <div className="relative z-10">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{plan}</h3>
            <p className="text-sm text-gray-500">Kuukausihinta</p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-xl text-gray-600">€</span>
            <span className="text-sm text-gray-500">/kk</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">+ ALV 24%</p>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-6">
          {featureList.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelect}
          className={`w-full py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all ${
            popular
              ? `bg-gradient-to-r ${gradient}`
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          Valitse {plan}
        </motion.button>

        {popular && (
          <p className="text-xs text-center text-gray-500 mt-3">
            🎉 14 päivän rahat takaisin -takuu
          </p>
        )}
      </div>
    </motion.div>
  );
}
