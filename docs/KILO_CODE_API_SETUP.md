# Kilo Code API - Kuvanluontiasetukset

## Yleistä

Kilo Code API -integraatio mahdollistaa kuvanluonnin Converto Business OS -järjestelmässä.

## API-avaimen hankkiminen

### Vaiheet:

1. **Kirjaudu sisään Kilo Code -palveluun**
   - Siirry Kilo Coden verkkosivustolle ja kirjaudu sisään
   - Vaihtoehtoisesti: käytä Kilo Coden kehittäjäportaalia

2. **Siirry API-asetuksiin**
   - Etsi käyttäjätilisi asetukset tai hallintapaneeli
   - Valitse "API-avaimet", "Kehittäjäasetukset" tai "Integraatiot"

3. **Luo uusi API-avain**
   - Valitse "Luo uusi avain" tai vastaava vaihtoehto
   - Anna avaimelle kuvaava nimi (esim. "Converto Business OS")
   - Määritä tarvittavat käyttöoikeudet (kuvanluonti)

4. **Kopioi API-avain**
   - Tallenna avain ja kopioi se turvalliseen paikkaan
   - **HUOM:** Avain näytetään vain kerran, kopioi se heti!

## Konfigurointi

### Backend (.env)

Lisää seuraavat muuttujat `.env`-tiedostoon:

```bash
KILO_CODE_API_KEY=your_api_key_here
KILO_CODE_API_BASE=https://api.kilocode.com
IMAGE_GENERATION_ENABLED=true
```

### Cursor Settings (cursor-settings.json)

Kuvanluontiasetukset on konfiguroitu `cursor-settings.json`-tiedostossa:

```json
{
  "imageGeneration": {
    "provider": "kilocode",
    "apiKey": "your_api_key_here",
    "apiBase": "https://api.kilocode.com",
    "enabled": true,
    "defaultModel": "image-generation-v1",
    "maxImages": 4,
    "imageSize": "1024x1024"
  }
}
```

## Käyttö

Kun API-avain on konfiguroitu, voit käyttää kuvanluontia:

1. **Backend:** API-avain ladataan automaattisesti `backend/config.py`-asetuksista
2. **Frontend:** Kuvanluontia voi käyttää API-endpointin kautta

## Tuki

Jos tarvitset apua:
- Tarkista Kilo Coden virallinen dokumentaatio
- Ota yhteyttä Kilo Coden asiakastukeen
- Tarkista `backend/config.py` konfiguraatio

## Turvallisuus

- **Älä koskaan** commitoi API-avainta versionhallintaan
- Käytä `.env`-tiedostoa paikalliseen kehitykseen
- Käytä Render/Vercel environment variables tuotannossa
- Kiertä API-avaimet säännöllisesti

