/**
 * AI Console - Developer Panel
 * Accessible only with NEXT_PUBLIC_DEV_AI=1
 */

"use client";
import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

export default function AIConsolePage() {
  const [prompt, setPrompt] = useState("");
  const [systemMessage, setSystemMessage] = useState("You are a helpful business assistant.");
  const [model, setModel] = useState("gpt-4o-mini");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if dev mode is enabled
  const devEnabled = process.env.NEXT_PUBLIC_DEV_AI === "1";

  if (!devEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            AI Console requires NEXT_PUBLIC_DEV_AI=1
          </p>
        </div>
      </div>
    );
  }

  async function sendPrompt() {
    setLoading(true);
    setResponse("");

    try {
      // Call OpenAI directly (dev mode only)
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY || ""}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
          ],
          max_tokens: 500
        })
      });

      const data = await res.json();
      setResponse(data.choices?.[0]?.message?.content || "No response");
    } catch (error) {
      setResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              AI Console (Dev Mode)
            </h1>
          </div>
          <p className="text-gray-600">
            Raw AI testing panel - not available to customers
          </p>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Configuration</h2>

          <div className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Model</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="gpt-4o-mini">gpt-4o-mini (fast, cheap)</option>
                <option value="gpt-4o">gpt-4o (advanced)</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
              </select>
            </div>

            {/* System Message */}
            <div>
              <label className="block text-sm font-medium mb-1">System Message</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
                rows={3}
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="font-semibold mb-4">Prompt</h2>

          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono mb-4"
            rows={6}
            placeholder="Enter your prompt..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={sendPrompt}
            disabled={loading || !prompt.trim()}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Prompt
              </>
            )}
          </button>
        </div>

        {/* Response */}
        {response && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="font-semibold mb-4">Response</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
              {response}
            </pre>
          </div>
        )}

        {/* Quick Templates */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Dev Only</h3>
          <p className="text-sm text-amber-800">
            This panel is only accessible with <code className="bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_DEV_AI=1</code>.
            It makes direct OpenAI API calls and is not rate-limited.
          </p>
          <p className="text-sm text-amber-800 mt-2">
            For customer-facing AI chat, use the Pro tier feature with quota tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
