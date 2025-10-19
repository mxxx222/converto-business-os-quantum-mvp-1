"use client";
import { t } from "@/lib/i18n";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6">
        <div className="text-sm text-gray-700">
          🔥 <span className="font-medium">{t("ctaBannerText") || "Valmis sulkemaan kaupan?"}</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.location.href = "/leads"}
            className="rounded-lg bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 active:scale-95 transition-all"
          >
            {t("cta.openLead") || "Avaa mahdollisuus"}
          </button>
          <button
            onClick={() => window.location.href = "/hotleads"}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
          >
            {t("cta.openHotLeads") || "Avaa HotLeadit"}
          </button>
        </div>
      </div>
    </div>
  );
}
