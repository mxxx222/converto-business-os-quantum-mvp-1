/**
 * Cloudflare Image Loader for Next.js
 * Enables automatic image optimization via Cloudflare
 */

export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`];
  
  if (quality) {
    params.push(`quality=${quality}`);
  }
  
  // Format: Auto (WebP/AVIF)
  params.push('format=auto');
  
  // Sharpening: Auto
  params.push('sharpen=1');
  
  // Build Cloudflare Image Resizing URL
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_URL || 'https://cdn.converto.fi';
  return `${baseUrl}/cdn-cgi/image/${params.join(',')}/${src}`;
}

