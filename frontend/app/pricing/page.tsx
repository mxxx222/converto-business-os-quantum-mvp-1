import CTA from "@/components/CTA"

export const metadata = {
  title: "Hinnasto – Converto Business OS™ ja palvelut",
  description:
    "Hinnasto: Business OS™ 49–129 €/kk, NextSite™ 1 490–2 990 €, ylläpito 190 €/kk, ChatService™ 490–990 €/kk. Tilaa tai varaa auditointi.",
}

export default function PricingPage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-6xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Hinnasto
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Selkeä ja läpinäkyvä hinnoittelu. Aloita kevyesti ja skaalaa tarpeiden mukaan.
        </p>
      </section>

      {/* Business OS Pricing */}
      <section className="max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-center">Business OS™</h2>
        <p className="text-center text-gray-600 mt-2">SaaS-alusta automaatioon ja analytiikkaan</p>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Starter</h3>
            <p className="text-gray-600 mt-2">Ydinominaisuudet pienille tiimeille</p>
            <p className="mt-4 font-bold text-2xl">49 €/kk</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Growth</h3>
            <p className="text-gray-600 mt-2">Lisäintegraatiot ja raportointi</p>
            <p className="mt-4 font-bold text-2xl">89 €/kk</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Scale</h3>
            <p className="text-gray-600 mt-2">Laajennettu automaatio ja tuki</p>
            <p className="mt-4 font-bold text-2xl">129 €/kk</p>
          </div>
        </div>
      </section>

      {/* Services Pricing */}
      <section className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold text-center">Palvelut</h2>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Automation Consulting™</h3>
            <p className="text-gray-600 mt-2">Prosessien auditointi ja automaatioprojektit</p>
            <p className="mt-4"><span className="font-bold">790 €</span> + ylläpito 250 €/kk</p>
            <p className="text-gray-500 text-sm mt-1">Projekti + ylläpito</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Notion + GPT Agenttipaketit™</h3>
            <p className="text-gray-600 mt-2">Viikkosuunnittelija, Verotusagentti, ROI Dashboard</p>
            <p className="mt-4 font-bold">49–249 €/kk</p>
            <p className="text-gray-500 text-sm mt-1">Digituote</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">ChatService™</h3>
            <p className="text-gray-600 mt-2">GPT-5-pohjainen asiakaspalvelu- ja liidibotti</p>
            <p className="mt-4 font-bold">490–990 €/kk</p>
            <p className="text-gray-500 text-sm mt-1">Subscription</p>
          </div>
        </div>
      </section>

      {/* NextSite Pricing */}
      <section className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold text-center">NextSite™ – Next.js-verkkosivut</h2>
        <div className="grid gap-6 md:grid-cols-3 mt-6">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Launch</h3>
            <p className="text-gray-600 mt-2">Nopea julkaisu, 1–5 sivua</p>
            <p className="mt-4 font-bold">1 490 €</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Growth</h3>
            <p className="text-gray-600 mt-2">6–15 sivua, blogi & ROI-laskurit</p>
            <p className="mt-4 font-bold">2 990 €</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Ylläpito</h3>
            <p className="text-gray-600 mt-2">Päivitykset, turvallisuus, analytiikka</p>
            <p className="mt-4 font-bold">190 €/kk</p>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Valmis aloittamaan?"
          subtitle="Varaa maksuton auditointi tai aloita 30 päivän ilmainen kokeilu."
          ctaLabel="Ilmoittaudu pilottiin"
          href="/#pilot"
        />
      </div>
    </main>
  )
}