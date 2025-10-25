import type { NextRequest } from 'next/server';

const LEGACY_DEFAULT_TENANT = '550e8400-e29b-41d4-a716-446655440000';

const runtimeDefaultTenant =
  process.env.NEXT_PUBLIC_DEMO_TENANT_ID ||
  process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ||
  LEGACY_DEFAULT_TENANT;

interface TenantRequestLike {
  headers: Headers;
  nextUrl?: URL;
  url?: string;
}

function normaliseTenantId(candidate?: string | null): string | null {
  if (!candidate) return null;
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function getDefaultTenantId(): string {
  return runtimeDefaultTenant;
}

type TenantRequestSource = NextRequest | Request | TenantRequestLike;

export function getTenantIdFromRequest(request: TenantRequestSource): string {
  const headerTenant = normaliseTenantId(request.headers.get('x-tenant-id'))
    || normaliseTenantId(request.headers.get('x-tenant'))
    || normaliseTenantId(request.headers.get('x-organisation-id'));

  if (headerTenant) {
    return headerTenant;
  }

  const searchSource = 'nextUrl' in request && request.nextUrl
    ? request.nextUrl
    : request.url
      ? new URL(request.url)
      : null;

  if (searchSource) {
    const queryTenant = normaliseTenantId(searchSource.searchParams.get('tenantId'))
      || normaliseTenantId(searchSource.searchParams.get('tenant_id'))
      || normaliseTenantId(searchSource.searchParams.get('tenant'));

    if (queryTenant) {
      return queryTenant;
    }
  }

  return getDefaultTenantId();
}

export function getClientTenantId(): string {
  if (typeof window !== 'undefined') {
    const fromStorage = normaliseTenantId(window.localStorage.getItem('tenantId'));
    if (fromStorage) {
      return fromStorage;
    }
  }

  return getDefaultTenantId();
}

export function persistClientTenantId(tenantId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('tenantId', tenantId);
}
