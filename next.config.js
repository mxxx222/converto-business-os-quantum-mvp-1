/**
 * @type {import('next').NextConfig}
 *
 * Vercel previously detected the project as a static export which resulted in
 * requests being served the generic 404 page.  Opting into the standalone
 * output ensures Vercel provisions the Node.js runtime so App Router pages are
 * served by Next.js rather than the static export fallback.
 */
const nextConfig = {
  // Ensure Vercel provisions a Node.js runtime instead of treating the build as
  // a static export (`nextExport: true`).
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Align lint behaviour between local builds and Vercel.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
