import BillingClient from "./BillingClient";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

// Ensure Next does not attempt to pre-render this route at build time
// Note: cannot export generateStaticParams in a client component; rely on dynamic rendering

export default function BillingPage() {
  return <BillingClient />;
}
