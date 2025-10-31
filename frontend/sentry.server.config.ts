import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_RUNTIME === 'nodejs') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.2,
    environment: process.env.NODE_ENV || 'development',
    // Server-side specific config
    integrations: [
      Sentry.httpIntegration(),
    ],
  });
}

export { Sentry };

