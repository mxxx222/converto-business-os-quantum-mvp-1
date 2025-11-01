import PilotForm from "@/components/PilotForm"

export const metadata = {
  title: "Ota yhteyttä – Converto Solutions Oy",
  description:
    "Ota yhteyttä Converto-tiimiin. Varaa maksuton auditointi tai kysy lisää Business OS™, NextSite™ ja ChatService™ -palveluista.",
}

export default function YhteysPage() {
  return (
    <main className="px-6 py-14">
      <section className="max-w-4xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Ota yhteyttä
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Varaa maksuton auditointi tai kysy lisää palveluistamme. Vastaamme 24 tunnin sisällä.
        </p>
      </section>

      <section className="max-w-4xl mx-auto mt-14 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Yhteystiedot</h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="font-semibold">Sähköposti</p>
                <p className="text-gray-600">hello@converto.fi</p>
              </div>
              <div>
                <p className="font-semibold">Puhelin</p>
                <p className="text-gray-600">+358 40 123 4567</p>
              </div>
              <div>
                <p className="font-semibold">Yritys</p>
                <p className="text-gray-600">Converto Solutions Oy</p>
                <p className="text-gray-600">Y-tunnus: 1234567-8</p>
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Palvelut</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Business OS™</span>
                <span className="text-gray-600">49–129 €/kk</span>
              </div>
              <div className="flex justify-between">
                <span>NextSite™</span>
                <span className="text-gray-600">1 490–2 990 €</span>
              </div>
              <div className="flex justify-between">
                <span>ChatService™</span>
                <span className="text-gray-600">490–990 €/kk</span>
              </div>
              <div className="flex justify-between">
                <span>Automation Consulting™</span>
                <span className="text-gray-600">790 € + 250 €/kk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Ilmoittaudu pilottiin</h2>
            <p className="text-gray-600 mt-2 mb-6">
              Ensimmäiset 50 yritystä saavat 30 päivää maksutonta käyttöä.
            </p>
            <PilotForm />
          </div>

          <div className="p-6 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold">Nopeat linkit</h2>
            <div className="mt-4 space-y-2">
              <a href="https://app.converto.fi/demo" className="block text-blue-600 hover:text-blue-800">
                → Aloita demo
              </a>
              <a href="https://app.converto.fi/login" className="block text-blue-600 hover:text-blue-800">
                → Kirjaudu sisään
              </a>
              <a href="https://app.converto.fi/signup" className="block text-blue-600 hover:text-blue-800">
                → Luo tili
              </a>
              <a href="/pricing" className="block text-blue-600 hover:text-blue-800">
                → Katso hinnasto
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-14">
        <div className="p-6 border rounded-xl bg-white shadow-sm text-center">
          <h2 className="text-2xl font-bold">Usein kysytyt kysymykset</h2>
          <div className="mt-6 space-y-4 text-left">
            <div>
              <h3 className="font-semibold">Kuinka nopeasti pääsen alkuun?</h3>
              <p className="text-gray-600 mt-1">Business OS™ demo on käytettävissä heti. Täysi käyttöönotto 7 päivässä.</p>
            </div>
            <div>
              <h3 className="font-semibold">Voiko palvelut integroida olemassa oleviin järjestelmiin?</h3>
              <p className="text-gray-600 mt-1">Kyllä. Tuemme Stripe, Resend, Supabase, Notion ja muita yleisiä alustoja.</p>
            </div>
            <div>
              <h3 className="font-semibold">Onko pilottiohjelma todella ilmainen?</h3>
              <p className="text-gray-600 mt-1">Kyllä. 30 päivää täysin ilmaista käyttöä ilman sitoutumista.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}