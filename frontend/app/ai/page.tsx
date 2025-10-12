"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Lock } from "lucide-react";

const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

export default function AIPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/v1/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer || "Tarvitset AI-lisäpalvelun. Tilaa Pro.");
    } catch (e) {
      setAnswer("Virhe: AI-palvelu ei vastaa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-8 h-8" />
          <h1 className="text-2xl font-bold">AI-avustaja</h1>
        </div>
        <p className="text-white/90">Kysy mitä tahansa verotuksesta tai kirjanpidosta</p>
      </div>

      <Card className="bg-white/80 backdrop-blur border-gray-200 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Kysymyksesi
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Esim: Miten teen ALV-ilmoituksen? Mihin kategoriaan ruokaostokset kuuluvat?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={ask}
              disabled={loading || !question.trim()}
              className="flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700"
            >
              {loading ? "Ajattelee..." : "Kysy AI:lta"}
            </Button>
            <a href="/billing" className="block">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <Lock className="w-4 h-4 mr-2" />
                Avaa Pro
              </Button>
            </a>
          </div>

          {answer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Vastaus:</div>
              <div className="text-sm text-gray-900 whitespace-pre-wrap">{answer}</div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 AI-avustaja on saatavilla Pro-tilauksella (49 €/kk) tai lisäpalveluna (+9 €/kk).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

