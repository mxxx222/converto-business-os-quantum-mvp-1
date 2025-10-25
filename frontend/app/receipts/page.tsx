"use client";
import RecentReceipts from "@/components/RecentReceipts";
import VATSummary from "@/components/VATSummary";

export default function ReceiptsPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            Kuittien hallinta
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Lataa kuitteja, analysoi ne OCR:llä ja seuraa ALV-velkaa
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <RecentReceipts />
          </div>
          <div>
            <VATSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
