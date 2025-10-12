/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  experimental: { 
    serverActions: false 
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };
    return config;
  },
};
