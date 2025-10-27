import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://converto.fi';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/pilot`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/legal`, changeFrequency: 'yearly', priority: 0.2 }
  ];
}
