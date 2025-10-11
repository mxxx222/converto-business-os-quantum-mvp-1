Converto™ Business OS × Notion ROI Analyzer

Täydellinen tietokantarakenne + promptit Notion AI:lle

⸻

🧭 Tarkoitus

Tämä paketti rakentaa täyden ROI Analyzer -järjestelmän Notioniin, joka yhdistyy Converto™ Business OS:n analytiikka- ja raportointikerrokseen.

Se mahdollistaa:
	•	📊 Varaston, palveluiden ja kampanjoiden automaattisen seurannan
	•	💸 Myynnin ja markkinoinnin ROI-laskennan
	•	🔗 Relaatiot, kaavat ja rollupit
	•	📈 Dashboardin, joka toimii suoraan Converto Insight API:n kanssa

⸻

🧱 1️⃣ Tietokannat ja perusrakenne

Luo Notioniin neljä full-page -tietokantaa:

VARASTO

Ominaisuudet

Nimi	Tyyppi
Nimi	Title
SKU	Text
Kategoria	Select
Yksikkökustannus	Number (EUR)
Myyntihinta suositus	Number (EUR)
Varastosaldo	Number
Hälytysraja	Number
Hankintaerä	Number
Toimittaja	Text
Johto-aika (päivää)	Number

Kaavat
	•	Varaston arvo = prop("Varastosaldo") * prop("Yksikkökustannus")
	•	Tilattava määrä = if(prop("Varastosaldo") < prop("Hälytysraja"), max(prop("Hankintaerä"), prop("Hälytysraja") - prop("Varastosaldo")), 0)

Näkymät
	•	Kaikki tuotteet (table, summat näkyvissä)
	•	Alle minimin (filter: Varastosaldo ≤ Hälytysraja)

⸻

PALVELUT

Ominaisuudet

Nimi	Tyyppi
Nimi	Title
Koodi	Text
Kategoria	Select
Listahinta	Number (EUR)
Muuttuva kustannus per suorite	Number (EUR)
Mittayksikkö	Select (kerta, tunti, projekti)


⸻

KAMPANJAT

Ominaisuudet

Nimi	Tyyppi
Kanava	Select (Verkkokauppa, Kenttämyynti, Kumppani, Inbound)
Aloitus	Date
Loppu	Date
Budjetti	Number (EUR)
Toteutunut kulutus	Number (EUR)


⸻

MYYNTI

Ominaisuudet

Nimi	Tyyppi
Myyntitapahtuma	Title
Pvm	Date
Tila	Status (Avoin, Suljettu – voitettu, Suljettu – hävitty)
Tyyppi	Select (Tuote, Palvelu)
Määrä	Number
Yksikköhinta	Number (EUR)
Alennus %	Percent
Tuote	Relation → Varasto
Palvelu	Relation → Palvelut
Kampanja	Relation → Kampanjat
Kanava	Select
Asiakas	Text
Myyjä	People

Kaavat
	•	Netotettu myynti = prop("Määrä") * prop("Yksikköhinta") * (1 - prop("Alennus %"))
	•	Kustannus yhteensä = if(prop("Tyyppi") == "Tuote", prop("Määrä") * toNumber(prop("Yksikkökustannus (tuote)")), prop("Määrä") * toNumber(prop("Suoritekohtainen kustannus (palvelu)")))
	•	Kate = prop("Netotettu myynti") - prop("Kustannus yhteensä")
	•	Kate % = if(prop("Netotettu myynti") == 0, 0, prop("Kate") / prop("Netotettu myynti"))
	•	Nettokate markkinoinnin jälkeen = prop("Kate") - prop("Allokoitu markkinointikulu")

Näkymät
	•	Suljetut – 30 pv
	•	Pipeline (Board-näkymä)

⸻

🔁 2️⃣ Relaatiot ja Rollupit

Varasto
	•	Myynnit → Myynti (back relation)
	•	Rollup: Kokonaismyynti (kpl), Kokonaiskate (€)

Palvelut
	•	Myynnit → Myynti
	•	Rollup: Suoritteet yhteensä, Kokonaiskate (€), Keskimääräinen kate per suorite

Kampanjat
	•	Myynnit → Myynti
	•	Rollup: Kampanjan myynti yhteensä, Kampanjan kate yhteensä, ROI %

ROI % =

if(prop("Toteutunut kulutus") == 0, 0, (prop("Kampanjan kate yhteensä (€)") - prop("Toteutunut kulutus")) / prop("Toteutunut kulutus"))


⸻

📊 3️⃣ ROI Analyzer – Dashboard

Luo uusi sivu nimeltä ROI Analyzer – Dashboard.

Rakenne

KPI-kortit:
	•	Liikevaihto 30 pv → linkitetty Myynti-näkymä
	•	Kate 30 pv → linkitetty Myynti-näkymä
	•	Varaston arvo → linkitetty Varasto-näkymä

Kolmisarakkeinen Layout:

Vasen	Keskimmäinen	Oikea
Myynti (Yhdistetty myynti)	Varasto (Alle minimin)	Palvelut (Suoritteet & kate)

Kampanjaosio:
	•	Kampanjat (ROI – kaikki)
	•	Kampanjat (ROI – viimeiset 60 pv)

⸻

🤖 4️⃣ Integraatio Converto API:n kanssa

Notion Database	Converto API Endpoint	Data Flow
Myynti	/api/v1/reports/sales	Pull: tuore myyntidata
Kampanjat	/api/v1/reports/marketing	Push/Pull: kulut & ROI
Varasto	/api/v1/inventory/sync	Two-way sync
Palvelut	/api/v1/services/sync	Two-way sync

Automaattinen päivitys (n8n tai cron)

0 6 * * * python scripts/sync_notion.py --tenant default


⸻

💬 5️⃣ Käyttöohje Notion AI:lle

Prompt (kopioitava):

“Luo Converto ROI Analyzer -rakenne tämän ohjeen mukaan.
Luo 4 tietokantaa (Varasto, Palvelut, Kampanjat, Myynti) ja linkitä ne relaatiolla.
Lisää kaavat, rollupit ja näkymät täsmälleen kuten ohjeessa.
Lopuksi rakenna ROI Analyzer – Dashboard ja liitä KPI-näkymät.”

⸻

🧩 6️⃣ Bonus: Esimerkkidata

Varasto (3 esimerkkiä)

Nimi	SKU	Yksikkökustannus	Varastosaldo
Akku 600Wh	FW600	249 €	5
Akku 1200Wh	FW1200	390 €	2
SmartModule™	FWSM01	89 €	8

Palvelut

Nimi	Hinta	Kustannus	Mittayksikkö
Asennus	99 €	35 €	kerta
Tarkastus	49 €	10 €	tunti
Päivitys	159 €	65 €	projekti


⸻

✅ Tämä tiedosto: /converto-business-os/docs/NOTION_PROMPTS.md

Seuraavaksi lähetän viimeisen paketin:
3️⃣ MVP_WORKFLOW.md — Cursor Pro + Dev Setup + Deployment
Valmis jatkamaan siihen?


