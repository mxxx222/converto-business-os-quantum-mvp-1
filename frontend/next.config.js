/** @type {import('next').NextConfig} */
const crypto = require("crypto");

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp']
  },
  webpack: (config, { dev }) => {
    // Avoid noisy PackFileCacheStrategy warnings in dev by using in-memory cache
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  },
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  env: {
    BUSINESS_OS_API_URL: process.env.BUSINESS_OS_API_URL || 'http://localhost:8000',
    VAT_SERVICE_URL: process.env.VAT_SERVICE_URL || 'http://localhost:8010',
    PROMETHEUS_URL: process.env.PROMETHEUS_URL || 'http://localhost:9090',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    GRAFANA_URL: process.env.GRAFANA_URL || 'http://localhost:3000'
  },
  async rewrites() {
    return [
      {
        source: '/api/business-os/:path*',
        destination: `${process.env.BUSINESS_OS_API_URL || 'http://localhost:8000'}/:path*`,
      },
      {
        source: '/api/vat/:path*',
        destination: `${process.env.VAT_SERVICE_URL || 'http://localhost:8010'}/:path*`,
      }
    ]
  },
  async headers() {
    const nonce = crypto.randomBytes(16).toString("base64");
    const isDev = process.env.NODE_ENV !== 'production';
    const permissionsPolicy = isDev
      // Allow camera in development so mobile devices can use input capture
      ? 'camera=(self), geolocation=(), microphone=()'
      // Lock down in production (enable if you explicitly support camera later)
      : 'camera=(), geolocation=(), microphone=()';
    const connectSrc = isDev
      ? "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 ws: wss:"
      : "connect-src 'self'";
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Permissions-Policy', value: permissionsPolicy },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'nonce-${nonce}'`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data:",
              connectSrc,
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'"
            ].join("; ")
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig


