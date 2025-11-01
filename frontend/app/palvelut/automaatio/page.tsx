import CTA from "@/components/CTA"

export const metadata = {
  title: "Automation Consulting™ – Prosessien automaatio | Converto",
  description:
    "Automation Consulting™: Prosessien auditointi ja automaatioprojektit. Setup 790 € + ylläpito 250 €/kk. Säästä 40% työajasta.",
}

export default function AutomaatioPage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-5xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Automation Consulting™
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Prosessien auditointi ja automaatioprojektit. Tunnistamme pullonkaulat ja automatisoimme ne Business OS™ -integraatioilla.
        </p>
        <div className="grid gap-6 md:grid-cols-2 text-left">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Prosessi-auditointi</h3>
            <p className="text-gray-600 mt-2">Kartoitamme nykyiset prosessit ja tunnistamme automaatiomahdollisuudet.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Automaatioprojekti</h3>
            <p className="text-gray-600 mt-2">Toteutamme automaatiot Business OS™ -alustalla ja integroimme olemassa oleviin järjestelmiin.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Mitä automatisoimme</h2>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>Kuittien käsittely ja ALV-erittely</li>
            <li>Laskutus ja maksumuistutukset</li>
            <li>Asiakaspalvelun vastaukset (ChatBot)</li>
            <li>Raportointi ja KPI-seuranta</li>
            <li>Sähköposti-workflowt (Resend)</li>
            <li>Tietojen synkronointi järjestelmien välillä</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Projektin kulku</h2>
          <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
            <li>Prosessi-auditointi (1-2 viikkoa)</li>
            <li>Automaatiosuunnitelma ja ROI-arvio</li>
            <li>Toteutus Business OS™ -alustalla</li>
            <li>Testaus ja käyttöönotto</li>
            <li>Koulutus ja dokumentaatio</li>
            <li>Jatkuva ylläpito ja optimointi</li>
          </ol>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Projektin kesto</p>
              <p className="text-2xl font-extrabold">4-8 vk</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-extrabold">300%+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Hinnoittelu</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Setup</h3>
              <p className="text-gray-600 mt-2">Auditointi + automaatioprojekti</p>
              <p className="mt-4 font-bold text-2xl">790 €</p>
              <p className="text-gray-500 text-sm mt-1">Kertamaksu</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Ylläpito</h3>
              <p className="text-gray-600 mt-2">Jatkuva optimointi ja tuki</p>
              <p className="mt-4 font-bold text-2xl">250 €/kk</p>
              <p className="text-gray-500 text-sm mt-1">Kuukausimaksu</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Valmis automatisoimaan prosessit?"
          subtitle="Varaa maksuton auditointi ja saa ROI-arvio automaatiomahdollisuuksista."
          ctaLabel="Varaa maksuton auditointi"
          href="/yhteys"
        />
      </div>
    </main>
  )
}