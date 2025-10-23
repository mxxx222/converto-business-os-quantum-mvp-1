import Link from 'next/link'
import Image from 'next/image'
import ClientBoot from '@/components/ClientBoot'
import LeadForm from '@/components/LeadForm'
import HeroHeadline from '@/components/HeroHeadline'
import { track } from '@/lib/analytics'

export const metadata = {
  title: 'Converto Business OS — Automaatio, joka kasvattaa kassavirtaa',
  description: 'Integroitu Business OS suomalaisille yrittäjille. Vähennä manuaalityötä 60-80%, nopeuta laskutusta ja seuraa tuloksia hallintapaneelissa. Demo 3-7 arkipäivässä.',
  openGraph: {
    title: 'Converto Business OS — Automaatio, joka kasvattaa kassavirtaa',
    description: 'Integroitu Business OS suomalaisille yrittäjille. Vähennä manuaalityötä 60-80%, nopeuta laskutusta.',
    url: 'https://converto.fi',
    siteName: 'Converto',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Converto Business OS - Automaatio, joka kasvattaa kassavirtaa',
      },
    ],
    locale: 'fi_FI',
    type: 'website',
  },
}

export default function Page() {
  return (
    <main className="bg-white text-zinc-900">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-up:nth-child(1) { animation-delay: 0.1s; }
        .animate-fade-in-up:nth-child(2) { animation-delay: 0.2s; }
        .animate-fade-in-up:nth-child(3) { animation-delay: 0.3s; }
      `}</style>

      <ClientBoot />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Poista toistotyö. Saat laskut ulos ajallaan.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-zinc-600">
            Autamme sinua automatisoimaan rutiinit. 3 vaihetta, käyttöönotto 3–7 arkipäivää.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="#book"
              onClick={() => track('cta_demo_click', { location: 'hero', button_text: 'Varaa 20 min demo' })}
              className="rounded-lg bg-emerald-600 text-white px-6 py-3 font-semibold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Varaa 20 min demo
            </Link>
            <Link
              href="#solutions"
              onClick={() => track('cta_watch_demo_click', { location: 'hero', button_text: 'Katso miten se toimii' })}
              className="rounded-lg border border-zinc-200 px-6 py-3 font-semibold hover:bg-zinc-50 transition-colors"
            >
              Katso miten se toimii
            </Link>
          </div>
          <div className="mt-6 text-sm text-zinc-500">
            Ei luottokorttia aloitukseen. Peruutus milloin vain.
          </div>

          {/* Ongelma + Empatia */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-2xl">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 text-xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-zinc-900 mb-2">Tunnetko tämän?</h3>
                <p className="text-zinc-700">
                  Manuaali vie aikaa ja laskut viivästyvät. Kassavirta katkeaa, asiakkaat odottavat, stressi kasvaa.
                  Kymmenet pk-yritykset ovat jo ratkaisseet tämän – voit tehdä saman.
                </p>
              </div>
            </div>
          </div>

          {/* Mitä saat */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-zinc-900">Laskut ulos 2× nopeammin</div>
              <div className="text-sm text-zinc-600">Ei enää viivästyksiä tai manuaalista työtä</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-zinc-900">60–80% vähemmän rutiinia</div>
              <div className="text-sm text-zinc-600">Automatisoi toistuvat tehtävät automaattisesti</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-zinc-900">Kaikki tiedot yhdessä paikassa</div>
              <div className="text-sm text-zinc-600">Hallintapaneeli näyttää reaaliaikaisen tilanteen</div>
            </div>
          </div>

          {/* 3-vaiheinen suunnitelma */}
          <div className="mt-12 bg-zinc-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-center mb-6">3 vaihetta käyttöönottoon</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">1</div>
                <h4 className="font-semibold mb-2">Kytke sähköposti ja talousohjelma</h4>
                <p className="text-sm text-zinc-600">Liitä järjestelmät turvallisesti – ei IT-projekteja</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">2</div>
                <h4 className="font-semibold mb-2">Valitse automaatiot</h4>
                <p className="text-sm text-zinc-600">Aktivoi kuitit, laskutus ja hälytykset tarpeen mukaan</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">3</div>
                <h4 className="font-semibold mb-2">Näe säästöt hallintapaneelissa</h4>
                <p className="text-sm text-zinc-600">Seuraa tuloksia ja säästöjä reaaliajassa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Mistä aloitat automaation?</h2>
          <p className="text-lg text-zinc-600 mb-6">
            Lataa ilmainen 5 kohdan lista yrityksesi automaation aloittamiseen. (PDF, 2 min lukuaika)
          </p>
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-sm">
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Sähköpostisi"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Lataa ilmainen lista
              </button>
            </form>
            <p className="text-xs text-zinc-500 mt-3">Ei spämmiä. Peruuta milloin vain.</p>
          </div>
        </div>
      </section>

      {/* Ominaisuudet */}
      <section id="solutions" className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Näin se toimii</h2>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto">
            Neljä askelta kohti automaatiota ja kasvavaa kassavirtaa
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <Card
            step="1"
            title="Kytke sähköposti ja palvelut"
            icon="�"
            color="blue"
            desc="Yhdistä sähköpostisi ja kirjanpitopalvelut."
            detail="Automaattinen synkronointi aloitetaan turvallisesti."
            className="animate-fade-in-up"
          />
          <Card
            step="2"
            title="Tuo tuotteet ja asiakkaat"
            icon="👥"
            color="purple"
            desc="Siirrä asiakastiedot ja tuotekatalogi järjestelmään."
            detail="CSV-tuonti tai API-integraatio yritysjärjestelmiin."
            className="animate-fade-in-up"
          />
          <Card
            step="3"
            title="Ota käyttöön automaatio"
            icon="⚙️"
            color="green"
            desc="Aktivoi kuitti- ja laskuautomaatio."
            detail="AI oppii yrityksesi prosesseista ja skaalautuu tarpeen mukaan."
            className="animate-fade-in-up"
          />
          <Card
            step="4"
            title="Seuraa tuloksia hallintapaneelissa"
            icon="�"
            color="orange"
            desc="Näe reaaliaikaiset mittarit ja säästöt."
            detail="Hälytykset poikkeamista ja kuukausiraportit automaattisesti."
            className="animate-fade-in-up"
          />
        </div>
      </section>

      {/* Luottosignaalit + Offer Stack */}
      <section className="bg-zinc-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Trust Signals */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">Miksi yritykset valitsevat Converton?</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <span className="text-zinc-700">Käyttöönotto 3–7 arkipäivässä</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <span className="text-zinc-700">60–80% vähemmän manuaalityötä</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">✓</span>
                  </div>
                  <span className="text-zinc-700">Netvisor-integraatio valmiina</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h4 className="font-semibold mb-3">Luottanut jo 50+ yritystä Suomessa</h4>
                <div className="flex items-center gap-6 opacity-60">
                  <span className="font-semibold text-zinc-400">Netvisor</span>
                  <span className="font-semibold text-zinc-400">Procountor</span>
                  <span className="font-semibold text-zinc-400">Finnish Tax Admin</span>
                  <span className="font-semibold text-zinc-400">+5 muuta</span>
                </div>
              </div>
            </div>

            {/* Offer Stack */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6">Mitä saat käyttöösi</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="text-zinc-700">Käyttöönotto 3–7 arkipäivässä</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="text-zinc-700">Automaatiopaketti: kuitit, laskutus, hälytykset</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="text-zinc-700">Hallintapaneeli ja viikkoraportit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="text-zinc-700">Tuki sähköpostilla ja chatilla</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">🎁</span>
                  </div>
                  <span className="text-zinc-700 font-semibold">Bonus: Säästöarvio + toteutussuunnitelma 24h</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">⏰</span>
                    <span className="font-semibold text-yellow-800">Rajoitettu aika</span>
                  </div>
                  <p className="text-yellow-700 text-sm text-center">
                    Ilmainen pilotti on saatavilla vain seuraaville 50 yritykselle
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">alkaen 29€/kk</div>
                  <p className="text-sm text-zinc-600 mb-4">Ei sitoumusta. Peruutus milloin vain. 30 päivän rahat takaisin -takuu.</p>
                  <Link
                    href="#book"
                    onClick={() => track('cta_pilot_click', { location: 'offer_stack', button_text: 'Aloita ilmainen pilotti' })}
                    className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Aloita ilmainen pilotti
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sosiaalinen todiste */}
      <section className="container mx-auto max-w-screen-xl px-4 md:px-6 py-10 md:py-14">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">Miksi suomalaiset yrittäjät valitsevat Converton?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">PK</span>
              </div>
              <div className="text-sm text-zinc-500">Pieni yritys, Uusimaa</div>
            </div>
            <p className="text-zinc-700 italic">"Asennus päivässä, säästöä heti. Kuitit skannautuvat automaattisesti ja ALV lasketaan oikein."</p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-semibold">TH</span>
              </div>
              <div className="text-sm text-zinc-500">Taloushallinto</div>
            </div>
            <p className="text-zinc-700 italic">"Poista toistotyö. Automatisoi 60–80% rutiineista. Netvisor-integraatio toimii saumattomasti."</p>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">TJ</span>
              </div>
              <div className="text-sm text-zinc-500">Toimitusjohtaja</div>
            </div>
            <p className="text-zinc-700 italic">"Reaaliaikainen kassavirta ja viivehälytykset. Päätökset dataan nojaten, ei Excel-kaaoissa."</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto max-w-screen-xl px-4 md:px-6 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Usein kysyttyä</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Faq q="Tarvitseeko luottokortin aloitukseen?" a="Ei. Aloita ilmaiseksi ja päivitä myöhemmin tarpeen mukaan." />
          <Faq q="Miten pitkä käyttöönottoprosessi on?" a="3–7 arkipäivää tuotantoon. Asennus tapahtuu pilvessä ilman IT-resursseja." />
          <Faq q="Tukeeko Netvisoria ja muita järjestelmiä?" a="Kyllä, natiivi Netvisor-integraatio ja 10+ muuta suomalaisen kirjanpidon järjestelmää." />
          <Faq q="Voiko peruuttaa milloin vain?" a="Kyllä, ilman irtisanomismaksua. Tietosi poistetaan pyynnöstä." />
        </div>
      </section>

      {/* Mini-laskelma */}
      <section className="mx-auto max-w-4xl px-6 md:px-8 py-12 md:py-16">
        <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">Esimerkkilaskelma säästöistä</h3>
          <p className="text-lg text-zinc-700 mb-6">
            Jos tiimissä kuluu 10 tuntia viikossa manuaaliin, automaatio säästää ~520 tuntia vuodessa.<br/>
            Tuntihinta 35 € → säästö noin <span className="font-bold text-emerald-600">18 200 € / vuosi</span>.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">–72%</div>
              <div className="text-zinc-600">Laskuvirheet</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">⚡</div>
              <div className="text-zinc-600">Viivehälytykset ja poikkeamat</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bridge Copy */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Miltä tämä näyttää yrityksessäsi 14 päivän päästä?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-semibold mb-2">Enemmän aikaa</h3>
              <p className="text-sm opacity-90">Tiimi tekee tärkeämpää työtä kuin manuaalista syöttöä</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Parempi kassavirta</h3>
              <p className="text-sm opacity-90">Laskut lähtevät ajallaan, rahat tulevat nopeammin</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-3">😌</div>
              <h3 className="font-semibold mb-2">Vähemmän stressiä</h3>
              <p className="text-sm opacity-90">Automaattiset hälytykset ja reaaliaikainen seuranta</p>
            </div>
          </div>
          <p className="text-xl opacity-90">
            Älä odota enää. Aloita ilmainen pilotti tänään.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section id="book" className="bg-emerald-600 text-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Valmis tuotantoon 3–7 arkipäivässä
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Varaa 20 minuutin demo ja näe, miten Converto automatisoi liiketoimintasi.
          </p>

          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Varaa demo</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nimi"
                  className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-xs text-zinc-500 mt-1">Saat arvion säästetystä ajasta ja rahasta ennen aloitusta</p>
              </div>
              <input
                type="email"
                placeholder="Sähköposti"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <input
                type="tel"
                placeholder="Puhelinnumero"
                className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="submit"
                onClick={() => track('cta_book_demo_click', { location: 'final_cta', button_text: 'Varaa demo' })}
                className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Varaa demo
              </button>
            </form>
            <p className="text-xs text-zinc-500 mt-4">
              Tietosuojalauseke: Tietojasi käsitellään GDPR:n mukaisesti. <a href="/privacy" className="underline hover:no-underline">Lue lisää</a>
            </p>
          </div>
        </div>
      </section>

      {/* Yhdistetty JSON-LD (Website + Organization + SoftwareApplication) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                name: 'Converto',
                url: 'https://converto.fi',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://converto.fi/?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@type': 'Organization',
                name: 'Converto',
                url: 'https://converto.fi',
                logo: 'https://converto.fi/logo.png',
              },
              {
                '@type': 'SoftwareApplication',
                name: 'Converto Business OS',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
                url: 'https://converto.fi',
              },
            ],
          }),
        }}
      />
    </main>
  )
}

function Card({ step, title, children, icon, color, desc, detail, className }) {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    orange: 'border-orange-200 bg-orange-50 hover:bg-orange-100'
  };

  return (
    <div className={`relative rounded-xl border p-6 md:p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${colorClasses[color] || 'border-zinc-200'} ${className || ''}`}>
      {step && (
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {step}
        </div>
      )}
      {icon && <div className="text-3xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-700 mb-4 leading-relaxed">{desc || children}</p>
      {detail && (
        <p className="text-sm text-zinc-600 leading-relaxed border-t border-zinc-200 pt-3">
          {detail}
        </p>
      )}
    </div>
  )
}

function Faq({ q, a }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5">
      <div className="font-semibold">{q}</div>
      <div className="mt-1 text-zinc-600">{a}</div>
    </div>
  )
}
