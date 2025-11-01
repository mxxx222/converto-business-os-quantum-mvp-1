/** Analytics tracking for Converto Business OS
 * This file must be tracked in Git for Render builds to succeed
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

export class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  track(event: string, properties?: Record<string, any>): void {
    // Only track on client-side
    if (typeof window === 'undefined') {
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);

    // Send to server-side analytics
    this.sendToServer(analyticsEvent);

    // Send to client-side analytics (Plausible/GA4)
    this.sendToClient(analyticsEvent);

    console.log('Analytics Event:', analyticsEvent);
  }

  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    } catch (error) {
      console.error('Failed to send analytics to server:', error);
    }
  }

  private sendToClient(event: AnalyticsEvent): void {
    // Plausible Analytics (OPTIMIZED: Enhanced tracking)
    if (typeof window !== 'undefined' && (window as any).plausible) {
      // Map common events to Plausible goals
      const goalMap: Record<string, string> = {
        'view_premium': 'Page View',
        'cta_primary_click': 'CTA Click',
        'pricing_select': 'Pricing Select',
        'form_submit': 'Form Submit',
        'book_demo': 'Demo Booking',
        'start_trial': 'Trial Start',
        'thankyou_view': 'Thank You View',
      };

      const goalName = goalMap[event.event] || event.event;
      
      (window as any).plausible(goalName, {
        props: {
          ...event.properties,
          // Add UTM parameters if available
          ...this.getUTMParams(),
        },
      });
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, event.properties);
    }
  }

  // Premium page specific events
  trackPremiumView(): void {
    this.track('view_premium', {
      page: 'premium',
      section: 'hero',
    });
  }

  trackCTAClick(cta_type: string, location: string): void {
    this.track('cta_primary_click', {
      cta_type,
      location,
      page: 'premium',
    });
  }

  trackPricingSelect(plan: string, price: number): void {
    this.track('pricing_select', {
      plan,
      price,
      page: 'premium',
    });
  }

  trackFormSubmit(form_type: string, success: boolean): void {
    this.track('form_submit', {
      form_type,
      success,
      page: 'premium',
    });
  }

  trackThankYouView(): void {
    this.track('thankyou_view', {
      page: 'thankyou',
    });
  }

  trackDemoBooking(): void {
    this.track('book_demo', {
      page: 'premium',
    });
  }

  trackTrialStart(): void {
    this.track('start_trial', {
      page: 'premium',
    });
  }

  // Get UTM parameters
  getUTMParams(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {};
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};

    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    return utmParams;
  }

  // Get all events (for debugging)
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();
