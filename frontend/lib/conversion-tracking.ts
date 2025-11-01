/**
 * Conversion Tracking Engine - High ROI Analytics
 */

export interface ConversionEvent {
  id: string;
  source: 'landing' | 'chat' | 'pricing' | 'services';
  stage: 'view' | 'pilot' | 'signup' | 'payment';
  timestamp: Date;
  metadata?: Record<string, any>;
}

class ConversionTracker {
  private events: ConversionEvent[] = [];

  track(source: ConversionEvent['source'], stage: ConversionEvent['stage'], metadata?: Record<string, any>) {
    const event: ConversionEvent = {
      id: crypto.randomUUID(),
      source,
      stage,
      timestamp: new Date(),
      metadata,
    };

    this.events.push(event);
    
    // Send to analytics
    this.sendToAnalytics(event);
    
    // Store locally
    this.persistEvent(event);
  }

  private sendToAnalytics(event: ConversionEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', `conversion_${event.stage}`, {
        source: event.source,
        timestamp: event.timestamp.toISOString(),
        ...event.metadata,
      });
    }

    // Plausible
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible(`Conversion: ${event.stage}`, {
        props: {
          source: event.source,
          ...event.metadata,
        },
      });
    }
  }

  private persistEvent(event: ConversionEvent) {
    try {
      const stored = localStorage.getItem('converto_conversions') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('converto_conversions', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to persist conversion event:', error);
    }
  }

  getConversionFunnel() {
    const funnel = {
      views: this.events.filter(e => e.stage === 'view').length,
      pilots: this.events.filter(e => e.stage === 'pilot').length,
      signups: this.events.filter(e => e.stage === 'signup').length,
      payments: this.events.filter(e => e.stage === 'payment').length,
    };

    return {
      ...funnel,
      pilotConversion: funnel.views > 0 ? (funnel.pilots / funnel.views * 100).toFixed(1) : '0',
      signupConversion: funnel.pilots > 0 ? (funnel.signups / funnel.pilots * 100).toFixed(1) : '0',
      paymentConversion: funnel.signups > 0 ? (funnel.payments / funnel.signups * 100).toFixed(1) : '0',
    };
  }
}

export const conversionTracker = new ConversionTracker();

// Helper hooks for React components
export function useConversionTracking() {
  return {
    trackView: (source: ConversionEvent['source'], metadata?: Record<string, any>) => 
      conversionTracker.track(source, 'view', metadata),
    trackPilot: (source: ConversionEvent['source'], metadata?: Record<string, any>) => 
      conversionTracker.track(source, 'pilot', metadata),
    trackSignup: (source: ConversionEvent['source'], metadata?: Record<string, any>) => 
      conversionTracker.track(source, 'signup', metadata),
    trackPayment: (source: ConversionEvent['source'], metadata?: Record<string, any>) => 
      conversionTracker.track(source, 'payment', metadata),
  };
}

// Global window types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, any> }) => void;
  }
}