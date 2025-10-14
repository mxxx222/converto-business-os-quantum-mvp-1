"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ProviderType = "openai" | "ollama" | "anthropic" | "tesseract";

interface ProviderChipProps {
  aiProvider?: string;
  visionProvider?: string;
  showLatency?: boolean;
}

export function ProviderChip({ aiProvider, visionProvider, showLatency = true }: ProviderChipProps) {
  const [latency, setLatency] = useState<number | null>(null);
  const [aiInfo, setAIInfo] = useState<any>(null);
  const [visionInfo, setVisionInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch provider info
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/ai/whoami`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/vision/whoami`).then(r => r.json())
    ]).then(([ai, vision]) => {
      setAIInfo(ai);
      setVisionInfo(vision);
    }).catch(console.error);

    // Mock latency tracking (would be real in production)
    const interval = setInterval(() => {
      setLatency(Math.random() * 500 + 100); // 100-600ms
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentAI = aiProvider || aiInfo?.default_provider || "openai";
  const currentVision = visionProvider || visionInfo?.default_provider || "openai";

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "openai": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "ollama": return "bg-blue-100 text-blue-800 border-blue-200";
      case "anthropic": return "bg-purple-100 text-purple-800 border-purple-200";
      case "tesseract": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "openai": return "🤖";
      case "ollama": return "🦙";
      case "anthropic": return "🧠";
      case "tesseract": return "📖";
      default: return "🔧";
    }
  };

  const getCost = (provider: string) => {
    switch (provider) {
      case "openai": return "$0.15/1M";
      case "ollama": return "FREE";
      case "anthropic": return "$0.25/1M";
      case "tesseract": return "FREE";
      default: return "—";
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* AI Provider */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getProviderColor(currentAI)}`}
        title={`AI: ${currentAI} (${getCost(currentAI)})`}
      >
        <span>{getProviderIcon(currentAI)}</span>
        <span className="hidden sm:inline">{currentAI}</span>
        {showLatency && latency && (
          <span className="text-[10px] opacity-70">{Math.round(latency)}ms</span>
        )}
      </motion.div>

      {/* Vision Provider */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getProviderColor(currentVision)}`}
        title={`Vision: ${currentVision} (${getCost(currentVision)})`}
      >
        <span>🔍</span>
        <span className="hidden sm:inline">{currentVision}</span>
      </motion.div>
    </div>
  );
}

export function PrivacyChip() {
  const [isLocal, setIsLocal] = useState(false);

  useEffect(() => {
    // Check if using local providers
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/ai/whoami`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE || ""}/api/v1/vision/whoami`).then(r => r.json())
    ]).then(([ai, vision]) => {
      const aiLocal = ai?.default_provider === "ollama";
      const visionLocal = ["ollama", "tesseract"].includes(vision?.default_provider);
      setIsLocal(aiLocal && visionLocal);
    }).catch(console.error);
  }, []);

  if (!isLocal) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1.5"
      title="Data ei poistu Suomesta - 100% paikallinen käsittely"
    >
      <span>🇫🇮</span>
      <span className="hidden sm:inline">Local Intelligence</span>
      <span>🔒</span>
    </motion.div>
  );
}

export function LatencyChip({ latencies = [112, 98, 145, 103, 87] }: { latencies?: number[] }) {
  const avg = latencies.length > 0
    ? latencies.reduce((a, b) => a + b, 0) / latencies.length
    : 0;

  const getColor = (ms: number) => {
    if (ms < 200) return "text-green-600";
    if (ms < 500) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
      <div className="flex items-end gap-[2px] h-4">
        {latencies.slice(-10).map((lat, i) => {
          const height = Math.min(100, (lat / 1000) * 100);
          return (
            <div
              key={i}
              className={`w-1 bg-current ${getColor(lat)}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
      <span className={`text-xs font-medium ${getColor(avg)}`}>
        {Math.round(avg)}ms
      </span>
    </div>
  );
}

export function ConfidenceChip({ confidence }: { confidence: number }) {
  const getColor = () => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800 border-green-200";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getIcon = () => {
    if (confidence >= 0.8) return "✓";
    if (confidence >= 0.6) return "⚠";
    return "✗";
  };

  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getColor()}`}>
      <span>{getIcon()}</span>
      <span>{Math.round(confidence * 100)}%</span>
    </div>
  );
}

export function RiskFlag({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: { color: "bg-green-100 text-green-800 border-green-200", icon: "✓", label: "Matala riski" },
    medium: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "⚠", label: "Keskitaso" },
    high: { color: "bg-red-100 text-red-800 border-red-200", icon: "🚨", label: "Korkea riski" }
  };

  const c = config[level];

  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${c.color}`}>
      <span>{c.icon}</span>
      <span>{c.label}</span>
    </div>
  );
}

