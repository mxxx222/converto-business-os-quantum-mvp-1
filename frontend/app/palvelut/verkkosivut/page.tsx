import CTA from "@/components/CTA"

export const metadata = {
  title: "NextSite™ – Next.js-verkkosivut ja ylläpito | Converto",
  description:
    "NextSite™: Nopeat ja konvertoivat Next.js-verkkosivut. Paketit: Launch 1 490 € · Growth 2 990 € · Ylläpito 190 €/kk. Integroitu Business OS™ -ekosysteemiin.",
}

export default function NextSitePage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-5xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          NextSite™ – Nopeat, konvertoivat Next.js-verkkosivut
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Modernit, hakukoneoptimoidut sivut, joissa on sisäänrakennettu analytiikka, ChatBot-liiditys ja integrointi Converto Business OS™ -ekosysteemiin.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3 text-left">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Launch</h3>
            <p className="text-gray-600 mt-2">Nopea julkaisu, 1–5 sivua, valmiit osiot ja CTA.</p>
            <p className="mt-4 font-bold">1 490 €</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Growth</h3>
            <p className="text-gray-600 mt-2">Kasvavaan tarpeeseen, 6–15 sivua, blogi & ROI-laskurit.</p>
            <p className="mt-4 font-bold">2 990 €</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Ylläpito</h3>
            <p className="text-gray-600 mt-2">Päivitykset, turvallisuus, analytiikka ja A/B-testit.</p>
            <p className="mt-4 font-bold">190 €/kk</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Miksi NextSite™?</h2>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>Nopea lataus (Core Web Vitals)</li>
            <li>Hakukoneoptimoitu (SEO baseline)</li>
            <li>ChatBot-liiditys + lomakkeet (Resend)</li>
            <li>Stripe Checkout valmiina maksuille</li>
            <li>Plausible / GA4 -mittaus</li>
            <li>Business OS™ -integraatiot</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Konversio & ROI</h2>
          <p className="mt-3 text-gray-700">
            StoryBrand 2.0 -runko ja testatut CTA:t: 20–30 % parempi liidikonversio. ChatService vähentää manuaalista vastaamista jopa 60 %.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Latausaika</p>
              <p className="text-2xl font-extrabold">{"<"}1.5s</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Konversio</p>
              <p className="text-2xl font-extrabold">+25%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Mitä saat</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Landing + palvelusivut + blogipohja</li>
              <li>Pilottiohjelma-lomake (Resend)</li>
              <li>Stripe Checkout tuotteille</li>
              <li>ChatBot liidien ohjaamiseen</li>
            </ul>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Plausible/GA4 seuranta</li>
              <li>Vercel + Cloudflare deploy</li>
              <li>SEO-peruspaketti ja sitemap</li>
              <li>Konversiotapahtumien mittaus</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Valmis nostamaan konversionne seuraavalle tasolle?"
          subtitle="Tilaa NextSite™ – käynnistämme 7 päivässä. Integroitu Business OS™ -ekosysteemiin."
          ctaLabel="Varaa maksuton auditointi"
          href="/yhteys"
        />
      </div>
    </main>
  )
}