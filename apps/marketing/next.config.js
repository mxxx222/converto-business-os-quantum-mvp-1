const nextConfig = {
  reactStrictMode: true,
  experimental: { optimizePackageImports: ["clsx"] },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
      '@content': require('path').resolve(__dirname, './content'),
    };
    return config;
  },
};

module.exports = nextConfig;
