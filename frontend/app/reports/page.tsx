"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share2 } from "lucide-react";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function ReportsPage() {
  const month = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">Raportit</h1>
        <p className="text-white/90">Lataa kuukausi- ja kvartaaliraportit</p>
      </div>

      <Card className="bg-white/80 backdrop-blur border-gray-200 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Valitse kuukausi
            </label>
            <input
              type="month"
              defaultValue={month}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <a
              href={`${base}/api/v1/reports/monthly.pdf?month=${month}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                <FileText className="w-4 h-4 mr-2" />
                Lataa PDF
              </Button>
            </a>

            <a
              href={`${base}/api/v1/reports/monthly.csv?month=${month}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <Download className="w-4 h-4 mr-2" />
                Lataa CSV
              </Button>
            </a>

            <a
              href={`${base}/api/v1/reports/share?month=${month}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Share2 className="w-4 h-4 mr-2" />
                Jaa kirjanpitäjälle
              </Button>
            </a>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              💡 Raportit sisältävät kaikki kuitit, ALV-erittelyn ja yhteenvedon kuukaudelta.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

