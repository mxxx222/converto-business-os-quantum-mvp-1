import CTA from "@/components/CTA"

export const metadata = {
  title: "Growth Suite™ – Markkinoinnin automaatio | Converto",
  description:
    "Growth Suite™: Markkinoinnin automaatio + liidiseuranta. 390–690 €/kk. Kasvata liikevaihtoa automaattisilla kampanjoilla ja ROI-analytiikalla.",
}

export default function KasvuPage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-5xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Growth Suite™ – Kasvata liikevaihtoa automaatiolla
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Markkinoinnin automaatio, liidiseuranta ja ROI-analytiikka yhdessä paketissa. Integroitu Business OS™ -ekosysteemiin.
        </p>
        <div className="grid gap-6 md:grid-cols-3 text-left">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Liidiautomaatio</h3>
            <p className="text-gray-600 mt-2">Automaattiset sähköpostikampanjat, seuranta ja nurturing-sekvenssit.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">ROI-analytiikka</h3>
            <p className="text-gray-600 mt-2">Reaaliaikainen näkymä kampanjoiden tuottoon ja asiakashankintakustannuksiin.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">A/B-testaus</h3>
            <p className="text-gray-600 mt-2">Automaattinen landing page -optimointi ja konversion parantaminen.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Automaatiot</h2>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>Liidien keräys ja segmentointi</li>
            <li>Sähköpostikampanjat (Resend-integraatio)</li>
            <li>Retargeting ja uudelleenmarkkinointi</li>
            <li>Asiakaspolun seuranta</li>
            <li>Konversion optimointi</li>
            <li>ROI-raportointi</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Tulokset</h2>
          <div className="mt-3 space-y-3">
            <div className="flex justify-between items-center">
              <span>Liidien kasvu</span>
              <span className="font-bold text-green-600">+150%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Konversio-optimointi</span>
              <span className="font-bold text-green-600">+40%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Asiakashankintakustannus</span>
              <span className="font-bold text-green-600">-30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Markkinoinnin ROI</span>
              <span className="font-bold text-green-600">+200%</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Käyttöönotto</p>
              <p className="text-2xl font-extrabold">2-3 vk</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Takaisinmaksu</p>
              <p className="text-2xl font-extrabold">3-6 kk</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Hinnoittelu</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Starter</h3>
              <p className="text-gray-600 mt-2">Perusautomaatiot ja seuranta</p>
              <p className="mt-4 font-bold text-2xl">390 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Growth</h3>
              <p className="text-gray-600 mt-2">Laajennetut kampanjat ja A/B-testit</p>
              <p className="mt-4 font-bold text-2xl">590 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Scale</h3>
              <p className="text-gray-600 mt-2">Enterprise-automaatiot ja priorituki</p>
              <p className="mt-4 font-bold text-2xl">690 €/kk</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Valmis kasvattamaan liikevaihtoa?"
          subtitle="Growth Suite™ automatisoi markkinoinnin ja optimoi konversion jatkuvasti."
          ctaLabel="Varaa maksuton auditointi"
          href="/yhteys"
        />
      </div>
    </main>
  )
}