import CTA from "@/components/CTA"

export const metadata = {
  title: "ChatService™ – GPT-5-pohjainen asiakaspalvelu | Converto",
  description:
    "ChatService™: GPT-5-pohjainen asiakaspalvelu- ja liidibotti. 490–990 €/kk. Vähentää 60% manuaalisia liidivastauksia.",
}

export default function ChatServicePage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-5xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          ChatService™ – GPT-5-pohjainen asiakaspalvelu
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Älykäs chatbotti, joka vastaa asiakkaiden kysymyksiin, ohjaa liidit oikeaan suuntaan ja integroi Business OS™ -ekosysteemiin.
        </p>
        <div className="grid gap-6 md:grid-cols-3 text-left">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Liidien ohjaus</h3>
            <p className="text-gray-600 mt-2">Botti tunnistaa potentiaaliset asiakkaat ja ohjaa heidät demoihin tai pilottiin.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Asiakastuki</h3>
            <p className="text-gray-600 mt-2">Vastaa yleisiin kysymyksiin ja ohjaa monimutkaiset tapaukset tiimille.</p>
          </div>
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h3 className="font-semibold text-lg">Integraatiot</h3>
            <p className="text-gray-600 mt-2">Yhdistyy Resend-sähköposteihin, Stripe-tilauksiin ja Business OS™ -dataan.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14 grid gap-6 md:grid-cols-2">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Ominaisuudet</h2>
          <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-5">
            <li>GPT-5-pohjainen älykäs keskustelu</li>
            <li>Liidien tunnistus ja CTA-ohjaus</li>
            <li>Asiakastietojen haku Business OS™:sta</li>
            <li>Sähköposti-integraatio (Resend)</li>
            <li>Stripe-tilausten tuki</li>
            <li>Suomenkielinen käyttöliittymä</li>
          </ul>
        </div>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Hyödyt</h2>
          <ul className="mt-3 space-y-2 text-gray-700 list-disc pl-5">
            <li>60% vähemmän manuaalisia liidivastauksia</li>
            <li>24/7 asiakaspalvelu</li>
            <li>Parempi liidikonversio</li>
            <li>Asiakastyytyväisyyden kasvu</li>
            <li>Tiimin ajan säästö</li>
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Vastausaika</p>
              <p className="text-2xl font-extrabold">&lt; 3s</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-gray-600">Automaatio</p>
              <p className="text-2xl font-extrabold">60%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h2 className="text-2xl font-bold">Hinnoittelu</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Basic</h3>
              <p className="text-gray-600 mt-2">Peruschatbotti ja liidiohjaus</p>
              <p className="mt-4 font-bold text-2xl">490 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Pro</h3>
              <p className="text-gray-600 mt-2">Laajennetut integraatiot ja analytiikka</p>
              <p className="mt-4 font-bold text-2xl">690 €/kk</p>
            </div>
            <div className="p-6 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold text-lg">Enterprise</h3>
              <p className="text-gray-600 mt-2">Räätälöidyt ratkaisut ja priorituki</p>
              <p className="mt-4 font-bold text-2xl">990 €/kk</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-14">
        <CTA
          title="Valmis automatisoimaan asiakaspalvelun?"
          subtitle="ChatService™ vähentää manuaalista työtä ja parantaa asiakaskokemusta."
          ctaLabel="Aloita demo"
          href="https://app.converto.fi/demo"
        />
      </div>
    </main>
  )
}