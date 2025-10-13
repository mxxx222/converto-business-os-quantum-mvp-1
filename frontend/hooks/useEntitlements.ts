/**
 * Entitlements Hook
 * Check user's subscription tier and enabled features
 */

"use client";
import { useEffect, useState } from "react";

interface Entitlements {
  tier: "starter" | "pro" | "business" | "enterprise";
  modules: {
    ai_chat?: boolean;
    notion_sync?: boolean;
    whatsapp?: boolean;
    bank_sync?: boolean;
    logistics?: boolean;
    legal_ml?: boolean;
  };
  limits: {
    ocr_scans_per_month: number;
    ai_tokens_per_month: number;
    users: number;
  };
  usage: {
    ocr_scans_used: number;
    ai_tokens_used: number;
    ai_chat_queries_used: number;
  };
}

export function useEntitlements(tenantId?: string) {
  const [entitlements, setEntitlements] = useState<Entitlements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntitlements() {
      try {
        // For MVP: Load from /api/v1/entitlements or mock
        // In production: Fetch from backend based on Stripe subscription
        
        // Mock data for demo
        const mockEntitlements: Entitlements = {
          tier: "pro",
          modules: {
            ai_chat: true,
            notion_sync: true,
            whatsapp: true,
            bank_sync: false,
            logistics: false,
            legal_ml: false
          },
          limits: {
            ocr_scans_per_month: 500,
            ai_tokens_per_month: 400000,
            users: 3
          },
          usage: {
            ocr_scans_used: 42,
            ai_tokens_used: 12500,
            ai_chat_queries_used: 15
          }
        };

        setEntitlements(mockEntitlements);
      } catch (error) {
        console.error("Failed to fetch entitlements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntitlements();
  }, [tenantId]);

  const hasFeature = (feature: keyof Entitlements["modules"]) => {
    return entitlements?.modules[feature] || false;
  };

  const isNearLimit = (metric: "ocr" | "ai_tokens" | "ai_chat") => {
    if (!entitlements) return false;

    switch (metric) {
      case "ocr":
        return (
          entitlements.usage.ocr_scans_used / entitlements.limits.ocr_scans_per_month >= 0.9
        );
      case "ai_tokens":
        return (
          entitlements.usage.ai_tokens_used / entitlements.limits.ai_tokens_per_month >= 0.9
        );
      case "ai_chat":
        // AI chat has fixed limit of 100/month for Pro
        return entitlements.usage.ai_chat_queries_used >= 90;
      default:
        return false;
    }
  };

  return {
    entitlements,
    loading,
    hasFeature,
    isNearLimit,
    tier: entitlements?.tier,
    usage: entitlements?.usage,
    limits: entitlements?.limits
  };
}

