"use client";
import { motion } from "framer-motion";
import { Scale, Shield, FileText, Users } from "lucide-react";
import { useLegal } from "./hooks/useLegal";
import LegalCard from "./components/LegalCard";
import LegalSyncButton from "./components/LegalSyncButton";

export default function LegalPage() {
  const { rules, loading, refresh } = useLegal();

  const domains = [
    { name: "Tax", icon: FileText, color: "from-blue-500 to-cyan-500" },
    { name: "Employment", icon: Users, color: "from-purple-500 to-pink-500" },
    { name: "DataProtection", icon: Shield, color: "from-emerald-500 to-teal-500" },
    { name: "General", icon: Scale, color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Legal Compliance Engine™</h1>
          </div>
          <p className="text-white/90 text-lg">
            Seuraa lakimuutoksia automaattisesti - Finlex, Vero.fi ja EU-säädökset
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Domains */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {domains.map((domain, i) => {
            const Icon = domain.icon;
            const count = rules.filter((r: any) => r.domain === domain.name && r.is_active).length;
            return (
              <motion.div
                key={domain.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${domain.color} text-white rounded-xl p-4 shadow-lg`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="text-sm font-medium">{domain.name}</div>
                <div className="text-2xl font-bold">{count}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Säännöt ja päivitykset</h2>
          <LegalSyncButton onSync={refresh} />
        </div>

        {/* Rules Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Ladataan lakitietoja...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ei vielä sääntöjä</h3>
            <p className="text-gray-600 mb-4">Aloita synkronoimalla lakitietokanta</p>
            <LegalSyncButton onSync={refresh} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule: any) => (
              <LegalCard key={rule.id} rule={rule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
