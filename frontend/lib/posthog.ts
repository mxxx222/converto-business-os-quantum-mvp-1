/**
 * PostHog Analytics Integration
 * Track user behavior and product usage
 */

import posthog from 'posthog-js';

// Initialize PostHog only in browser and production
export function initPostHog(): void {
  if (typeof window === 'undefined') return;

  const apiKey: string | undefined = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const apiHost: string = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!apiKey) {
    console.warn('PostHog not initialized: NEXT_PUBLIC_POSTHOG_API_KEY missing');
    return;
  }

  posthog.init(apiKey, {
    api_host: apiHost,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.opt_out_capturing(); // Don't track in dev
      }
    },
    capture_pageview: true,
    capture_pageleave: true,
  });
}

// Event tracking helpers
export const trackEvent = {
  hotkeyUsed: (key: string, page: string): void => {
    posthog.capture('hotkey_used', { key, page });
  },

  suggestionClicked: (suggestion: string, context: string): void => {
    posthog.capture('suggestion_clicked', { suggestion, context });
  },

  levelUp: (newLevel: number, totalPoints: number): void => {
    posthog.capture('level_up', { new_level: newLevel, total_points: totalPoints });
  },

  roiViewed: (timeSaved: number, moneySaved: number): void => {
    posthog.capture('roi_card_viewed', { time_saved: timeSaved, money_saved: moneySaved });
  },

  aiChatOpened: (tier: string, quotaRemaining: number): void => {
    posthog.capture('ai_chat_opened', { tier, quota_remaining: quotaRemaining });
  },

  upgradeCTAClicked: (fromFeature: string, targetTier: string): void => {
    posthog.capture('upgrade_cta_clicked', { from_feature: fromFeature, target_tier: targetTier });
  },

  receiptScanned: (success: boolean, processingTime: number): void => {
    posthog.capture('receipt_scanned', { success, processing_time: processingTime });
  },

  vatCalculated: (month: string, totalVAT: number): void => {
    posthog.capture('vat_calculated', { month, total_vat: totalVAT });
  },

  notionSynced: (database: string, itemCount: number): void => {
    posthog.capture('notion_synced', { database, item_count: itemCount });
  },

  whatsappSent: (messageType: string): void => {
    posthog.capture('whatsapp_sent', { message_type: messageType });
  }
};

export default posthog;
