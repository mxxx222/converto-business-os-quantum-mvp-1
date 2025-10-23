export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

import React from 'react';
import BillingClient from "./BillingClient";

async function getPlans() {
  try {
    return [] as any[];
  } catch {
    return [] as any[];
  }
}

export default async function BillingPage() {
  const plans = await getPlans();
  return <BillingClient plans={plans} />;
}
