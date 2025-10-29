"use client";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle, Clock } from "lucide-react";

type LegalRule = {
  id: string;
  domain: string;
  regulation_code: string;
  title: string;
  summary?: string;
  valid_from: string;
  valid_to?: string;
  source_url?: string;
  is_active: boolean;
};

export default function LegalCard({ rule }: { rule: LegalRule }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {rule.domain}
            </span>
            {rule.is_active ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-600" />
            )}
          </div>
          <h3 className="font-semibold text-lg text-gray-900">{rule.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{rule.regulation_code}</p>
        </div>
      </div>

      {rule.summary && (
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{rule.summary}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Voimassa: {new Date(rule.valid_from).toLocaleDateString("fi-FI")}
        </div>
        {rule.source_url && (
          <a
            href={rule.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Lue Finlexissä
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
