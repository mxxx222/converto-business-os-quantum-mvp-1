import CTA from "@/components/CTA"

export const metadata = {
  title: "Converto Business OS™ – Automaatio ja analytiikka",
  description:
    "Converto Business OS™ automatisoi kuittien käsittelyn, ALV-laskennan, raportoinnin ja asiakaspalvelun. Next.js + Stripe + Resend + ChatBot -integraatiot.",
}

export default function BusinessOSPage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-6xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Converto Business OS™ – Automatisoi yrityksesi
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Yksi alusta prosessien automatisointiin, talousnäkymään ja asiakaspalvelun tehostamiseen. 
          Valmis integroimaan Stripe-ostot, Resend-sähköpostit, ChatBotin ja Supabasen.
        </p>
        <div className="grid gap-6 md:grid-cols-3 text-left">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">OCR + Kuitit</h3>
            <p className="text-gray-600 mt-2">Automaattinen kuittien tunnistus, kategorisointi ja ALV-erittely.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Raportointi</h3>
            <p className="text-gray-600 mt-2">Reaaliaikainen näkymä kuluihin, kassavirtaan ja KPI-mittareihin.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">ChatService™</h3>
            <p className="text-gray-600 mt-2">GPT-5-botti vastaa liideille ja ohjaa CTA:lla demoihin ja tilauksiin.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Keskeiset ominaisuudet</h2>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>Kuittien skannaus ja ALV-erittely (OCR)</li>
            <li>Talouden KPI-näkymä (Revenue, MRR, CAC, LTV)</li>
            <li>Workflowt ja muistutukset (sähköposti + ChatBot)</li>
            <li>Stripe Checkout ja laskutus</li>
            <li>Notion / Supabase -integraatiot</li>
            <li>PWA + analytiikka (Plausible/GA4)</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Nopea käyttöönotto</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>Ilmoittaudu pilottiin tai aloita demo</li>
            <li>Aktivoidaan integraatiot (Stripe, Resend, Supabase)</li>
            <li>Käynnistetään dashboard ja ChatService™</li>
          </ol>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Käyttöönotto</p>
              <p className="text-2xl font-extrabold">&lt; 7 pv</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Ajan säästö</p>
              <p className="text-2xl font-extrabold">40%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Hinnoittelu</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Starter</h3>
              <p className="text-gray-600 mt-2">Pienelle tiimille, ydinominaisuudet.</p>
              <p className="mt-4 font-bold">49 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Growth</h3>
              <p className="text-gray-600 mt-2">Kasvavat tiimit + lisäintegraatiot.</p>
              <p className="mt-4 font-bold">89 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Scale</h3>
              <p className="text-gray-600 mt-2">Laajennettu automaatio ja tuki.</p>
              <p className="mt-4 font-bold">129 €/kk</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Automatisoi yrityksesi tänään"
          subtitle="Käynnistämme Converto Business OS™ -ympäristön teille 7 päivässä."
          ctaLabel="Aloita demo"
          href="https://app.converto.fi/demo"
        />
      </div>
    </main>
  )
}