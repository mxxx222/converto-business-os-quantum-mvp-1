"use client";
import { motion } from "framer-motion";
import useSWR from "swr";
import { Receipt, Calendar, DollarSign, ChevronRight, Clock } from "lucide-react";

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json());

type Props = {
  tenant?: string;
  limit?: number;
};

export default function OCRRecent({ tenant = "t_demo", limit = 10 }: Props) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const { data, error } = useSWR(
    `${base}/api/v1/ocr/recent?tenant_id=${tenant}`,
    fetcher,
    { refreshInterval: 10000 }
  );

  const items = (data?.items || []).slice(0, limit);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Virhe ladattaessa kuitteja</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Viimeisimmät kuitit</h3>
              <p className="text-sm text-gray-600">{items.length} viimeisintä</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Päivittyy automaattisesti</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Ei vielä skannattuja kuitteja</p>
            <p className="text-xs text-gray-400 mt-1">Aloita skannaamalla ensimmäinen kuittisi</p>
          </div>
        ) : (
          items.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {/* Merchant & Category */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.data?.merchant || "Tuntematon kauppias"}
                    </h4>
                    {item.data?.category && (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.data.category}
                      </span>
                    )}
                  </div>

                  {/* Date & Details */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.data?.date || item.created_at?.split("T")[0] || "—"}</span>
                    </div>
                    {item.data?.vat && (
                      <span className="text-gray-400">
                        ALV {typeof item.data.vat === "object" ? item.data.vat.rate : item.data.vat}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                      <DollarSign className="w-4 h-4" />
                      <span>{item.data?.total?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="text-xs text-gray-500">{item.data?.currency || "EUR"}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Budget Line */}
              {item.data?.budget_line && (
                <div className="mt-2 text-xs text-gray-500">
                  📊 {item.data.budget_line}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
            Näytä kaikki kuitit →
          </button>
        </div>
      )}
    </div>
  );
}
