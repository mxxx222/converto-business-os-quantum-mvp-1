"use client";
import { motion } from "framer-motion";
import { CreditCard, Calendar, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

type Subscription = {
  id: string;
  plan: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
} | null;

type Props = {
  subscription: Subscription;
};

export default function BillingStatus({ subscription }: Props) {
  if (!subscription) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center"
      >
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ei aktiivista tilausta</h3>
        <p className="text-sm text-gray-600 mb-4">Valitse sopiva suunnitelma alta päästäksesi alkuun</p>
      </motion.div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("fi-FI", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isActive = subscription.status === "active";
  const daysLeft = Math.ceil((subscription.current_period_end - Date.now() / 1000) / 86400);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-indigo-50 p-6 shadow-lg"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Aktiivinen tilaus</h3>
          </div>
          <p className="text-sm text-gray-600">Nykyisen tilauksen tiedot</p>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
          isActive
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}>
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">{isActive ? "Aktiivinen" : subscription.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Plan */}
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-gray-500 uppercase">Suunnitelma</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{subscription.plan}</div>
        </div>

        {/* Renewal Date */}
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-gray-500 uppercase">Uusiutuu</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatDate(subscription.current_period_end)}
          </div>
          <div className="text-xs text-gray-500 mt-1">{daysLeft} päivää jäljellä</div>
        </div>

        {/* Status */}
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-medium text-gray-500 uppercase">Tila</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {subscription.cancel_at_period_end ? "Päättyy kauden lopussa" : "Automaattinen uusinta"}
          </div>
        </div>
      </div>

      {/* Cancel Warning */}
      {subscription.cancel_at_period_end && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Tilaus päättyy</p>
            <p className="text-xs text-yellow-700 mt-1">
              Tilauksesi päättyy {formatDate(subscription.current_period_end)}. Jos haluat jatkaa, ota yhteyttä tukeen.
            </p>
          </div>
        </motion.div>
      )}

      {/* Action Links */}
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
          Muuta suunnitelmaa
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium hover:underline">
          Hallinnoi korttia
        </button>
      </div>
    </motion.div>
  );
}
