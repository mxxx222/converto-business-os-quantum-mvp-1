"use client";

type Subscription = {
  plan: string;
  status: string;
  current_period_end: number;
};

export default function BillingStatus({ subscription }: { subscription?: Subscription }) {
  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">Ei aktiivista tilausta. Valitse suunnitelma alla!</p>
      </div>
    );
  }
  const next = new Date(subscription.current_period_end * 1000).toLocaleDateString("fi-FI");

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-lg p-4 mb-4">
      <p className="font-semibold text-green-800">Tilaus: {subscription.plan}</p>
      <p className="text-sm text-green-700">
        {subscription.status === "active"
          ? `Voimassa – seuraava laskutus ${next}`
          : `Tila: ${subscription.status}`}
      </p>
    </div>
  );
}

