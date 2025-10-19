"use client";
import { motion } from "framer-motion";

export default function LiveSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">📊 Live-yhteenveto</h2>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            ✓ Profiilointi
          </span>
          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
            💡 Tarjousstrategia
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-xl bg-white border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Profiilointi</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Yrityksen koko tunnistettu</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Päätöksentekijä vahvistettu</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Budjetti arvioitu</span>
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-white border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-2">Tarjousstrategia</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Suositeltu paketti:</span>
              <span className="font-semibold text-indigo-600">Pro (€44/kk)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Luottamus:</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Riski:</span>
              <span className="font-semibold text-yellow-600">Matala</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all"
        >
          Päivitä analyysi
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-indigo-300 hover:bg-indigo-50 transition-all"
        >
          Kopioi yhteenveto
        </motion.button>
      </div>
    </motion.div>
  );
}
