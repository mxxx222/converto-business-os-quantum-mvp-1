/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { runtime: 'edge' },
  transpilePackages: ['@converto/ui']
}

module.exports = nextConfig

