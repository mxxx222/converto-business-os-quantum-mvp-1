/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'strict-dynamic'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'" },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Strict-Transport-Security', value: 'max-age=15552000; includeSubDomains' },
]

const nextConfig = {
  experimental: { runtime: 'edge' },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { runtime: 'edge' },
  transpilePackages: ['@converto/ui']
}

module.exports = nextConfig

