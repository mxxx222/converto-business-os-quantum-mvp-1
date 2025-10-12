/**
 * Unified API client with JWT authentication.
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const data = await api('/api/v1/gamify/summary?tenant_id=demo');
 */

export async function api(path: string, init: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
  const jwt = process.env.NEXT_PUBLIC_DEV_JWT; // dev only - replace with auth provider in production
  
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> || {}),
  };
  
  // Add JWT if available
  if (jwt) {
    headers["Authorization"] = `Bearer ${jwt}`;
  }
  
  // Merge with init
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  
  return res.json();
}

/**
 * SWR fetcher that uses the api() helper.
 */
export const apiFetcher = (url: string) => api(url);

